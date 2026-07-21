from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List, Any

from app.core.config import settings
from app.core.database import get_db
from app.core.llm import llm_client
from app.agents.planner_agent import PlannerAgent
from app.agents.search_agent import SearchAgent
from app.agents.reader_agent import ReaderAgent
from app.models.paper import Paper
from app.models.conversation import Conversation

router = APIRouter()

class ResearchQuery(BaseModel):
    query: str
    model: str | None = None

class ResearchResponse(BaseModel):
    explanation: str
    papers: List[Any]

@router.get("/conversations")
async def get_conversations(db_session: AsyncSession = Depends(get_db)):
    stmt = select(Conversation).order_by(Conversation.created_at.desc())
    result = await db_session.execute(stmt)
    conversations = result.scalars().all()
    return [{"id": str(c.id), "title": c.title, "created_at": c.created_at.isoformat()} for c in conversations]

@router.post("/query", response_model=ResearchResponse)
async def start_research(request: ResearchQuery, db_session: AsyncSession = Depends(get_db)):
    """
    Executes the research pipeline synchronously and returns the findings.
    """
    # Save as new conversation
    new_conv = Conversation(title=request.query[:100] + ("..." if len(request.query) > 100 else ""))
    db_session.add(new_conv)
    await db_session.commit()

    # Determine the model string to use
    selected_model = settings.DATABYTE_MODEL
    if request.model == "Deepseek v4-flash":
        selected_model = "deepseek-v4-flash"
    elif request.model == "Databyte m1":
        selected_model = "databyte-m1"
        
    planner = PlannerAgent()
    try:
        plan = await planner.run(request.query, model=selected_model)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Planner Error: {str(e)}")
        
    if not plan.needs_search:
        return ResearchResponse(
            explanation=plan.direct_answer or plan.explanation or "Hello! How can I help you?",
            papers=[]
        )
        
    if not plan.search_queries:
        raise HTTPException(status_code=400, detail="Could not generate a valid search query.")
        
    searcher = SearchAgent()
    import asyncio
    
    async def execute_query(q):
        requested_limit = max(3, min(q.limit or 5, 10)) # Lower per-query limit to avoid massive results
        requested_source = q.source or "semanticscholar"
        
        async def fetch_with_source(src):
            return await searcher.run(
                q.query, 
                limit=requested_limit, 
                source=src, 
                year_from=q.year_from,
                year_to=q.year_to,
                db_session=db_session
            )
            
        try:
            res = await fetch_with_source(requested_source)
            if not res:
                raise Exception("Source returned no results (possibly due to API limits)")
            return res
        except Exception as e:
            print(f"Searcher failed for {q.query} on {requested_source}: {e}")
            if requested_source != "openalex":
                print(f"Falling back to openalex for {q.query}...")
                try:
                    return await fetch_with_source("openalex")
                except Exception as e2:
                    print(f"Fallback openalex failed: {e2}")
            return []

    # Execute up to top 3 queries sequentially to avoid API Rate Limits (429 Too Many Requests)
    queries_to_run = plan.search_queries[:3]
    results = []
    seen_ids = set()
    
    for q in queries_to_run:
        res_list = await execute_query(q)
        for res in res_list:
            # Deduplicate by DOI or Title
            dup_key = res.get("doi") or res.get("title", "").lower()
            if dup_key not in seen_ids:
                seen_ids.add(dup_key)
                results.append(res)
                if len(results) >= 12: # Rich synthesis allowed since frontend timeout is bypassed
                    break
        if len(results) >= 12:
            break
        # Add a small delay between queries to respect rate limits
        await asyncio.sleep(1)
            
    if not results:
        # Construct helpful message if everything fails
        attempted_queries = ", ".join([f"'{q.query}' ({q.source})" for q in queries_to_run])
        raise HTTPException(status_code=404, detail=f"No papers found. I searched for: {attempted_queries}. Try modifying your query.")
    
    reader = ReaderAgent()
    # Use the first query as the fallback search string for mock abstracts
    search_string = plan.search_queries[0].query if plan.search_queries else "the requested topic"
    
    # Import the celery tasks here to avoid circular imports at module level
    from app.worker.tasks import extract_paper_knowledge, process_pdf_and_chunk
    
    for res in results:
        stmt = select(Paper).where(Paper.openalex_id == res["openalex_id"])
        paper = (await db_session.execute(stmt)).scalar_one_or_none()
        
        mock_abstract = f"This paper is titled '{res['title']}'. It focuses on applying methods related to {search_string}."
        if paper:
            # Trigger background extraction!
            extract_paper_knowledge.delay(str(paper.id), res.get("abstract") or mock_abstract)
            
            # Phase 2: If we have a PDF URL, trigger PDF chunking and vector embedding!
            if res.get("pdf_url"):
                process_pdf_and_chunk.delay(str(paper.id), res["pdf_url"])
                
    # NEW: Synthesis Step with Relevance Filtering
    synthesis_prompt = f"""
You are an expert AI Research Assistant. The user asked: "{request.query}"

Here are the top papers found:
"""
    for idx, p in enumerate(results):
        abstract = p.get('abstract', 'No abstract')
        if abstract and len(abstract) > 300:
            abstract = abstract[:300] + "..."
        year = p.get('publication_year', 'N/A')
        url = p.get('openalex_id') or p.get('pdf_url')
        synthesis_prompt += f"\n[{idx}] Title: {p['title']}\nYear: {year}\nURL: {url}\nAbstract: {abstract}\n"
        
    synthesis_prompt += """
You must synthesize the answer based ONLY on the provided papers above.

You MUST respond in strict JSON format with exactly two keys:
1. "explanation": A comprehensive markdown string answering the user's query. 
   - Start with an enthusiastic, concise introductory sentence.
   - You MUST generate a Markdown Table containing the most relevant papers. The table should have columns: | Paper | Year | Core contribution |.
   - In the "Paper" column, you MUST format the title as a clickable markdown link using the provided URL (e.g., `[Title of Paper](https://...)`).
   - If a paper is only partially relevant, include it but clarify its scope in the contribution column. Do not be overly defensive or pessimistic.
   - DO NOT include a "References" section at the bottom.
2. "relevant_indices": A JSON array of integers containing ONLY the indices of the papers that are actually relevant.

Respond with nothing but the JSON object.
"""
    
    try:
        completion = await llm_client.chat.completions.create(
            model=selected_model,
            messages=[{"role": "system", "content": "You are a helpful AI Research Assistant that outputs JSON."},
                      {"role": "user", "content": synthesis_prompt}],
            temperature=0.3,
            max_tokens=2048
        )
        synthesis_json = completion.choices[0].message.content
        
        # Extract JSON if wrapped in markdown
        import re
        import json
        json_match = re.search(r"```(?:json)?(.*?)```", synthesis_json, re.DOTALL)
        if json_match:
            synthesis_json = json_match.group(1).strip()
            
        parsed = json.loads(synthesis_json)
        synthesis_response = parsed.get("explanation", "I found some relevant papers.")
        relevant_indices = parsed.get("relevant_indices", list(range(len(results))))
        
        # Ensure it's a list of integers
        if not isinstance(relevant_indices, list):
            relevant_indices = list(range(len(results)))
        else:
            try:
                relevant_indices = [int(i) for i in relevant_indices]
            except (ValueError, TypeError):
                relevant_indices = list(range(len(results)))
        
        # Filter results
        filtered_results = [results[i] for i in relevant_indices if i < len(results)]
        if not filtered_results:
            filtered_results = results # fallback if AI rejected everything
            
    except Exception as e:
        print(f"Synthesis failed: {e}")
        synthesis_response = "I found some relevant papers, but I was unable to synthesize a summary at this time."
        filtered_results = results
                
    return ResearchResponse(
        explanation=synthesis_response,
        papers=filtered_results
    )

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

router = APIRouter()

class ResearchQuery(BaseModel):
    query: str

class ResearchResponse(BaseModel):
    explanation: str
    papers: List[Any]

@router.post("/query", response_model=ResearchResponse)
async def start_research(request: ResearchQuery, db_session: AsyncSession = Depends(get_db)):
    """
    Executes the research pipeline synchronously and returns the findings.
    """
    planner = PlannerAgent()
    try:
        plan = await planner.run(request.query)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Planner Error: {str(e)}")
        
    if not plan.needs_search:
        return ResearchResponse(
            explanation=plan.direct_answer or plan.explanation or "Hello! How can I help you?",
            papers=[]
        )
        
    if not plan.search_queries:
        raise HTTPException(status_code=400, detail="Could not generate a valid search query.")
        
    first_query = plan.search_queries[0]
    search_string = first_query.query
    
    # We will pass the year_from to the search agent if we modify it, but for now just use the query string.
    # OpenAlex relevance is better without appending random years to the search string.
    # The user wants a default of 5 papers, and a max cap of 10 papers.
    # Enforce min 5 and max 10.
    requested_limit = max(5, min(first_query.limit or 5, 10))
    requested_source = first_query.source or "semanticscholar"
        
    searcher = SearchAgent()
    try:
        results = await searcher.run(search_string, limit=requested_limit, source=requested_source, db_session=db_session)
    except Exception as e:
        import traceback
        err_msg = traceback.format_exc()
        raise HTTPException(status_code=500, detail=f"Searcher Error: {err_msg}")
    
    reader = ReaderAgent()
    for res in results:
        stmt = select(Paper).where(Paper.openalex_id == res["openalex_id"])
        paper = (await db_session.execute(stmt)).scalar_one_or_none()
        
        mock_abstract = f"This paper is titled '{res['title']}'. It focuses on applying methods related to {search_string}."
        if paper:
            try:
                await reader.run(paper_id=paper.id, text=mock_abstract, db_session=db_session)
            except Exception as e:
                print(f"Reader failed silently for {paper.id}: {e}")
                
    # NEW: Synthesis Step with Relevance Filtering
    synthesis_prompt = f"""
You are an expert AI Research Assistant. The user asked: "{request.query}"

Here are the top papers found:
"""
    for idx, p in enumerate(results):
        abstract = p.get('abstract', 'No abstract')
        if abstract and len(abstract) > 500:
            abstract = abstract[:500] + "..."
        synthesis_prompt += f"\n[{idx}] Title: {p['title']}\nAbstract: {abstract}\n"
        
    synthesis_prompt += """
You must synthesize the answer based ONLY on the provided papers above.
DO NOT invent, hallucinate, or cite any papers that are not in the list above.
DO NOT include a "References" or "Daftar Pustaka" section at the end of your response! The UI will automatically display the sources.

You MUST respond in strict JSON format with exactly two keys:
1. "explanation": A comprehensive, highly structured markdown string answering the user's query. Use formatting (bolding, lists, tables). Cite relevant papers inline using ONLY their exact index, like [0] or [1].
2. "relevant_indices": A JSON array of integers containing ONLY the indices of the papers from the list above that are actually relevant.

Respond with nothing but the JSON object.
"""
    
    try:
        completion = await llm_client.chat.completions.create(
            model=settings.DATABYTE_MODEL,
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

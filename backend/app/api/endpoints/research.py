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
        
    searcher = SearchAgent()
    try:
        results = await searcher.run(search_string, limit=requested_limit, db_session=db_session)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Searcher Error: {str(e)}")
    
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
                
    # NEW: Synthesis Step
    synthesis_prompt = f"""
You are an expert AI Research Assistant. The user asked: "{request.query}"

Here are the top papers found:
"""
    for idx, p in enumerate(results):
        synthesis_prompt += f"\n[{idx+1}] Title: {p['title']}\nAbstract: {p.get('abstract', 'No abstract')}\n"
        
    synthesis_prompt += """
Write a comprehensive, highly structured response answering the user's query based on these papers.
- Use Markdown formatting (bolding, lists, and tables if comparing multiple methods).
- You MUST cite the papers inline using their index, like [1] or [2].
- Structure it beautifully with sections.
"""
    
    try:
        completion = await llm_client.chat.completions.create(
            model=settings.DATABYTE_MODEL,
            messages=[{"role": "system", "content": "You are a helpful AI Research Assistant."},
                      {"role": "user", "content": synthesis_prompt}],
            temperature=0.7,
            max_tokens=2048
        )
        synthesis_response = completion.choices[0].message.content
        if not synthesis_response:
            synthesis_response = "I found some relevant papers, but the AI returned an empty response."
    except Exception as e:
        print(f"Synthesis failed: {e}")
        synthesis_response = "I found some relevant papers, but I was unable to synthesize a summary at this time."
                
    return ResearchResponse(
        explanation=synthesis_response,
        papers=results
    )

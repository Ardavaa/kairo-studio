from fastapi import APIRouter, Depends, BackgroundTasks
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.core.database import get_db, AsyncSessionLocal
from app.agents.planner_agent import PlannerAgent
from app.agents.search_agent import SearchAgent
from app.agents.reader_agent import ReaderAgent
from app.models.paper import Paper
import asyncio

router = APIRouter()

class ResearchQuery(BaseModel):
    query: str

async def run_research_pipeline(query: str):
    # Background tasks cannot easily share the same dependency-injected session safely 
    # across async boundaries, so we create a new session just for the background worker.
    async with AsyncSessionLocal() as db_session:
        # 1. Plan the search
        planner = PlannerAgent()
        try:
            plan = await planner.run(query)
        except Exception as e:
            print(f"Error in planner: {e}")
            return
            
        if not plan.search_queries:
            return
            
        first_query = plan.search_queries[0]
        search_string = first_query.query
        if first_query.year_from:
            search_string += f" {first_query.year_from}"
            
        # 2. Execute the Search and save to DB
        searcher = SearchAgent()
        try:
            results = await searcher.run(search_string, limit=3, db_session=db_session)
        except Exception as e:
            print(f"Error in searcher: {e}")
            return
        
        # 3. For each fetched paper, run the Reader Agent
        reader = ReaderAgent()
        for res in results:
            stmt = select(Paper).where(Paper.openalex_id == res["openalex_id"])
            paper = (await db_session.execute(stmt)).scalar_one_or_none()
            
            mock_abstract = f"This paper is titled '{res['title']}'. It focuses on applying methods related to {search_string}."
            
            if paper:
                try:
                    await reader.run(paper_id=paper.id, text=mock_abstract, db_session=db_session)
                except Exception as e:
                    print(f"Error in reader for paper {paper.id}: {e}")

@router.post("/query")
async def start_research(request: ResearchQuery, background_tasks: BackgroundTasks):
    """
    Triggers the research pipeline in the background.
    """
    background_tasks.add_task(run_research_pipeline, request.query)
    return {"status": "Research pipeline started in the background", "query": request.query}

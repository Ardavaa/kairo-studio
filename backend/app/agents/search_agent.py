import httpx
from typing import List, Dict, Any, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.agents.base import BaseAgent
from app.models.paper import Paper

class SearchAgent(BaseAgent):
    """Agent responsible for searching the OpenAlex database."""
    
    def __init__(self):
        self.base_url = "https://api.openalex.org/works"

    async def run(self, query: str, limit: int = 10, db_session: Optional[AsyncSession] = None) -> List[Dict[str, Any]]:
        params = {
            "search": query,
            "per-page": limit,
            "sort": "cited_by_count:desc"
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.get(self.base_url, params=params)
            response.raise_for_status()
            data = response.json()
            
        results = []
        for work in data.get("results", []):
            paper_data = {
                "openalex_id": work.get("id"),
                "doi": work.get("doi"),
                "title": work.get("title"),
                "publication_year": work.get("publication_year"),
                "citation_count": work.get("cited_by_count", 0),
                "is_open_access": work.get("open_access", {}).get("is_oa", False)
            }
            results.append(paper_data)
            
            # Save to Database if session is provided
            if db_session and paper_data["openalex_id"]:
                # Check if it already exists
                stmt = select(Paper).where(Paper.openalex_id == paper_data["openalex_id"])
                existing = await db_session.execute(stmt)
                
                if not existing.scalar_one_or_none():
                    new_paper = Paper(**paper_data)
                    db_session.add(new_paper)
                    
        # Commit the transaction if we added new papers
        if db_session:
            await db_session.commit()
            
        return results

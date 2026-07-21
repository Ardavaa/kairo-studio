import httpx
import xml.etree.ElementTree as ET
from typing import List, Dict, Any, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.agents.base import BaseAgent
from app.models.paper import Paper
from app.core.config import settings

class SearchAgent(BaseAgent):
    """Agent responsible for searching academic databases."""
    
    def __init__(self):
        self.openalex_url = "https://api.openalex.org/works"
        self.s2_url = "https://api.semanticscholar.org/graph/v1/paper/search"
        self.arxiv_url = "https://export.arxiv.org/api/query"

    async def run(self, query: str, limit: int = 10, source: str = "openalex", year_from: Optional[int] = None, year_to: Optional[int] = None, db_session: Optional[AsyncSession] = None) -> List[Dict[str, Any]]:
        source = source.lower()
        if source == "semanticscholar":
            results = await self._search_semantic_scholar(query, limit, year_from, year_to)
        elif source == "arxiv":
            results = await self._search_arxiv(query, limit, year_from, year_to)
        elif source == "core":
            results = await self._search_core(query, limit, year_from, year_to)
        elif source == "elsevier":
            results = await self._search_elsevier(query, limit, year_from, year_to)
        else:
            results = await self._search_openalex(query, limit, year_from, year_to)
            
        # Save to Database if session is provided
        if db_session:
            for paper_data in results:
                identifier = paper_data.get("openalex_id") or paper_data.get("arxiv_id") or paper_data.get("doi")
                if not identifier:
                    continue
                    
                # Check if it already exists
                conditions = []
                if paper_data.get("openalex_id"):
                    conditions.append(Paper.openalex_id == paper_data["openalex_id"])
                # Also check old mock IDs if they were stored
                if paper_data.get("arxiv_id"):
                    conditions.append(Paper.arxiv_id == paper_data["arxiv_id"])
                    conditions.append(Paper.openalex_id == f"arxiv:{paper_data['arxiv_id']}")
                if paper_data.get("doi"):
                    conditions.append(Paper.doi == paper_data["doi"])
                    
                if conditions:
                    from sqlalchemy import or_
                    stmt = select(Paper).where(or_(*conditions))
                    existing = await db_session.execute(stmt)
                    
                    if existing.first():
                        continue
                        
                # Filter only the fields that exist in the Paper model
                valid_keys = {"openalex_id", "doi", "title", "publication_year", "citation_count", "is_open_access", "arxiv_id", "abstract", "venue", "pdf_url"}
                filtered_data = {k: v for k, v in paper_data.items() if k in valid_keys}
                new_paper = Paper(**filtered_data)
                db_session.add(new_paper)
            await db_session.commit()
            
        return results

    async def _search_openalex(self, query: str, limit: int, year_from: Optional[int] = None, year_to: Optional[int] = None) -> List[Dict[str, Any]]:
        params = {"search": query, "per-page": limit}
        filters = []
        if year_from:
            filters.append(f"from_publication_date:{year_from}-01-01")
        if year_to:
            filters.append(f"to_publication_date:{year_to}-12-31")
        if filters:
            params["filter"] = ",".join(filters)
            
        try:
            async with httpx.AsyncClient(follow_redirects=True) as client:
                response = await client.get(self.openalex_url, params=params)
                response.raise_for_status()
                data = response.json()
        except Exception as e:
            print(f"OpenAlex API failed: {e}")
            return []
            
        results = []
        for work in data.get("results", []):
            oa_data = work.get("open_access", {})
            pdf_url = oa_data.get("oa_url")
            if pdf_url and not pdf_url.endswith(".pdf") and "arxiv.org" not in pdf_url:
                pdf_url = None # ensure it's a PDF or arxiv url for safety
                
            results.append({
                "openalex_id": work.get("id"),
                "doi": work.get("doi"),
                "title": work.get("title"),
                "publication_year": work.get("publication_year"),
                "citation_count": work.get("cited_by_count", 0),
                "is_open_access": oa_data.get("is_oa", False),
                "pdf_url": pdf_url
            })
        return results

    async def _search_semantic_scholar(self, query: str, limit: int, year_from: Optional[int] = None, year_to: Optional[int] = None) -> List[Dict[str, Any]]:
        # Fields we want to retrieve
        fields = "paperId,externalIds,title,year,citationCount,isOpenAccess,abstract,venue"
        params = {"query": query, "limit": limit, "fields": fields}
        if year_from and year_to:
            params["year"] = f"{year_from}-{year_to}"
        elif year_from:
            params["year"] = f"{year_from}-"
        elif year_to:
            params["year"] = f"-{year_to}"
            
        headers = {}
        if settings.S2_API_KEY:
            headers["x-api-key"] = settings.S2_API_KEY
        
        try:
            async with httpx.AsyncClient(follow_redirects=True, headers=headers) as client:
                response = await client.get(self.s2_url, params=params)
                response.raise_for_status()
                data = response.json()
        except Exception as e:
            print(f"Semantic Scholar API failed: {e}")
            return []
            
        results = []
        for paper in data.get("data", []):
            ext_ids = paper.get("externalIds", {})
            results.append({
                "doi": ext_ids.get("DOI"),
                "title": paper.get("title"),
                "publication_year": paper.get("year"),
                "citation_count": paper.get("citationCount", 0),
                "is_open_access": paper.get("isOpenAccess", False),
                "abstract": paper.get("abstract"),
                "venue": paper.get("venue"),
                # We can map S2 Corpus ID or keep it in memory
                "openalex_id": f"https://www.semanticscholar.org/paper/{paper.get('paperId')}" # Mock ID for frontend rendering
            })
        return results

    async def _search_arxiv(self, query: str, limit: int, year_from: Optional[int] = None, year_to: Optional[int] = None) -> List[Dict[str, Any]]:
        url = f"http://export.arxiv.org/api/query?search_query=all:{query.replace(' ', '+')}&max_results={limit}"
        
        import urllib.request
        import asyncio
        
        def fetch_arxiv():
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req, timeout=10) as response:
                return response.read()
                
        try:
            xml_data = await asyncio.to_thread(fetch_arxiv)
        except Exception as e:
            print(f"Arxiv API failed: {e}")
            return []
            
        root = ET.fromstring(xml_data)
        ns = {"atom": "http://www.w3.org/2005/Atom"}
        
        results = []
        for entry in root.findall("atom:entry", ns):
            id_url = entry.find("atom:id", ns).text
            arxiv_id = id_url.split("/abs/")[-1] if "/abs/" in id_url else id_url
            title = entry.find("atom:title", ns).text.replace("\\n", " ").strip()
            published = entry.find("atom:published", ns).text
            year = int(published.split("-")[0]) if published else None
            abstract = entry.find("atom:summary", ns).text.replace("\\n", " ").strip()
            
            results.append({
                "arxiv_id": arxiv_id,
                "openalex_id": f"https://arxiv.org/abs/{arxiv_id}", # Mock ID for frontend rendering link fallback
                "title": title,
                "publication_year": year,
                "abstract": abstract,
                "is_open_access": True, # Arxiv is always open access
                "citation_count": 0, # Arxiv API doesn't provide citation counts directly
                "pdf_url": f"https://arxiv.org/pdf/{arxiv_id}.pdf"
            })
        return results

    async def _search_core(self, query: str, limit: int, year_from: Optional[int] = None, year_to: Optional[int] = None) -> List[Dict[str, Any]]:
        if not settings.CORE_API_KEY:
            print("CORE API integration is pending API key configuration.")
            return []
            
        url = "https://api.core.ac.uk/v3/search/works"
        params = {"q": query, "limit": limit}
        headers = {"Authorization": f"Bearer {settings.CORE_API_KEY}"}
        
        try:
            async with httpx.AsyncClient(follow_redirects=True) as client:
                response = await client.get(url, params=params, headers=headers)
                response.raise_for_status()
                data = response.json()
        except Exception as e:
            print(f"CORE API failed: {e}")
            return []
            
        results = []
        for work in data.get("results", []):
            results.append({
                "openalex_id": f"https://core.ac.uk/display/{work.get('id')}",
                "doi": work.get("doi"),
                "title": work.get("title"),
                "publication_year": work.get("yearPublished"),
                "citation_count": work.get("citationCount", 0),
                "is_open_access": True, # CORE is an OA aggregator
                "abstract": work.get("abstract"),
                "venue": work.get("publisher")
            })
        return results

    async def _search_elsevier(self, query: str, limit: int, year_from: Optional[int] = None, year_to: Optional[int] = None) -> List[Dict[str, Any]]:
        if not settings.ELSEVIER_API_KEY:
            print("Elsevier API integration is pending API key configuration.")
            return []
            
        url = "https://api.elsevier.com/content/search/scopus"
        params = {"query": query, "count": limit}
        headers = {
            "X-ELS-APIKey": settings.ELSEVIER_API_KEY,
            "Accept": "application/json"
        }
        
        try:
            async with httpx.AsyncClient(follow_redirects=True) as client:
                response = await client.get(url, params=params, headers=headers)
                response.raise_for_status()
                data = response.json()
        except Exception as e:
            print(f"Elsevier API failed: {e}")
            return []
            
        results = []
        entries = data.get("search-results", {}).get("entry", [])
        for entry in entries:
            # Safely extract year
            cover_date = entry.get("prism:coverDate", "")
            year = int(cover_date.split("-")[0]) if cover_date else None
            
            results.append({
                "openalex_id": f"https://www.scopus.com/record/display.uri?eid={entry.get('dc:identifier')}",
                "doi": entry.get("prism:doi"),
                "title": entry.get("dc:title"),
                "publication_year": year,
                "citation_count": int(entry.get("citedby-count", 0)),
                "is_open_access": entry.get("openaccessFlag") == "true",
                "abstract": entry.get("dc:description"),
                "venue": entry.get("prism:publicationName")
            })
        return results

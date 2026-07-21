from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List, Dict, Any

from app.core.database import get_db
from app.models.chunk import PaperChunk
from app.models.paper import Paper
from app.agents.embedding_agent import EmbeddingAgent

router = APIRouter()

class RAGQuery(BaseModel):
    query: str
    paper_id: str | None = None
    limit: int = 5

@router.post("/search")
async def search_chunks(request: RAGQuery, db: AsyncSession = Depends(get_db)):
    """
    Semantic search against paper chunks using pgvector.
    """
    embedder = EmbeddingAgent()
    query_embedding = embedder.embed_chunks([request.query])[0]
    
    # We use pgvector's L2 distance (<->) for ordering. 
    # Can also use inner product (<#>) or cosine distance (<=>). 
    # BGE models typically work well with cosine distance (<=>)
    
    if request.paper_id:
        stmt = select(PaperChunk, Paper).join(Paper).where(
            PaperChunk.paper_id == request.paper_id
        ).order_by(
            PaperChunk.embedding.cosine_distance(query_embedding)
        ).limit(request.limit)
    else:
        stmt = select(PaperChunk, Paper).join(Paper).order_by(
            PaperChunk.embedding.cosine_distance(query_embedding)
        ).limit(request.limit)
        
    result = await db.execute(stmt)
    rows = result.all()
    
    response_data = []
    for chunk, paper in rows:
        response_data.append({
            "chunk_id": str(chunk.id),
            "paper_id": str(paper.id),
            "paper_title": paper.title,
            "text": chunk.text_content,
            "metadata": chunk.metadata_
        })
        
    return {"results": response_data}

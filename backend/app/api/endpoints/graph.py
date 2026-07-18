from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.core.database import get_db
from app.models.graph import GraphNode, GraphEdge
from app.models.paper import Paper

router = APIRouter()

@router.get("/nodes")
async def get_nodes(db: AsyncSession = Depends(get_db)):
    stmt = select(GraphNode)
    result = await db.execute(stmt)
    nodes = result.scalars().all()
    return nodes

@router.get("/edges")
async def get_edges(db: AsyncSession = Depends(get_db)):
    stmt = select(GraphEdge)
    result = await db.execute(stmt)
    edges = result.scalars().all()
    return edges

@router.get("/papers")
async def get_papers(db: AsyncSession = Depends(get_db)):
    stmt = select(Paper)
    result = await db.execute(stmt)
    papers = result.scalars().all()
    return papers

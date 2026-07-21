from fastapi import APIRouter
from app.api.endpoints import research, graph, rag

api_router = APIRouter()
api_router.include_router(research.router, prefix="/research", tags=["research"])
api_router.include_router(graph.router, prefix="/graph", tags=["graph"])
api_router.include_router(rag.router, prefix="/rag", tags=["rag"])

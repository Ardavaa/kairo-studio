from fastapi import APIRouter
from app.api.endpoints import research, graph, rag, editor, auth

api_router = APIRouter()
api_router.include_router(research.router, prefix="/research", tags=["research"])
api_router.include_router(graph.router, prefix="/graph", tags=["graph"])
api_router.include_router(rag.router, prefix="/rag", tags=["rag"])
api_router.include_router(editor.router, prefix="/editor", tags=["editor"])
api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])

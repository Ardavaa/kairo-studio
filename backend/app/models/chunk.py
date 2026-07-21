import uuid
from sqlalchemy import Column, String, Integer, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID, JSONB
from pgvector.sqlalchemy import Vector
from app.core.database import Base

class PaperChunk(Base):
    __tablename__ = "paper_chunks"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    paper_id = Column(UUID(as_uuid=True), ForeignKey("papers.id", ondelete="CASCADE"), nullable=False)
    
    # Chunk metadata
    chunk_index = Column(Integer, nullable=False)
    text_content = Column(Text, nullable=False)
    
    # Extracted metadata (like section name, page number, etc)
    metadata_ = Column("metadata", JSONB, default=dict)
    
    # Embedding using pgvector (using 384 dimensions for fastembed BGE-small by default)
    embedding = Column(Vector(384))

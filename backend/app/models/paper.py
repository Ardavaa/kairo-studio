import uuid
from sqlalchemy import Column, String, Integer, DateTime, Boolean
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import func
from app.core.database import Base

class Paper(Base):
    __tablename__ = "papers"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    doi = Column(String, unique=True, index=True, nullable=True)
    openalex_id = Column(String, unique=True, index=True, nullable=True)
    arxiv_id = Column(String, unique=True, index=True, nullable=True)
    
    title = Column(String, nullable=False)
    abstract = Column(String)
    publication_year = Column(Integer)
    venue = Column(String)
    citation_count = Column(Integer, default=0)
    is_open_access = Column(Boolean, default=False)
    
    authors_raw = Column(JSONB, default=list)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

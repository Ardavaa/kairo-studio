import asyncio
import uuid
from app.core.celery_app import celery_app
from app.agents.reader_agent import ReaderAgent
from app.core.database import AsyncSessionLocal

@celery_app.task(name="extract_paper_knowledge", bind=True, max_retries=3)
def extract_paper_knowledge(self, paper_id_str: str, text: str):
    """
    Celery task that extracts nodes and edges from a paper's text asynchronously.
    It spins up its own asyncio event loop because Celery workers are sync by default.
    """
    paper_id = uuid.UUID(paper_id_str)
    
    async def _run_extraction():
        # Spin up a new session specifically for this background task
        async with AsyncSessionLocal() as session:
            reader = ReaderAgent()
            try:
                print(f"Starting knowledge extraction for paper: {paper_id_str}")
                await reader.run(paper_id=paper_id, text=text, db_session=session)
                print(f"Successfully extracted knowledge for paper: {paper_id_str}")
            except Exception as e:
                print(f"Extraction failed for paper {paper_id_str}: {e}")
                raise e

    try:
        # Run the async extraction inside the sync celery wrapper
        asyncio.run(_run_extraction())
    except Exception as exc:
        print(f"Retrying task due to error: {exc}")
        raise self.retry(exc=exc, countdown=60)

@celery_app.task(name="process_pdf_and_chunk", bind=True, max_retries=3)
def process_pdf_and_chunk(self, paper_id_str: str, pdf_url: str):
    """
    Celery task that downloads a PDF, parses it, chunks it, generates embeddings, 
    and saves to Postgres Vector DB.
    """
    paper_id = uuid.UUID(paper_id_str)
    
    async def _run_pdf_pipeline():
        from app.agents.pdf_agent import PDFAgent
        from app.agents.embedding_agent import EmbeddingAgent
        from app.models.chunk import PaperChunk
        
        try:
            print(f"Starting PDF processing for {paper_id_str} at {pdf_url}")
            pdf_agent = PDFAgent(chunk_size=1500, chunk_overlap=200)
            
            # 1. Download
            pdf_path = await pdf_agent.download_pdf(pdf_url)
            
            # 2. Parse & Chunk
            chunks_data = pdf_agent.parse_and_chunk(pdf_path)
            
            # 3. Embed
            embedder = EmbeddingAgent()
            texts_to_embed = [c["text_content"] for c in chunks_data]
            embeddings = embedder.embed_chunks(texts_to_embed)
            
            # 4. Save to Database
            async with AsyncSessionLocal() as session:
                for idx, chunk_data in enumerate(chunks_data):
                    chunk = PaperChunk(
                        paper_id=paper_id,
                        chunk_index=chunk_data["chunk_index"],
                        text_content=chunk_data["text_content"],
                        metadata_=chunk_data["metadata_"],
                        embedding=embeddings[idx]
                    )
                    session.add(chunk)
                await session.commit()
                print(f"Successfully saved {len(chunks_data)} chunks for {paper_id_str}")
                
        except Exception as e:
            print(f"PDF Processing failed for {paper_id_str}: {e}")
            raise e
            
    try:
        asyncio.run(_run_pdf_pipeline())
    except Exception as exc:
        print(f"Retrying PDF task due to error: {exc}")
        raise self.retry(exc=exc, countdown=60)

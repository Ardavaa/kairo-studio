import os
import httpx
import tempfile
import fitz  # PyMuPDF
from typing import List, Dict

class PDFAgent:
    """Agent responsible for downloading, parsing, and chunking PDF documents."""
    
    def __init__(self, chunk_size: int = 1500, chunk_overlap: int = 200):
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap

    async def download_pdf(self, url: str) -> str:
        """Downloads a PDF from a URL and saves it to a temporary file."""
        if not url:
            raise ValueError("No URL provided for PDF download.")
            
        # Ensure it's a direct PDF link if it's arXiv
        if "arxiv.org/abs/" in url:
            url = url.replace("arxiv.org/abs/", "arxiv.org/pdf/") + ".pdf"
            
        async with httpx.AsyncClient(follow_redirects=True) as client:
            response = await client.get(url, timeout=30.0)
            if response.status_code != 200:
                raise Exception(f"Failed to download PDF, status code: {response.status_code}")
                
            fd, path = tempfile.mkstemp(suffix=".pdf")
            with os.fdopen(fd, 'wb') as f:
                f.write(response.content)
            return path

    def parse_and_chunk(self, pdf_path: str) -> List[Dict]:
        """Parses a PDF file using PyMuPDF and returns chunks of text."""
        doc = fitz.open(pdf_path)
        chunks = []
        
        full_text = ""
        # Simple extraction for now: we can enhance this with block extraction
        for page_num in range(len(doc)):
            page = doc.load_page(page_num)
            text = page.get_text("text")
            full_text += f"\n\n--- Page {page_num + 1} ---\n\n" + text
            
        # Very simple character-based chunking
        # In a production system, we'd use recursive character chunking or semantic chunking
        start = 0
        chunk_idx = 0
        while start < len(full_text):
            end = start + self.chunk_size
            chunk_text = full_text[start:end]
            
            # Try to end at a newline if possible to avoid breaking words
            if end < len(full_text):
                last_newline = chunk_text.rfind('\n')
                if last_newline != -1 and last_newline > self.chunk_size // 2:
                    end = start + last_newline
                    chunk_text = full_text[start:end]
            
            chunks.append({
                "chunk_index": chunk_idx,
                "text_content": chunk_text.strip(),
                "metadata_": {"source_length": len(chunk_text)}
            })
            
            start = end - self.chunk_overlap
            chunk_idx += 1
            
        doc.close()
        # Clean up temp file
        if os.path.exists(pdf_path):
            os.remove(pdf_path)
            
        return chunks

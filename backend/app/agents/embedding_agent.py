from fastembed import TextEmbedding
from typing import List

class EmbeddingAgent:
    """Agent responsible for converting text chunks into vector embeddings."""
    
    def __init__(self):
        # We use a lightweight model by default: BGE-small-en-v1.5 (384 dimensions)
        # It's highly performant and requires no PyTorch!
        self.model = TextEmbedding(model_name="BAAI/bge-small-en-v1.5")
        
    def embed_chunks(self, texts: List[str]) -> List[List[float]]:
        """Generates embeddings for a list of text chunks."""
        # fastembed returns a generator of numpy arrays, we convert to lists
        embeddings_generator = self.model.embed(texts)
        return [list(emb) for emb in embeddings_generator]

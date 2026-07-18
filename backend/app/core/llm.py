from openai import AsyncOpenAI
from app.core.config import settings

llm_client = AsyncOpenAI(
    api_key=settings.DATABYTE_API_KEY,
    base_url=settings.DATABYTE_BASE_URL
)

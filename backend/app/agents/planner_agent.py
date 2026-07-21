import json
from app.agents.base import BaseAgent
from app.core.llm import llm_client
from app.core.config import settings
from app.schemas.agent import PlannerOutput

class PlannerAgent(BaseAgent):
    """Agent responsible for interpreting user requests into a concrete research plan."""
    
    async def run(self, user_prompt: str, model: str = settings.DATABYTE_MODEL) -> PlannerOutput:
        system_prompt = f"""
        You are the Planner Agent for Kairo Studio, an AI-native Research Operating System.
        Your job is to take a user's research goal and decompose it into an actionable search strategy.
        Extract the intent and formulate specific keyword combinations suitable for scholarly search engines.
        
        CRITICAL: Extract ONLY the core academic keywords for the search query. DO NOT use the entire conversational sentence. If the user prompt is in a non-English language (e.g. Indonesian), translate the search keywords to English. For example, "carikan paper terkait image captioning" should result in the query "image captioning".
        
        You have multiple databases at your disposal. Use the "source" field in your search query to select the best one:
        - "arxiv": [HIGHLY RECOMMENDED] Best for AI, ML, Computer Science, and getting immediate PDF access. 
        - "openalex": [HIGHLY RECOMMENDED] Excellent for global interdisciplinary research and reliable fallback.
        - "semanticscholar": Use sparingly due to strict API rate limits (HTTP 429 errors).
        - "core": Best for finding open-access papers globally across disciplines.
        - "elsevier": Best for finding high-impact journal articles (Scopus/ScienceDirect).
        
        If the user asks a general question, greetings, or something that does not require searching scholarly papers, set "needs_search" to false, leave "search_queries" empty, and provide your response in "direct_answer".

        You MUST return ONLY a valid JSON object matching this exact format, with no markdown formatting or extra text:
        {{
            "intent": "Brief description of the research goal or chat intent",
            "needs_search": true,
            "direct_answer": null,
            "search_queries": [
                {{
                    "query": "exact search keywords",
                    "source": "semanticscholar",
                    "limit": 5,
                    "year_from": 2023,
                    "year_to": 2024
                }}
            ],
            "explanation": "Why you chose these queries or your reasoning"
        }}
        """

        response = await llm_client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.2,
            max_tokens=1024
        )
        
        raw_content = response.choices[0].message.content
        
        # Strip markdown json block if present
        if raw_content.startswith("```json"):
            raw_content = raw_content.split("```json")[1].split("```")[0].strip()
        elif raw_content.startswith("```"):
            raw_content = raw_content.split("```")[1].split("```")[0].strip()
            
        return PlannerOutput.model_validate_json(raw_content)

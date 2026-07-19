import json
from app.agents.base import BaseAgent
from app.core.llm import llm_client
from app.core.config import settings
from app.schemas.agent import PlannerOutput

class PlannerAgent(BaseAgent):
    """Agent responsible for interpreting user requests into a concrete research plan."""
    
    async def run(self, user_prompt: str) -> PlannerOutput:
        system_prompt = f"""
        You are the Planner Agent for Kairo Studio, an AI-native Research Operating System.
        Your job is to take a user's research goal and decompose it into an actionable search strategy.
        Extract the intent and formulate specific keyword combinations suitable for scholarly search engines.
        
        CRITICAL: For your first search_query, use the EXACT key phrase the user provided without appending generic terms like "deep learning" or "AI" or "machine learning". Scholarly search engines like OpenAlex perform poorly when specific concepts are diluted with generic keywords.
        
        If the user asks a general question, greetings, or something that does not require searching scholarly papers, set "needs_search" to false, leave "search_queries" empty, and provide your response in "direct_answer".

        You MUST return ONLY a valid JSON object matching this exact format, with no markdown formatting or extra text:
        {{
            "intent": "Brief description of the research goal or chat intent",
            "needs_search": true,
            "direct_answer": null,
            "search_queries": [
                {{
                    "query": "exact search keywords",
                    "limit": 5,
                    "year_from": 2023,
                    "year_to": 2024
                }}
            ],
            "explanation": "Why you chose these queries or your reasoning"
        }}
        """

        response = await llm_client.chat.completions.create(
            model=settings.DATABYTE_MODEL,
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

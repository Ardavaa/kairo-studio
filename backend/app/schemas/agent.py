from pydantic import BaseModel, Field
from typing import List

class SearchQuery(BaseModel):
    query: str = Field(..., description="The search string to use for querying scholarly databases.")
    year_from: int | None = Field(None, description="Start year for filtering papers.")
    year_to: int | None = Field(None, description="End year for filtering papers.")

class PlannerOutput(BaseModel):
    intent: str = Field(..., description="The main intent of the user, e.g., 'Literature Review', 'Find Dataset'.")
    search_queries: List[SearchQuery] = Field(..., description="A list of structured search queries to execute.")
    explanation: str = Field(..., description="Brief explanation of the research strategy.")

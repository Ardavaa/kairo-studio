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

class ExtractedNode(BaseModel):
    name: str = Field(..., description="The name of the entity, e.g., 'Vision Transformer', 'ImageNet'")
    node_type: str = Field(..., description="The type of entity. Must be one of: 'Method', 'Dataset', 'Task', 'Metric', 'Finding', 'Concept'")
    properties: dict = Field(default_factory=dict, description="Any additional properties or definitions")

class ExtractedEdge(BaseModel):
    source_name: str = Field(..., description="The name of the source node")
    target_name: str = Field(..., description="The name of the target node")
    relation_type: str = Field(..., description="The relationship type. Examples: 'improves', 'uses', 'evaluates_on', 'compares_to'")
    properties: dict = Field(default_factory=dict, description="Context or explanation of the relationship")

class ExtractionOutput(BaseModel):
    nodes: List[ExtractedNode] = Field(..., description="List of extracted entities")
    edges: List[ExtractedEdge] = Field(..., description="List of relationships between the extracted entities")

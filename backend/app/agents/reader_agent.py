import json
from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
import uuid

from app.agents.base import BaseAgent
from app.core.llm import llm_client
from app.core.config import settings
from app.schemas.agent import ExtractionOutput
from app.models.graph import GraphNode, GraphEdge
from app.models.paper import Paper

class ReaderAgent(BaseAgent):
    """Agent responsible for reading text and extracting Knowledge Graph entities."""

    async def run(self, paper_id: uuid.UUID, text: str, db_session: Optional[AsyncSession] = None) -> ExtractionOutput:
        system_prompt = f"""
        You are the Reader Agent for Kairo Studio. Your task is to perform Information Extraction on scientific text.
        Extract key entities (Methods, Datasets, Tasks, Metrics, Concepts) and how they relate to each other.
        
        You MUST return ONLY a valid JSON object matching this exact format, with no markdown:
        {{
            "nodes": [
                {{"name": "Vision Transformer", "node_type": "Method", "properties": {{"description": "A transformer architecture for vision"}}}}
            ],
            "edges": [
                {{"source_name": "Vision Transformer", "target_name": "ImageNet", "relation_type": "evaluates_on", "properties": {{"accuracy": "88%"}}}}
            ]
        }}
        """

        response = await llm_client.chat.completions.create(
            model=settings.DATABYTE_MODEL,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Extract knowledge from the following text:\\n\\n{text}"}
            ],
            temperature=0.1
        )
        
        raw_content = response.choices[0].message.content
        if raw_content.startswith("```json"):
            raw_content = raw_content.split("```json")[1].split("```")[0].strip()
        elif raw_content.startswith("```"):
            raw_content = raw_content.split("```")[1].split("```")[0].strip()
            
        extraction = ExtractionOutput.model_validate_json(raw_content)
        
        # Save to Database
        if db_session:
            await self._save_to_db(extraction, paper_id, db_session)
            
        return extraction

    async def _save_to_db(self, extraction: ExtractionOutput, paper_id: uuid.UUID, db_session: AsyncSession):
        node_map = {}
        
        # 1. Upsert Nodes
        for node_data in extraction.nodes:
            stmt = select(GraphNode).where(
                GraphNode.name == node_data.name,
                GraphNode.node_type == node_data.node_type
            )
            result = await db_session.execute(stmt)
            node = result.scalar_one_or_none()
            
            if not node:
                node = GraphNode(
                    name=node_data.name, 
                    node_type=node_data.node_type, 
                    properties=node_data.properties
                )
                db_session.add(node)
                await db_session.flush() # Get the new ID immediately
            
            node_map[node_data.name] = node.id
            
        # 2. Upsert Edges
        for edge_data in extraction.edges:
            source_id = node_map.get(edge_data.source_name)
            target_id = node_map.get(edge_data.target_name)
            
            if source_id and target_id:
                stmt = select(GraphEdge).where(
                    GraphEdge.source_id == source_id,
                    GraphEdge.target_id == target_id,
                    GraphEdge.relation_type == edge_data.relation_type,
                    GraphEdge.evidence_paper_id == paper_id
                )
                result = await db_session.execute(stmt)
                edge = result.scalar_one_or_none()
                
                if not edge:
                    edge = GraphEdge(
                        source_id=source_id,
                        target_id=target_id,
                        relation_type=edge_data.relation_type,
                        evidence_paper_id=paper_id,
                        properties=edge_data.properties
                    )
                    db_session.add(edge)
                    
        await db_session.commit()

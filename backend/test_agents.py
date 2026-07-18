import asyncio
from app.agents.planner_agent import PlannerAgent
from app.agents.search_agent import SearchAgent
from app.agents.reader_agent import ReaderAgent
from app.core.database import AsyncSessionLocal
from app.models.paper import Paper
from sqlalchemy.future import select

async def main():
    print("Initializing Planner Agent...")
    planner = PlannerAgent()
    
    prompt = "Cari paper tentang penggunaan vision transformer untuk medical imaging tahun 2023-2024"
    print(f"User Prompt: '{prompt}'")
    
    plan = await planner.run(prompt)
    print("\n--- Planner Output ---")
    print(f"Intent: {plan.intent}")
    print(f"Explanation: {plan.explanation}")
    
    for idx, query in enumerate(plan.search_queries):
        print(f"\nQuery {idx + 1}: '{query.query}' (from {query.year_from} to {query.year_to})")
        
        # Pass the first query to Search Agent
        if idx == 0:
            print("\nInitializing Search Agent...")
            searcher = SearchAgent()
            
            # Add year filter to query for OpenAlex syntax if year_from/year_to are present
            # For simplicity, we just append it to the search string or let OpenAlex handle it in text
            search_string = query.query
            if query.year_from:
                search_string += f" {query.year_from}"
                
            print(f"Executing search for: '{search_string}'...")
            
            # Use database session
            async with AsyncSessionLocal() as session:
                results = await searcher.run(search_string, limit=3, db_session=session)
            
            print("\n--- Search Results (Top 3) ---")
            for r in results:
                print(f"- [{r['publication_year']}] {r['title']}")
                print(f"  Citations: {r['citation_count']} | Open Access: {r['is_open_access']}")
                print(f"  DOI: {r['doi']}")
                
            print("\nInitializing Reader Agent...")
            reader = ReaderAgent()
            
            # Fetch the paper from the database to get its UUID
            async with AsyncSessionLocal() as session:
                stmt = select(Paper).where(Paper.openalex_id == results[0]["openalex_id"])
                paper = (await session.execute(stmt)).scalar_one_or_none()
                
                if paper:
                    print(f"Testing extraction on Paper: {paper.title}")
                    sample_abstract = "We present the Vision Transformer (ViT), a novel architecture that applies a pure transformer directly to sequences of image patches. When pre-trained on large amounts of data and transferred to multiple mid-sized or small image recognition benchmarks (ImageNet, CIFAR-100, VTAB, etc.), Vision Transformer produces excellent results compared to state-of-the-art convolutional networks while requiring substantially fewer computational resources to train."
                    
                    extraction = await reader.run(paper_id=paper.id, text=sample_abstract, db_session=session)
                    print("\n--- Extraction Results ---")
                    for node in extraction.nodes:
                        print(f"Node: [{node.node_type}] {node.name}")
                    for edge in extraction.edges:
                        print(f"Edge: {edge.source_name} --({edge.relation_type})--> {edge.target_name}")

if __name__ == "__main__":
    asyncio.run(main())

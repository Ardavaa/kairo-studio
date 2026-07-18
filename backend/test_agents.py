import asyncio
from app.agents.planner_agent import PlannerAgent
from app.agents.search_agent import SearchAgent
from app.core.database import AsyncSessionLocal

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

if __name__ == "__main__":
    asyncio.run(main())

import asyncio
from app.agents.planner_agent import PlannerAgent

async def run():
    p = PlannerAgent()
    r = await p.run('zero-shot object detection')
    print(r)

asyncio.run(run())

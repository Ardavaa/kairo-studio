import asyncio
from sqlalchemy import select
from app.core.database import AsyncSessionLocal
from app.models.conversation import Conversation

async def check():
    async with AsyncSessionLocal() as session:
        res = await session.execute(select(Conversation))
        convs = res.scalars().all()
        for c in convs:
            print(f"ID: {c.id} | Email: '{c.user_email}' | Title: {c.title}")

if __name__ == "__main__":
    asyncio.run(check())

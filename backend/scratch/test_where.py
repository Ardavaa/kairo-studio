import asyncio
from sqlalchemy import select
from app.core.database import AsyncSessionLocal
from app.models.conversation import Conversation

async def main():
    async with AsyncSessionLocal() as session:
        stmt = select(Conversation).where(Conversation.user_email == 'ardavamuhammad@gmail.com')
        r = await session.execute(stmt)
        print("RES ARDAVA:", len(r.scalars().all()))

        stmt2 = select(Conversation).where(Conversation.user_email == 'jhea658@gmail.com')
        r2 = await session.execute(stmt2)
        print("RES JHEA:", len(r2.scalars().all()))

        stmt3 = select(Conversation)
        r3 = await session.execute(stmt3)
        print("RES ALL:", len(r3.scalars().all()))

if __name__ == "__main__":
    asyncio.run(main())

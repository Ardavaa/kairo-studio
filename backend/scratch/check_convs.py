import asyncio
import sqlalchemy as sa
from app.core.database import AsyncSessionLocal

async def main():
    async with AsyncSessionLocal() as session:
        result = await session.execute(sa.text("SELECT id, title, user_email FROM conversations"))
        rows = result.fetchall()
        print(f"Total conversations in DB: {len(rows)}")
        for row in rows:
            print(f"ID: {row[0]} | Title: {row[1]} | Email: '{row[2]}'")

if __name__ == "__main__":
    asyncio.run(main())

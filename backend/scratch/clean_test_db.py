import asyncio
from sqlalchemy import delete
from app.core.database import AsyncSessionLocal
from app.models.conversation import Conversation

async def clean_test():
    async with AsyncSessionLocal() as session:
        stmt = delete(Conversation).where(
            (Conversation.user_email == "alice@kairo.ai") | 
            (Conversation.user_email == "bob@kairo.ai") |
            (Conversation.user_email == "test@example.com")
        )
        res = await session.execute(stmt)
        await session.commit()
        print(f"✅ Berhasil membersihkan data tes. Total terhapus: {res.rowcount}")

if __name__ == "__main__":
    asyncio.run(clean_test())

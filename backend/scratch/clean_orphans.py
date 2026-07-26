import asyncio
from sqlalchemy import delete, select
from app.core.database import AsyncSessionLocal
from app.models.conversation import Conversation

async def clean():
    async with AsyncSessionLocal() as session:
        # Periksa dulu berapa yang ada
        res_all = await session.execute(select(Conversation))
        all_convs = res_all.scalars().all()
        print(f"Total percakapan di DB sebelum pembersihan: {len(all_convs)}")
        for c in all_convs:
            print(f" - ID: {c.id}, Email: {c.user_email}, Title: {c.title}")
            
        stmt = delete(Conversation).where(
            (Conversation.user_email == None) | 
            (Conversation.user_email == '') | 
            (Conversation.user_email == 'null') | 
            (Conversation.user_email == 'undefined')
        )
        res = await session.execute(stmt)
        await session.commit()
        print(f"[SUCCESS] Berhasil menghapus {res.rowcount} percakapan orphan.")
        
        res_after = await session.execute(select(Conversation))
        after_convs = res_after.scalars().all()
        print(f"Total percakapan di DB setelah pembersihan: {len(after_convs)}")

if __name__ == "__main__":
    asyncio.run(clean())

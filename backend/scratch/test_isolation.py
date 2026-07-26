import asyncio
import urllib.request
import urllib.parse
import json
from app.core.database import AsyncSessionLocal
from app.models.conversation import Conversation

async def test_isolation():
    print("--- 1. Menambahkan data percakapan simulasi ke DB ---")
    async with AsyncSessionLocal() as session:
        c1 = Conversation(user_email="alice@kairo.ai", title="Alice Research on Quantum Computing")
        c2 = Conversation(user_email="bob@kairo.ai", title="Bob Research on Neural Networks")
        session.add(c1)
        session.add(c2)
        await session.commit()
        print("✅ Data Alice dan Bob berhasil disimpan di DB.")

    print("\n--- 2. Menguji API GET /conversations untuk Alice ---")
    url_alice = "http://localhost:8000/api/v1/research/conversations?user_email=" + urllib.parse.quote("alice@kairo.ai")
    req_alice = urllib.request.Request(url_alice, headers={"X-User-Email": "alice@kairo.ai"})
    res_alice = json.loads(urllib.request.urlopen(req_alice).read().decode())
    print(f"Hasil untuk Alice ({len(res_alice)} percakapan):")
    for item in res_alice:
        print(f"   -> Title: {item['title']}")
        assert "Alice" in item['title'], "ERROR: Kebocoran data milik user lain!"
        assert "Bob" not in item['title'], "ERROR: Data Bob bocor ke Alice!"

    print("\n--- 3. Menguji API GET /conversations untuk Bob ---")
    url_bob = "http://localhost:8000/api/v1/research/conversations?user_email=" + urllib.parse.quote("bob@kairo.ai")
    req_bob = urllib.request.Request(url_bob, headers={"X-User-Email": "bob@kairo.ai"})
    res_bob = json.loads(urllib.request.urlopen(req_bob).read().decode())
    print(f"Hasil untuk Bob ({len(res_bob)} percakapan):")
    for item in res_bob:
        print(f"   -> Title: {item['title']}")
        assert "Bob" in item['title'], "ERROR: Kebocoran data milik user lain!"
        assert "Alice" not in item['title'], "ERROR: Data Alice bocor ke Bob!"

    print("\n--- 4. Membersihkan data simulasi ---")
    async with AsyncSessionLocal() as session:
        await session.delete(c1)
        await session.delete(c2)
        await session.commit()
        print("✅ Data simulasi dibersihkan. ISOLASI 100% SUKSES TERVERIFIKASI!")

if __name__ == "__main__":
    asyncio.run(test_isolation())

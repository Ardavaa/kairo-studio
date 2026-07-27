from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.router import api_router

app = FastAPI(
    title="Kairo Studio API",
    description="Backend API for Kairo Studio",
    version="1.0.0",
)

# Configure CORS to allow local development, Vercel production, and previews
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://kairostudio-ai.vercel.app",
    ],
    allow_origin_regex="https?://.*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to Kairo Studio API"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

app.include_router(api_router, prefix="/api/v1")

from fastapi import WebSocket, WebSocketDisconnect
from app.core.tinymist_manager import get_tinymist_path
import asyncio
import logging

logger = logging.getLogger(__name__)

@app.websocket("/api/v1/ws/lsp/typst")
async def typst_lsp_endpoint(websocket: WebSocket):
    await websocket.accept()
    
    try:
        tinymist_path = get_tinymist_path()
    except Exception as e:
        logger.error(f"Could not get tinymist: {e}")
        await websocket.close()
        return

    import subprocess
    process = subprocess.Popen(
        [tinymist_path, "lsp"],
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
    )

    async def forward_stdout():
        try:
            while True:
                # Run blocking readline in a thread
                header = await asyncio.to_thread(process.stdout.readline)
                if not header:
                    break
                header_str = header.decode('utf-8')
                if header_str.startswith("Content-Length:"):
                    length_str = header_str.split(":")[1].strip()
                    length = int(length_str)
                    
                    await asyncio.to_thread(process.stdout.readline)
                    
                    content = await asyncio.to_thread(process.stdout.read, length)
                    await websocket.send_text(content.decode('utf-8'))
                elif header_str == "\r\n":
                    continue
        except Exception as e:
            logger.error(f"Error forwarding stdout: {e}")

    async def forward_stderr():
        try:
            while True:
                line = await asyncio.to_thread(process.stderr.readline)
                if not line:
                    break
        except Exception as e:
            pass

    async def forward_websocket_to_stdin():
        try:
            while True:
                data = await websocket.receive_text()
                payload = data.encode('utf-8')
                header = f"Content-Length: {len(payload)}\r\n\r\n".encode('utf-8')
                
                def write_stdin():
                    process.stdin.write(header)
                    process.stdin.write(payload)
                    process.stdin.flush()
                    
                await asyncio.to_thread(write_stdin)
        except WebSocketDisconnect:
            pass
        except Exception as e:
            logger.error(f"Error forwarding stdin: {e}")

    task1 = asyncio.create_task(forward_stdout())
    task2 = asyncio.create_task(forward_stderr())
    task3 = asyncio.create_task(forward_websocket_to_stdin())

    try:
        await asyncio.gather(task1, task2, task3)
    except asyncio.CancelledError:
        pass
    finally:
        try:
            process.terminate()
            await process.wait()
        except:
            pass

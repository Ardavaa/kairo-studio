from fastapi import APIRouter, WebSocket, WebSocketDisconnect
import asyncio
import logging
from app.core.tinymist_manager import get_tinymist_path

logger = logging.getLogger(__name__)

lsp_router = APIRouter()

@lsp_router.websocket("/ws/lsp/typst")
async def typst_lsp_endpoint(websocket: WebSocket):
    await websocket.accept()
    
    try:
        tinymist_path = get_tinymist_path()
    except Exception as e:
        logger.error(f"Could not get tinymist: {e}")
        await websocket.close()
        return

    # Start tinymist lsp
    process = await asyncio.create_subprocess_exec(
        tinymist_path, "lsp",
        stdin=asyncio.subprocess.PIPE,
        stdout=asyncio.subprocess.PIPE,
        stderr=asyncio.subprocess.PIPE,
    )

    async def forward_stdout():
        try:
            while True:
                # Read header (e.g. Content-Length: 123\r\n)
                header = await process.stdout.readline()
                if not header:
                    break
                header_str = header.decode('utf-8')
                if header_str.startswith("Content-Length:"):
                    length_str = header_str.split(":")[1].strip()
                    length = int(length_str)
                    
                    # Read the next line (empty line \r\n)
                    await process.stdout.readline()
                    
                    # Read the JSON content
                    content = await process.stdout.readexactly(length)
                    await websocket.send_text(content.decode('utf-8'))
                elif header_str == "\r\n":
                    continue
        except Exception as e:
            logger.error(f"Error forwarding stdout: {e}")

    async def forward_stderr():
        try:
            while True:
                line = await process.stderr.readline()
                if not line:
                    break
                # Tinymist logs to stderr, we could log it here if needed
                # logger.debug(f"tinymist: {line.decode('utf-8').strip()}")
        except Exception as e:
            pass

    async def forward_websocket_to_stdin():
        try:
            while True:
                data = await websocket.receive_text()
                # Construct JSON-RPC payload with headers for tinymist
                payload = data.encode('utf-8')
                header = f"Content-Length: {len(payload)}\r\n\r\n".encode('utf-8')
                process.stdin.write(header)
                process.stdin.write(payload)
                await process.stdin.drain()
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
        # Clean up process on disconnect
        try:
            process.terminate()
            await process.wait()
        except Exception:
            pass

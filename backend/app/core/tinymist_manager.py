import os
import sys
import platform
import urllib.request
import logging

logger = logging.getLogger(__name__)

# Base directory for the tinymist executable
BIN_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "bin")
os.makedirs(BIN_DIR, exist_ok=True)

def get_tinymist_path():
    """Get the path to the tinymist executable. Downloads it if not present."""
    system = platform.system().lower()
    machine = platform.machine().lower()
    
    if system == "windows":
        exe_name = "tinymist.exe"
        if "arm" in machine or "aarch64" in machine:
            asset_name = "tinymist-win32-arm64.exe"
        else:
            asset_name = "tinymist-win32-x64.exe"
    elif system == "darwin":
        exe_name = "tinymist"
        if "arm" in machine or "aarch64" in machine:
            asset_name = "tinymist-darwin-arm64"
        else:
            asset_name = "tinymist-darwin-x64"
    else:
        exe_name = "tinymist"
        if "arm64" in machine or "aarch64" in machine:
            asset_name = "tinymist-linux-arm64"
        elif "arm" in machine:
            asset_name = "tinymist-linux-armhf"
        else:
            asset_name = "tinymist-linux-x64"
            
    exe_path = os.path.join(BIN_DIR, exe_name)
    
    if not os.path.exists(exe_path):
        logger.info(f"tinymist executable not found. Downloading {asset_name}...")
        url = f"https://github.com/Myriad-Dreamin/tinymist/releases/latest/download/{asset_name}"
        try:
            print(f"Downloading {url} to {exe_path}...")
            import requests
            response = requests.get(url, stream=True)
            response.raise_for_status()
            with open(exe_path, 'wb') as f:
                for chunk in response.iter_content(chunk_size=8192):
                    f.write(chunk)
            if system != "windows":
                os.chmod(exe_path, 0o755)
            logger.info("Successfully downloaded tinymist.")
            print("Successfully downloaded tinymist.")
        except Exception as e:
            logger.error(f"Failed to download tinymist: {e}")
            print(f"\n=======================================================")
            print(f"ERROR: Failed to automatically download tinymist LSP.")
            print(f"Please manually download the executable from:")
            print(f"  {url}")
            print(f"And place it at: {exe_path}")
            print(f"=======================================================\n")
            raise RuntimeError(f"tinymist not found and automatic download failed. Please download manually and place at {exe_path}")
            
    return exe_path

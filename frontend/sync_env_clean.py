import os
import subprocess

env_file = os.path.join(os.path.dirname(__file__), ".env.local")

if not os.path.exists(env_file):
    print("Error: .env.local not found!")
    exit(1)

print("Reading .env.local with utf-8-sig (stripping BOM)...")
with open(env_file, "r", encoding="utf-8-sig") as f:
    lines = f.readlines()

for line in lines:
    line = line.strip()
    if not line or line.startswith("#"):
        continue
    if "=" in line:
        key, value = line.split("=", 1)
        key = key.strip()
        value = value.strip().strip("'").strip('"')
        
        print(f"Updating clean env var: {key} ...")
        cmd = [
            "npx.cmd", "vercel", "env", "add", key, "production",
            "--value", value,
            "--force",
            "--yes"
        ]
        res = subprocess.run(cmd, capture_output=True, text=True, cwd=os.path.dirname(__file__), shell=True)
        if res.returncode == 0:
            print(f"✅ Successfully updated {key}")
        else:
            print(f"❌ Failed to update {key}: {res.stderr or res.stdout}")

print("\n🎉 All environment variables synced cleanly without BOM!")

import os from "os";
import path from "path";
import fs from "fs/promises";
import { exec } from "child_process";

export function getWorkspaceDir(id: string = "default"): string {
  const isServerless =
    process.env.VERCEL ||
    process.env.AWS_LAMBDA_FUNCTION_NAME ||
    process.env.NODE_ENV === "production";
  const baseDir = isServerless
    ? path.join(os.tmpdir(), "kairo-workspace")
    : path.join(/*turbopackIgnore: true*/ process.cwd(), ".workspace");
  return path.join(baseDir, id);
}

export async function getOrDownloadTypstCli(): Promise<string> {
  if (process.platform !== "linux") {
    return "typst"; // On Windows/Mac local dev, use global typst in PATH
  }

  const binDir = path.join(os.tmpdir(), "bin");
  const typstBin = path.join(binDir, "typst");

  try {
    await fs.access(typstBin);
    return typstBin;
  } catch {
    // Binary not cached in /tmp yet, download official musl static binary
    await fs.mkdir(binDir, { recursive: true });
    const url =
      "https://github.com/typst/typst/releases/download/v0.12.0/typst-x86_64-unknown-linux-musl.tar.xz";

    await new Promise((resolve, reject) => {
      exec(
        `curl -L "${url}" | tar -xJ --strip-components=1 -C "${binDir}" typst-x86_64-unknown-linux-musl/typst`,
        (err, stdout, stderr) => {
          if (err) reject(err);
          else resolve(stdout);
        }
      );
    });

    await fs.chmod(typstBin, 0o755);
    return typstBin;
  }
}

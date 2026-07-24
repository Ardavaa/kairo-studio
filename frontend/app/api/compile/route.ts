import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import fs from "fs/promises";
import path from "path";
import os from "os";

export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json();

    if (!code) {
      return NextResponse.json({ error: "Code is required" }, { status: 400 });
    }

    // Create a temporary workspace directory
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "kairo-typst-"));
    const typstFilePath = path.join(tempDir, "main.typ");
    const svgOutputPattern = path.join(tempDir, "output-{n}.svg");

    // Write the code to the typst file
    await fs.writeFile(typstFilePath, code, "utf-8");

    // Compile the typst file to SVG
    await new Promise((resolve, reject) => {
      exec(`typst compile "${typstFilePath}" "${svgOutputPattern}"`, (error, stdout, stderr) => {
        if (error) {
          reject(stderr || error.message);
        } else {
          resolve(stdout);
        }
      });
    });

    // Read generated SVGs
    const files = await fs.readdir(tempDir);
    const svgFiles = files
      .filter((file) => file.startsWith("output-") && file.endsWith(".svg"))
      // Sort numerically
      .sort((a, b) => {
        const numA = parseInt(a.replace("output-", "").replace(".svg", ""), 10);
        const numB = parseInt(b.replace("output-", "").replace(".svg", ""), 10);
        return numA - numB;
      });

    const svgs = [];
    for (const file of svgFiles) {
      const content = await fs.readFile(path.join(tempDir, file), "utf-8");
      svgs.push(content);
    }

    // Cleanup temp directory in background
    fs.rm(tempDir, { recursive: true, force: true }).catch(console.error);

    return NextResponse.json({ pages: svgs });
  } catch (error: any) {
    console.error("Compilation error:", error);
    return NextResponse.json({ error: error.toString() }, { status: 500 });
  }
}

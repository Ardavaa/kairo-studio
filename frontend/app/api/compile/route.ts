import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import fs from "fs/promises";
import path from "path";
import os from "os";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code, targetFile = "main.typ" } = body;

    if (!code && code !== "") {
      return NextResponse.json({ error: "Code is required" }, { status: 400 });
    }

    const id = req.nextUrl.searchParams.get("id") || "default";
    const workspaceDir = path.join(process.cwd(), ".workspace", id);
    
    // Create workspace directory if it doesn't exist
    await fs.mkdir(workspaceDir, { recursive: true });
    
    // Write the code to the target file
    const targetFilePath = path.join(workspaceDir, targetFile);
    await fs.writeFile(targetFilePath, code, "utf-8");

    // Always compile main.typ
    const mainFilePath = path.join(workspaceDir, "main.typ");
    
    // Check if main.typ exists, if not create it empty
    try {
      await fs.access(mainFilePath);
    } catch {
      await fs.writeFile(mainFilePath, "", "utf-8");
    }

    // Run typst compile
    await new Promise((resolve, reject) => {
      exec(`typst compile main.typ output-{n}.svg`, { cwd: workspaceDir }, (error, stdout, stderr) => {
        if (error) {
          reject(stderr || error.message);
        } else {
          resolve(stdout);
        }
      });
    });

    // Read generated SVGs
    const files = await fs.readdir(workspaceDir);
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
      const content = await fs.readFile(path.join(workspaceDir, file), "utf-8");
      svgs.push(content);
    }

    // Save the first page as preview.svg
    if (svgFiles.length > 0) {
      await fs.copyFile(path.join(workspaceDir, svgFiles[0]), path.join(workspaceDir, "preview.svg")).catch(() => {});
    }

    // Cleanup ONLY output SVG files, keep images and main.typ
    for (const file of svgFiles) {
      await fs.unlink(path.join(workspaceDir, file)).catch(() => {});
    }

    return NextResponse.json({ pages: svgs });
  } catch (error: any) {
    console.error("Compilation error:", error);
    return NextResponse.json({ error: error.toString() }, { status: 500 });
  }
}

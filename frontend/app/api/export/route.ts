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

    const id = "default";
    const workspaceDir = path.join(process.cwd(), ".workspace", id);
    
    // Create workspace directory if it doesn't exist
    await fs.mkdir(workspaceDir, { recursive: true });
    
    const typstFilePath = path.join(workspaceDir, "main.typ");
    const pdfOutputPattern = path.join(workspaceDir, "output.pdf");

    // Write the code to the target file
    const targetFilePath = path.join(workspaceDir, targetFile);
    await fs.writeFile(targetFilePath, code, "utf-8");

    // Always compile main.typ
    const mainFilePath = path.join(workspaceDir, "main.typ");
    try {
      await fs.access(mainFilePath);
    } catch {
      await fs.writeFile(mainFilePath, "", "utf-8");
    }

    // Compile the typst file to PDF
    await new Promise((resolve, reject) => {
      exec(`typst compile main.typ output.pdf`, { cwd: workspaceDir }, (error, stdout, stderr) => {
        if (error) {
          reject(stderr || error.message);
        } else {
          resolve(stdout);
        }
      });
    });

    // Read generated PDF
    const pdfBuffer = await fs.readFile(pdfOutputPattern);

    // Cleanup ONLY output PDF file
    await fs.unlink(pdfOutputPattern).catch(() => {});

    // Return the PDF file
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="document.pdf"',
      },
    });
  } catch (error: any) {
    console.error("Compilation error:", error);
    return NextResponse.json({ error: error.toString() }, { status: 500 });
  }
}

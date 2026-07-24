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
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "kairo-typst-export-"));
    const typstFilePath = path.join(tempDir, "main.typ");
    const pdfOutputPattern = path.join(tempDir, "output.pdf");

    // Write the code to the typst file
    await fs.writeFile(typstFilePath, code, "utf-8");

    // Compile the typst file to PDF
    await new Promise((resolve, reject) => {
      exec(`typst compile "${typstFilePath}" "${pdfOutputPattern}"`, (error, stdout, stderr) => {
        if (error) {
          reject(stderr || error.message);
        } else {
          resolve(stdout);
        }
      });
    });

    // Read generated PDF
    const pdfBuffer = await fs.readFile(pdfOutputPattern);

    // Cleanup temp directory in background
    fs.rm(tempDir, { recursive: true, force: true }).catch(console.error);

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

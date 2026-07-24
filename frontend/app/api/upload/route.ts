import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const id = searchParams.get("id") || "default";

    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
    }

    const workspaceDir = path.join(process.cwd(), ".workspace", id);
    
    // Create workspace directory if it doesn't exist
    await fs.mkdir(workspaceDir, { recursive: true });

    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const filePath = path.join(workspaceDir, file.name);
      await fs.writeFile(filePath, buffer);
    }

    return NextResponse.json({ success: true, count: files.length });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: error.toString() }, { status: 500 });
  }
}

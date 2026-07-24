import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

// GET: Read file content
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const id = searchParams.get("id") || "default";
    const name = searchParams.get("name");

    if (!name) {
      return NextResponse.json({ error: "Missing name" }, { status: 400 });
    }

    const workspaceDir = path.join(process.cwd(), ".workspace", id);
    const filePath = path.join(workspaceDir, name);

    const buffer = await fs.readFile(filePath);

    // Determine mime type
    let mimeType = "text/plain";
    if (name.endsWith(".png")) mimeType = "image/png";
    else if (name.endsWith(".jpg") || name.endsWith(".jpeg")) mimeType = "image/jpeg";
    else if (name.endsWith(".svg")) mimeType = "image/svg+xml";

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": mimeType,
      },
    });
  } catch (error: any) {
    console.error("Read file error:", error);
    return NextResponse.json({ error: error.toString() }, { status: 500 });
  }
}

// PUT: Update file content (not used directly if we use compile endpoint to save, but good for pure save)
export async function PUT(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const id = searchParams.get("id") || "default";
    const body = await req.json();
    const { name, content } = body;

    if (!name) {
      return NextResponse.json({ error: "Missing name" }, { status: 400 });
    }

    const workspaceDir = path.join(process.cwd(), ".workspace", id);
    const filePath = path.join(workspaceDir, name);

    await fs.writeFile(filePath, content, "utf-8");

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Write file error:", error);
    return NextResponse.json({ error: error.toString() }, { status: 500 });
  }
}

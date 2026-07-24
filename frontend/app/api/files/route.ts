import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

// GET: List all files
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const id = searchParams.get("id") || "default";
    const workspaceDir = path.join(process.cwd(), ".workspace", id);
    
    await fs.mkdir(workspaceDir, { recursive: true });

    async function walk(dir: string, base: string = ""): Promise<{name: string, type: string}[]> {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      let results: {name: string, type: string}[] = [];
      for (const entry of entries) {
        const relPath = path.join(base, entry.name).replace(/\\/g, '/');
        if (entry.isDirectory()) {
          results.push({ name: relPath, type: 'folder' });
          const children = await walk(path.join(dir, entry.name), relPath);
          results = results.concat(children);
        } else {
          let type = 'other';
          if (entry.name.endsWith('.typ')) type = 'typst';
          else if (entry.name.endsWith('.bib')) type = 'bib';
          else if (entry.name.match(/\.(png|jpe?g|gif|svg|webp)$/i)) type = 'image';
          results.push({ name: relPath, type });
        }
      }
      return results;
    }

    const files = await walk(workspaceDir);
    return NextResponse.json(files);
  } catch (error: any) {
    console.error("List files error:", error);
    return NextResponse.json({ error: error.toString() }, { status: 500 });
  }
}

// POST: Create a file or directory
export async function POST(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const id = searchParams.get("id") || "default";
    const body = await req.json();
    const { name, isFolder } = body;

    if (!name) {
      return NextResponse.json({ error: "Missing name" }, { status: 400 });
    }

    const workspaceDir = path.join(process.cwd(), ".workspace", id);
    const targetPath = path.join(workspaceDir, name);

    if (isFolder) {
      await fs.mkdir(targetPath, { recursive: true });
    } else {
      await fs.writeFile(targetPath, "", "utf-8");
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Create error:", error);
    return NextResponse.json({ error: error.toString() }, { status: 500 });
  }
}

// PUT: Rename file
export async function PUT(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const id = searchParams.get("id") || "default";
    const body = await req.json();
    const { oldName, newName } = body;

    if (!oldName || !newName) {
      return NextResponse.json({ error: "Missing oldName or newName" }, { status: 400 });
    }

    const workspaceDir = path.join(process.cwd(), ".workspace", id);
    const oldPath = path.join(workspaceDir, oldName);
    const newPath = path.join(workspaceDir, newName);

    await fs.rename(oldPath, newPath);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Rename error:", error);
    return NextResponse.json({ error: error.toString() }, { status: 500 });
  }
}

// DELETE: Delete file
export async function DELETE(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const id = searchParams.get("id") || "default";
    const name = searchParams.get("name");

    if (!name) {
      return NextResponse.json({ error: "Missing name" }, { status: 400 });
    }

    const workspaceDir = path.join(process.cwd(), ".workspace", id);
    const filePath = path.join(workspaceDir, name);

    await fs.unlink(filePath);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Delete error:", error);
    return NextResponse.json({ error: error.toString() }, { status: 500 });
  }
}

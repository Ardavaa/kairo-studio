import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const DB_PATH = path.join(process.cwd(), ".workspace", "db.json");

async function getDb() {
  try {
    const data = await fs.readFile(DB_PATH, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

async function saveDb(data: any) {
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const projects = await getDb();
    const filtered = projects.filter((p: any) => p.id !== id);
    
    await saveDb(filtered);

    const workspaceDir = path.join(process.cwd(), ".workspace", id);
    await fs.rm(workspaceDir, { recursive: true, force: true }).catch(() => {});

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.toString() }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const projects = await getDb();
    
    const index = projects.findIndex((p: any) => p.id === id);
    if (index === -1) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    projects[index] = { ...projects[index], ...body, updated: new Date().toISOString() };
    await saveDb(projects);

    return NextResponse.json(projects[index]);
  } catch (err: any) {
    return NextResponse.json({ error: err.toString() }, { status: 500 });
  }
}

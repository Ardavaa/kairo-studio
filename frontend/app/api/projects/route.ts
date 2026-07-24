import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const DB_PATH = path.join(process.cwd(), ".workspace", "db.json");
const INITIAL_CODE = `#import "@preview/charged-ieee:0.1.4": ieee

#show: ieee.with(
  title: [New Project],
  abstract: [
    Abstract goes here.
  ]
)

= Introduction
Start writing here.
`;

async function getDb() {
  try {
    await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
    const data = await fs.readFile(DB_PATH, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

async function saveDb(data: any) {
  await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
}

export async function GET() {
  try {
    const projects = await getDb();
    return NextResponse.json(projects);
  } catch (err: any) {
    return NextResponse.json({ error: err.toString() }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const title = body.title || "Untitled Document";
    const template = body.template || "default";

    const projects = await getDb();
    const newId = `proj_${Date.now()}`;
    const newProject = {
      id: newId,
      title: title,
      author: "You",
      updated: new Date().toISOString(),
      type: "document"
    };

    projects.push(newProject);
    await saveDb(projects);

    const workspaceDir = path.join(process.cwd(), ".workspace", newId);
    await fs.mkdir(workspaceDir, { recursive: true });
    
    const fileContent = template === "empty" ? "" : INITIAL_CODE;
    await fs.writeFile(path.join(workspaceDir, "main.typ"), fileContent, "utf-8");

    return NextResponse.json(newProject);
  } catch (err: any) {
    return NextResponse.json({ error: err.toString() }, { status: 500 });
  }
}

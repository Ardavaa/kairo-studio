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

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userEmail = searchParams.get("user_email");
    if (!userEmail || ["", "null", "undefined"].includes(userEmail.trim())) {
      return NextResponse.json([]);
    }
    const projects = await getDb();
    const cleanEmail = userEmail.trim();
    const filtered = projects.filter((p: any) => p.user_email === cleanEmail || p.author === cleanEmail);
    return NextResponse.json(filtered);
  } catch (err: any) {
    return NextResponse.json({ error: err.toString() }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const title = body.title || "Untitled Document";
    const template = body.template || "default";
    const duplicateFrom = body.duplicateFrom;
    const userEmail = body.user_email || "";

    const projects = await getDb();
    const newId = `proj_${Date.now()}`;

    if (duplicateFrom) {
      const origIndex = projects.findIndex((p: any) => p.id === duplicateFrom);
      if (origIndex === -1) {
        return NextResponse.json({ error: "Source project not found" }, { status: 404 });
      }
      const origProject = projects[origIndex];
      const newProject = {
        ...origProject,
        id: newId,
        title: title,
        user_email: userEmail || origProject.user_email || "",
        updated: new Date().toISOString(),
      };
      projects.splice(origIndex + 1, 0, newProject);
      await saveDb(projects);

      const workspaceDir = path.join(process.cwd(), ".workspace", newId);
      const sourceDir = path.join(process.cwd(), ".workspace", duplicateFrom);
      await fs.mkdir(workspaceDir, { recursive: true });
      await fs.cp(sourceDir, workspaceDir, { recursive: true });

      return NextResponse.json(newProject);
    }

    const newProject = {
      id: newId,
      title: title,
      author: userEmail ? userEmail.split("@")[0] : "You",
      user_email: userEmail,
      updated: new Date().toISOString(),
      type: "document"
    };

    projects.push(newProject);
    await saveDb(projects);

    const workspaceDir = path.join(process.cwd(), ".workspace", newId);
    await fs.mkdir(workspaceDir, { recursive: true });
    if (template === "ieee" || template === "neurips") {
      const templatePath = path.join(process.cwd(), "..", "paper-templates", template);
      await fs.cp(templatePath, workspaceDir, { recursive: true });
    } else {
      const fileContent = template === "empty" ? "" : INITIAL_CODE;
      await fs.writeFile(path.join(workspaceDir, "main.typ"), fileContent, "utf-8");
    }

    // Generate preview
    try {
      const { exec } = require("child_process");
      await new Promise((resolve, reject) => {
        exec(`typst compile main.typ preview-{n}.svg`, { cwd: workspaceDir }, (error: any, stdout: any, stderr: any) => {
          if (error) {
            reject(stderr || error.message);
          } else {
            resolve(stdout);
          }
        });
      });
      // Delete extra pages, keep preview-1.svg and rename to preview.svg
      const files = await fs.readdir(workspaceDir);
      const previewFiles = files.filter(f => f.startsWith("preview-") && f.endsWith(".svg"));
      if (previewFiles.length > 0) {
        previewFiles.sort(); // preview-1.svg, preview-2.svg
        await fs.rename(path.join(workspaceDir, previewFiles[0]), path.join(workspaceDir, "preview.svg"));
        for (let i = 1; i < previewFiles.length; i++) {
          await fs.unlink(path.join(workspaceDir, previewFiles[i]));
        }
      }
    } catch (e) {
      console.log("Failed to generate initial preview", e);
    }

    return NextResponse.json(newProject);
  } catch (err: any) {
    return NextResponse.json({ error: err.toString() }, { status: 500 });
  }
}

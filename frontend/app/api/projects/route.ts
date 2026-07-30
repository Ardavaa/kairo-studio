import { NextRequest, NextResponse } from "next/server";
import { insforge } from "@/lib/insforge";
import fs from "fs/promises";
import path from "path";
import { getWorkspaceDir } from "@/utils/workspace";

// InsForge API URL for backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://gnitfu5w.function2.insforge.app";

const NEURIPS_TEMPLATE = `#import "@preview/ilm:0.1.1": *

#show: paper.with(
  title: [NeurIPS Paper Title],
  authors: (
    (
      name: "Author Name",
      affiliation: "University / Institution",
      email: "author@example.com",
    ),
  ),
  abstract: [
    Enter your NeurIPS paper abstract here. Summarize your research contributions, methodology, and key findings.
  ],
)

= Introduction
Welcome to your NeurIPS template in Kairo Studio. Write your introduction here.

= Related Work
Discuss existing literature and foundational papers here.

= Methodology
Describe your proposed model, algorithms, and experimental setup.

= Experiments & Results
Present your empirical evaluation, figures, and comparison tables.

= Conclusion
Summarize your contributions and future directions.
`;

const IEEE_TEMPLATE = `#import "@preview/charged-ieee:0.1.4": ieee

#show: ieee.with(
  title: [IEEE Conference / Journal Paper Title],
  abstract: [
    This is the abstract for your IEEE formatted paper. Provide a summary of the problem, proposed solution, and empirical results.
  ],
  authors: (
    (
      name: "Author Name",
      department: "Department of Computer Science",
      organization: "University / Institution",
      location: "City, Country",
      email: "author@example.com"
    ),
  ),
  index-terms: ("IEEE Format", "Typst Template", "Research Paper"),
)

= Introduction
Welcome to your IEEE template in Kairo Studio. This standard two-column format is suitable for IEEE conference and journal submissions.

= Proposed System
Describe your system architecture, formulas, and implementation details.

= Performance Evaluation
Present figures, tables, and benchmark performance metrics.

= Conclusion
Provide final remarks and future work.
`;

const DEFAULT_TEMPLATE = `#set page(paper: "a4", margin: (x: 2cm, y: 2.5cm))
#set text(font: "Liberation Sans", size: 11pt)

= Main Document Title

Welcome to Kairo Studio! Start typing your document here...
`;

async function getUserEmail(req: NextRequest): Promise<string | null> {
  // Try to get from query param or body
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("user_email");
  if (email && !["", "null", "undefined"].includes(email.trim())) {
    return email.trim();
  }
  return null;
}

export async function GET(req: NextRequest) {
  try {
    const userEmail = await getUserEmail(req);
    if (!userEmail) {
      return NextResponse.json([]);
    }

    // Fetch from InsForge database - match actual schema: user_id, user_email, name, etc.
    const { data, error } = await insforge.database
      .from("projects")
      .select("*")
      .eq("user_email", userEmail)
      .order("updated_at", { ascending: false });

    if (error) {
      console.error("InsForge error:", error);
      return NextResponse.json([]);
    }

    // Transform to frontend expected format
    const projects = (data || []).map((p: any) => ({
      id: p.id,
      title: p.name,
      author: p.user_id || p.user_email?.split("@")[0] || "You",
      user_email: p.user_email,
      description: p.description,
      created_at: p.created_at,
      updated: p.updated_at,
      type: "document"
    }));

    return NextResponse.json(projects);
  } catch (err: any) {
    console.error("Projects GET error:", err);
    return NextResponse.json({ error: err.toString() }, { status: 500 });
  }
}

async function copyTemplateFiles(template: string, targetWorkspaceDir: string) {
  const possiblePaths = [
    path.join(process.cwd(), "paper-templates", template),
    path.join(process.cwd(), "..", "paper-templates", template),
  ];

  let srcDir: string | null = null;
  for (const p of possiblePaths) {
    try {
      await fs.access(p);
      srcDir = p;
      break;
    } catch {}
  }

  if (srcDir) {
    const entries = await fs.readdir(srcDir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isFile()) {
        const content = await fs.readFile(path.join(srcDir, entry.name));
        await fs.writeFile(path.join(targetWorkspaceDir, entry.name), content);
      }
    }
    return true;
  }
  return false;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const title = body.title || "Untitled Document";
    const description = body.description || "";
    const template = body.template || "default";
    const duplicateFrom = body.duplicateFrom;
    const userEmail = body.user_email || "";

    if (!userEmail) {
      return NextResponse.json({ error: "user_email is required" }, { status: 400 });
    }

    const newId = crypto.randomUUID();

    // Prepare workspace directory and seed main.typ file from paper-templates
    const workspaceDir = getWorkspaceDir(newId);
    await fs.mkdir(workspaceDir, { recursive: true });

    const copied = await copyTemplateFiles(template, workspaceDir);
    if (!copied) {
      let initialCode = DEFAULT_TEMPLATE;
      if (template === "neurips") {
        initialCode = NEURIPS_TEMPLATE;
      } else if (template === "ieee") {
        initialCode = IEEE_TEMPLATE;
      }
      await fs.writeFile(path.join(workspaceDir, "main.typ"), initialCode, "utf-8");
    }

    if (duplicateFrom) {
      // Get original project
      const { data: origProject, error: getError } = await insforge.database
        .from("projects")
        .select("*")
        .eq("id", duplicateFrom)
        .single();

      if (getError || !origProject) {
        return NextResponse.json({ error: "Source project not found" }, { status: 404 });
      }

      const newProject: any = {
        id: newId,
        name: title,
        description: origProject.description || "",
        user_email: userEmail,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { error: insertError } = await insforge.database
        .from("projects")
        .insert([newProject]);

      if (insertError) {
        console.error("InsForge duplicate insert error:", insertError);
        return NextResponse.json({ error: insertError.message || JSON.stringify(insertError) }, { status: 500 });
      }

      return NextResponse.json({
        id: newProject.id,
        title: newProject.name,
        author: userEmail.split("@")[0],
        user_email: newProject.user_email,
        description: newProject.description,
        created_at: newProject.created_at,
        updated: newProject.updated_at,
        type: "document"
      });
    }

    const newProject: any = {
      id: newId,
      name: title,
      description: description,
      user_email: userEmail,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { error: insertError } = await insforge.database
      .from("projects")
      .insert([newProject]);

    if (insertError) {
      console.error("InsForge insert error:", insertError);
      return NextResponse.json({ error: insertError.message || JSON.stringify(insertError) }, { status: 500 });
    }

    return NextResponse.json({
      id: newProject.id,
      title: newProject.name,
      author: userEmail.split("@")[0],
      user_email: newProject.user_email,
      description: newProject.description,
      created_at: newProject.created_at,
      updated: newProject.updated_at,
      type: "document"
    });
  } catch (err: any) {
    console.error("Projects POST error:", err);
    return NextResponse.json({ error: err.toString() }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("id");
    const userEmail = searchParams.get("user_email");

    if (!projectId || !userEmail) {
      return NextResponse.json({ error: "id and user_email are required" }, { status: 400 });
    }

    // Verify ownership before delete
    const { data: project, error: getError } = await insforge.database
      .from("projects")
      .select("*")
      .eq("id", projectId)
      .eq("user_email", userEmail)
      .single();

    if (getError || !project) {
      return NextResponse.json({ error: "Project not found or access denied" }, { status: 404 });
    }

    const { error: deleteError } = await insforge.database
      .from("projects")
      .delete()
      .eq("id", projectId)
      .eq("user_email", userEmail);

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    return NextResponse.json({ status: "success" });
  } catch (err: any) {
    console.error("Projects DELETE error:", err);
    return NextResponse.json({ error: err.toString() }, { status: 500 });
  }
}

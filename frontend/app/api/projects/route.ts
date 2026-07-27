import { NextRequest, NextResponse } from "next/server";
import { insforge } from "@/lib/insforge";

// InsForge API URL for backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://gnitfu5w.function2.insforge.app";

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

    // Fetch from InsForge database
    const { data, error } = await insforge.database
      .from("projects")
      .select("*")
      .eq("user_email", userEmail)
      .order("updated", { ascending: false });

    if (error) {
      console.error("InsForge error:", error);
      return NextResponse.json([]);
    }

    return NextResponse.json(data || []);
  } catch (err) {
    console.error("Projects GET error:", err);
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

    if (!userEmail) {
      return NextResponse.json({ error: "user_email is required" }, { status: 400 });
    }

    const newId = `proj_${Date.now()}`;

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

      const newProject = {
        ...origProject,
        id: newId,
        title: title,
        user_email: userEmail,
        updated: new Date().toISOString(),
      };

      const { error: insertError } = await insforge.database
        .from("projects")
        .insert([newProject]);

      if (insertError) {
        return NextResponse.json({ error: insertError.message }, { status: 500 });
      }

      return NextResponse.json(newProject);
    }

    const newProject = {
      id: newId,
      title: title,
      author: userEmail.split("@")[0],
      user_email: userEmail,
      updated: new Date().toISOString(),
      type: "document"
    };

    const { error: insertError } = await insforge.database
      .from("projects")
      .insert([newProject]);

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json(newProject);
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

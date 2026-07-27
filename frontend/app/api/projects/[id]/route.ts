import { NextRequest, NextResponse } from "next/server";
import { insforge } from "@/lib/insforge";
import fs from "fs/promises";
import { getWorkspaceDir } from "@/utils/workspace";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const userEmail = searchParams.get("user_email");

    let query = insforge.database.from("projects").delete().eq("id", id);
    if (userEmail) {
      query = query.eq("user_email", userEmail);
    }

    const { error } = await query;
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Clean up temporary/workspace directory if accessible
    const workspaceDir = getWorkspaceDir(id);
    await fs
      .rm(workspaceDir, { recursive: true, force: true })
      .catch(() => {});

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.toString() }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const updateData: any = { updated_at: new Date().toISOString() };
    if (body.title) updateData.name = body.title;
    if (body.description !== undefined)
      updateData.description = body.description;

    const { data, error } = await insforge.database
      .from("projects")
      .update(updateData)
      .eq("id", id)
      .select("*")
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: error?.message || "Project not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: data.id,
      title: data.name || "Untitled Project",
      author: data.user_id || data.user_email?.split("@")[0] || "You",
      user_email: data.user_email,
      description: data.description || "",
      created_at: data.created_at || new Date().toISOString(),
      updated:
        data.updated_at || data.created_at || new Date().toISOString(),
      type: "document",
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.toString() }, { status: 500 });
  }
}

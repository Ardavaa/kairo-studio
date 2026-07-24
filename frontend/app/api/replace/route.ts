import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

// POST: Replace text in a file
export async function POST(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const id = searchParams.get("id") || "default";
    const body = await req.json();
    const { file, search, replace, line, matchStart } = body;

    if (!file || !search || replace === undefined) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    const workspaceDir = path.join(process.cwd(), ".workspace", id);
    const fullPath = path.join(workspaceDir, file);
    
    let content = await fs.readFile(fullPath, "utf-8");

    if (line !== undefined && matchStart !== undefined) {
      // Replace only on a specific line at a specific start index
      const lines = content.split('\n');
      const targetIdx = line - 1;
      if (targetIdx >= 0 && targetIdx < lines.length) {
        const lineText = lines[targetIdx];
        const before = lineText.substring(0, matchStart);
        const after = lineText.substring(matchStart + search.length);
        lines[targetIdx] = before + replace + after;
        content = lines.join('\n');
      }
    } else {
      // Replace all occurrences in the file
      const escapeRegExp = (string: string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const flags = body.casesensitive ? 'g' : 'gi';
      const regex = new RegExp(escapeRegExp(search), flags);
      content = content.replace(regex, replace);
    }

    await fs.writeFile(fullPath, content, "utf-8");

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Replace error:", error);
    return NextResponse.json({ error: error.toString() }, { status: 500 });
  }
}

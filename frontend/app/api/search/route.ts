import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

// GET: Search text inside files
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const id = searchParams.get("id") || "default";
    const q = searchParams.get("q");

    if (!q) {
      return NextResponse.json({ results: [] });
    }

    const workspaceDir = path.join(process.cwd(), ".workspace", id);
    await fs.mkdir(workspaceDir, { recursive: true });

    async function walk(dir: string, base: string = ""): Promise<string[]> {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      let results: string[] = [];
      for (const entry of entries) {
        const relPath = path.join(base, entry.name).replace(/\\/g, '/');
        if (entry.isDirectory()) {
          const children = await walk(path.join(dir, entry.name), relPath);
          results = results.concat(children);
        } else {
          // Only search text-like files
          if (entry.name.match(/\.(typ|bib|txt|md|json)$/i)) {
            results.push(relPath);
          }
        }
      }
      return results;
    }

    const textFiles = await walk(workspaceDir);
    const results = [];

    const isCaseSensitive = searchParams.get("casesensitive") === "true";
    const query = isCaseSensitive ? q : q.toLowerCase();

    for (const file of textFiles) {
      const fullPath = path.join(workspaceDir, file);
      const content = await fs.readFile(fullPath, "utf-8");
      const lines = content.split('\n');
      
      const fileMatches = [];
      for (let i = 0; i < lines.length; i++) {
        const lineText = lines[i];
        const searchTarget = isCaseSensitive ? lineText : lineText.toLowerCase();
        
        let startIndex = 0;
        let index;
        while ((index = searchTarget.indexOf(query, startIndex)) > -1) {
          fileMatches.push({
            line: i + 1,
            col: index + 1,
            text: lineText,
            matchStart: index,
            matchLength: query.length
          });
          startIndex = index + query.length;
        }
      }

      if (fileMatches.length > 0) {
        results.push({ file, matches: fileMatches });
      }
    }

    return NextResponse.json({ results });
  } catch (error: any) {
    console.error("Search error:", error);
    return NextResponse.json({ error: error.toString() }, { status: 500 });
  }
}

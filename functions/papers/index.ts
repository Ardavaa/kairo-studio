// Kairo Studio Papers API Edge Function
// Handles papers CRUD operations using InsForge database

const DB_URL = "postgresql://postgres:gnitfu5w@gnitfu5w.ap-southeast.database.insforge.app:5432/insforge?sslmode=require";

async function query(sql: string, params: any[] = []) {
  const response = await fetch(DB_URL + "&options=statement_timeout=10000", {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: { sql, params }
    })
  });
  return response.json();
}

export default async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const path = url.pathname;

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // GET /papers - List all papers
    if (path === '/papers' && req.method === 'GET') {
      const limit = parseInt(url.searchParams.get('limit') || '50');
      const offset = parseInt(url.searchParams.get('offset') || '0');
      const search = url.searchParams.get('search') || '';

      let sql = `
        SELECT id, doi, arxiv_id, title, abstract, publication_year, venue, 
               citation_count, is_open_access, pdf_url, authors_raw, created_at
        FROM papers
      `;
      const params: any[] = [];

      if (search) {
        sql += ` WHERE title ILIKE $1 OR abstract ILIKE $1`;
        params.push(`%${search}%`);
        sql += ` ORDER BY citation_count DESC LIMIT $2 OFFSET $3`;
        params.push(limit, offset);
      } else {
        sql += ` ORDER BY citation_count DESC LIMIT $1 OFFSET $2`;
        params.push(limit, offset);
      }

      const result = await query(sql, params);
      
      return new Response(JSON.stringify({
        papers: result.rows || [],
        total: result.rows?.length || 0,
        limit,
        offset
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // GET /papers/:id - Get paper by ID
    if (path.match(/^\/papers\/([^/]+)$/) && req.method === 'GET') {
      const id = path.match(/^\/papers\/([^/]+)$/)?.[1];
      
      const result = await query(
        `SELECT * FROM papers WHERE id = $1 OR arxiv_id = $1 OR doi = $1`,
        [id]
      );

      if (!result.rows?.length) {
        return new Response(JSON.stringify({ error: 'Paper not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify(result.rows[0]), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // POST /papers - Create new paper
    if (path === '/papers' && req.method === 'POST') {
      const body = await req.json();
      const { doi, arxiv_id, title, abstract, publication_year, venue, authors_raw } = body;

      if (!title) {
        return new Response(JSON.stringify({ error: 'Title is required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const result = await query(
        `INSERT INTO papers (doi, arxiv_id, title, abstract, publication_year, venue, authors_raw)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [doi, arxiv_id, title, abstract, publication_year, venue, JSON.stringify(authors_raw || [])]
      );

      return new Response(JSON.stringify(result.rows[0]), {
        status: 201,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Health check
    if (path === '/health' && req.method === 'GET') {
      return new Response(JSON.stringify({ 
        status: 'ok', 
        service: 'papers-api',
        database: 'connected'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Not found' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Papers API error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

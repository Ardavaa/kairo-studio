// Kairo Studio Projects API Edge Function
// Handles projects CRUD operations

const DB_URL = "postgresql://postgres:gnitfu5w@gnitfu5w.ap-southeast.database.insforge.app:5432/insforge?sslmode=require";

async function query(sql: string, params: any[] = []) {
  const response = await fetch(DB_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: { sql, params } })
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
    // GET /projects - List projects
    if (path === '/projects' && req.method === 'GET') {
      const result = await query(
        `SELECT p.*, u.email as owner_email 
         FROM projects p 
         LEFT JOIN users u ON p.user_id = u.id 
         ORDER BY p.created_at DESC`
      );
      
      return new Response(JSON.stringify({
        projects: result.rows || [],
        total: result.rows?.length || 0
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // POST /projects - Create project
    if (path === '/projects' && req.method === 'POST') {
      const body = await req.json();
      const { user_id, name, description } = body;

      if (!name) {
        return new Response(JSON.stringify({ error: 'Name is required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const result = await query(
        `INSERT INTO projects (user_id, name, description)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [user_id, name, description]
      );

      return new Response(JSON.stringify(result.rows[0]), {
        status: 201,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // GET /projects/:id - Get project
    if (path.match(/^\/projects\/([^/]+)$/) && req.method === 'GET') {
      const id = path.match(/^\/projects\/([^/]+)$/)?.[1];
      
      const result = await query(
        `SELECT p.*, u.email as owner_email 
         FROM projects p 
         LEFT JOIN users u ON p.user_id = u.id 
         WHERE p.id = $1`,
        [id]
      );

      if (!result.rows?.length) {
        return new Response(JSON.stringify({ error: 'Project not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify(result.rows[0]), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // DELETE /projects/:id
    if (path.match(/^\/projects\/([^/]+)$/) && req.method === 'DELETE') {
      const id = path.match(/^\/projects\/([^/]+)$/)?.[1];
      
      await query(`DELETE FROM projects WHERE id = $1`, [id]);

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Health
    if (path === '/health' && req.method === 'GET') {
      return new Response(JSON.stringify({ status: 'ok', service: 'projects-api' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Not found' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Projects API error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

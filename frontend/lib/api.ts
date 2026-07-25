/**
 * Backend API client for Kairo Studio.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

/**
 * Get the authentication token from cookie.
 */
function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'auth_token') {
      return decodeURIComponent(value);
    }
  }
  
  return null;
}

/**
 * Generic API request handler.
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: 'include',
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'An error occurred' }));
    throw new Error(error.detail || `API Error: ${response.status}`);
  }
  
  return response.json();
}

// Auth API
export const authApi = {
  getGoogleAuthUrl: () => `${API_BASE_URL}/auth/google`,
  
  getCurrentUser: () => apiRequest<{
    id: string;
    email: string;
    name: string;
    picture?: string;
  }>('/auth/me'),
  
  checkStatus: () => apiRequest<{
    authenticated: boolean;
    user?: {
      id: string;
      email: string;
      name: string;
      picture?: string;
    };
  }>('/auth/status'),
  
  logout: () => apiRequest<{ message: string }>('/auth/logout', { method: 'POST' }),
  
  refreshToken: () => apiRequest<{ message: string }>('/auth/refresh', { method: 'POST' }),
};

// Research API
export const researchApi = {
  search: (query: string) => 
    apiRequest<{ results: any[] }>(`/research/search?q=${encodeURIComponent(query)}`),
  
  getPaper: (id: string) => 
    apiRequest<any>(`/research/papers/${id}`),
  
  addToLibrary: (paperId: string) => 
    apiRequest<any>('/research/library', {
      method: 'POST',
      body: JSON.stringify({ paper_id: paperId }),
    }),
};

// RAG API
export const ragApi = {
  addDocument: (content: string, metadata: Record<string, any>) =>
    apiRequest<{ id: string }>('/rag/documents', {
      method: 'POST',
      body: JSON.stringify({ content, metadata }),
    }),
  
  query: (query: string, topK: number = 5) =>
    apiRequest<{ results: any[] }>(`/rag/query?q=${encodeURIComponent(query)}&top_k=${topK}`),
};

// Editor API
export const editorApi = {
  compile: (content: string, template: string) =>
    apiRequest<{ pdf_url: string }>('/editor/compile', {
      method: 'POST',
      body: JSON.stringify({ content, template }),
    }),
};

// Graph API
export const graphApi = {
  getGraph: (projectId: string) =>
    apiRequest<{ nodes: any[]; edges: any[] }>(`/graph/${projectId}`),
  
  addNode: (projectId: string, node: any) =>
    apiRequest<{ id: string }>(`/graph/${projectId}/nodes`, {
      method: 'POST',
      body: JSON.stringify(node),
    }),
};

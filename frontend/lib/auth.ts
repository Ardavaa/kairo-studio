/**
 * Authentication utilities for Kairo Studio frontend.
 * Handles token management and user state.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

/**
 * Get the authentication token from cookie or localStorage.
 */
export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  
  // Try to get from cookie first (set by backend)
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'auth_token') {
      return decodeURIComponent(value);
    }
  }
  
  // Fallback to localStorage for development
  return localStorage.getItem('auth_token');
}

/**
 * Set the authentication token.
 */
export function setToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('auth_token', token);
  
  // Also set cookie for server-side access
  document.cookie = `auth_token=${encodeURIComponent(token)}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
}

/**
 * Remove the authentication token.
 */
export function removeToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('auth_token');
  document.cookie = 'auth_token=; path=/; max-age=0';
}

/**
 * Get the current user from the API.
 */
export async function getCurrentUser(): Promise<User | null> {
  const token = getToken();
  if (!token) return null;
  
  try {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
    });
    
    if (response.ok) {
      const data = await response.json();
      return data as User;
    }
    
    return null;
  } catch {
    return null;
  }
}

/**
 * Check if the user is authenticated.
 */
export async function checkAuthStatus(): Promise<AuthState> {
  const token = getToken();
  
  if (!token) {
    return { user: null, isAuthenticated: false, isLoading: false };
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/auth/status`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
    });
    
    if (response.ok) {
      const data = await response.json();
      return {
        user: data.user,
        isAuthenticated: data.authenticated,
        isLoading: false,
      };
    }
    
    return { user: null, isAuthenticated: false, isLoading: false };
  } catch {
    return { user: null, isAuthenticated: false, isLoading: false };
  }
}

/**
 * Initiate Google OAuth login.
 */
export function loginWithGoogle(): void {
  window.location.href = `${API_BASE_URL}/auth/google`;
}

/**
 * Log out the current user.
 */
export async function logout(): Promise<void> {
  try {
    await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
  } catch {
    // Continue even if API call fails
  }
  
  removeToken();
}

/**
 * Refresh the authentication token.
 */
export async function refreshToken(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    });
    
    if (response.ok) {
      return true;
    }
    
    return false;
  } catch {
    return false;
  }
}

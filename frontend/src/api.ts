const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api';

export type AuthResponse = { token: string; username: string; role: string };
export type Owner = { id: number; username: string };

async function request(path: string, options: RequestInit = {}) {
  const token = localStorage.getItem('fixflow_token');
  const headers = new Headers(options.headers);
  const isPublicRequest = path.startsWith('/auth/') || path === '/owners';
  headers.set('Content-Type', 'application/json');
  if (token && !isPublicRequest) headers.set('Authorization', `Bearer ${token}`);
  const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
  if (!response.ok) {
    const message = (await response.text()) || `Request failed (${response.status})`;
    if ((response.status === 401 || response.status === 403) && path !== '/owners') {
      localStorage.removeItem('fixflow_token');
      localStorage.removeItem('fixflow_session');
      window.dispatchEvent(new Event('fixflow-auth-expired'));
      throw new Error('Your session has expired. Please sign in again.');
    }
    throw new Error(message);
  }
  return response.json();
}

export async function fetchHealth() {
  const res = await fetch(`${API_BASE_URL}/health`);
  return res.json();
}

export async function fetchDashboardMetrics() {
  return request('/dashboard/metrics');
}

export async function fetchRequests() {
  return request('/requests');
}

export async function fetchOwners(): Promise<Owner[]> {
  return request('/owners');
}

export async function authenticate(path: '/auth/login' | '/auth/register', body: object): Promise<AuthResponse> {
  return request(path, { method: 'POST', body: JSON.stringify(body) });
}

export async function createRequest(body: object) {
  return request('/requests', { method: 'POST', body: JSON.stringify(body) });
}

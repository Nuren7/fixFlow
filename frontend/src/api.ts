const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api';

export async function fetchHealth() {
  const res = await fetch(`${API_BASE_URL}/health`);
  return res.json();
}

export async function fetchDashboardMetrics() {
  const res = await fetch(`${API_BASE_URL}/dashboard/metrics`);
  return res.json();
}

export async function fetchRequests() {
  const res = await fetch(`${API_BASE_URL}/requests`);
  return res.json();
}

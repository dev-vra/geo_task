const BASE = '/api';

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${url}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `HTTP ${res.status}`);
  }
  return res.json();
}

// ── Tasks ─────────────────────────────────────────────────────

export const tasksApi = {
  list: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return request<any[]>(`/tasks${qs}`);
  },
  get: (id: number) => request<any>(`/tasks/${id}`),
  create: (data: any) => request<any>('/tasks', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => request<any>(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => request<void>(`/tasks/${id}`, { method: 'DELETE' }),
  toggleSubtask: (taskId: number, subtaskId: number) =>
    request<any>(`/tasks/${taskId}/subtasks/${subtaskId}/toggle`, { method: 'PUT' }),
  addSubtask: (taskId: number, data: any) =>
    request<any>(`/tasks/${taskId}/subtasks`, { method: 'POST', body: JSON.stringify(data) }),
  removeSubtask: (taskId: number, subtaskId: number) =>
    request<void>(`/tasks/${taskId}/subtasks/${subtaskId}`, { method: 'DELETE' }),
};

// ── Users ─────────────────────────────────────────────────────

export const usersApi = {
  list: (sectorId?: number) => {
    const qs = sectorId ? `?sectorId=${sectorId}` : '';
    return request<any[]>(`/users${qs}`);
  },
  get: (id: number) => request<any>(`/users/${id}`),
  create: (data: any) => request<any>('/users', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => request<any>(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => request<void>(`/users/${id}`, { method: 'DELETE' }),
};

// ── Sectors ───────────────────────────────────────────────────

export const sectorsApi = {
  list: () => request<any[]>('/sectors'),
  get: (id: number) => request<any>(`/sectors/${id}`),
  create: (data: any) => request<any>('/sectors', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => request<any>(`/sectors/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => request<void>(`/sectors/${id}`, { method: 'DELETE' }),
};

// ── Contracts ─────────────────────────────────────────────────

export const contractsApi = {
  list: () => request<any[]>('/contracts'),
  get: (id: number) => request<any>(`/contracts/${id}`),
  create: (data: any) => request<any>('/contracts', { method: 'POST', body: JSON.stringify(data) }),
};

// ── Cities ────────────────────────────────────────────────────

export const citiesApi = {
  list: () => request<any[]>('/cities'),
  get: (id: number) => request<any>(`/cities/${id}`),
  neighborhoods: (cityId: number) => request<any[]>(`/cities/${cityId}/neighborhoods`),
};

// ── Templates ─────────────────────────────────────────────────

export const templatesApi = {
  list: () => request<any[]>('/templates'),
  get: (id: number) => request<any>(`/templates/${id}`),
  create: (data: any) => request<any>('/templates', { method: 'POST', body: JSON.stringify(data) }),
  delete: (id: number) => request<void>(`/templates/${id}`, { method: 'DELETE' }),
};

// ── Dashboard ─────────────────────────────────────────────────

export const dashboardApi = {
  stats: () => request<any>('/dashboard/stats'),
};

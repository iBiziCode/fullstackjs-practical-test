export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

async function request(url: string, options: RequestInit = {}) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || res.statusText);
  }
  return res.headers.get('content-type')?.includes('application/json')
    ? res.json()
    : res.text();
}

export const listUsers = () => request(`${API_URL}/users`);

export const getUser = (id: string) => request(`${API_URL}/users/${id}`);

export const createUser = (data: { email: string; role: string; status: string }) =>
  request(`${API_URL}/users`, { method: 'POST', body: JSON.stringify(data) });

export const deleteUser = (id: string) =>
  request(`${API_URL}/users/${id}`, { method: 'DELETE' });

export const exportProto = () =>
  request(`${API_URL}/users/export`, { headers: { Accept: 'application/x-protobuf' } });

export const fetchPublicKey = () => request(`${API_URL}/users/public-key`);
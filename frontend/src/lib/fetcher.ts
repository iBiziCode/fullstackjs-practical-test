export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

async function request(url: string, options: RequestInit = {}) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!res.ok) {
    const errorText = await res.text();

    let parsedError;
    try {
      parsedError = JSON.parse(errorText);
    } catch (e) {
      parsedError = { message: errorText || res.statusText }; 
    }

    throw new Error(parsedError.message || res.statusText);
  }

  const contentType = res.headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    return res.json();
  }

  if (contentType.includes('application/octet-stream')) {
    const buffer = await res.arrayBuffer();
    return buffer;
  }

  return res.text();
}


export const listUsers = () => request(`${API_URL}/users`);

export const getUser = (id: string) => request(`${API_URL}/users/${id}`);

export const createUser = (data: { email: string; role: string; status: string }) =>
  request(`${API_URL}/users`, { method: 'POST', body: JSON.stringify(data) });

export const deleteUser = (id: string) =>
  request(`${API_URL}/users/${id}`, { method: 'DELETE' });

export const fetchPublicKey = () => request(`${API_URL}/users/public-key`);

export const fetchUsersProto = () =>
  request(`${API_URL}/users/export`,{
    headers: { Accept: 'application/octet-stream' },
  });

export const fetchUserStats = async () => {
  const res = await fetch(`${API_URL}/users/stats`);
  if (!res.ok) throw new Error('Failed to fetch user stats');
  return res.json();
};

export const updateUser = (id: string, data: any) =>
  request(`${API_URL}/users/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
const baseUrl = import.meta.env.VITE_BACKEND_ENDPOINT || '';

export async function get(path: string): Promise<Response> {
  return fetch(`${baseUrl}/${path}`);
}

export async function post<T>(path: string, body: T): Promise<Response> {
  return fetch(`${baseUrl}/${path}`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export type Response = {
  status: string;
  message: string;
  data?: any;
  error?: string;
};

export async function apiClient(path: string, options: RequestInit = {}) {
  const headers = new Headers(options.headers);

  // Don't override Content-Type for FormData
  if (!(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    credentials: 'include',
  });

  const data: Response = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Something went wrong');
  }

  return data;
}

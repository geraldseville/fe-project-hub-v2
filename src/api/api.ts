const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api`;

export type ApiResponse<T = unknown> = {
  status: string;
  message: string;
  data?: T;
  error?: string;
};

export async function apiClient<T>(
  path: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  const headers = new Headers(options.headers);

  if (!(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    credentials: 'include',
  });

  const data: ApiResponse<T> = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
}

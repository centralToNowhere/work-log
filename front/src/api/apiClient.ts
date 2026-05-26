const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

type RequestOptions = RequestInit & {
  signal?: AbortSignal;
};

export const apiClient = {
  async get<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(await getErrorMessage(response));
    }

    return response.json();
  },

  async post<T>(path: string, body: unknown, options: RequestOptions = {}): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(await getErrorMessage(response));
    }

    return response.json();
  },

  async delete(path: string, options: RequestOptions = {}): Promise<void> {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(await getErrorMessage(response));
    }
  },
};

const getErrorMessage = async (response: Response) => {
  try {
    const data = await response.json();

    return data.message || response.statusText;
  } catch {
    return response.statusText;
  }
};

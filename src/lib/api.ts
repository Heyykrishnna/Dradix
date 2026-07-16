const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api/v1';

let accessTokenInMemory: string | null = null;

// Get token from memory or fallback to localStorage (for persistence across tab reloads)
export const getAccessToken = (): string | null => {
  if (accessTokenInMemory) return accessTokenInMemory;
  if (typeof window !== 'undefined') {
    return localStorage.getItem('dradix_token');
  }
  return null;
};

export const setAccessToken = (token: string | null) => {
  accessTokenInMemory = token;
  if (typeof window !== 'undefined') {
    if (token) {
      localStorage.setItem('dradix_token', token);
    } else {
      localStorage.removeItem('dradix_token');
    }
  }
};

interface FetchOptions extends RequestInit {
  skipAuth?: boolean;
}

export async function apiFetch<T = unknown>(path: string, options: FetchOptions = {}): Promise<T> {
  const { skipAuth = false, headers = {}, ...rest } = options;
  const url = `${API_URL}${path}`;

  const requestHeaders = new Headers(headers);
  if (!requestHeaders.has('Content-Type') && !(rest.body instanceof FormData)) {
    requestHeaders.set('Content-Type', 'application/json');
  }

  // Attach access token
  const token = getAccessToken();
  if (token && !skipAuth) {
    requestHeaders.set('Authorization', `Bearer ${token}`);
  }

  const fetchOptions: RequestInit = {
    ...rest,
    headers: requestHeaders,
    credentials: 'include', // Crucial for HttpOnly cookies
  };

  let response = await fetch(url, fetchOptions);

  // If 401 Unauthorized, try to refresh the token once
  if (response.status === 401 && !skipAuth && path !== '/auth/refresh') {
    try {
      const refreshResponse = await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (refreshResponse.ok) {
        const refreshData = await refreshResponse.json();
        const newAccessToken = refreshData.data?.accessToken;
        
        if (newAccessToken) {
          setAccessToken(newAccessToken);
          // Retry the request with the new access token
          requestHeaders.set('Authorization', `Bearer ${newAccessToken}`);
          response = await fetch(url, fetchOptions);
        }
      } else {
        // Refresh token expired or invalid, log out
        setAccessToken(null);
      }
    } catch (err) {
      console.error('Failed to auto-refresh token:', err);
      setAccessToken(null);
    }
  }

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
}

export const cleanUrl = (url: string): string => {
  let cleaned = url.trim();
  cleaned = cleaned.replace(/^(https?:?\/\/+)+/i, '');
  cleaned = cleaned.replace(/^(https?\/+)+/i, '');
  
  const isLocal = cleaned.includes('localhost') || cleaned.includes('127.0.0.1');
  const protocol = isLocal ? 'http://' : 'https://';
  
  return protocol + cleaned;
};

export const API_URL = cleanUrl(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api/v1');

let accessTokenInMemory: string | null = null;
let refreshTokenInMemory: string | null = null;

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

export const getRefreshToken = (): string | null => {
  if (refreshTokenInMemory) return refreshTokenInMemory;
  if (typeof window !== 'undefined') {
    return localStorage.getItem('dradix_refresh_token');
  }
  return null;
};

export const setRefreshToken = (token: string | null) => {
  refreshTokenInMemory = token;
  if (typeof window !== 'undefined') {
    if (token) {
      localStorage.setItem('dradix_refresh_token', token);
    } else {
      localStorage.removeItem('dradix_refresh_token');
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

  let deviceId: string | null = null;
  if (typeof window !== 'undefined') {
    deviceId = localStorage.getItem('dradix_device_id');
    if (!deviceId) {
      deviceId = crypto.randomUUID();
      localStorage.setItem('dradix_device_id', deviceId);
    }
  }
  if (deviceId) {
    requestHeaders.set('X-Device-Id', deviceId);
  }

  const token = getAccessToken();
  if (token && !skipAuth) {
    requestHeaders.set('Authorization', `Bearer ${token}`);
  }

  const fetchOptions: RequestInit = {
    ...rest,
    headers: requestHeaders,
    credentials: 'include',
  };

  let response = await fetch(url, fetchOptions);

  if (response.status === 401 && !skipAuth && path !== '/auth/refresh') {
    try {
      const storedRefreshToken = getRefreshToken();
      const refreshResponse = await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: storedRefreshToken }),
        credentials: 'include',
      });

      if (refreshResponse.ok) {
        const refreshData = await refreshResponse.json();
        const newAccessToken = refreshData.data?.accessToken;
        const newRefreshToken = refreshData.data?.refreshToken;
        
        if (newAccessToken) {
          setAccessToken(newAccessToken);
          if (newRefreshToken) {
            setRefreshToken(newRefreshToken);
          }
          requestHeaders.set('Authorization', `Bearer ${newAccessToken}`);
          response = await fetch(url, fetchOptions);
        }
      } else {
        setAccessToken(null);
        setRefreshToken(null);
      }
    } catch {
      setAccessToken(null);
      setRefreshToken(null);
    }
  }

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
}

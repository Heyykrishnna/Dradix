export const cleanUrl = (url: string): string => {
  if (!url) return 'http://localhost:5001/api/v1';
  let cleaned = url.trim();
  cleaned = cleaned.replace(/^(https?:?\/\/+)+/i, '');
  cleaned = cleaned.replace(/^(https?\/+)+/i, '');

  cleaned = cleaned.replace(/\/+$/, '');

  if (!cleaned.endsWith('/api/v1')) {
    if (cleaned.endsWith('/api')) {
      cleaned = `${cleaned}/v1`;
    } else {
      cleaned = `${cleaned}/api/v1`;
    }
  }

  const isLocal = cleaned.includes('localhost') || cleaned.includes('127.0.0.1');
  const protocol = isLocal ? 'http://' : 'https://';
  return protocol + cleaned;
};

export const API_URL = cleanUrl(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api/v1');

let accessTokenInMemory: string | null = null;
let refreshTokenInMemory: string | null = null;

export const getAccessToken = (): string | null => {
  if (accessTokenInMemory) return accessTokenInMemory;
  if (typeof window !== 'undefined') return localStorage.getItem('dradix_token');
  return null;
};

export const setAccessToken = (token: string | null) => {
  accessTokenInMemory = token;
  if (typeof window !== 'undefined') {
    if (token) localStorage.setItem('dradix_token', token);
    else localStorage.removeItem('dradix_token');
  }
};

export const getRefreshToken = (): string | null => {
  if (refreshTokenInMemory) return refreshTokenInMemory;
  if (typeof window !== 'undefined') return localStorage.getItem('dradix_refresh_token');
  return null;
};

export const setRefreshToken = (token: string | null) => {
  refreshTokenInMemory = token;
  if (typeof window !== 'undefined') {
    if (token) localStorage.setItem('dradix_refresh_token', token);
    else localStorage.removeItem('dradix_refresh_token');
  }
};

let refreshPromise: Promise<string | null> | null = null;

const performTokenRefresh = async (): Promise<string | null> => {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
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
        const newAccessToken = refreshData.data?.accessToken as string | undefined;
        const newRefreshToken = refreshData.data?.refreshToken as string | undefined;
        if (newAccessToken) {
          setAccessToken(newAccessToken);
          if (newRefreshToken) setRefreshToken(newRefreshToken);
          return newAccessToken;
        }
      }

      setAccessToken(null);
      setRefreshToken(null);
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};

interface FetchOptions extends RequestInit {
  skipAuth?: boolean;
}

export async function apiFetch<T = unknown>(path: string, options: FetchOptions = {}): Promise<T> {
  const { skipAuth = false, headers = {}, ...rest } = options;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const url = `${API_URL}${normalizedPath}`;

  const buildHeaders = (overrideToken?: string): Headers => {
    const h = new Headers(headers);
    if (!h.has('Content-Type') && !(rest.body instanceof FormData)) {
      h.set('Content-Type', 'application/json');
    }
    if (typeof window !== 'undefined') {
      let deviceId = localStorage.getItem('dradix_device_id');
      if (!deviceId) {
        deviceId = crypto.randomUUID();
        localStorage.setItem('dradix_device_id', deviceId);
      }
      h.set('X-Device-Id', deviceId);
    }
    const token = overrideToken ?? getAccessToken();
    if (token && !skipAuth) h.set('Authorization', `Bearer ${token}`);
    return h;
  };

  let response = await fetch(url, { ...rest, headers: buildHeaders(), credentials: 'include' });

  if (response.status === 401 && !skipAuth && path !== '/auth/refresh') {
    const newToken = await performTokenRefresh();
    const tokenToUse = newToken ?? getAccessToken();
    if (tokenToUse) {
      response = await fetch(url, { ...rest, headers: buildHeaders(tokenToUse), credentials: 'include' });
    }
  }

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data as T;
}

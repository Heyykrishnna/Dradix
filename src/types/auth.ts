export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export interface SafeUser {
  id: number;
  username: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  cover_url: string | null;
  bio: string | null;
  developer_score: number;
  skills: string[];
  socials: Record<string, string>;
  two_factor_enabled: boolean;
  role?: Role;
  is_verified?: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    user?: SafeUser;
    accessToken?: string;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}


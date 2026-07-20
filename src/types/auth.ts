export interface SafeUser {
  id: number;
  username: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  developer_score: number;
  skills: string[];
  socials: Record<string, string>;
  two_factor_enabled: boolean;
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

export interface SecurityEvent {
  id: number;
  event_type: string;
  description: string;
  ip_address: string | null;
  device_name: string | null;
  browser: string | null;
  os: string | null;
  location: string | null;
  device_type: string | null;
  event_status: string;
  created_at: string;
}

export interface AuditLogEntry extends SecurityEvent {
  user_agent: string | null;
}

export interface SecurityOverview {
  score: number;
  features: {
    emailVerified: boolean;
    twoFactorEnabled: boolean;
    hasPassword: boolean;
    hasGoogleLinked: boolean;
    hasTrustedDevices: boolean;
    activeSessionCount: number;
    trustedDeviceCount: number;
  };
  accountInfo: {
    createdAt: string;
    lastLoginAt: string | null;
    lastPasswordChangedAt: string | null;
    activeSessionCount: number;
    trustedDeviceCount: number;
    currentSessionExpiresAt: string | null;
  };
}

export interface NotificationPrefs {
  new_device_login: boolean;
  password_changes: boolean;
  email_changes: boolean;
  failed_login_attempts: boolean;
  security_setting_changes: boolean;
  account_recovery: boolean;
}



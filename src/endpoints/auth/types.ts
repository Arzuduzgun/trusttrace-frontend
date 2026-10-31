export type UserRole = 'CUSTOMER' | 'AGENT' | 'ADMIN';
export type UserStatus = 'ACTIVE' | 'SUSPENDED' | 'BANNED';

export interface SessionUser {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  status: UserStatus;
  suspendedUntil: string | null;
}

export interface AuthResult {
  accessToken: string;
  accessTokenExpiresIn: number;
  refreshToken: string;
  user: SessionUser;
}
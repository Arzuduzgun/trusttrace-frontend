export type { AuthResult, SessionUser, UserRole, UserStatus, WsTicket, AdminUser } from './api-schemas';

export interface LoginState {
  error: string | null;
  fieldErrors: { email?: string[]; password?: string[] };
  values: { email: string };
}

export interface RegisterState {
  error: string | null;
  fieldErrors: {
    displayName?: string[];
    email?: string[];
    password?: string[];
    passwordConfirm?: string[];
  };
  values: { displayName: string; email: string };
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}
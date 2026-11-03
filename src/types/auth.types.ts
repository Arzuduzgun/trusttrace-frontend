export type { AuthResult, SessionUser, UserRole, UserStatus, WsTicket } from './api-schemas';

export interface LoginState {
  error: string | null;
  fieldErrors: { email?: string[]; password?: string[] };
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}
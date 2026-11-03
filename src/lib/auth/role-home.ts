import type { UserRole } from '@/types/auth.types';

export const ROLE_HOME: Record<UserRole, string> = {
  CUSTOMER: '/chat',
  AGENT: '/agent',
  ADMIN: '/admin',
};
//Rol adlarının Türkçesi
import type { UserRole } from '@/endpoints/auth/types';

export const ROLE_LABELS: Record<UserRole, string> = {
  CUSTOMER: 'Müşteri',
  AGENT: 'Temsilci',
  ADMIN: 'Yönetici',
};
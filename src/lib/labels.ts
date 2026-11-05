import type { UserRole } from '@/types/auth.types';
import type { RevokeReasonCode, SanctionAction, SanctionReasonCode } from '@/types/moderation.types';
import { MemberRole } from '@/types/room.types';

export const ROLE_LABELS: Record<UserRole, string> = {
  CUSTOMER: 'Müşteri',
  AGENT: 'Temsilci',
  ADMIN: 'Yönetici',
};

export const SANCTION_REASON_LABELS: Record<SanctionReasonCode, string> = {
  INSULT: 'Hakaret',
  SPAM: 'Spam / sürekli mesaj',
  THREAT: 'Tehdit',
  FRAUD: 'Dolandırıcılık girişimi',
  INAPPROPRIATE_CONTENT: 'Uygunsuz içerik',
  OTHER: 'Diğer',
};

export const REVOKE_REASON_LABELS: Record<RevokeReasonCode, string> = {
  WRONG_DECISION: 'Hatalı değerlendirme',
  APPEAL_ACCEPTED: 'İtiraz kabul edildi',
  EARLY_RELEASE: 'Erken sonlandırma',
  OTHER: 'Diğer',
};

export const SANCTION_ACTION_LABELS: Record<SanctionAction, string> = {
  SUSPEND: 'Askıya al',
  BAN: 'Banla',
  REVOKE: 'Cezayı kaldır',
};

export const MEMBER_ROLE_LABELS: Record<MemberRole, string> = {
  CUSTOMER: 'Müşteri',
  AGENT: 'Temsilci',
};
import { z } from 'zod';
import { REVOKE_REASON_LABELS, SANCTION_REASON_LABELS } from '@/lib/labels';
import type { RevokeReasonCode, SanctionReasonCode } from '@/types/moderation.types';

export const noteSchema = z.preprocess(
  (value) => (typeof value === 'string' && value.trim() === '' ? undefined : value),
  z.string().trim().max(500, 'Açıklama en fazla 500 karakter olabilir.').optional(),
);

const durationSchema = z.preprocess(
  (value) => (value === '' || value === null ? undefined : value),
  z.coerce.number().int().min(1).max(720).optional(),
);

export const sanctionReasonSchema = z.custom<SanctionReasonCode>(
  (value) => typeof value === 'string' && Object.hasOwn(SANCTION_REASON_LABELS, value),
  'Bir gerekçe seçin.',
);

const revokeReasonSchema = z.custom<RevokeReasonCode>(
  (value) => typeof value === 'string' && Object.hasOwn(REVOKE_REASON_LABELS, value),
  'Bir gerekçe seçin.',
);

export const sanctionFormSchema = z
  .discriminatedUnion('action', [
    z.object({
      action: z.literal('SUSPEND'),
      reasonCode: sanctionReasonSchema,
      note: noteSchema,
      durationHours: durationSchema,
    }),
    z.object({ action: z.literal('BAN'), reasonCode: sanctionReasonSchema, note: noteSchema }),
    z.object({ action: z.literal('REVOKE'), reasonCode: revokeReasonSchema, note: noteSchema }),
  ])
  .refine((data) => data.reasonCode !== 'OTHER' || (data.note?.length ?? 0) >= 3, {
    message: '"Diğer" seçildiğinde en az 3 karakterlik bir açıklama yazın.',
    path: ['note'],
  });

export const createAgentSchema = z.object({
  displayName: z.string().trim().min(2, 'Ad en az 2 karakter olmalı.').max(80),
  email: z.email('Geçerli bir e-posta girin.').max(254),
});
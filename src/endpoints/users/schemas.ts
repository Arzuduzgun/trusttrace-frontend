import { z } from 'zod';
import { passwordSchema } from '../auth/schemas';

const reasonSchema = z.string().trim().min(3, 'Gerekçe en az 3 karakter olmalı.').max(500);

export const suspendSchema = z.object({
  reason: reasonSchema,
  durationHours: z.preprocess(
    (value) => (value === '' || value === null ? undefined : value),
    z.coerce.number().int().min(1).max(720).optional(),
  ),
});

export const reasonOnlySchema = z.object({ reason: reasonSchema });

export const createAgentSchema = z.object({
  displayName: z.string().trim().min(2, 'Ad en az 2 karakter olmalı.').max(80),
  email: z.email('Geçerli bir e-posta girin.').max(254),
  password: passwordSchema,
});
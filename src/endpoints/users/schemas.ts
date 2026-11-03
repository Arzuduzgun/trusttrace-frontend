import { z } from 'zod';

const reasonSchema = z.string().trim().min(3, 'Gerekçe en az 3 karakter olmalı.').max(500);

export const suspendSchema = z.object({
  reason: reasonSchema,
  durationHours: z.preprocess(
    (value) => (value === '' || value === null ? undefined : value),
    z.coerce.number().int().min(1).max(720).optional(),
  ),
});

export const reasonOnlySchema = z.object({ reason: reasonSchema });
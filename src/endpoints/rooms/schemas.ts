import { z } from 'zod';
import { noteSchema, sanctionReasonSchema } from '../users/schemas';

export const escalateSchema = z
  .object({
    customerId: z.uuid('Bir müşteri seçin.'),
    reasonCode: sanctionReasonSchema,
    note: noteSchema,
  })
  .refine((data) => data.reasonCode !== 'OTHER' || (data.note?.length ?? 0) >= 3, {
    message: '"Diğer" seçildiğinde en az 3 karakterlik bir açıklama yazın.',
    path: ['note'],
  });
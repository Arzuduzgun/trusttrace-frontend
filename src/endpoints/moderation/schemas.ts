import { z } from 'zod';

export const createRuleSchema = z.object({
  pattern: z.string().trim().min(1, 'Kelime ya da cümle girin.').max(200),
  action: z.enum(['BLOCK', 'FLAG']),
});
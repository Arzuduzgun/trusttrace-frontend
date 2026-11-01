//Yeni kural formunun kuralları: kelime 1 ile 200 karakter arası olmalı, eylem de sadece BLOCK ya da FLAG olabilir.
import { z } from 'zod';

export const createRuleSchema = z.object({
  pattern: z.string().trim().min(1, 'Kelime ya da cümle girin.').max(200),
  action: z.enum(['BLOCK', 'FLAG']),
});
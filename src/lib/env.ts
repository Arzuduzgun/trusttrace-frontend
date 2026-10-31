import 'server-only';
import { z } from 'zod';

const envSchema = z.object({
  API_BASE_URL: z.url(),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
});

export const env = envSchema.parse(process.env);
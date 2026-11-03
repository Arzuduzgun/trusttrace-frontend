import { z } from 'zod';

export const passwordSchema = z
  .string()
  .min(8, 'Şifre en az 8 karakter olmalı.')
  .max(72, 'Şifre en fazla 72 karakter olabilir.')
  .regex(/^(?=.*[A-Za-z])(?=.*\d).+$/, 'Şifre en az bir harf ve bir rakam içermeli.');

export const loginSchema = z.object({
  email: z.email('Geçerli bir e-posta girin.'),
  password: z.string().min(1, 'Şifre gerekli.').max(72),
});

export const registerSchema = z
  .object({
    displayName: z.string().trim().min(2, 'Ad en az 2 karakter olmalı.').max(80, 'Ad en fazla 80 karakter olabilir.'),
    email: z.email('Geçerli bir e-posta girin.').max(254),
    password: passwordSchema,
    passwordConfirm: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: 'Şifreler eşleşmiyor.',
    path: ['passwordConfirm'],
  });
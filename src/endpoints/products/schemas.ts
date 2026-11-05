import { z } from 'zod';

const IMAGE_URL_PATTERN = /^(\/products\/[\w.-]+\.(jpg|jpeg|png|webp)|https:\/\/\S+)$/i;

export const createProductSchema = z.object({
  name: z.string().trim().min(2, 'Ürün adı en az 2 karakter olmalı.').max(100),
  description: z.string().trim().max(1000, 'Açıklama en fazla 1000 karakter olabilir.'),
  imageUrl: z
    .string()
    .trim()
    .regex(IMAGE_URL_PATTERN, 'Fotoğraf adresi /products/dosya.jpg ya da https:// ile başlamalı.'),
  price: z.coerce.number().min(0, 'Fiyat negatif olamaz.').max(1_000_000, 'Fiyat çok yüksek.'),
});
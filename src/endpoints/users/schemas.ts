/*Ceza formlarının kuralları.
Gerekçe: 3 ile 500 karakter arası. Baştaki ve sondaki boşluklar silinir (trim).
Askı süresi: Boş bırakılabilir (süresiz). Doluysa 1 ile 720 saat arası. 
z.preprocess ne yapıyor: Formda “Süresiz” seçilince değer boş bir metin olarak geliyor. Bu satır, boş metni “değer yok” olarak çeviriyor; böylece “0 saat” sanılıp hata verilmiyor.*/
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
# TrustTrace — Frontend

TrustTrace müşteri hizmetleri platformunun web arayüzü. Müşteri, temsilci ve yönetici için ayrı paneller içerir.

| | |
|---|---|
| Canlı uygulama | https://56-228-77-224.sslip.io |
| Backend reposu (mimari, challenge'lar, deploy) | https://github.com/Arzuduzgun/trusttrace-backend |

## Teknolojiler

Next.js 16 (App Router, Server Actions) · React 19 · TypeScript · Tailwind CSS 4 · shadcn/ui (Base UI) · Socket.io client · zod · openapi-typescript

## Özellikler

- **Müşteri:** Kayıt ve giriş, temsilciyle birebir sohbet başlatma, ürün odalarına katılma, canlı mesajlaşma.
- **Temsilci:** Atanan sohbetler, ürün odaları, okundu bilgisi, üye bilgileri, müşteriyi gerekçeyle yöneticiye bildirme, bildirim zili.
- **Yönetici:** Kullanıcılar ve yaptırımlar (gerekçeli askı, ban ve geri alma), ihlal defteri (filtreler, hash zinciri doğrulama, trace ID), yasaklı kelimeler, tüm konuşmalar (salt okunur, oda durumu, temsilci değiştirme), ürünler, sistem sağlığı.

## Mimari notları

- **Backend'e sadece sunucu tarafından erişilir.** Sayfalar ve Server Action'lar `lib/api/server-fetch.ts` üzerinden istek atar; tarayıcı backend adresini veya token'ları hiç görmez.
- **Token'lar httpOnly cookie'lerde** (`tt_access`, `tt_refresh`) tutulur; production'da `secure` bayrağı açıktır.
- **`src/proxy.ts`** her istekte access token'ın süresini kontrol eder, bitmek üzereyse sayfa render edilmeden önce yeniler. Yenileme başarısız olursa kullanıcı, açık yönlendirme korumalı bir `next` parametresiyle giriş sayfasına gönderilir.
- **WebSocket:** `providers/socket-provider.tsx` sekme başına tek bir bağlantı açar. Bağlantı, Server Action ile alınan kısa ömürlü bir *ws-ticket* ile kurulur.
- **Tipler backend'den üretilir:** `pnpm gen:api` komutu Swagger şemasından `src/types/api.ts` dosyasını oluşturur. Backend'de bir enum değiştiğinde frontend derlemesi hata vererek uyumsuzluğu yakalar.
- **Formlar:** zod şemalarıyla yazarken anlık doğrulama yapılır (`hooks/use-live-validation.ts`), sunucu tarafında tekrar doğrulanır.

## Kurulum (yerel)

Gerekenler: Node.js 22, pnpm 9 ve çalışan bir [backend](https://github.com/Arzuduzgun/trusttrace-backend).

```bash
git clone https://github.com/Arzuduzgun/trusttrace-frontend.git
cd trusttrace-frontend
pnpm install
```

Proje kökünde `.env.local` dosyası oluştur:

```
API_BASE_URL=http://localhost:4000/api/v1
NEXT_PUBLIC_WS_URL=http://localhost:4000/chat
```

```bash
pnpm dev
```

Uygulama http://localhost:3000 adresinde açılır. Demo hesaplar backend README'sinde.

## Ortam değişkenleri

| Değişken | Nerede kullanılır | Açıklama |
|---|---|---|
| `API_BASE_URL` | Sadece sunucu | Backend API adresi (`/api/v1` dahil) |
| `NEXT_PUBLIC_WS_URL` | Tarayıcı | WebSocket adresi (`/chat` namespace'i dahil). Build sırasında koda gömülür. |

## Komutlar

| Komut | Ne yapar |
|---|---|
| `pnpm dev` | Geliştirme sunucusu |
| `pnpm build` | Production derlemesi |
| `pnpm start` | Derlenmiş uygulamayı çalıştırır |
| `pnpm lint` | ESLint |
| `pnpm gen:api` | Backend Swagger şemasından tipleri üretir (backend açıkken) |

## Proje yapısı

```
src/
  app/          sayfalar: (auth), (customer)/chat, agent, admin
  endpoints/    backend çağrıları: queries (okuma), actions (Server Action), schemas (zod)
  features/     ekran bileşenleri: auth, chat, moderation, notifications, products, users
  components/   ortak arayüz bileşenleri (ui, shell, form alanları)
  hooks/        use-chat-room, use-room-members, use-live-validation
  providers/    SocketProvider
  lib/          api istemcisi, auth/cookie yardımcıları, ortam değişkenleri
  types/        üretilen API tipleri ve uygulama tipleri
  proxy.ts      token yenileme ve yönlendirme
```

## Deploy ve CI/CD

Uygulama Docker imajı olarak (`Dockerfile`) backend ile aynı EC2 sunucusunda çalışır; ayrıntılar backend README'sindedir.

GitHub Actions (`.github/workflows/ci-cd.yml`): her push'ta `pnpm lint` ve `pnpm build` çalışır; `main` dalında başarılı olursa sunucudaki deploy betiği SSH ile tetiklenir.

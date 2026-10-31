//Login sayfasına neden gelindiğini çevirir.
export const LOGIN_REASON_MESSAGES: Record<string, string> = {
  AUTH_ACCOUNT_BANNED: 'Hesabınız kalıcı olarak kapatıldı.',
  AUTH_TOKEN_REVOKED: 'Oturumunuz sonlandırıldı, lütfen tekrar giriş yapın.',
  AUTH_TOKEN_INVALID: 'Oturumunuz geçersiz, lütfen tekrar giriş yapın.',
  AUTH_TOKEN_MISSING: 'Devam etmek için giriş yapın.',
  SESSION_EXPIRED: 'Oturum süreniz doldu, lütfen tekrar giriş yapın.',
};
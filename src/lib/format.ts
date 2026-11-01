//Tarihi Türkçe ve İstanbul saatine göre biçimlendirir
export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('tr-TR', {
    timeZone: 'Europe/Istanbul',
    dateStyle: 'short',
    timeStyle: 'short',
  });
}
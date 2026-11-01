//Admin formlarının ortak sonuç şekli: bir hata mesajı (varsa) ve “işlem tamamlandı mı?” bilgisi. Bütün admin formları aynı şekli kullanır.
export interface ActionResult {
  error: string | null;
  done: boolean;
}

export const INITIAL_ACTION_RESULT: ActionResult = { error: null, done: false };
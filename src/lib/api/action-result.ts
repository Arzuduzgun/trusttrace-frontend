export interface ActionResult {
  error: string | null;
  done: boolean;
}

export const INITIAL_ACTION_RESULT: ActionResult = { error: null, done: false };
import type { ActionResult, InviteActionResult } from '@/types/action-result.types';

export const INITIAL_ACTION_RESULT: ActionResult = { error: null, done: false };

export const INITIAL_INVITE_RESULT: InviteActionResult = { error: null, done: false, invite: null };

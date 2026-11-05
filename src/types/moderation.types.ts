//Defter kaydının frontend’deki şekli. Backend’deki ModerationEventResponseDto ile aynı.
export type { ModerationEvent, ModerationEventType, ModerationRule, RuleAction, RuleMatchType } from './api-schemas';

export type { RevokeReasonCode, SanctionReasonCode, ChainBreakReason, ChainVerification } from './api-schemas';

export type SanctionAction = 'SUSPEND' | 'BAN' | 'REVOKE';
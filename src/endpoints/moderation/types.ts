//Defter kaydının frontend’deki şekli. Backend’deki ModerationEventResponseDto ile aynı.
export type ModerationEventType = 'VIOLATION_DETECTED' | 'SANCTION_IMPOSED' | 'SANCTION_REVOKED';

export interface ModerationEvent {
  seq: number;
  id: string;
  eventType: ModerationEventType;
  actorType: 'SYSTEM' | 'ADMIN';
  actorId: string | null;
  subjectUserId: string;
  roomId: string | null;
  messageId: string | null;
  refersToEventId: string | null;
  payload: Record<string, unknown>;
  occurredAt: string;
}
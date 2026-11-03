import type { components } from './api';

type Schemas = components['schemas'];

export type UserRole = Schemas['UserRole'];
export type UserStatus = Schemas['UserStatus'];
export type SessionUser = Schemas['UserResponseDto'];
export type AuthResult = Schemas['AuthResponseDto'];
export type WsTicket = Schemas['WsTicketResponseDto'];

export type RoomType = Schemas['RoomType'];
export type RoomStatus = Schemas['RoomStatus'];
export type Room = Schemas['RoomResponseDto'];

export type MessageStatus = Schemas['MessageStatus'];
export type ChatMessage = Schemas['MessageResponseDto'];

export type RuleAction = Schemas['RuleAction'];
export type RuleMatchType = Schemas['RuleMatchType'];
export type ModerationRule = Schemas['RuleResponseDto'];

export type ModerationEventType = Schemas['ModerationEventType'];
export type ModerationEvent = Schemas['ModerationEventResponseDto'];

export type RegisterRequest = Schemas['RegisterDto'];
export type CreateAgentRequest = Schemas['CreateAgentDto'];
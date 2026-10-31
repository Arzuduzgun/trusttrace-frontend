//Odanın frontend’deki şekli. Backend’deki RoomResponseDto ile aynı.
export type RoomType = 'DIRECT' | 'PRODUCT';
export type RoomStatus = 'OPEN' | 'ESCALATED' | 'CLOSED';

export interface Room {
  id: string;
  type: RoomType;
  name: string;
  status: RoomStatus;
  createdAt: string;
}
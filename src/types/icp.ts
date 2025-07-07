
export interface User {
  id: string;
  principal: string;
  avatar?: Avatar;
  tickets: Ticket[];
  createdAt: bigint;
}

export interface Avatar {
  id: string;
  name: string;
  color: string;
  accessory: string;
  owner: string;
}

export interface Ticket {
  id: string;
  eventName: string;
  eventDate: bigint;
  ticketType: string;
  price: bigint;
  owner: string;
  isUsed: boolean;
}

export interface VRPosition {
  x: number;
  y: number;
  z: number;
}

export interface VRUser {
  principal: string;
  avatar?: Avatar;
  position: VRPosition;
  rotation: VRPosition;
}


export interface User {
  id: string;
  principal: string;
  avatar?: Avatar;
  tickets: Ticket[];
  vrWorlds: VRWorld[];
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
  owner: string;
  isUsed: boolean;
}

export interface VRWorld {
  id: string;
  name: string;
  description: string;
  creator: string;
  createdAt: bigint;
  isActive: boolean;
  participants: string[];
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


export interface Avatar {
  id: string;
  name: string;
  color: string;
  accessory: string;
}

export interface Ticket {
  id: string;
  eventName: string;
  eventDate: bigint;
  ticketType: string;
  isUsed: boolean;
  owner: string;
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

export interface User {
  principal: string;
  avatar?: Avatar;
  tickets: Ticket[];
  createdWorlds: string[];
}

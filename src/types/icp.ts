
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
  userCount: number;
  isActive: boolean;
}

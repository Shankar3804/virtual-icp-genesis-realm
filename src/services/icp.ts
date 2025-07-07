
import { AuthClient } from '@dfinity/auth-client';
import { Actor, HttpAgent } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';

// This will be replaced with actual canister IDs after deployment
const BACKEND_CANISTER_ID = process.env.REACT_APP_BACKEND_CANISTER_ID || 'rrkah-fqaaa-aaaaa-aaaaq-cai';
const II_URL = process.env.NODE_ENV === 'production' 
  ? 'https://identity.ic0.app'
  : `http://localhost:4943/?canisterId=rdmx6-jaaaa-aaaaa-aaadq-cai`;

export class ICPService {
  private authClient: AuthClient | null = null;
  private actor: any = null;
  private agent: HttpAgent | null = null;

  async init() {
    this.authClient = await AuthClient.create({
      idleOptions: {
        disableIdle: true,
        disableDefaultIdleCallback: true,
      },
    });

    if (await this.authClient.isAuthenticated()) {
      await this.setupActor();
    }
  }

  async login(): Promise<boolean> {
    if (!this.authClient) {
      await this.init();
    }

    return new Promise((resolve) => {
      this.authClient!.login({
        identityProvider: II_URL,
        onSuccess: async () => {
          await this.setupActor();
          resolve(true);
        },
        onError: (error: any) => {
          console.error('Login failed:', error);
          resolve(false);
        },
      });
    });
  }

  async logout() {
    if (this.authClient) {
      await this.authClient.logout();
      this.actor = null;
      this.agent = null;
    }
  }

  async isAuthenticated(): Promise<boolean> {
    if (!this.authClient) {
      await this.init();
    }
    return await this.authClient!.isAuthenticated();
  }

  async getPrincipal(): Promise<Principal | null> {
    if (!this.authClient) {
      await this.init();
    }
    
    if (await this.authClient!.isAuthenticated()) {
      return this.authClient!.getIdentity().getPrincipal();
    }
    return null;
  }

  private async setupActor() {
    const identity = this.authClient!.getIdentity();
    
    this.agent = new HttpAgent({
      identity,
      host: process.env.NODE_ENV === 'production' ? 'https://ic0.app' : 'http://localhost:4943',
    });

    if (process.env.NODE_ENV !== 'production') {
      await this.agent.fetchRootKey();
    }

    // This IDL will be replaced with actual generated declarations
    const idlFactory = ({ IDL }: any) => {
      const Avatar = IDL.Record({
        id: IDL.Text,
        name: IDL.Text,
        color: IDL.Text,
        accessory: IDL.Text,
        owner: IDL.Text,
      });

      const Ticket = IDL.Record({
        id: IDL.Text,
        eventName: IDL.Text,
        eventDate: IDL.Nat64,
        ticketType: IDL.Text,
        price: IDL.Nat64,
        owner: IDL.Text,
        isUsed: IDL.Bool,
      });

      return IDL.Service({
        createAvatar: IDL.Func([IDL.Text, IDL.Text, IDL.Text], [IDL.Opt(Avatar)], []),
        getAvatar: IDL.Func([], [IDL.Opt(Avatar)], ['query']),
        mintTicket: IDL.Func([IDL.Text, IDL.Nat64, IDL.Text, IDL.Nat64], [IDL.Opt(Ticket)], []),
        getTickets: IDL.Func([], [IDL.Vec(Ticket)], ['query']),
        whoami: IDL.Func([], [IDL.Principal], ['query']),
      });
    };

    this.actor = Actor.createActor(idlFactory, {
      agent: this.agent,
      canisterId: BACKEND_CANISTER_ID,
    });
  }

  // Avatar methods
  async createAvatar(name: string, color: string, accessory: string) {
    if (!this.actor) throw new Error('Not authenticated');
    return await this.actor.createAvatar(name, color, accessory);
  }

  async getAvatar() {
    if (!this.actor) throw new Error('Not authenticated');
    return await this.actor.getAvatar();
  }

  // Ticket methods
  async mintTicket(eventName: string, eventDate: bigint, ticketType: string, price: bigint) {
    if (!this.actor) throw new Error('Not authenticated');
    return await this.actor.mintTicket(eventName, eventDate, ticketType, price);
  }

  async getTickets() {
    if (!this.actor) throw new Error('Not authenticated');
    return await this.actor.getTickets();
  }

  async whoami() {
    if (!this.actor) throw new Error('Not authenticated');
    return await this.actor.whoami();
  }
}

export const icpService = new ICPService();

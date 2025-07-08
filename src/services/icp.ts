import { AuthClient } from '@dfinity/auth-client';
import { Actor, HttpAgent } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';

// This will be replaced with actual canister IDs after deployment
const BACKEND_CANISTER_ID = import.meta.env.VITE_BACKEND_CANISTER_ID || 'rrkah-fqaaa-aaaaa-aaaaq-cai';
const II_URL = import.meta.env.NODE_ENV === 'production' 
  ? 'https://identity.ic0.app'
  : `http://localhost:4943/?canisterId=rdmx6-jaaaa-aaaaa-aaadq-cai`;

export class ICPService {
  private authClient: AuthClient | null = null;
  private actor: any = null;
  private agent: HttpAgent | null = null;

  async init() {
    try {
      this.authClient = await AuthClient.create({
        idleOptions: {
          disableIdle: true,
          disableDefaultIdleCallback: true,
        },
      });

      if (await this.authClient.isAuthenticated()) {
        await this.setupActor();
      }
    } catch (error) {
      console.error('ICP Service initialization failed:', error);
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
          try {
            await this.setupActor();
            resolve(true);
          } catch (error) {
            console.error('Setup actor failed:', error);
            resolve(false);
          }
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
    try {
      const identity = this.authClient!.getIdentity();
      
      this.agent = new HttpAgent({
        identity,
        host: import.meta.env.NODE_ENV === 'production' ? 'https://ic0.app' : 'http://localhost:4943',
      });

      if (import.meta.env.NODE_ENV !== 'production') {
        await this.agent.fetchRootKey().catch(err => {
          console.warn('Failed to fetch root key:', err);
        });
      }

      // Mock IDL for development - this will be replaced with actual generated declarations
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
          owner: IDL.Text,
          isUsed: IDL.Bool,
        });

        const VRWorld = IDL.Record({
          id: IDL.Text,
          name: IDL.Text,
          description: IDL.Text,
          creator: IDL.Text,
          createdAt: IDL.Nat64,
          isActive: IDL.Bool,
          participants: IDL.Vec(IDL.Text),
        });

        return IDL.Service({
          createAvatar: IDL.Func([IDL.Text, IDL.Text, IDL.Text], [IDL.Opt(Avatar)], []),
          getAvatar: IDL.Func([], [IDL.Opt(Avatar)], ['query']),
          mintTicket: IDL.Func([IDL.Text, IDL.Nat64, IDL.Text], [IDL.Opt(Ticket)], []),
          getTickets: IDL.Func([], [IDL.Vec(Ticket)], ['query']),
          createVRWorld: IDL.Func([IDL.Text, IDL.Text], [IDL.Opt(VRWorld)], []),
          getAllVRWorlds: IDL.Func([], [IDL.Vec(VRWorld)], ['query']),
          joinVRWorld: IDL.Func([IDL.Text], [IDL.Bool], []),
          getUserVRWorlds: IDL.Func([], [IDL.Vec(VRWorld)], ['query']),
          whoami: IDL.Func([], [IDL.Principal], ['query']),
        });
      };

      this.actor = Actor.createActor(idlFactory, {
        agent: this.agent,
        canisterId: BACKEND_CANISTER_ID,
      });
    } catch (error) {
      console.error('Actor setup failed:', error);
    }
  }

  // Avatar methods
  async createAvatar(name: string, color: string, accessory: string) {
    if (!this.actor) throw new Error('Not authenticated');
    try {
      return await this.actor.createAvatar(name, color, accessory);
    } catch (error) {
      console.error('Create avatar failed:', error);
      // Return mock data for development
      return [{
        id: Math.random().toString(36).substr(2, 9),
        name,
        color,
        accessory,
        owner: 'mock-principal'
      }];
    }
  }

  async getAvatar() {
    if (!this.actor) throw new Error('Not authenticated');
    try {
      return await this.actor.getAvatar();
    } catch (error) {
      console.error('Get avatar failed:', error);
      return [];
    }
  }

  // Ticket methods
  async mintTicket(eventName: string, eventDate: bigint, ticketType: string) {
    if (!this.actor) throw new Error('Not authenticated');
    try {
      return await this.actor.mintTicket(eventName, eventDate, ticketType);
    } catch (error) {
      console.error('Mint ticket failed:', error);
      // Return mock data for development
      return [{
        id: Math.random().toString(36).substr(2, 9),
        eventName,
        eventDate,
        ticketType,
        owner: 'mock-principal',
        isUsed: false
      }];
    }
  }

  async getTickets() {
    if (!this.actor) throw new Error('Not authenticated');
    try {
      return await this.actor.getTickets();
    } catch (error) {
      console.error('Get tickets failed:', error);
      return [];
    }
  }

  // VR World methods
  async createVRWorld(name: string, description: string) {
    if (!this.actor) throw new Error('Not authenticated');
    try {
      const result = await this.actor.createVRWorld(name, description);
      console.log('Backend createVRWorld result:', result);
      return result;
    } catch (error) {
      console.error('Create VR world failed:', error);
      // Return mock data for development
      const mockWorld = {
        id: Math.random().toString(36).substr(2, 9),
        name,
        description,
        creator: 'mock-principal',
        createdAt: BigInt(Date.now()),
        isActive: true,
        participants: ['mock-principal']
      };
      console.log('Returning mock VR world:', mockWorld);
      return [mockWorld];
    }
  }

  async getAllVRWorlds() {
    if (!this.actor) throw new Error('Not authenticated');
    try {
      const result = await this.actor.getAllVRWorlds();
      console.log('getAllVRWorlds result:', result);
      return result;
    } catch (error) {
      console.error('Get all VR worlds failed:', error);
      // Return some mock data for development
      const mockWorlds = [
        {
          id: 'world-1',
          name: 'Demo World',
          description: 'A demo VR world for testing',
          creator: 'mock-principal',
          createdAt: BigInt(Date.now() - 1000000),
          isActive: true,
          participants: ['mock-principal']
        }
      ];
      console.log('Returning mock VR worlds:', mockWorlds);
      return mockWorlds;
    }
  }

  async joinVRWorld(worldId: string) {
    if (!this.actor) throw new Error('Not authenticated');
    try {
      const result = await this.actor.joinVRWorld(worldId);
      console.log('Join VR world backend result:', result);
      return result;
    } catch (error) {
      console.error('Join VR world failed:', error);
      // For development, simulate successful join
      console.log('Simulating successful join for development');
      return true;
    }
  }

  async getUserVRWorlds() {
    if (!this.actor) throw new Error('Not authenticated');
    try {
      return await this.actor.getUserVRWorlds();
    } catch (error) {
      console.error('Get user VR worlds failed:', error);
      return [];
    }
  }

  async whoami() {
    if (!this.actor) throw new Error('Not authenticated');
    try {
      return await this.actor.whoami();
    } catch (error) {
      console.error('Whoami failed:', error);
      return Principal.fromText('rdmx6-jaaaa-aaaaa-aaadq-cai');
    }
  }
}

export const icpService = new ICPService();

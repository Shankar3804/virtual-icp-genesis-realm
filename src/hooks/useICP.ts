
import { useState, useEffect } from 'react';
import { AuthClient } from '@dfinity/auth-client';
import { Principal } from '@dfinity/principal';
import { Avatar, Ticket } from '../types/icp';

export const useICP = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [principal, setPrincipal] = useState<Principal | null>(null);
  const [avatar, setAvatar] = useState<Avatar | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [authClient, setAuthClient] = useState<AuthClient | null>(null);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      console.log('Initializing auth client...');
      const client = await AuthClient.create({
        idleOptions: {
          disableIdle: true,
          disableDefaultIdleCallback: true
        }
      });
      
      setAuthClient(client);
      
      const isAuth = await client.isAuthenticated();
      console.log('Authentication status:', isAuth);
      
      if (isAuth) {
        const identity = client.getIdentity();
        const principalId = identity.getPrincipal();
        console.log('Authenticated with principal:', principalId.toString());
        
        setIsAuthenticated(true);
        setPrincipal(principalId);
        
        // Load user data
        await loadUserData(principalId);
      }
    } catch (error) {
      console.error('Auth initialization failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (): Promise<boolean> => {
    if (!authClient) {
      console.error('Auth client not initialized');
      return false;
    }

    try {
      console.log('Starting login process...');
      setLoading(true);

      return new Promise((resolve) => {
        authClient.login({
          identityProvider: 'https://identity.ic0.app',
          maxTimeToLive: BigInt(7 * 24 * 60 * 60 * 1000 * 1000 * 1000), // 7 days in nanoseconds
          windowOpenerFeatures: 'toolbar=0,location=0,menubar=0,width=500,height=500,left=' + 
            (screen.width / 2 - 250) + ',top=' + (screen.height / 2 - 250),
          onSuccess: async () => {
            console.log('Login successful');
            try {
              const identity = authClient.getIdentity();
              const principalId = identity.getPrincipal();
              
              console.log('Login success with principal:', principalId.toString());
              
              setIsAuthenticated(true);
              setPrincipal(principalId);
              
              await loadUserData(principalId);
              resolve(true);
            } catch (error) {
              console.error('Post-login processing failed:', error);
              resolve(false);
            } finally {
              setLoading(false);
            }
          },
          onError: (error) => {
            console.error('Login failed:', error);
            setLoading(false);
            resolve(false);
          }
        });
      });
    } catch (error) {
      console.error('Login process failed:', error);
      setLoading(false);
      return false;
    }
  };

  const logout = async () => {
    if (!authClient) return;
    
    try {
      await authClient.logout();
      setIsAuthenticated(false);
      setPrincipal(null);
      setAvatar(null);
      setTickets([]);
      console.log('Logout successful');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const loadUserData = async (userPrincipal: Principal) => {
    try {
      console.log('Loading user data for:', userPrincipal.toString());
      
      // Simulate loading avatar data
      const mockAvatar: Avatar = {
        id: userPrincipal.toString(),
        name: 'VR User',
        color: '#00ffff',
        accessory: 'none'
      };
      setAvatar(mockAvatar);
      
      // Simulate loading tickets
      const mockTickets: Ticket[] = [];
      setTickets(mockTickets);
      
      console.log('User data loaded successfully');
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  };

  const createAvatar = async (name: string, color: string, accessory: string) => {
    if (!principal) return;
    
    try {
      console.log('Creating avatar:', { name, color, accessory });
      
      const newAvatar: Avatar = {
        id: principal.toString(),
        name,
        color,
        accessory
      };
      
      setAvatar(newAvatar);
      console.log('Avatar created successfully');
    } catch (error) {
      console.error('Avatar creation failed:', error);
    }
  };

  const mintTicket = async (eventName: string, eventDate: bigint, ticketType: string) => {
    if (!principal) return;
    
    try {
      console.log('Minting ticket:', { eventName, eventDate, ticketType });
      
      const newTicket: Ticket = {
        id: Date.now().toString(),
        eventName,
        eventDate,
        ticketType,
        isUsed: false,
        owner: principal.toString()
      };
      
      setTickets(prev => [...prev, newTicket]);
      console.log('Ticket minted successfully');
    } catch (error) {
      console.error('Ticket minting failed:', error);
    }
  };

  const joinWorld = async (): Promise<boolean> => {
    if (!isAuthenticated) {
      console.error('User not authenticated');
      return false;
    }
    
    try {
      console.log('Joining VR world...');
      // Simulate world joining logic
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Successfully joined VR world');
      return true;
    } catch (error) {
      console.error('Failed to join world:', error);
      return false;
    }
  };

  return {
    isAuthenticated,
    loading,
    principal,
    avatar,
    tickets,
    login,
    logout,
    createAvatar,
    mintTicket,
    joinWorld
  };
};

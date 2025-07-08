import { useState, useEffect } from 'react';
import { Principal } from '@dfinity/principal';
import { icpService } from '../services/icp';
import { Avatar, Ticket, VRWorld } from '../types/icp';
import { useToast } from './use-toast';

export const useICP = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [principal, setPrincipal] = useState<Principal | null>(null);
  const [avatar, setAvatar] = useState<Avatar | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [vrWorlds, setVRWorlds] = useState<VRWorld[]>([]);
  const [allVRWorlds, setAllVRWorlds] = useState<VRWorld[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    initAuth();
  }, []);

  const initAuth = async () => {
    try {
      console.log('Initializing ICP authentication...');
      await icpService.init();
      const authenticated = await icpService.isAuthenticated();
      console.log('Authentication status:', authenticated);
      setIsAuthenticated(authenticated);
      
      if (authenticated) {
        const userPrincipal = await icpService.getPrincipal();
        console.log('User principal:', userPrincipal?.toString());
        setPrincipal(userPrincipal);
        await loadUserData();
      }
    } catch (error) {
      console.error('Auth initialization failed:', error);
      toast({
        title: "Authentication Error",
        description: "Failed to initialize authentication",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const login = async (): Promise<boolean> => {
    setLoading(true);
    try {
      console.log('Attempting to login...');
      const success = await icpService.login();
      console.log('Login success:', success);
      if (success) {
        setIsAuthenticated(true);
        const userPrincipal = await icpService.getPrincipal();
        setPrincipal(userPrincipal);
        await loadUserData();
        toast({
          title: "Welcome to ICP VR Genesis!",
          description: "Successfully logged in with Internet Identity",
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      toast({
        title: "Login Failed",
        description: "Unable to authenticate with Internet Identity",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await icpService.logout();
      setIsAuthenticated(false);
      setPrincipal(null);
      setAvatar(null);
      setTickets([]);
      setVRWorlds([]);
      setAllVRWorlds([]);
      toast({
        title: "Logged Out",
        description: "Successfully logged out from ICP VR Genesis",
      });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const loadUserData = async () => {
    try {
      console.log('Loading user data...');
      const [userAvatar, userTickets, userVRWorlds, allWorlds] = await Promise.all([
        icpService.getAvatar(),
        icpService.getTickets(),
        icpService.getUserVRWorlds(),
        icpService.getAllVRWorlds(),
      ]);
      
      console.log('User avatar:', userAvatar);
      console.log('User tickets:', userTickets);
      console.log('User VR worlds:', userVRWorlds);
      console.log('All VR worlds:', allWorlds);
      
      setAvatar(userAvatar[0] || null);
      setTickets(userTickets);
      setVRWorlds(userVRWorlds);
      setAllVRWorlds(allWorlds);
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  };

  const createAvatar = async (name: string, color: string, accessory: string) => {
    try {
      console.log('Creating avatar:', { name, color, accessory });
      const result = await icpService.createAvatar(name, color, accessory);
      console.log('Avatar creation result:', result);
      if (result[0]) {
        setAvatar(result[0]);
        toast({
          title: "Avatar Created!",
          description: `Welcome to the metaverse, ${name}!`,
        });
        return result[0];
      }
    } catch (error) {
      console.error('Avatar creation failed:', error);
      toast({
        title: "Avatar Creation Failed",
        description: "Unable to create your avatar",
        variant: "destructive",
      });
    }
    return null;
  };

  const mintTicket = async (eventName: string, eventDate: bigint, ticketType: string) => {
    try {
      console.log('Minting ticket:', { eventName, eventDate, ticketType });
      const result = await icpService.mintTicket(eventName, eventDate, ticketType);
      console.log('Ticket minting result:', result);
      if (result[0]) {
        setTickets(prev => [...prev, result[0]]);
        toast({
          title: "Ticket Minted!",
          description: `Successfully minted ticket for ${eventName}`,
        });
        return result[0];
      }
    } catch (error) {
      console.error('Ticket minting failed:', error);
      toast({
        title: "Ticket Minting Failed",
        description: "Unable to mint your ticket",
        variant: "destructive",
      });
    }
    return null;
  };

  const createVRWorld = async (name: string, description: string) => {
    try {
      console.log('Creating VR world:', { name, description });
      const result = await icpService.createVRWorld(name, description);
      console.log('VR world creation result:', result);
      if (result[0]) {
        const newWorld = result[0];
        setVRWorlds(prev => [...prev, newWorld]);
        setAllVRWorlds(prev => [...prev, newWorld]); // Add to both arrays
        toast({
          title: "VR World Created!",
          description: `Successfully created ${name}`,
        });
        return newWorld;
      }
    } catch (error) {
      console.error('VR world creation failed:', error);
      toast({
        title: "VR World Creation Failed",
        description: "Unable to create your VR world",
        variant: "destructive",
      });
    }
    return null;
  };

  const joinVRWorld = async (worldId: string) => {
    try {
      console.log('Joining VR world:', worldId);
      const success = await icpService.joinVRWorld(worldId);
      console.log('Join VR world result:', success);
      if (success) {
        await loadAllVRWorlds(); // Refresh all worlds list
        toast({
          title: "Joined VR World!",
          description: "Successfully joined the VR world",
        });
        return true;
      }
    } catch (error) {
      console.error('Join VR world failed:', error);
      toast({
        title: "Join VR World Failed",
        description: "Unable to join the VR world",
        variant: "destructive",
      });
    }
    return false;
  };

  const loadAllVRWorlds = async () => {
    try {
      const allWorlds = await icpService.getAllVRWorlds();
      console.log('Loaded all VR worlds:', allWorlds);
      setAllVRWorlds(allWorlds);
    } catch (error) {
      console.error('Failed to load all VR worlds:', error);
    }
  };

  return {
    isAuthenticated,
    principal,
    avatar,
    tickets,
    vrWorlds,
    allVRWorlds,
    loading,
    login,
    logout,
    createAvatar,
    mintTicket,
    createVRWorld,
    joinVRWorld,
    loadUserData,
    loadAllVRWorlds,
  };
};

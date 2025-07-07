
import { useState, useEffect } from 'react';
import { Principal } from '@dfinity/principal';
import { icpService } from '../services/icp';
import { Avatar, Ticket } from '../types/icp';
import { useToast } from './use-toast';

export const useICP = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [principal, setPrincipal] = useState<Principal | null>(null);
  const [avatar, setAvatar] = useState<Avatar | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
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

  const login = async () => {
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
      }
    } catch (error) {
      console.error('Login failed:', error);
      toast({
        title: "Login Failed",
        description: "Unable to authenticate with Internet Identity",
        variant: "destructive",
      });
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
      const [userAvatar, userTickets] = await Promise.all([
        icpService.getAvatar(),
        icpService.getTickets(),
      ]);
      
      console.log('User avatar:', userAvatar);
      console.log('User tickets:', userTickets);
      
      setAvatar(userAvatar[0] || null);
      setTickets(userTickets);
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

  const mintTicket = async (eventName: string, eventDate: bigint, ticketType: string, price: bigint) => {
    try {
      console.log('Minting ticket:', { eventName, eventDate, ticketType, price });
      const result = await icpService.mintTicket(eventName, eventDate, ticketType, price);
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

  return {
    isAuthenticated,
    principal,
    avatar,
    tickets,
    loading,
    login,
    logout,
    createAvatar,
    mintTicket,
    loadUserData,
  };
};

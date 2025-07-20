
import { AuthClient } from "@dfinity/auth-client";
import { Actor, HttpAgent } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";

// Mainnet Internet Identity URL
const II_URL = "https://identity.ic0.app";

// Create HTTP Agent for mainnet
const agent = new HttpAgent({
  host: "https://ic0.app",
});

let authClient: AuthClient | null = null;

export const initAuth = async () => {
  if (!authClient) {
    authClient = await AuthClient.create();
  }
  return authClient;
};

export const login = async () => {
  const client = await initAuth();
  
  return new Promise<boolean>((resolve) => {
    client.login({
      identityProvider: II_URL,
      onSuccess: () => {
        console.log("Login successful");
        resolve(true);
      },
      onError: (error) => {
        console.error("Login failed:", error);
        resolve(false);
      },
    });
  });
};

export const logout = async () => {
  const client = await initAuth();
  await client.logout();
  console.log("Logout successful");
};

export const isAuthenticated = async () => {
  const client = await initAuth();
  return await client.isAuthenticated();
};

export const getPrincipal = async () => {
  const client = await initAuth();
  const identity = client.getIdentity();
  return identity.getPrincipal();
};

// Mock backend functions for demo purposes
export const createAvatar = async (avatar: any) => {
  console.log("Creating avatar:", avatar);
  return { success: true, id: Math.random().toString(36) };
};

export const mintTicket = async (ticket: any) => {
  console.log("Minting ticket:", ticket);
  return { success: true, id: Math.random().toString(36) };
};

export const createVRWorld = async (world: any) => {
  console.log("Creating VR world:", world);
  return { success: true, id: Math.random().toString(36) };
};

export const getAllVRWorlds = async () => {
  console.log("Fetching all VR worlds");
  return [
    {
      id: "world-1",
      name: "Cyber Plaza",
      description: "A futuristic cyberpunk cityscape",
      creator: "user-1",
      createdAt: BigInt(Date.now()),
      isActive: true,
      participants: ["user-1", "user-2"]
    },
    {
      id: "world-2",
      name: "Ocean Depths",
      description: "An underwater adventure world",
      creator: "user-2",
      createdAt: BigInt(Date.now() - 86400000),
      isActive: true,
      participants: ["user-2"]
    }
  ];
};

export const joinWorld = async (worldId: string) => {
  console.log("Joining world:", worldId);
  return { success: true };
};

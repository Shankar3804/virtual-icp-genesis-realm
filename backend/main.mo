
import Debug "mo:base/Debug";
import Hash "mo:base/Hash";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Option "mo:base/Option";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Array "mo:base/Array";

actor ICPVRGenesis {
    // Types
    public type Avatar = {
        id: Text;
        name: Text;
        color: Text;
        accessory: Text;
        owner: Principal;
    };

    public type Ticket = {
        id: Text;
        eventName: Text;
        eventDate: Int;
        ticketType: Text;
        owner: Principal;
        isUsed: Bool;
    };

    public type VRWorld = {
        id: Text;
        name: Text;
        description: Text;
        creator: Principal;
        createdAt: Int;
        isActive: Bool;
        participants: [Principal];
    };

    public type User = {
        id: Principal;
        avatar: ?Avatar;
        tickets: [Ticket];
        vrWorlds: [VRWorld];
        createdAt: Int;
    };

    // State
    private stable var nextTicketId: Nat = 0;
    private stable var nextAvatarId: Nat = 0;
    private stable var nextVRWorldId: Nat = 0;
    
    private var users = HashMap.HashMap<Principal, User>(10, Principal.equal, Principal.hash);
    private var avatars = HashMap.HashMap<Principal, Avatar>(10, Principal.equal, Principal.hash);
    private var tickets = HashMap.HashMap<Text, Ticket>(10, Text.equal, Text.hash);
    private var vrWorlds = HashMap.HashMap<Text, VRWorld>(10, Text.equal, Text.hash);

    // Helper functions
    private func generateTicketId(): Text {
        nextTicketId += 1;
        "ticket_" # Nat.toText(nextTicketId)
    };

    private func generateAvatarId(): Text {
        nextAvatarId += 1;
        "avatar_" # Nat.toText(nextAvatarId)
    };

    private func generateVRWorldId(): Text {
        nextVRWorldId += 1;
        "vr_world_" # Nat.toText(nextVRWorldId)
    };

    // Avatar functions
    public shared(msg) func createAvatar(name: Text, color: Text, accessory: Text): async ?Avatar {
        let caller = msg.caller;
        
        // Check if user already has an avatar
        switch (avatars.get(caller)) {
            case (?existing) { return ?existing };
            case null {
                let avatar: Avatar = {
                    id = generateAvatarId();
                    name = name;
                    color = color;
                    accessory = accessory;
                    owner = caller;
                };
                
                avatars.put(caller, avatar);
                Debug.print("Avatar created for user: " # Principal.toText(caller));
                ?avatar
            };
        }
    };

    public shared query(msg) func getAvatar(): async ?Avatar {
        let caller = msg.caller;
        avatars.get(caller)
    };

    // Ticket functions
    public shared(msg) func mintTicket(
        eventName: Text, 
        eventDate: Int, 
        ticketType: Text
    ): async ?Ticket {
        let caller = msg.caller;
        let ticketId = generateTicketId();
        
        let ticket: Ticket = {
            id = ticketId;
            eventName = eventName;
            eventDate = eventDate;
            ticketType = ticketType;
            owner = caller;
            isUsed = false;
        };
        
        tickets.put(ticketId, ticket);
        Debug.print("Ticket minted: " # ticketId # " for user: " # Principal.toText(caller));
        ?ticket
    };

    public shared query(msg) func getTickets(): async [Ticket] {
        let caller = msg.caller;
        let userTickets = tickets.vals()
            |> Iter.filter(_, func(ticket: Ticket): Bool { ticket.owner == caller })
            |> Iter.toArray(_);
        userTickets
    };

    // VR World functions
    public shared(msg) func createVRWorld(
        name: Text,
        description: Text
    ): async ?VRWorld {
        let caller = msg.caller;
        let worldId = generateVRWorldId();
        
        let vrWorld: VRWorld = {
            id = worldId;
            name = name;
            description = description;
            creator = caller;
            createdAt = Time.now();
            isActive = true;
            participants = [caller];
        };
        
        vrWorlds.put(worldId, vrWorld);
        Debug.print("VR World created: " # worldId # " by user: " # Principal.toText(caller));
        ?vrWorld
    };

    public shared query func getAllVRWorlds(): async [VRWorld] {
        let activeWorlds = vrWorlds.vals()
            |> Iter.filter(_, func(world: VRWorld): Bool { world.isActive })
            |> Iter.toArray(_);
        activeWorlds
    };

    public shared(msg) func joinVRWorld(worldId: Text): async Bool {
        let caller = msg.caller;
        switch (vrWorlds.get(worldId)) {
            case (?world) {
                // Check if user is already a participant
                let isParticipant = Array.find<Principal>(world.participants, func(p: Principal): Bool { p == caller });
                switch (isParticipant) {
                    case (?_) { true }; // Already joined
                    case null {
                        let updatedParticipants = Array.append<Principal>(world.participants, [caller]);
                        let updatedWorld: VRWorld = {
                            id = world.id;
                            name = world.name;
                            description = world.description;
                            creator = world.creator;
                            createdAt = world.createdAt;
                            isActive = world.isActive;
                            participants = updatedParticipants;
                        };
                        vrWorlds.put(worldId, updatedWorld);
                        Debug.print("User " # Principal.toText(caller) # " joined VR World: " # worldId);
                        true
                    };
                }
            };
            case null { false };
        }
    };

    public shared query(msg) func getUserVRWorlds(): async [VRWorld] {
        let caller = msg.caller;
        let userWorlds = vrWorlds.vals()
            |> Iter.filter(_, func(world: VRWorld): Bool { world.creator == caller })
            |> Iter.toArray(_);
        userWorlds
    };

    // User management
    public shared query(msg) func whoami(): async Principal {
        msg.caller
    };

    public shared query(msg) func getUser(): async ?User {
        let caller = msg.caller;
        let avatar = avatars.get(caller);
        let userTickets = tickets.vals()
            |> Iter.filter(_, func(ticket: Ticket): Bool { ticket.owner == caller })
            |> Iter.toArray(_);
        let userVRWorlds = vrWorlds.vals()
            |> Iter.filter(_, func(world: VRWorld): Bool { world.creator == caller })
            |> Iter.toArray(_);
        
        ?{
            id = caller;
            avatar = avatar;
            tickets = userTickets;
            vrWorlds = userVRWorlds;
            createdAt = Time.now();
        }
    };

    // Admin functions (for development)
    public query func getTotalTickets(): async Nat {
        tickets.size()
    };

    public query func getTotalAvatars(): async Nat {
        avatars.size()
    };

    public query func getTotalVRWorlds(): async Nat {
        vrWorlds.size()
    };

    // System functions for upgrades
    system func preupgrade() {
        Debug.print("Preparing for upgrade...");
    };

    system func postupgrade() {
        Debug.print("Upgrade completed successfully!");
    };
}


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
        price: Nat;
        owner: Principal;
        isUsed: Bool;
    };

    public type User = {
        id: Principal;
        avatar: ?Avatar;
        tickets: [Ticket];
        createdAt: Int;
    };

    // State
    private stable var nextTicketId: Nat = 0;
    private stable var nextAvatarId: Nat = 0;
    
    private var users = HashMap.HashMap<Principal, User>(10, Principal.equal, Principal.hash);
    private var avatars = HashMap.HashMap<Principal, Avatar>(10, Principal.equal, Principal.hash);
    private var tickets = HashMap.HashMap<Text, Ticket>(10, Text.equal, Text.hash);

    // Helper functions
    private func generateTicketId(): Text {
        nextTicketId += 1;
        "ticket_" # Nat.toText(nextTicketId)
    };

    private func generateAvatarId(): Text {
        nextAvatarId += 1;
        "avatar_" # Nat.toText(nextAvatarId)
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
        ticketType: Text, 
        price: Nat
    ): async ?Ticket {
        let caller = msg.caller;
        let ticketId = generateTicketId();
        
        let ticket: Ticket = {
            id = ticketId;
            eventName = eventName;
            eventDate = eventDate;
            ticketType = ticketType;
            price = price;
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

    public shared query(msg) func getTicket(ticketId: Text): async ?Ticket {
        let caller = msg.caller;
        switch (tickets.get(ticketId)) {
            case (?ticket) {
                if (ticket.owner == caller) { ?ticket } else { null }
            };
            case null { null };
        }
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
        
        ?{
            id = caller;
            avatar = avatar;
            tickets = userTickets;
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

    // System functions for upgrades
    system func preupgrade() {
        Debug.print("Preparing for upgrade...");
    };

    system func postupgrade() {
        Debug.print("Upgrade completed successfully!");
    };
}

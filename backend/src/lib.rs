use candid::{CandidType, Deserialize, Principal};
use ic_cdk::api::time;
use ic_cdk::{caller, query, update};
use ic_stable_structures::memory_manager::{MemoryId, MemoryManager, VirtualMemory};
use ic_stable_structures::{DefaultMemoryImpl, StableBTreeMap};
use serde::Serialize;
use std::cell::RefCell;

type Memory = VirtualMemory<DefaultMemoryImpl>;

// Types
#[derive(CandidType, Deserialize, Serialize, Clone)]
pub struct Avatar {
    pub id: String,
    pub name: String,
    pub color: String,
    pub accessory: String,
    pub owner: Principal,
}

#[derive(CandidType, Deserialize, Serialize, Clone)]
pub struct Ticket {
    pub id: String,
    pub event_name: String,
    pub event_date: u64,
    pub ticket_type: String,
    pub owner: Principal,
    pub is_used: bool,
}

#[derive(CandidType, Deserialize, Serialize, Clone)]
pub struct VRWorld {
    pub id: String,
    pub name: String,
    pub description: String,
    pub creator: Principal,
    pub created_at: u64,
    pub is_active: bool,
    pub participants: Vec<Principal>,
}

#[derive(CandidType, Deserialize, Serialize, Clone)]
pub struct User {
    pub id: Principal,
    pub avatar: Option<Avatar>,
    pub tickets: Vec<Ticket>,
    pub vr_worlds: Vec<VRWorld>,
    pub created_at: u64,
}

// State management
thread_local! {
    static MEMORY_MANAGER: RefCell<MemoryManager<DefaultMemoryImpl>> =
        RefCell::new(MemoryManager::init(DefaultMemoryImpl::default()));

    static AVATARS: RefCell<StableBTreeMap<Principal, Avatar, Memory>> = RefCell::new(
        StableBTreeMap::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(0))),
        )
    );

    static TICKETS: RefCell<StableBTreeMap<String, Ticket, Memory>> = RefCell::new(
        StableBTreeMap::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(1))),
        )
    );

    static VR_WORLDS: RefCell<StableBTreeMap<String, VRWorld, Memory>> = RefCell::new(
        StableBTreeMap::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(2))),
        )
    );

    static NEXT_TICKET_ID: RefCell<u64> = RefCell::new(0);
    static NEXT_AVATAR_ID: RefCell<u64> = RefCell::new(0);
    static NEXT_VR_WORLD_ID: RefCell<u64> = RefCell::new(0);
}

// Helper functions
fn generate_ticket_id() -> String {
    NEXT_TICKET_ID.with(|id| {
        let mut id_ref = id.borrow_mut();
        *id_ref += 1;
        format!("ticket_{}", *id_ref)
    })
}

fn generate_avatar_id() -> String {
    NEXT_AVATAR_ID.with(|id| {
        let mut id_ref = id.borrow_mut();
        *id_ref += 1;
        format!("avatar_{}", *id_ref)
    })
}

fn generate_vr_world_id() -> String {
    NEXT_VR_WORLD_ID.with(|id| {
        let mut id_ref = id.borrow_mut();
        *id_ref += 1;
        format!("vr_world_{}", *id_ref)
    })
}

// Avatar functions
#[update]
fn create_avatar(name: String, color: String, accessory: String) -> Option<Avatar> {
    let caller = caller();
    
    // Check if user already has an avatar
    AVATARS.with(|avatars| {
        let avatars_ref = avatars.borrow();
        if avatars_ref.contains_key(&caller) {
            return avatars_ref.get(&caller);
        }
        
        drop(avatars_ref);
        
        let avatar = Avatar {
            id: generate_avatar_id(),
            name,
            color,
            accessory,
            owner: caller,
        };
        
        avatars.borrow_mut().insert(caller, avatar.clone());
        ic_cdk::println!("Avatar created for user: {}", caller.to_text());
        Some(avatar)
    })
}

#[query]
fn get_avatar() -> Option<Avatar> {
    let caller = caller();
    AVATARS.with(|avatars| avatars.borrow().get(&caller))
}

// Ticket functions
#[update]
fn mint_ticket(event_name: String, event_date: u64, ticket_type: String) -> Option<Ticket> {
    let caller = caller();
    let ticket_id = generate_ticket_id();
    
    let ticket = Ticket {
        id: ticket_id.clone(),
        event_name,
        event_date,
        ticket_type,
        owner: caller,
        is_used: false,
    };
    
    TICKETS.with(|tickets| {
        tickets.borrow_mut().insert(ticket_id.clone(), ticket.clone());
        ic_cdk::println!("Ticket minted: {} for user: {}", ticket_id, caller.to_text());
        Some(ticket)
    })
}

#[query]
fn get_tickets() -> Vec<Ticket> {
    let caller = caller();
    TICKETS.with(|tickets| {
        tickets
            .borrow()
            .iter()
            .filter_map(|(_, ticket)| {
                if ticket.owner == caller {
                    Some(ticket)
                } else {
                    None
                }
            })
            .collect()
    })
}

// VR World functions
#[update]
fn create_vr_world(name: String, description: String) -> Option<VRWorld> {
    let caller = caller();
    let world_id = generate_vr_world_id();
    
    let vr_world = VRWorld {
        id: world_id.clone(),
        name,
        description,
        creator: caller,
        created_at: time(),
        is_active: true,
        participants: vec![caller],
    };
    
    VR_WORLDS.with(|worlds| {
        worlds.borrow_mut().insert(world_id.clone(), vr_world.clone());
        ic_cdk::println!("VR World created: {} by user: {}", world_id, caller.to_text());
        Some(vr_world)
    })
}

#[query]
fn get_all_vr_worlds() -> Vec<VRWorld> {
    VR_WORLDS.with(|worlds| {
        worlds
            .borrow()
            .iter()
            .filter_map(|(_, world)| {
                if world.is_active {
                    Some(world)
                } else {
                    None
                }
            })
            .collect()
    })
}

#[update]
fn join_vr_world(world_id: String) -> bool {
    let caller = caller();
    
    VR_WORLDS.with(|worlds| {
        let mut worlds_ref = worlds.borrow_mut();
        
        if let Some(mut world) = worlds_ref.get(&world_id) {
            // Check if user is already a participant
            if world.participants.contains(&caller) {
                return true;
            }
            
            // Add user to participants
            world.participants.push(caller);
            worlds_ref.insert(world_id.clone(), world);
            ic_cdk::println!("User {} joined VR World: {}", caller.to_text(), world_id);
            true
        } else {
            false
        }
    })
}

#[query]
fn get_user_vr_worlds() -> Vec<VRWorld> {
    let caller = caller();
    VR_WORLDS.with(|worlds| {
        worlds
            .borrow()
            .iter()
            .filter_map(|(_, world)| {
                if world.creator == caller {
                    Some(world)
                } else {
                    None
                }
            })
            .collect()
    })
}

// User management
#[query]
fn whoami() -> Principal {
    caller()
}

#[query]
fn get_user() -> Option<User> {
    let caller = caller();
    
    let avatar = AVATARS.with(|avatars| avatars.borrow().get(&caller));
    
    let user_tickets = TICKETS.with(|tickets| {
        tickets
            .borrow()
            .iter()
            .filter_map(|(_, ticket)| {
                if ticket.owner == caller {
                    Some(ticket)
                } else {
                    None
                }
            })
            .collect()
    });
    
    let user_vr_worlds = VR_WORLDS.with(|worlds| {
        worlds
            .borrow()
            .iter()
            .filter_map(|(_, world)| {
                if world.creator == caller {
                    Some(world)
                } else {
                    None
                }
            })
            .collect()
    });
    
    Some(User {
        id: caller,
        avatar,
        tickets: user_tickets,
        vr_worlds: user_vr_worlds,
        created_at: time(),
    })
}

// Admin functions (for development)
#[query]
fn get_total_tickets() -> u64 {
    TICKETS.with(|tickets| tickets.borrow().len())
}

#[query]
fn get_total_avatars() -> u64 {
    AVATARS.with(|avatars| avatars.borrow().len())
}

#[query]
fn get_total_vr_worlds() -> u64 {
    VR_WORLDS.with(|worlds| worlds.borrow().len())
}

// Export candid interface
ic_cdk::export_candid!();
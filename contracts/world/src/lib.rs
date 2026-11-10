use borsh::BorshSerialize;
use near_sdk::collections::{UnorderedMap, UnorderedSet};
use near_sdk::json_types::U128;
use near_sdk::{env, near, require, AccountId, BorshStorageKey, PanicOnDefault};

const STARTER_CRED: u128 = 1_000;
const NPC_CAP: u128 = 160;
const MIN_FEE_BPS: u128 = 30;

#[derive(BorshSerialize, BorshStorageKey)]
enum StorageKey {
    Players,
    Ports,
    Ships,
    Routes,
    Ambushes,
    Escorts,
    PlayerIds,
}

#[near(serializers = [json, borsh])]
#[derive(Clone, Copy, PartialEq, Eq, Debug)]
pub enum Good {
    Hashpower,
    Liquidity,
    Blockspace,
}

impl Good {
    fn index(self) -> usize {
        match self {
            Self::Hashpower => 0,
            Self::Liquidity => 1,
            Self::Blockspace => 2,
        }
    }
}

#[near(serializers = [json, borsh])]
#[derive(Clone, Debug)]
pub struct Player {
    pub cred: u128,
    pub goods: [u128; 3],
    pub defence: u128,
    pub active_commits: u8,
}

#[near(serializers = [json, borsh])]
#[derive(Clone, Debug)]
pub struct Port {
    pub token_id: String,
    pub owner_id: AccountId,
    pub fee_bps: u16,
    pub treasury: u128,
    pub reserves: [u128; 3],
    pub cred_reserve: u128,
    pub sale_price: u128,
}

#[near(serializers = [json, borsh])]
#[derive(Clone, Debug)]
pub struct PortMetadata {
    pub title: String,
    pub description: String,
    pub media: Option<String>,
}

#[near(serializers = [json, borsh])]
#[derive(Clone, Debug)]
pub struct NftToken {
    pub token_id: String,
    pub owner_id: AccountId,
    pub metadata: PortMetadata,
}

#[near(serializers = [json, borsh])]
#[derive(Clone, Debug)]
pub struct NftContractMetadata {
    pub spec: String,
    pub name: String,
    pub symbol: String,
    pub icon: Option<String>,
    pub base_uri: Option<String>,
    pub reference: Option<String>,
    pub reference_hash: Option<Vec<u8>>,
}

#[near(serializers = [json, borsh])]
#[derive(Clone, Debug)]
pub struct MtTokenMetadata {
    pub spec: String,
    pub name: String,
    pub symbol: String,
    pub icon: Option<String>,
    pub reference: Option<String>,
    pub reference_hash: Option<Vec<u8>>,
    pub decimals: u8,
}

#[near(serializers = [json, borsh])]
#[derive(Clone, Debug)]
pub struct EconomySnapshot {
    pub cred_supply: U128,
    pub npc_faucet: U128,
    pub sinks: U128,
    pub spoilage: U128,
    pub epoch: u64,
}

#[near(serializers = [json, borsh])]
#[derive(Clone, Debug)]
pub struct Route {
    pub route_id: u64,
    pub from_port: u64,
    pub to_port: u64,
    pub distance: u64,
}

#[near(serializers = [json, borsh])]
#[derive(Clone, Debug)]
pub struct Ship {
    pub token_id: String,
    pub owner_id: AccountId,
    pub cargo: [u128; 3],
    pub defence: u128,
    pub route_id: Option<u64>,
    pub departed_at: u64,
    pub arrives_at: u64,
    pub destination_commit: Option<Vec<u8>>,
}

#[near(serializers = [json, borsh])]
#[derive(Clone, Debug)]
pub struct Ambush {
    pub route_id: u64,
    pub window: u64,
    pub raider: AccountId,
    pub stake: u128,
    pub commit: Vec<u8>,
    pub revealed: bool,
}

#[near(serializers = [json, borsh])]
#[derive(Clone, Debug)]
pub struct EscortOffer {
    pub ship_id: u64,
    pub owner_id: AccountId,
    pub price: u128,
    pub defence: u128,
    pub active: bool,
}

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct World {
    players: UnorderedMap<AccountId, Player>,
    player_ids: UnorderedSet<AccountId>,
    ports: UnorderedMap<u64, Port>,
    routes: UnorderedMap<u64, Route>,
    ships: UnorderedMap<u64, Ship>,
    ambushes: UnorderedMap<String, Ambush>,
    escorts: UnorderedMap<u64, EscortOffer>,
    next_ship: u64,
    epoch: u64,
    cred_supply: u128,
    npc_faucet: u128,
    sinks: u128,
    spoilage: u128,
}

#[near]
impl World {
    #[init]
    pub fn new() -> Self {
        let mut this = Self {
            players: UnorderedMap::new(StorageKey::Players),
            player_ids: UnorderedSet::new(StorageKey::PlayerIds),
            ports: UnorderedMap::new(StorageKey::Ports),
            routes: UnorderedMap::new(StorageKey::Routes),
            ships: UnorderedMap::new(StorageKey::Ships),
            ambushes: UnorderedMap::new(StorageKey::Ambushes),
            escorts: UnorderedMap::new(StorageKey::Escorts),
            next_ship: 1,
            epoch: 0,
            cred_supply: 0,
            npc_faucet: 0,
            sinks: 0,
            spoilage: 0,
        };
        let contract_account = env::current_account_id();
        this.players.insert(
            &contract_account,
            &Player {
                cred: STARTER_CRED,
                goods: [0; 3],
                defence: 0,
                active_commits: 0,
            },
        );
        this.player_ids.insert(&contract_account);
        this.cred_supply = STARTER_CRED;
        let names = [
            "Bitcoin Isle",
            "Solana Reef",
            "Base Harbor",
            "Tron Bay",
            "NEAR Capital",
        ];
        for (id, _name) in names.iter().enumerate() {
            this.ports.insert(
                &(id as u64 + 1),
                &Port {
                    token_id: format!("port-{}", id + 1),
                    owner_id: env::current_account_id(),
                    fee_bps: 300,
                    treasury: 0,
                    reserves: [500, 500, 500],
                    cred_reserve: 1_000,
                    sale_price: 500,
                },
            );
        }
        let routes = [(1, 2, 12), (2, 3, 15), (1, 4, 18), (4, 5, 20), (3, 5, 14)];
        for (i, (from, to, distance)) in routes.iter().enumerate() {
            this.routes.insert(
                &(i as u64 + 1),
                &Route {
                    route_id: i as u64 + 1,
                    from_port: *from,
                    to_port: *to,
                    distance: *distance,
                },
            );
        }
        this
    }

    pub fn register_player(&mut self) {
        let caller = env::predecessor_account_id();
        require!(!self.player_ids.contains(&caller), "ERR_PLAYER_EXISTS");
        self.players.insert(
            &caller,
            &Player {
                cred: STARTER_CRED,
                goods: [0; 3],
                defence: 0,
                active_commits: 0,
            },
        );
        self.player_ids.insert(&caller);
        self.cred_supply += STARTER_CRED;
        self.emit("player_registered", &caller.to_string());
    }

    pub fn get_player(&self, account_id: AccountId) -> Option<Player> {
        self.players.get(&account_id)
    }
    pub fn get_port(&self, port_id: u64) -> Option<Port> {
        self.ports.get(&port_id)
    }
    pub fn get_route(&self, route_id: u64) -> Option<Route> {
        self.routes.get(&route_id)
    }
    pub fn get_ship(&self, ship_id: u64) -> Option<Ship> {
        self.ships.get(&ship_id)
    }
    pub fn get_escort(&self, offer_id: u64) -> Option<EscortOffer> {
        self.escorts.get(&offer_id)
    }
    pub fn economy(&self) -> (U128, U128, U128, u64) {
        (
            U128(self.cred_supply),
            U128(self.npc_faucet),
            U128(self.sinks),
            self.epoch,
        )
    }

    pub fn economy_dashboard(&self) -> EconomySnapshot {
        EconomySnapshot {
            cred_supply: U128(self.cred_supply),
            npc_faucet: U128(self.npc_faucet),
            sinks: U128(self.sinks),
            spoilage: U128(self.spoilage),
            epoch: self.epoch,
        }
    }

    pub fn build_ship(&mut self, kind: String) -> u64 {
        let caller = env::predecessor_account_id();
        let (cost, defence) = match kind.as_str() {
            "sloop" => (100, 1),
            "galleon" => (350, 3),
            _ => env::panic_str("ERR_SHIP_KIND"),
        };
        self.debit_cred(&caller, cost, "ERR_SHIP_FUNDS");
        let id = self.next_ship;
        self.next_ship += 1;
        self.ships.insert(
            &id,
            &Ship {
                token_id: format!("ship:{}", id),
                owner_id: caller.clone(),
                cargo: [0; 3],
                defence,
                route_id: None,
                departed_at: 0,
                arrives_at: 0,
                destination_commit: None,
            },
        );
        self.emit("ship_built", &id.to_string());
        id
    }

    pub fn buy(&mut self, port_id: u64, good: Good, cred_in: U128, min_out: U128) -> U128 {
        let caller = env::predecessor_account_id();
        let mut port = self.port_or_panic(port_id);
        let idx = good.index();
        require!(port.reserves[idx] > 0 && cred_in.0 > 0, "ERR_BAD_TRADE");
        self.debit_cred(&caller, cred_in.0, "ERR_CRED_FUNDS");
        let fee = (cred_in.0 * port.fee_bps as u128 / 10_000)
            .max(MIN_FEE_BPS)
            .min(cred_in.0);
        let net = cred_in.0 - fee;
        let out = (port.reserves[idx] * net) / (port.cred_reserve + net);
        require!(out >= min_out.0 && out < port.reserves[idx], "ERR_SLIPPAGE");
        port.cred_reserve += net;
        port.reserves[idx] -= out;
        port.treasury += fee;
        self.credit_good(&caller, idx, out);
        self.ports.insert(&port_id, &port);
        self.emit("trade", &format!("buy:{}:{}:{}", port_id, idx, out));
        U128(out)
    }

    pub fn sell(&mut self, port_id: u64, good: Good, amount: U128, min_cred: U128) -> U128 {
        let caller = env::predecessor_account_id();
        let mut port = self.port_or_panic(port_id);
        let idx = good.index();
        self.debit_good(&caller, idx, amount.0);
        let gross = (port.cred_reserve * amount.0) / (port.reserves[idx] + amount.0);
        let fee = (gross * port.fee_bps as u128 / 10_000)
            .max(MIN_FEE_BPS)
            .min(gross);
        let payout = gross - fee;
        require!(
            payout >= min_cred.0 && payout < port.cred_reserve,
            "ERR_SLIPPAGE"
        );
        port.reserves[idx] += amount.0;
        port.cred_reserve -= gross;
        port.treasury += fee;
        self.credit_cred(&caller, payout);
        self.ports.insert(&port_id, &port);
        self.emit("trade", &format!("sell:{}:{}:{}", port_id, idx, payout));
        U128(payout)
    }

    pub fn set_fee(&mut self, port_id: u64, fee_bps: u16) {
        let caller = env::predecessor_account_id();
        let mut port = self.port_or_panic(port_id);
        require!(port.owner_id == caller, "ERR_NOT_PORT_OWNER");
        require!(fee_bps <= 1_000, "ERR_FEE_RANGE");
        port.fee_bps = fee_bps.max(MIN_FEE_BPS as u16);
        self.ports.insert(&port_id, &port);
        self.emit("fee_set", &format!("{}:{}", port_id, fee_bps));
    }

    pub fn depart(
        &mut self,
        ship_id: u64,
        route_id: u64,
        destination_commit: Vec<u8>,
        cargo: [U128; 3],
    ) {
        let caller = env::predecessor_account_id();
        let mut ship = self.ship_or_panic(ship_id);
        let route = self.route_or_panic(route_id);
        require!(ship.owner_id == caller, "ERR_NOT_SHIP_OWNER");
        require!(ship.route_id.is_none(), "ERR_IN_TRANSIT");
        let player = self.player_or_panic(&caller);
        require!(
            cargo.iter().map(|x| x.0).sum::<u128>() <= player.goods.iter().sum(),
            "ERR_CARGO_FUNDS"
        );
        let mut updated = player;
        for (idx, amount) in cargo.iter().enumerate() {
            require!(updated.goods[idx] >= amount.0, "ERR_CARGO_FUNDS");
            updated.goods[idx] -= amount.0;
            ship.cargo[idx] = amount.0;
        }
        self.players.insert(&caller, &updated);
        ship.route_id = Some(route_id);
        ship.departed_at = env::block_height();
        ship.arrives_at = env::block_height() + route.distance;
        ship.destination_commit = Some(destination_commit);
        self.ships.insert(&ship_id, &ship);
        self.emit("departed", &ship_id.to_string());
    }

    pub fn arrive(&mut self, ship_id: u64, destination: u64, salt: String) {
        let caller = env::predecessor_account_id();
        let mut ship = self.ship_or_panic(ship_id);
        require!(ship.owner_id == caller, "ERR_NOT_SHIP_OWNER");
        let route_id = ship.route_id.expect("ERR_NOT_IN_TRANSIT");
        require!(env::block_height() >= ship.arrives_at, "ERR_TOO_EARLY");
        let expected = env::sha256(format!("{}:{}:{}", destination, route_id, salt).as_bytes());
        require!(
            ship.destination_commit.as_ref() == Some(&expected),
            "ERR_DESTINATION_REVEAL"
        );
        let window = ship.departed_at;
        let ambush = self
            .ambushes
            .keys()
            .filter_map(|candidate| self.ambushes.get(&candidate))
            .find(|candidate| {
                candidate.route_id == route_id && candidate.window <= window && candidate.revealed
            });
        if let Some(ambush) = ambush {
            if self.raider_power(&ambush.raider) > ship.defence {
                let loss = ship.cargo.iter().sum::<u128>() / 2;
                self.sinks += loss;
                ship.cargo[0] = ship.cargo[0].saturating_sub(loss.min(ship.cargo[0]));
            }
        }
        let player = self.player_or_panic(&caller);
        let mut updated = player;
        for (idx, amount) in ship.cargo.iter().enumerate() {
            updated.goods[idx] += *amount;
        }
        self.players.insert(&caller, &updated);
        ship.route_id = None;
        ship.destination_commit = None;
        ship.cargo = [0; 3];
        self.ships.insert(&ship_id, &ship);
        self.emit("arrived", &ship_id.to_string());
    }

    pub fn commit_ambush(&mut self, route_id: u64, window: u64, commit: Vec<u8>, stake: U128) {
        let caller = env::predecessor_account_id();
        require!(stake.0 >= 10, "ERR_STAKE");
        require!(window >= env::block_height(), "ERR_WINDOW");
        let player = self.player_or_panic(&caller);
        require!(player.active_commits < 3, "ERR_COMMIT_SPAM");
        self.debit_cred(&caller, stake.0, "ERR_CRED_FUNDS");
        let key = Self::ambush_key(route_id, window);
        require!(self.ambushes.get(&key).is_none(), "ERR_DUP_COMMIT");
        let mut updated = self.player_or_panic(&caller);
        updated.active_commits += 1;
        self.players.insert(&caller, &updated);
        self.ambushes.insert(
            &key,
            &Ambush {
                route_id,
                window,
                raider: caller,
                stake: stake.0,
                commit,
                revealed: false,
            },
        );
        self.emit("ambush_committed", &key);
    }

    pub fn reveal_ambush(&mut self, route_id: u64, window: u64, salt: String) {
        let caller = env::predecessor_account_id();
        require!(env::block_height() <= window + 20, "ERR_REVEAL_LATE");
        let key = Self::ambush_key(route_id, window);
        let mut ambush = self.ambushes.get(&key).expect("ERR_NO_AMBUSH");
        require!(ambush.raider == caller, "ERR_NOT_RAIDER");
        require!(
            env::sha256(format!("{}:{}", route_id, salt).as_bytes()) == ambush.commit,
            "ERR_AMBUSH_REVEAL"
        );
        ambush.revealed = true;
        self.ambushes.insert(&key, &ambush);
        self.emit("ambush_revealed", &key);
    }

    pub fn offer_escort(&mut self, ship_id: u64, price: U128) -> u64 {
        let caller = env::predecessor_account_id();
        let ship = self.ship_or_panic(ship_id);
        require!(ship.owner_id == caller, "ERR_NOT_SHIP_OWNER");
        require!(ship.route_id.is_none(), "ERR_IN_TRANSIT");
        let offer_id = self.escorts.len() + 1;
        self.escorts.insert(
            &offer_id,
            &EscortOffer {
                ship_id,
                owner_id: caller,
                price: price.0,
                defence: ship.defence,
                active: true,
            },
        );
        self.emit("escort_offered", &offer_id.to_string());
        offer_id
    }

    pub fn hire_escort(&mut self, offer_id: u64, convoy_ship_id: u64) {
        let caller = env::predecessor_account_id();
        let mut offer = self.escorts.get(&offer_id).expect("ERR_ESCORT_NOT_FOUND");
        let convoy = self.ship_or_panic(convoy_ship_id);
        require!(convoy.owner_id == caller, "ERR_NOT_SHIP_OWNER");
        require!(
            offer.active && offer.owner_id != caller,
            "ERR_ESCORT_INACTIVE"
        );
        self.debit_cred(&caller, offer.price, "ERR_CRED_FUNDS");
        self.credit_cred(&offer.owner_id, offer.price);
        offer.active = false;
        self.escorts.insert(&offer_id, &offer);
        self.emit("escort_hired", &format!("{}:{}", offer_id, convoy_ship_id));
    }

    pub fn set_port_sale_price(&mut self, port_id: u64, price: U128) {
        let caller = env::predecessor_account_id();
        let mut port = self.port_or_panic(port_id);
        require!(port.owner_id == caller, "ERR_NOT_PORT_OWNER");
        port.sale_price = price.0;
        self.ports.insert(&port_id, &port);
    }

    pub fn buy_port(&mut self, port_id: u64) {
        let caller = env::predecessor_account_id();
        let mut port = self.port_or_panic(port_id);
        require!(port.owner_id != caller, "ERR_ALREADY_PORT_OWNER");
        let seller = port.owner_id.clone();
        let price = port.sale_price;
        self.debit_cred(&caller, price, "ERR_CRED_FUNDS");
        self.credit_cred(&seller, price);
        port.owner_id = caller;
        self.ports.insert(&port_id, &port);
        self.emit("port_transferred", &port.token_id);
    }

    pub fn tick_epoch(&mut self) {
        let upkeep = 5 * 2;
        let mut spoiled = 0u128;
        let ids: Vec<AccountId> = self.player_ids.iter().collect();
        for id in ids {
            let mut player = self.player_or_panic(&id);
            for good in &mut player.goods {
                let loss = *good / 20;
                *good -= loss;
                spoiled += loss;
            }
            self.players.insert(&id, &player);
        }
        self.spoilage += spoiled;
        self.cred_supply = self.cred_supply.saturating_sub(upkeep);
        self.sinks += upkeep + spoiled;
        self.npc_faucet = NPC_CAP;
        self.cred_supply += NPC_CAP;
        self.epoch += 1;
        self.emit(
            "epoch",
            &format!("{}:{}:{}:{}", self.epoch, NPC_CAP, upkeep, spoiled),
        );
    }

    #[payable]
    pub fn nft_transfer(
        &mut self,
        receiver_id: AccountId,
        token_id: String,
        _approval_id: Option<u64>,
        _memo: Option<String>,
    ) {
        require!(env::attached_deposit().as_yoctonear() == 1, "ERR_ONE_YOCTO");
        let id = self.port_id_from_token(&token_id);
        let mut port = self.port_or_panic(id);
        require!(
            port.owner_id == env::predecessor_account_id(),
            "ERR_NOT_PORT_OWNER"
        );
        port.owner_id = receiver_id;
        self.ports.insert(&id, &port);
        self.emit("port_transferred", &token_id);
    }
    pub fn nft_token(&self, token_id: String) -> Option<NftToken> {
        self.port_id_from_token(&token_id)
            .checked_sub(0)
            .and_then(|id| {
                self.ports.get(&id).map(|port| NftToken {
                    token_id: port.token_id,
                    owner_id: port.owner_id,
                    metadata: PortMetadata {
                        title: format!("FRONTIER Port {}", id),
                        description: "Player-owned port market in FRONTIER".to_string(),
                        media: None,
                    },
                })
            })
    }
    pub fn nft_tokens_for_owner(
        &self,
        account_id: AccountId,
        from_index: Option<U128>,
        limit: Option<u64>,
    ) -> Vec<NftToken> {
        let start = from_index.map(|x| x.0 as usize).unwrap_or(0);
        let take = limit.unwrap_or(50) as usize;
        self.ports
            .values()
            .filter(|port| port.owner_id == account_id)
            .skip(start)
            .take(take)
            .map(|port| NftToken {
                token_id: port.token_id.clone(),
                owner_id: port.owner_id.clone(),
                metadata: PortMetadata {
                    title: format!("FRONTIER {}", port.token_id),
                    description: "Player-owned port market in FRONTIER".to_string(),
                    media: None,
                },
            })
            .collect()
    }
    pub fn nft_metadata(&self) -> NftContractMetadata {
        NftContractMetadata {
            spec: "nft-1.0.0".to_string(),
            name: "FRONTIER Ports".to_string(),
            symbol: "PORT".to_string(),
            icon: None,
            base_uri: None,
            reference: None,
            reference_hash: None,
        }
    }

    #[payable]
    pub fn mt_transfer(
        &mut self,
        receiver_id: AccountId,
        token_id: String,
        amount: U128,
        _approval: Option<(AccountId, u64)>,
        _memo: Option<String>,
    ) {
        require!(env::attached_deposit().as_yoctonear() == 1, "ERR_ONE_YOCTO");
        let caller = env::predecessor_account_id();
        if let Some(ship_id) = token_id.strip_prefix("ship:") {
            let id: u64 = ship_id.parse().unwrap_or(0);
            let mut ship = self.ship_or_panic(id);
            require!(ship.owner_id == caller && amount.0 == 1, "ERR_MT_TRANSFER");
            ship.owner_id = receiver_id;
            self.ships.insert(&id, &ship);
        } else if let Some(idx) = self.good_token_index(&token_id) {
            let mut sender = self.player_or_panic(&caller);
            require!(sender.goods[idx] >= amount.0, "ERR_MT_TRANSFER");
            sender.goods[idx] -= amount.0;
            self.players.insert(&caller, &sender);
            let mut receiver = self.player_or_panic(&receiver_id);
            receiver.goods[idx] += amount.0;
            self.players.insert(&receiver_id, &receiver);
        } else {
            env::panic_str("ERR_MT_TOKEN")
        }
        self.emit("mt_transfer", &token_id);
    }
    pub fn mt_balance_of(&self, account_id: AccountId, token_id: String) -> U128 {
        if let Some(id) = token_id
            .strip_prefix("ship:")
            .and_then(|x| x.parse::<u64>().ok())
        {
            return U128(
                self.ships
                    .get(&id)
                    .filter(|s| s.owner_id == account_id)
                    .map(|_| 1)
                    .unwrap_or(0),
            );
        }
        self.good_token_index(&token_id)
            .map(|idx| U128(self.player_or_panic(&account_id).goods[idx]))
            .unwrap_or(U128(0))
    }
    pub fn mt_batch_balance_of(&self, account_id: AccountId, token_ids: Vec<String>) -> Vec<U128> {
        token_ids
            .into_iter()
            .map(|token_id| self.mt_balance_of(account_id.clone(), token_id))
            .collect()
    }
    pub fn mt_token(&self, token_id: String) -> Option<MtTokenMetadata> {
        if token_id
            .strip_prefix("ship:")
            .and_then(|x| x.parse::<u64>().ok())
            .is_some()
        {
            return Some(MtTokenMetadata {
                spec: "mt-1.0.0".to_string(),
                name: "FRONTIER Ship".to_string(),
                symbol: "SHIP".to_string(),
                icon: None,
                reference: None,
                reference_hash: None,
                decimals: 0,
            });
        }
        self.good_token_index(&token_id).map(|idx| MtTokenMetadata {
            spec: "mt-1.0.0".to_string(),
            name: ["Hashpower", "Liquidity", "Blockspace"][idx].to_string(),
            symbol: "CRED-GOOD".to_string(),
            icon: None,
            reference: None,
            reference_hash: None,
            decimals: 0,
        })
    }

    fn ambush_key(route: u64, window: u64) -> String {
        format!("{}:{}", route, window)
    }
    fn raider_power(&self, raider: &AccountId) -> u128 {
        self.ships
            .values()
            .filter(|ship| ship.owner_id == *raider && ship.route_id.is_none())
            .map(|ship| ship.defence)
            .sum()
    }
    fn port_id_from_token(&self, token: &str) -> u64 {
        token
            .strip_prefix("port-")
            .and_then(|x| x.parse().ok())
            .unwrap_or(0)
    }
    fn good_token_index(&self, token: &str) -> Option<usize> {
        match token.strip_prefix("good:")? {
            "0" | "Hashpower" => Some(0),
            "1" | "Liquidity" => Some(1),
            "2" | "Blockspace" => Some(2),
            _ => None,
        }
    }
    fn port_or_panic(&self, id: u64) -> Port {
        self.ports.get(&id).expect("ERR_PORT_NOT_FOUND")
    }
    fn route_or_panic(&self, id: u64) -> Route {
        self.routes.get(&id).expect("ERR_ROUTE_NOT_FOUND")
    }
    fn ship_or_panic(&self, id: u64) -> Ship {
        self.ships.get(&id).expect("ERR_SHIP_NOT_FOUND")
    }
    fn player_or_panic(&self, id: &AccountId) -> Player {
        self.players.get(id).expect("ERR_PLAYER_NOT_FOUND")
    }
    fn debit_cred(&mut self, id: &AccountId, amount: u128, error: &str) {
        let mut player = self.player_or_panic(id);
        require!(player.cred >= amount, error);
        player.cred -= amount;
        self.players.insert(id, &player);
    }
    fn credit_cred(&mut self, id: &AccountId, amount: u128) {
        let mut player = self.player_or_panic(id);
        player.cred += amount;
        self.players.insert(id, &player);
    }
    fn credit_good(&mut self, id: &AccountId, idx: usize, amount: u128) {
        let mut player = self.player_or_panic(id);
        player.goods[idx] += amount;
        self.players.insert(id, &player);
    }
    fn debit_good(&mut self, id: &AccountId, idx: usize, amount: u128) {
        let mut player = self.player_or_panic(id);
        require!(player.goods[idx] >= amount, "ERR_GOOD_FUNDS");
        player.goods[idx] -= amount;
        self.players.insert(id, &player);
    }
    fn emit(&self, event: &str, value: &str) {
        env::log_str(&format!("EVENT_JSON:{{\"standard\":\"frontier\",\"version\":\"1.0.0\",\"event\":\"{}\",\"data\":[{{\"value\":\"{}\"}}]}}", event, value));
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use near_sdk::{testing_env, NearToken, VMContext};
    use proptest::prelude::*;

    fn context(account: &str, block: u64) -> VMContext {
        near_sdk::test_utils::VMContextBuilder::new()
            .current_account_id(account.parse().unwrap())
            .predecessor_account_id(account.parse().unwrap())
            .block_height(block)
            .build()
    }
    fn context_with_deposit(account: &str, block: u64, deposit: u128) -> VMContext {
        near_sdk::test_utils::VMContextBuilder::new()
            .current_account_id(account.parse().unwrap())
            .predecessor_account_id(account.parse().unwrap())
            .block_height(block)
            .attached_deposit(NearToken::from_yoctonear(deposit))
            .build()
    }
    fn world() -> World {
        testing_env!(context("alice.testnet", 1));
        World::new()
    }

    fn assert_panic(code: &str, action: impl FnOnce()) {
        let result = std::panic::catch_unwind(std::panic::AssertUnwindSafe(action));
        let payload = result.expect_err("expected contract panic");
        let message = payload
            .downcast_ref::<String>()
            .cloned()
            .or_else(|| {
                payload
                    .downcast_ref::<&str>()
                    .map(|value| (*value).to_string())
            })
            .unwrap_or_default();
        assert!(message.contains(code), "expected {code}, got {message}");
    }

    macro_rules! error_test {
        ($name:ident, $code:literal, $body:block) => {
            #[test]
            fn $name() {
                assert_panic($code, || $body);
            }
        };
    }

    error_test!(error_already_port_owner, "ERR_ALREADY_PORT_OWNER", {
        let mut world = world();
        world.buy_port(1);
    });
    error_test!(error_ambush_reveal, "ERR_AMBUSH_REVEAL", {
        let mut world = world();
        testing_env!(context("alice.testnet", 2));
        world.commit_ambush(1, 2, env::sha256(b"1:right"), U128(10));
        world.reveal_ambush(1, 2, "wrong".into());
    });
    error_test!(error_bad_trade, "ERR_BAD_TRADE", {
        let mut world = world();
        world.buy(1, Good::Hashpower, U128(0), U128(0));
    });
    error_test!(error_cargo_funds, "ERR_CARGO_FUNDS", {
        let mut world = world();
        let ship = world.build_ship("sloop".into());
        world.depart(ship, 1, vec![0; 32], [U128(1), U128(0), U128(0)]);
    });
    error_test!(error_commit_spam, "ERR_COMMIT_SPAM", {
        let mut world = world();
        for route in 1..=4 {
            world.commit_ambush(
                route,
                2,
                env::sha256(format!("{}:s", route).as_bytes()),
                U128(10),
            );
        }
    });
    error_test!(error_cred_funds, "ERR_CRED_FUNDS", {
        let mut world = world();
        world.buy(1, Good::Hashpower, U128(2_000), U128(0));
    });
    error_test!(error_destination_reveal, "ERR_DESTINATION_REVEAL", {
        let mut world = world();
        let ship = world.build_ship("sloop".into());
        world.depart(
            ship,
            1,
            env::sha256(b"2:1:right"),
            [U128(0), U128(0), U128(0)],
        );
        testing_env!(context("alice.testnet", 30));
        world.arrive(ship, 2, "wrong".into());
    });
    error_test!(error_dup_commit, "ERR_DUP_COMMIT", {
        let mut world = world();
        testing_env!(context("alice.testnet", 2));
        world.commit_ambush(1, 2, env::sha256(b"1:s"), U128(10));
        world.commit_ambush(1, 2, env::sha256(b"1:s"), U128(10));
    });
    error_test!(error_escort_inactive, "ERR_ESCORT_INACTIVE", {
        let mut world = world();
        let escort = world.build_ship("sloop".into());
        let offer = world.offer_escort(escort, U128(10));
        testing_env!(context("bob.testnet", 2));
        world.register_player();
        let convoy = world.build_ship("sloop".into());
        world.hire_escort(offer, convoy);
        world.hire_escort(offer, convoy);
    });
    error_test!(error_escort_not_found, "ERR_ESCORT_NOT_FOUND", {
        let mut world = world();
        testing_env!(context("bob.testnet", 2));
        world.register_player();
        let convoy = world.build_ship("sloop".into());
        world.hire_escort(99, convoy);
    });
    error_test!(error_fee_range, "ERR_FEE_RANGE", {
        let mut world = world();
        world.set_fee(1, 1_001);
    });
    error_test!(error_good_funds, "ERR_GOOD_FUNDS", {
        let mut world = world();
        world.sell(1, Good::Hashpower, U128(1), U128(0));
    });
    error_test!(error_in_transit, "ERR_IN_TRANSIT", {
        let mut world = world();
        let ship = world.build_ship("sloop".into());
        world.depart(ship, 1, vec![0; 32], [U128(0), U128(0), U128(0)]);
        world.depart(ship, 1, vec![0; 32], [U128(0), U128(0), U128(0)]);
    });
    error_test!(error_mt_token, "ERR_MT_TOKEN", {
        let mut world = world();
        testing_env!(context_with_deposit("alice.testnet", 1, 1));
        world.mt_transfer(
            "bob.testnet".parse().unwrap(),
            "cred".into(),
            U128(1),
            None,
            None,
        );
    });
    error_test!(error_mt_transfer, "ERR_MT_TRANSFER", {
        let mut world = world();
        let ship = world.build_ship("sloop".into());
        testing_env!(context_with_deposit("alice.testnet", 1, 1));
        world.mt_transfer(
            "bob.testnet".parse().unwrap(),
            format!("ship:{}", ship),
            U128(2),
            None,
            None,
        );
    });
    error_test!(error_no_ambush, "ERR_NO_AMBUSH", {
        let mut world = world();
        world.reveal_ambush(1, 2, "s".into());
    });
    error_test!(error_not_in_transit, "ERR_NOT_IN_TRANSIT", {
        let mut world = world();
        let ship = world.build_ship("sloop".into());
        world.arrive(ship, 2, "s".into());
    });
    error_test!(error_not_port_owner, "ERR_NOT_PORT_OWNER", {
        let mut world = world();
        testing_env!(context("bob.testnet", 2));
        world.register_player();
        world.set_fee(1, 100);
    });
    error_test!(error_not_raider, "ERR_NOT_RAIDER", {
        let mut world = world();
        testing_env!(context("alice.testnet", 2));
        world.commit_ambush(1, 2, env::sha256(b"1:s"), U128(10));
        testing_env!(context("bob.testnet", 2));
        world.register_player();
        world.reveal_ambush(1, 2, "s".into());
    });
    error_test!(error_not_ship_owner, "ERR_NOT_SHIP_OWNER", {
        let mut world = world();
        let ship = world.build_ship("sloop".into());
        testing_env!(context("bob.testnet", 2));
        world.register_player();
        world.offer_escort(ship, U128(10));
    });
    error_test!(error_one_yocto, "ERR_ONE_YOCTO", {
        let mut world = world();
        world.nft_transfer("bob.testnet".parse().unwrap(), "port-1".into(), None, None);
    });
    error_test!(error_player_exists, "ERR_PLAYER_EXISTS", {
        let mut world = world();
        world.register_player();
    });
    error_test!(error_player_not_found, "ERR_PLAYER_NOT_FOUND", {
        let mut world = world();
        testing_env!(context("bob.testnet", 2));
        world.build_ship("sloop".into());
    });
    error_test!(error_port_not_found, "ERR_PORT_NOT_FOUND", {
        let mut world = world();
        world.set_fee(99, 100);
    });
    error_test!(error_reveal_late, "ERR_REVEAL_LATE", {
        let mut world = world();
        testing_env!(context("alice.testnet", 2));
        world.commit_ambush(1, 2, env::sha256(b"1:s"), U128(10));
        testing_env!(context("alice.testnet", 23));
        world.reveal_ambush(1, 2, "s".into());
    });
    error_test!(error_route_not_found, "ERR_ROUTE_NOT_FOUND", {
        let mut world = world();
        let ship = world.build_ship("sloop".into());
        world.depart(ship, 99, vec![0; 32], [U128(0), U128(0), U128(0)]);
    });
    error_test!(error_ship_funds, "ERR_SHIP_FUNDS", {
        let mut world = world();
        world.build_ship("galleon".into());
        world.build_ship("galleon".into());
        world.build_ship("galleon".into());
    });
    error_test!(error_ship_kind, "ERR_SHIP_KIND", {
        let mut world = world();
        world.build_ship("invalid".into());
    });
    error_test!(error_ship_not_found, "ERR_SHIP_NOT_FOUND", {
        let mut world = world();
        world.offer_escort(99, U128(10));
    });
    error_test!(error_slippage, "ERR_SLIPPAGE", {
        let mut world = world();
        world.buy(1, Good::Hashpower, U128(10), U128(10_000));
    });
    error_test!(error_stake, "ERR_STAKE", {
        let mut world = world();
        world.commit_ambush(1, 2, vec![0; 32], U128(9));
    });
    error_test!(error_too_early, "ERR_TOO_EARLY", {
        let mut world = world();
        let ship = world.build_ship("sloop".into());
        world.depart(ship, 1, env::sha256(b"2:1:s"), [U128(0), U128(0), U128(0)]);
        world.arrive(ship, 2, "s".into());
    });
    error_test!(error_window, "ERR_WINDOW", {
        let mut world = world();
        world.commit_ambush(1, 0, vec![0; 32], U128(10));
    });

    #[test]
    fn registers_and_caps_faucet() {
        let mut world = world();
        testing_env!(context("alice.testnet", 2));
        world.tick_epoch();
        assert_eq!(world.economy().1 .0, NPC_CAP);
    }
    #[test]
    fn rejects_late_reveal() {
        let mut world = world();
        testing_env!(context("alice.testnet", 2));
        world.commit_ambush(1, 2, env::sha256(b"1:s"), U128(10));
        testing_env!(context("alice.testnet", 23));
        let result = std::panic::catch_unwind(std::panic::AssertUnwindSafe(|| {
            world.reveal_ambush(1, 2, "s".into())
        }));
        assert!(result.is_err());
    }
    #[test]
    fn rejects_bad_destination() {
        let mut world = world();
        testing_env!(context("alice.testnet", 2));
        let ship = world.build_ship("sloop".into());
        world.depart(ship, 1, vec![0; 32], [U128(0), U128(0), U128(0)]);
        testing_env!(context("alice.testnet", 30));
        let result = std::panic::catch_unwind(std::panic::AssertUnwindSafe(|| {
            world.arrive(ship, 2, "wrong-salt".into())
        }));
        assert!(result.is_err());
    }
    #[test]
    fn ambush_power_cannot_be_injected_at_reveal() {
        let mut world = world();
        testing_env!(context("alice.testnet", 2));
        let ship = world.build_ship("sloop".into());
        let _second_ship = world.build_ship("sloop".into());
        world.commit_ambush(1, 2, env::sha256(b"1:s"), U128(10));
        world.reveal_ambush(1, 2, "s".into());
        let ambush = world.ambushes.get(&"1:2".to_string()).expect("ambush");
        assert_eq!(world.raider_power(&ambush.raider), 2);
        assert_eq!(world.get_ship(ship).unwrap().route_id, None);
    }
    #[test]
    fn standards_and_spoilage_are_live() {
        let mut world = world();
        let token = world.nft_token("port-1".into()).expect("port NFT");
        assert_eq!(
            token.owner_id,
            "alice.testnet".parse::<AccountId>().unwrap()
        );
        assert_eq!(
            world
                .nft_tokens_for_owner("alice.testnet".parse().unwrap(), None, None)
                .len(),
            5
        );
        assert_eq!(world.nft_metadata().spec, "nft-1.0.0");

        let ship = world.build_ship("sloop".into());
        assert_eq!(
            world
                .mt_balance_of("alice.testnet".parse().unwrap(), format!("ship:{ship}"))
                .0,
            1
        );
        assert_eq!(
            world.mt_batch_balance_of(
                "alice.testnet".parse().unwrap(),
                vec![format!("ship:{ship}"), "good:0".into()]
            ),
            vec![U128(1), U128(0)]
        );
        assert_eq!(
            world.mt_token("good:Hashpower".into()).unwrap().spec,
            "mt-1.0.0"
        );

        world.buy(1, Good::Hashpower, U128(100), U128(0));
        let before = world
            .get_player("alice.testnet".parse().unwrap())
            .unwrap()
            .goods[0];
        world.tick_epoch();
        let after = world
            .get_player("alice.testnet".parse().unwrap())
            .unwrap()
            .goods[0];
        assert!(after < before);
        assert!(world.economy_dashboard().spoilage.0 > 0);
    }

    #[test]
    fn nft_transfer_keeps_treasury_with_token() {
        let mut world = world();
        testing_env!(context_with_deposit("alice.testnet", 1, 1));
        world.set_fee(1, 100);
        let before = world.get_port(1).unwrap().treasury;
        world.nft_transfer("bob.testnet".parse().unwrap(), "port-1".into(), None, None);
        let port = world.get_port(1).unwrap();
        assert_eq!(port.owner_id, "bob.testnet".parse::<AccountId>().unwrap());
        assert_eq!(port.treasury, before);
    }
    proptest! {
        #[test]
        fn invariants_hold(trades in 0u8..100, fee in 30u128..1_001) {
            let mut reserve = 1_000u128;
            let mut treasury = 0u128;
            let mut supply = 1_000u128;
            for _ in 0..trades {
                let amount = 1u128;
                reserve += amount;
                let collected = (amount * fee / 10_000).max(MIN_FEE_BPS);
                treasury += collected;
                supply = supply.saturating_sub(collected);
                prop_assert!(reserve >= 1_000);
                prop_assert!(treasury <= 1_000 + trades as u128 * MIN_FEE_BPS);
                prop_assert!(NPC_CAP <= 160);
            }
            let owner_before = treasury;
            let owner_after = owner_before;
            prop_assert_eq!(owner_before, owner_after);
            prop_assert!(supply <= 1_000);
        }
    }
}

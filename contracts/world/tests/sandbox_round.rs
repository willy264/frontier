//! Sandbox acceptance round for the FRONTIER MVP.
//! The test is intentionally ignored on ordinary unit-test runs because it downloads
//! and starts a near-sandbox binary; run it with `cargo test --test sandbox_round -- --ignored`.

#[tokio::test]
#[ignore]
async fn three_player_round_with_escort_raid_port_sale_and_key_boundary() -> anyhow::Result<()> {
    use near_workspaces::types::{AccessKey, KeyType, NearToken, SecretKey};
    use near_workspaces::Account;
    use sha2::{Digest, Sha256};

    let worker = near_workspaces::sandbox().await?;
    let wasm = near_workspaces::compile_project(".").await?;
    let contract = worker.dev_deploy(&wasm).await?;
    contract.call("new").transact().await?.into_result()?;

    let p1 = worker.dev_create_account().await?;
    let p2 = worker.dev_create_account().await?;
    let p3 = worker.dev_create_account().await?;
    for player in [&p1, &p2, &p3] {
        player
            .call(contract.id(), "register_player")
            .transact()
            .await?
            .into_result()?;
    }

    p1.call(contract.id(), "buy_port")
        .args_json(serde_json::json!({"port_id": 1}))
        .transact()
        .await?
        .into_result()?;
    let s1 = p1
        .call(contract.id(), "build_ship")
        .args_json(serde_json::json!({"kind": "sloop"}))
        .transact()
        .await?
        .into_result()?;
    let s2 = p2
        .call(contract.id(), "build_ship")
        .args_json(serde_json::json!({"kind": "sloop"}))
        .transact()
        .await?
        .into_result()?;
    let ship_1: u64 = s1.json()?;
    let ship_2: u64 = s2.json()?;
    let offer = p1
        .call(contract.id(), "offer_escort")
        .args_json(serde_json::json!({"ship_id": ship_1, "price": "20"}))
        .transact()
        .await?
        .into_result()?;
    let offer_id: u64 = offer.json()?;
    p2.call(contract.id(), "hire_escort")
        .args_json(serde_json::json!({"offer_id": offer_id, "convoy_ship_id": ship_2}))
        .transact()
        .await?
        .into_result()?;

    let convoy_salt = "convoy-salt";
    let convoy_commit =
        Sha256::digest(format!("{}:{}:{}", 2, convoy_salt, ship_2).as_bytes()).to_vec();
    let raid_salt = "raid-salt";
    let ambush_window = worker.view_block().await?.header().height() + 5;
    let raid_commit =
        Sha256::digest(format!("{}:{}:{}:{}", 1, ambush_window, raid_salt, p3.id()).as_bytes())
            .to_vec();
    p3.call(contract.id(), "commit_ambush")
        .args_json(
            serde_json::json!({"window_start": ambush_window, "commit": raid_commit, "stake": "10"}),
        )
        .transact()
        .await?
        .into_result()?;
    p2.call(contract.id(), "depart").args_json(serde_json::json!({"ship_id": ship_2, "origin_port": 1, "destination_commit": convoy_commit, "cargo": ["0", "0", "0"]})).transact().await?.into_result()?;
    p3.call(contract.id(), "reveal_ambush")
        .args_json(serde_json::json!({"commit_id": raid_commit, "route_id": 1, "salt": raid_salt}))
        .transact()
        .await?
        .into_result()?;
    worker.fast_forward(20).await?;
    p2.call(contract.id(), "arrive")
        .args_json(serde_json::json!({"ship_id": ship_2, "route_id": 1, "destination": 2, "salt": convoy_salt}))
        .transact()
        .await?
        .into_result()?;

    p1.call(contract.id(), "set_port_sale_price")
        .args_json(serde_json::json!({"port_id": 1, "price": "25"}))
        .transact()
        .await?
        .into_result()?;
    p2.call(contract.id(), "buy_port")
        .args_json(serde_json::json!({"port_id": 1}))
        .transact()
        .await?
        .into_result()?;
    assert_eq!(
        contract
            .view("get_port")
            .args_json(serde_json::json!({"port_id": 1}))
            .await?
            .json::<serde_json::Value>()?["owner_id"],
        p2.id().to_string()
    );

    // A key restricted to register_player cannot call build_ship.
    let session_key = SecretKey::from_random(KeyType::ED25519);
    p2.batch(p2.id())
        .add_key(
            session_key.public_key(),
            AccessKey::function_call_access(
                contract.id(),
                &["register_player"],
                Some(NearToken::from_near(1)),
            ),
        )
        .transact()
        .await?
        .into_result()?;
    let restricted = Account::from_secret_key(p2.id().clone(), session_key, &worker);
    let forbidden = restricted
        .call(contract.id(), "build_ship")
        .args_json(serde_json::json!({"kind": "sloop"}))
        .transact()
        .await;
    assert!(forbidden.is_err() || forbidden.as_ref().is_ok_and(|outcome| outcome.is_failure()));
    Ok(())
}

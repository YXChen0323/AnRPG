// 遊戲狀態
const gameState = {
    player: {
        name: '冒險者',
        level: 1,
        exp: 0,
        expToNext: 100,
        health: 100,
        maxHealth: 100,
        attack: 10,
        defense: 5,
        gold: 0,
        critChance: 0.1,      // 10% 暴擊率
        dodgeChance: 0.05,    // 5% 閃避率
        kills: 0,              // 擊殺數
        bossKills: 0,         // Boss擊殺數
        totalGold: 0          // 總獲得金幣
    },
    currentLocation: {
        name: '起始村莊',
        description: '你站在一個寧靜的村莊入口，遠處傳來怪物的低吼聲...',
        type: 'village'
    },
    currentEnemy: null,
    locations: [
        {
            name: '起始村莊',
            description: '你站在一個寧靜的村莊入口，遠處傳來怪物的低吼聲...',
            type: 'village',
            enemyLevel: 1,
            goldMultiplier: 1.0
        },
        {
            name: '黑暗森林',
            description: '陰森的樹林中傳來陣陣低吼，危險潛伏在每個角落...',
            type: 'forest',
            enemyLevel: 2,
            goldMultiplier: 1.2
        },
        {
            name: '荒蕪平原',
            description: '一望無際的平原上，強風呼嘯而過，遠處有巨大的身影在移動...',
            type: 'plains',
            enemyLevel: 3,
            goldMultiplier: 1.5
        },
        {
            name: '惡魔洞穴',
            description: '深不見底的洞穴中，散發著邪惡的氣息，這裡是Boss的巢穴...',
            type: 'cave',
            enemyLevel: 4,
            goldMultiplier: 2.0
        }
    ],
    enemies: [
        { name: '哥布林', baseHealth: 30, baseAttack: 5, baseDefense: 2, baseExp: 20, baseGold: 10 },
        { name: '野狼', baseHealth: 40, baseAttack: 7, baseDefense: 3, baseExp: 30, baseGold: 15 },
        { name: '骷髏兵', baseHealth: 50, baseAttack: 8, baseDefense: 4, baseExp: 40, baseGold: 20 },
        { name: '獸人', baseHealth: 60, baseAttack: 10, baseDefense: 5, baseExp: 50, baseGold: 25 }
    ],
    bosses: [
        { name: '暗黑騎士', baseHealth: 150, baseAttack: 15, baseDefense: 8, baseExp: 200, baseGold: 100 },
        { name: '惡魔領主', baseHealth: 250, baseAttack: 20, baseDefense: 12, baseExp: 400, baseGold: 200 },
        { name: '終極魔王', baseHealth: 500, baseAttack: 30, baseDefense: 20, baseExp: 1000, baseGold: 500 }
    ],
    shop: [
        { name: '生命藥水', type: 'heal', value: 50, cost: 25, description: '恢復50點生命值', stock: -1 },
        { name: '大生命藥水', type: 'heal', value: 100, cost: 50, description: '恢復100點生命值', stock: -1 },
        { name: '攻擊藥劑', type: 'attack', value: 3, cost: 60, description: '永久增加3點攻擊力', stock: -1 },
        { name: '防禦藥劑', type: 'defense', value: 3, cost: 60, description: '永久增加3點防禦力', stock: -1 },
        { name: '生命上限藥劑', type: 'maxHealth', value: 20, cost: 100, description: '永久增加20點最大生命值', stock: -1 },
        { name: '暴擊藥劑', type: 'critChance', value: 0.05, cost: 150, description: '永久增加5%暴擊率', stock: -1 },
        { name: '閃避藥劑', type: 'dodgeChance', value: 0.03, cost: 150, description: '永久增加3%閃避率', stock: -1 }
    ],
    quests: [
        { id: 1, name: '新手任務', description: '擊敗3隻怪物', target: 'kills', targetValue: 3, reward: { gold: 50, exp: 30 }, completed: false },
        { id: 2, name: '怪物獵人', description: '擊敗10隻怪物', target: 'kills', targetValue: 10, reward: { gold: 150, exp: 100 }, completed: false },
        { id: 3, name: 'Boss挑戰者', description: '擊敗1個Boss', target: 'bossKills', targetValue: 1, reward: { gold: 200, exp: 200 }, completed: false },
        { id: 4, name: '財富累積', description: '累積獲得500金幣', target: 'totalGold', targetValue: 500, reward: { gold: 100, exp: 150 }, completed: false }
    ],
    achievements: [
        { id: 1, name: '初出茅廬', description: '達到5級', target: 'level', targetValue: 5, unlocked: false },
        { id: 2, name: '怪物殺手', description: '擊敗50隻怪物', target: 'kills', targetValue: 50, unlocked: false },
        { id: 3, name: 'Boss終結者', description: '擊敗5個Boss', target: 'bossKills', targetValue: 5, unlocked: false },
        { id: 4, name: '百萬富翁', description: '累積獲得1000金幣', target: 'totalGold', targetValue: 1000, unlocked: false }
    ]
};

// DOM 元素
const elements = {
    healthFill: document.getElementById('healthFill'),
    healthText: document.getElementById('healthText'),
    level: document.getElementById('level'),
    exp: document.getElementById('exp'),
    attack: document.getElementById('attack'),
    defense: document.getElementById('defense'),
    gold: document.getElementById('gold'),
    locationName: document.getElementById('locationName'),
    locationDescription: document.getElementById('locationDescription'),
    battleArea: document.getElementById('battleArea'),
    enemyName: document.getElementById('enemyName'),
    enemyHealthFill: document.getElementById('enemyHealthFill'),
    enemyHealthText: document.getElementById('enemyHealthText'),
    logArea: document.getElementById('logArea'),
    exploreBtn: document.getElementById('exploreBtn'),
    battleBtn: document.getElementById('battleBtn'),
    bossBtn: document.getElementById('bossBtn'),
    restBtn: document.getElementById('restBtn'),
    shopBtn: document.getElementById('shopBtn'),
    enemyPanel: document.getElementById('enemyPanel'),
    enemyDetails: document.getElementById('enemyDetails'),
    shopModal: document.getElementById('shopModal'),
    shopItems: document.getElementById('shopItems'),
    closeShop: document.getElementById('closeShop'),
    locationSelect: document.getElementById('locationSelect'),
    moveBtn: document.getElementById('moveBtn')
};

// 初始化遊戲
function initGame() {
    updateUI();
    addLog('遊戲開始！歡迎來到文字RPG世界！');
    addLog('點擊「探索」按鈕開始你的冒險吧！');
    checkQuests();
    checkAchievements();
}

// 更新UI
function updateUI() {
    const player = gameState.player;
    
    // 更新生命值
    const healthPercent = (player.health / player.maxHealth) * 100;
    elements.healthFill.style.width = healthPercent + '%';
    elements.healthText.textContent = `${player.health}/${player.maxHealth}`;
    
    // 更新其他狀態
    elements.level.textContent = player.level;
    elements.exp.textContent = `${player.exp}/${player.expToNext}`;
    elements.attack.textContent = player.attack;
    elements.defense.textContent = player.defense;
    elements.gold.textContent = player.gold;
    
    // 更新位置資訊
    elements.locationName.textContent = gameState.currentLocation.name;
    elements.locationDescription.textContent = gameState.currentLocation.description;
}

// 添加日誌
function addLog(message, type = 'info') {
    const logEntry = document.createElement('p');
    logEntry.className = 'log-entry';
    logEntry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
    elements.logArea.appendChild(logEntry);
    elements.logArea.scrollTop = elements.logArea.scrollHeight;
}

// 計算敵人屬性（根據地點等級）
function calculateEnemyStats(baseEnemy, locationLevel) {
    const multiplier = 1 + (locationLevel - 1) * 0.3;
    return {
        name: baseEnemy.name,
        health: Math.floor(baseEnemy.baseHealth * multiplier),
        maxHealth: Math.floor(baseEnemy.baseHealth * multiplier),
        attack: Math.floor(baseEnemy.baseAttack * multiplier),
        defense: Math.floor(baseEnemy.baseDefense * multiplier),
        exp: Math.floor(baseEnemy.baseExp * multiplier),
        gold: Math.floor(baseEnemy.baseGold * multiplier * gameState.currentLocation.goldMultiplier)
    };
}

// 探索功能
function explore() {
    if (gameState.currentEnemy) {
        addLog('你正在戰鬥中，無法探索！');
        return;
    }
    
    const location = gameState.currentLocation;
    addLog(`你在${location.name}中探索...`);
    
    // 根據位置類型決定遇到什麼
    setTimeout(() => {
        const rand = Math.random();
        
        if (location.type === 'cave') {
            // 洞穴中只會遇到Boss
            if (rand < 0.25) {
                encounterBoss();
            } else if (rand < 0.4) {
                findTreasure();
            } else {
                addLog('你在洞穴深處探索，但沒有發現Boss...');
            }
        } else {
            // 其他地點可能遇到普通怪物或事件
            if (rand < 0.5) {
                encounterEnemy();
            } else if (rand < 0.7) {
                findGold();
            } else if (rand < 0.85) {
                randomEvent();
            } else if (rand < 0.95) {
                findTreasure();
            } else {
                addLog('你探索了一番，但沒有發現任何東西...');
            }
        }
    }, 500);
}

// 遇到敵人
function encounterEnemy() {
    const enemyIndex = Math.floor(Math.random() * gameState.enemies.length);
    const baseEnemy = gameState.enemies[enemyIndex];
    const location = gameState.currentLocation;
    
    gameState.currentEnemy = calculateEnemyStats(baseEnemy, location.enemyLevel);
    
    addLog(`你遇到了${gameState.currentEnemy.name}！`);
    showBattleUI();
    updateEnemyUI();
}

// 遇到Boss
function encounterBoss() {
    const location = gameState.currentLocation;
    const bossIndex = Math.min(
        Math.floor((gameState.player.level - 1) / 3),
        gameState.bosses.length - 1
    );
    const baseBoss = gameState.bosses[bossIndex];
    
    // Boss根據玩家等級調整
    const levelMultiplier = 1 + (gameState.player.level - 1) * 0.2;
    gameState.currentEnemy = {
        name: baseBoss.name,
        health: Math.floor(baseBoss.baseHealth * levelMultiplier),
        maxHealth: Math.floor(baseBoss.baseHealth * levelMultiplier),
        attack: Math.floor(baseBoss.baseAttack * levelMultiplier),
        defense: Math.floor(baseBoss.baseDefense * levelMultiplier),
        exp: Math.floor(baseBoss.baseExp * levelMultiplier),
        gold: Math.floor(baseBoss.baseGold * levelMultiplier * location.goldMultiplier),
        isBoss: true
    };
    
    addLog(`強大的${gameState.currentEnemy.name}出現了！`);
    showBattleUI();
    updateEnemyUI();
}

// 找到金幣
function findGold() {
    const location = gameState.currentLocation;
    const baseGold = Math.floor(Math.random() * 30) + 10;
    const goldFound = Math.floor(baseGold * location.goldMultiplier);
    gameState.player.gold += goldFound;
    gameState.player.totalGold += goldFound;
    addLog(`你找到了${goldFound}枚金幣！`);
    updateUI();
    checkQuests();
}

// 找到寶箱
function findTreasure() {
    const location = gameState.currentLocation;
    const rand = Math.random();
    
    if (rand < 0.4) {
        // 金幣寶箱
        const gold = Math.floor((Math.random() * 100 + 50) * location.goldMultiplier);
        gameState.player.gold += gold;
        gameState.player.totalGold += gold;
        addLog(`你發現了一個寶箱！獲得${gold}枚金幣！`);
    } else if (rand < 0.7) {
        // 經驗值
        const exp = Math.floor((Math.random() * 50 + 30) * location.enemyLevel);
        gameState.player.exp += exp;
        addLog(`你發現了一個經驗水晶！獲得${exp}點經驗值！`);
        checkLevelUp();
    } else {
        // 生命值恢復
        const heal = Math.floor(gameState.player.maxHealth * 0.5);
        gameState.player.health = Math.min(gameState.player.maxHealth, gameState.player.health + heal);
        addLog(`你發現了一個治療泉水！恢復了${heal}點生命值！`);
    }
    
    updateUI();
    checkQuests();
}

// 隨機事件
function randomEvent() {
    const events = [
        {
            name: '神秘商人',
            action: () => {
                const discount = Math.floor(Math.random() * 20 + 10);
                addLog(`你遇到了神秘商人，他給你${discount}枚金幣作為見面禮！`);
                gameState.player.gold += discount;
                gameState.player.totalGold += discount;
            }
        },
        {
            name: '訓練場',
            action: () => {
                const expGain = Math.floor(Math.random() * 30 + 20);
                addLog(`你發現了一個訓練場，進行訓練獲得${expGain}點經驗值！`);
                gameState.player.exp += expGain;
                checkLevelUp();
            }
        },
        {
            name: '受傷的旅人',
            action: () => {
                const gold = Math.floor(Math.random() * 40 + 20);
                addLog(`你幫助了一位受傷的旅人，他給了你${gold}枚金幣作為報酬！`);
                gameState.player.gold += gold;
                gameState.player.totalGold += gold;
            }
        },
        {
            name: '危險陷阱',
            action: () => {
                const damage = Math.floor(gameState.player.maxHealth * 0.1);
                gameState.player.health = Math.max(1, gameState.player.health - damage);
                addLog(`你不小心觸發了陷阱，受到${damage}點傷害！`);
            }
        }
    ];
    
    const event = events[Math.floor(Math.random() * events.length)];
    addLog(`你遇到了特殊事件：${event.name}！`);
    event.action();
    updateUI();
    checkQuests();
}

// 顯示戰鬥UI
function showBattleUI() {
    elements.battleArea.style.display = 'block';
    elements.battleBtn.style.display = 'inline-block';
    elements.enemyPanel.style.display = 'block';
    elements.exploreBtn.disabled = true;
}

// 隱藏戰鬥UI
function hideBattleUI() {
    elements.battleArea.style.display = 'none';
    elements.battleBtn.style.display = 'none';
    elements.bossBtn.style.display = 'none';
    elements.enemyPanel.style.display = 'none';
    elements.exploreBtn.disabled = false;
    gameState.currentEnemy = null;
}

// 更新敵人UI
function updateEnemyUI() {
    if (!gameState.currentEnemy) return;
    
    const enemy = gameState.currentEnemy;
    elements.enemyName.textContent = enemy.name + (enemy.isBoss ? ' [BOSS]' : '');
    
    const healthPercent = (enemy.health / enemy.maxHealth) * 100;
    elements.enemyHealthFill.style.width = healthPercent + '%';
    elements.enemyHealthText.textContent = `${enemy.health}/${enemy.maxHealth}`;
    
    // 更新敵人詳細資訊
    elements.enemyDetails.innerHTML = `
        <p><strong>生命值:</strong> ${enemy.health}/${enemy.maxHealth}</p>
        <p><strong>攻擊力:</strong> ${enemy.attack}</p>
        <p><strong>防禦力:</strong> ${enemy.defense}</p>
        <p><strong>經驗值:</strong> ${enemy.exp}</p>
        <p><strong>金幣:</strong> ${enemy.gold}</p>
    `;
}

// 計算傷害（包含暴擊）
function calculateDamage(attacker, defender, isPlayer = false) {
    let baseDamage = attacker.attack - defender.defense;
    if (baseDamage < 1) baseDamage = 1;
    
    // 傷害波動（±20%）
    const variance = 0.2;
    const damageMultiplier = 1 + (Math.random() * 2 - 1) * variance;
    let finalDamage = Math.floor(baseDamage * damageMultiplier);
    
    // 暴擊判定
    if (isPlayer && Math.random() < gameState.player.critChance) {
        finalDamage = Math.floor(finalDamage * 2);
        return { damage: finalDamage, isCrit: true };
    }
    
    return { damage: finalDamage, isCrit: false };
}

// 戰鬥
function battle() {
    if (!gameState.currentEnemy) {
        addLog('沒有敵人可以戰鬥！');
        return;
    }
    
    const player = gameState.player;
    const enemy = gameState.currentEnemy;
    
    // 玩家攻擊
    const playerAttack = calculateDamage(player, enemy, true);
    enemy.health -= playerAttack.damage;
    
    if (playerAttack.isCrit) {
        addLog(`暴擊！你對${enemy.name}造成了${playerAttack.damage}點傷害！`);
    } else {
        addLog(`你對${enemy.name}造成了${playerAttack.damage}點傷害！`);
    }
    
    if (enemy.health <= 0) {
        enemy.health = 0;
        victory(enemy);
        return;
    }
    
    updateEnemyUI();
    
    // 敵人反擊
    setTimeout(() => {
        // 閃避判定
        if (Math.random() < player.dodgeChance) {
            addLog(`你成功閃避了${enemy.name}的攻擊！`);
            updateUI();
            return;
        }
        
        const enemyAttack = calculateDamage(enemy, player, false);
        player.health -= enemyAttack.damage;
        addLog(`${enemy.name}對你造成了${enemyAttack.damage}點傷害！`);
        
        if (player.health <= 0) {
            player.health = 0;
            gameOver();
            return;
        }
        
        updateUI();
    }, 300);
}

// 挑戰Boss
function challengeBoss() {
    if (gameState.currentLocation.type !== 'cave') {
        addLog('只有在惡魔洞穴中才能挑戰Boss！');
        return;
    }
    
    encounterBoss();
}

// 勝利
function victory(enemy) {
    addLog(`你擊敗了${enemy.name}！`);
    
    // 獲得經驗值
    gameState.player.exp += enemy.exp;
    addLog(`獲得${enemy.exp}點經驗值！`);
    
    // 獲得金幣
    gameState.player.gold += enemy.gold;
    gameState.player.totalGold += enemy.gold;
    addLog(`獲得${enemy.gold}枚金幣！`);
    
    // 更新擊殺數
    if (enemy.isBoss) {
        gameState.player.bossKills++;
    } else {
        gameState.player.kills++;
    }
    
    // 檢查升級
    checkLevelUp();
    
    // 檢查任務和成就
    checkQuests();
    checkAchievements();
    
    updateUI();
    hideBattleUI();
}

// 檢查升級
function checkLevelUp() {
    while (gameState.player.exp >= gameState.player.expToNext) {
        gameState.player.exp -= gameState.player.expToNext;
        gameState.player.level++;
        gameState.player.expToNext = Math.floor(gameState.player.expToNext * 1.5);
        
        // 升級獎勵
        gameState.player.maxHealth += 20;
        gameState.player.health = gameState.player.maxHealth;
        gameState.player.attack += 3;
        gameState.player.defense += 2;
        
        addLog(`恭喜升級！你現在是${gameState.player.level}級！`);
        addLog('生命值、攻擊力、防禦力都提升了！');
        
        checkAchievements();
    }
    updateUI();
}

// 遊戲結束
function gameOver() {
    addLog('你被擊敗了！');
    addLog('點擊「休息」可以恢復生命值並繼續遊戲。');
    elements.battleBtn.disabled = true;
    elements.bossBtn.disabled = true;
}

// 休息
function rest() {
    if (gameState.currentEnemy) {
        addLog('戰鬥中無法休息！');
        return;
    }
    
    const healAmount = Math.floor(gameState.player.maxHealth * 0.3);
    gameState.player.health = Math.min(
        gameState.player.maxHealth,
        gameState.player.health + healAmount
    );
    
    addLog(`你休息了一會兒，恢復了${healAmount}點生命值。`);
    updateUI();
    
    // 重新啟用按鈕
    elements.battleBtn.disabled = false;
    elements.bossBtn.disabled = false;
}

// 移動到新地點
function moveToLocation() {
    if (gameState.currentEnemy) {
        addLog('戰鬥中無法移動！');
        return;
    }
    
    const locationIndex = parseInt(elements.locationSelect.value);
    const newLocation = gameState.locations[locationIndex];
    
    if (gameState.currentLocation.name === newLocation.name) {
        addLog('你已經在這個地點了！');
        return;
    }
    
    gameState.currentLocation = { ...newLocation };
    addLog(`你來到了${gameState.currentLocation.name}。`);
    updateUI();
    
    // 更新選擇器顯示
    elements.locationSelect.value = locationIndex;
}

// 檢查任務
function checkQuests() {
    gameState.quests.forEach(quest => {
        if (quest.completed) return;
        
        let currentValue = 0;
        switch (quest.target) {
            case 'kills':
                currentValue = gameState.player.kills;
                break;
            case 'bossKills':
                currentValue = gameState.player.bossKills;
                break;
            case 'totalGold':
                currentValue = gameState.player.totalGold;
                break;
        }
        
        if (currentValue >= quest.targetValue) {
            quest.completed = true;
            gameState.player.gold += quest.reward.gold;
            gameState.player.exp += quest.reward.exp;
            gameState.player.totalGold += quest.reward.gold;
            addLog(`任務完成：${quest.name}！獲得${quest.reward.gold}金幣和${quest.reward.exp}經驗值！`);
            checkLevelUp();
            updateUI();
        }
    });
}

// 檢查成就
function checkAchievements() {
    gameState.achievements.forEach(achievement => {
        if (achievement.unlocked) return;
        
        let currentValue = 0;
        switch (achievement.target) {
            case 'level':
                currentValue = gameState.player.level;
                break;
            case 'kills':
                currentValue = gameState.player.kills;
                break;
            case 'bossKills':
                currentValue = gameState.player.bossKills;
                break;
            case 'totalGold':
                currentValue = gameState.player.totalGold;
                break;
        }
        
        if (currentValue >= achievement.targetValue) {
            achievement.unlocked = true;
            addLog(`成就解鎖：${achievement.name}！`);
        }
    });
}

// 打開商店
function openShop() {
    if (gameState.currentEnemy) {
        addLog('戰鬥中無法進入商店！');
        return;
    }
    
    elements.shopItems.innerHTML = '';
    
    gameState.shop.forEach((item, index) => {
        const shopItem = document.createElement('div');
        shopItem.className = 'shop-item';
        
        const canAfford = gameState.player.gold >= item.cost;
        const isOutOfStock = item.stock === 0;
        
        shopItem.innerHTML = `
            <h4>${item.name}</h4>
            <p>${item.description}</p>
            <p><strong>價格: ${item.cost} 金幣</strong></p>
            <button ${!canAfford || isOutOfStock ? 'disabled' : ''} onclick="buyItem(${index})">
                ${isOutOfStock ? '已售完' : !canAfford ? '金幣不足' : '購買'}
            </button>
        `;
        
        elements.shopItems.appendChild(shopItem);
    });
    
    elements.shopModal.style.display = 'block';
}

// 購買物品
function buyItem(index) {
    const item = gameState.shop[index];
    const player = gameState.player;
    
    if (player.gold < item.cost) {
        addLog('金幣不足！');
        return;
    }
    
    if (item.stock === 0) {
        addLog('該物品已售完！');
        return;
    }
    
    player.gold -= item.cost;
    
    switch (item.type) {
        case 'heal':
            player.health = Math.min(player.maxHealth, player.health + item.value);
            addLog(`使用了${item.name}，恢復了${item.value}點生命值！`);
            break;
        case 'attack':
            player.attack += item.value;
            addLog(`使用了${item.name}，攻擊力永久增加${item.value}點！`);
            break;
        case 'defense':
            player.defense += item.value;
            addLog(`使用了${item.name}，防禦力永久增加${item.value}點！`);
            break;
        case 'maxHealth':
            player.maxHealth += item.value;
            player.health += item.value;
            addLog(`使用了${item.name}，最大生命值永久增加${item.value}點！`);
            break;
        case 'critChance':
            player.critChance += item.value;
            addLog(`使用了${item.name}，暴擊率永久增加${Math.floor(item.value * 100)}%！`);
            break;
        case 'dodgeChance':
            player.dodgeChance += item.value;
            addLog(`使用了${item.name}，閃避率永久增加${Math.floor(item.value * 100)}%！`);
            break;
    }
    
    if (item.stock > 0) {
        item.stock--;
    }
    
    updateUI();
    openShop(); // 刷新商店
}

// 關閉商店
function closeShop() {
    elements.shopModal.style.display = 'none';
}

// 事件監聽器
elements.exploreBtn.addEventListener('click', explore);
elements.battleBtn.addEventListener('click', battle);
elements.bossBtn.addEventListener('click', challengeBoss);
elements.restBtn.addEventListener('click', rest);
elements.shopBtn.addEventListener('click', openShop);
elements.closeShop.addEventListener('click', closeShop);
elements.moveBtn.addEventListener('click', moveToLocation);

// 點擊模態框外部關閉
window.addEventListener('click', (e) => {
    if (e.target === elements.shopModal) {
        closeShop();
    }
});

// 初始化遊戲
initGame();

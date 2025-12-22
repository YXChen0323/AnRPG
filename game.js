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
        gold: 0
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
            type: 'village'
        },
        {
            name: '黑暗森林',
            description: '陰森的樹林中傳來陣陣低吼，危險潛伏在每個角落...',
            type: 'forest'
        },
        {
            name: '荒蕪平原',
            description: '一望無際的平原上，強風呼嘯而過，遠處有巨大的身影在移動...',
            type: 'plains'
        },
        {
            name: '惡魔洞穴',
            description: '深不見底的洞穴中，散發著邪惡的氣息，這裡是Boss的巢穴...',
            type: 'cave'
        }
    ],
    enemies: [
        { name: '哥布林', health: 30, maxHealth: 30, attack: 5, defense: 2, exp: 20, gold: 10 },
        { name: '野狼', health: 40, maxHealth: 40, attack: 7, defense: 3, exp: 30, gold: 15 },
        { name: '骷髏兵', health: 50, maxHealth: 50, attack: 8, defense: 4, exp: 40, gold: 20 },
        { name: '獸人', health: 60, maxHealth: 60, attack: 10, defense: 5, exp: 50, gold: 25 }
    ],
    bosses: [
        { name: '暗黑騎士', health: 150, maxHealth: 150, attack: 15, defense: 8, exp: 200, gold: 100 },
        { name: '惡魔領主', health: 250, maxHealth: 250, attack: 20, defense: 12, exp: 400, gold: 200 },
        { name: '終極魔王', health: 500, maxHealth: 500, attack: 30, defense: 20, exp: 1000, gold: 500 }
    ],
    shop: [
        { name: '生命藥水', type: 'heal', value: 50, cost: 20, description: '恢復50點生命值' },
        { name: '攻擊藥劑', type: 'attack', value: 5, cost: 50, description: '永久增加5點攻擊力' },
        { name: '防禦藥劑', type: 'defense', value: 5, cost: 50, description: '永久增加5點防禦力' },
        { name: '生命上限藥劑', type: 'maxHealth', value: 20, cost: 80, description: '永久增加20點最大生命值' }
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

// 探索功能
function explore() {
    if (gameState.currentEnemy) {
        addLog('你正在戰鬥中，無法探索！', 'warning');
        return;
    }
    
    const location = gameState.currentLocation;
    addLog(`你在${location.name}中探索...`);
    
    // 根據位置類型決定遇到什麼
    setTimeout(() => {
        const rand = Math.random();
        
        if (location.type === 'cave') {
            // 洞穴中只會遇到Boss
            if (rand < 0.3) {
                encounterBoss();
            } else {
                addLog('你在洞穴深處探索，但沒有發現Boss...');
            }
        } else {
            // 其他地點可能遇到普通怪物
            if (rand < 0.6) {
                encounterEnemy();
            } else if (rand < 0.8) {
                findGold();
            } else {
                addLog('你探索了一番，但沒有發現任何東西...');
            }
        }
    }, 500);
}

// 遇到敵人
function encounterEnemy() {
    const enemyIndex = Math.floor(Math.random() * gameState.enemies.length);
    const enemyTemplate = gameState.enemies[enemyIndex];
    
    gameState.currentEnemy = {
        ...enemyTemplate,
        health: enemyTemplate.maxHealth
    };
    
    addLog(`你遇到了${gameState.currentEnemy.name}！`, 'danger');
    showBattleUI();
    updateEnemyUI();
}

// 遇到Boss
function encounterBoss() {
    const bossIndex = Math.min(
        Math.floor(gameState.player.level / 3),
        gameState.bosses.length - 1
    );
    const bossTemplate = gameState.bosses[bossIndex];
    
    gameState.currentEnemy = {
        ...bossTemplate,
        health: bossTemplate.maxHealth,
        isBoss: true
    };
    
    addLog(`⚠️ 強大的${gameState.currentEnemy.name}出現了！`, 'danger');
    showBattleUI();
    updateEnemyUI();
}

// 找到金幣
function findGold() {
    const goldFound = Math.floor(Math.random() * 30) + 10;
    gameState.player.gold += goldFound;
    addLog(`你找到了${goldFound}枚金幣！`, 'success');
    updateUI();
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
    elements.enemyName.textContent = enemy.name + (enemy.isBoss ? ' ⚠️ BOSS' : '');
    
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

// 戰鬥
function battle() {
    if (!gameState.currentEnemy) {
        addLog('沒有敵人可以戰鬥！');
        return;
    }
    
    const player = gameState.player;
    const enemy = gameState.currentEnemy;
    
    // 玩家攻擊
    const playerDamage = Math.max(1, player.attack - enemy.defense + Math.floor(Math.random() * 5));
    enemy.health -= playerDamage;
    addLog(`你對${enemy.name}造成了${playerDamage}點傷害！`);
    
    if (enemy.health <= 0) {
        enemy.health = 0;
        victory(enemy);
        return;
    }
    
    updateEnemyUI();
    
    // 敵人反擊
    setTimeout(() => {
        const enemyDamage = Math.max(1, enemy.attack - player.defense + Math.floor(Math.random() * 5));
        player.health -= enemyDamage;
        addLog(`${enemy.name}對你造成了${enemyDamage}點傷害！`, 'danger');
        
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
    addLog(`🎉 你擊敗了${enemy.name}！`, 'success');
    
    // 獲得經驗值
    gameState.player.exp += enemy.exp;
    addLog(`獲得${enemy.exp}點經驗值！`);
    
    // 獲得金幣
    gameState.player.gold += enemy.gold;
    addLog(`獲得${enemy.gold}枚金幣！`);
    
    // 檢查升級
    while (gameState.player.exp >= gameState.player.expToNext) {
        levelUp();
    }
    
    updateUI();
    hideBattleUI();
}

// 升級
function levelUp() {
    gameState.player.exp -= gameState.player.expToNext;
    gameState.player.level++;
    gameState.player.expToNext = Math.floor(gameState.player.expToNext * 1.5);
    
    // 升級獎勵
    gameState.player.maxHealth += 20;
    gameState.player.health = gameState.player.maxHealth;
    gameState.player.attack += 3;
    gameState.player.defense += 2;
    
    addLog(`🎊 恭喜升級！你現在是${gameState.player.level}級！`, 'success');
    addLog('生命值、攻擊力、防禦力都提升了！');
}

// 遊戲結束
function gameOver() {
    addLog('💀 你被擊敗了！遊戲結束！', 'danger');
    addLog('點擊「休息」可以恢復生命值並繼續遊戲。');
    elements.battleBtn.disabled = true;
    elements.bossBtn.disabled = true;
}

// 休息
function rest() {
    if (gameState.currentEnemy) {
        addLog('戰鬥中無法休息！', 'warning');
        return;
    }
    
    const healAmount = Math.floor(gameState.player.maxHealth * 0.3);
    gameState.player.health = Math.min(
        gameState.player.maxHealth,
        gameState.player.health + healAmount
    );
    
    addLog(`你休息了一會兒，恢復了${healAmount}點生命值。`, 'info');
    updateUI();
    
    // 重新啟用按鈕
    elements.battleBtn.disabled = false;
    elements.bossBtn.disabled = false;
}

// 移動到新地點
function moveToLocation() {
    if (gameState.currentEnemy) {
        addLog('戰鬥中無法移動！', 'warning');
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

// 打開商店
function openShop() {
    if (gameState.currentEnemy) {
        addLog('戰鬥中無法進入商店！', 'warning');
        return;
    }
    
    elements.shopItems.innerHTML = '';
    
    gameState.shop.forEach((item, index) => {
        const shopItem = document.createElement('div');
        shopItem.className = 'shop-item';
        
        const canAfford = gameState.player.gold >= item.cost;
        
        shopItem.innerHTML = `
            <h4>${item.name}</h4>
            <p>${item.description}</p>
            <p><strong>價格: ${item.cost} 金幣</strong></p>
            <button ${!canAfford ? 'disabled' : ''} onclick="buyItem(${index})">
                ${canAfford ? '購買' : '金幣不足'}
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
        addLog('金幣不足！', 'warning');
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


// 數據管理工具函數
const DataManager = {
    // 安全獲取數值，確保不是 NaN
    getNumber(value, defaultValue = 0) {
        const num = Number(value);
        return (isNaN(num) || !isFinite(num)) ? defaultValue : num;
    },
    
    // 安全設置數值
    setNumber(obj, key, value, defaultValue = 0) {
        obj[key] = this.getNumber(value, defaultValue);
    },
    
    // 安全計算（避免 NaN）
    safeMath(operation, defaultValue = 0) {
        try {
            const result = operation();
            return this.getNumber(result, defaultValue);
        } catch (e) {
            return defaultValue;
        }
    },
    
    // 初始化玩家數據
    initPlayer(player) {
        this.setNumber(player, 'level', player.level, 1);
        this.setNumber(player, 'exp', player.exp, 0);
        this.setNumber(player, 'expToNext', player.expToNext, 100);
        this.setNumber(player, 'health', player.health, 100);
        this.setNumber(player, 'maxHealth', player.maxHealth, 100);
        this.setNumber(player, 'attack', player.attack, 10);
        this.setNumber(player, 'defense', player.defense, 5);
        this.setNumber(player, 'gold', player.gold, 0);
        this.setNumber(player, 'critChance', player.critChance, 0.1);
        this.setNumber(player, 'dodgeChance', player.dodgeChance, 0.05);
        this.setNumber(player, 'expMultiplier', player.expMultiplier, 1.0);
        this.setNumber(player, 'kills', player.kills, 0);
        this.setNumber(player, 'bossKills', player.bossKills, 0);
        this.setNumber(player, 'totalGold', player.totalGold, 0);
        
        // 初始化訓練次數
        if (!player.trainingCount) {
            player.trainingCount = {
                stamina: 0,
                strength: 0,
                defense: 0,
                precision: 0,
                agility: 0,
                meditation: 0
            };
        }
    },
    
    // 初始化敵人數據
    initEnemy(enemy) {
        if (!enemy) return null;
        
        const initEnemy = {
            name: enemy.name || '未知敵人',
            health: this.getNumber(enemy.health, enemy.maxHealth || 1),
            maxHealth: this.getNumber(enemy.maxHealth, 1),
            attack: this.getNumber(enemy.attack, 0),
            defense: this.getNumber(enemy.defense, 0),
            exp: this.getNumber(enemy.exp, 0),
            gold: this.getNumber(enemy.gold, 0),
            isBoss: enemy.isBoss || false
        };
        
        // 確保生命值不超過最大生命值
        initEnemy.health = Math.min(initEnemy.health, initEnemy.maxHealth);
        
        return initEnemy;
    },
    
    // 初始化地點數據
    initLocation(location) {
        this.setNumber(location, 'enemyLevel', location.enemyLevel, 1);
        this.setNumber(location, 'goldMultiplier', location.goldMultiplier, 1.0);
    }
};

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
        expMultiplier: 1.0,   // 經驗獲取倍率
        kills: 0,              // 擊殺數
        bossKills: 0,         // Boss擊殺數
        totalGold: 0,          // 總獲得金幣
        trainingCount: {      // 訓練次數（用於補正計算）
            stamina: 0,        // 體能訓練
            strength: 0,       // 力量訓練
            defense: 0,        // 防禦訓練
            precision: 0,     // 精準訓練
            agility: 0,        // 敏捷訓練
            meditation: 0      // 冥想訓練
        }
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
            description: '一個寧靜安全的村莊，這裡有各種訓練設施可以提升你的能力。',
            type: 'village',
            enemyLevel: 1,
            goldMultiplier: 1.0,
            isTown: true  // 標記為城鎮，不會遇到怪物
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
    enemyNameDisplay: document.getElementById('enemyNameDisplay'),
    enemyHealthFill: document.getElementById('enemyHealthFill'),
    enemyHealthText: document.getElementById('enemyHealthText'),
    battleStatus: document.getElementById('battleStatus'),
    logArea: document.getElementById('logArea'),
    exploreBtn: document.getElementById('exploreBtn'),
    battleBtn: document.getElementById('battleBtn'),
    bossBtn: document.getElementById('bossBtn'),
    restBtn: document.getElementById('restBtn'),
    shopBtn: document.getElementById('shopBtn'),
    infoPanel: document.getElementById('infoPanel'),
    infoPanelTitle: document.getElementById('infoPanelTitle'),
    infoPanelContent: document.getElementById('infoPanelContent'),
    locationSelect: document.getElementById('locationSelect'),
    moveBtn: document.getElementById('moveBtn'),
    trainingArea: document.getElementById('trainingArea'),
    trainStaminaBtn: document.getElementById('trainStaminaBtn'),
    trainStrengthBtn: document.getElementById('trainStrengthBtn'),
    trainDefenseBtn: document.getElementById('trainDefenseBtn'),
    trainPrecisionBtn: document.getElementById('trainPrecisionBtn'),
    trainAgilityBtn: document.getElementById('trainAgilityBtn'),
    trainMeditationBtn: document.getElementById('trainMeditationBtn'),
    townButtons: document.getElementById('townButtons'),
    townShopBtn: document.getElementById('townShopBtn'),
    townActionBtn: document.getElementById('townActionBtn'),
    townInnBtn: document.getElementById('townInnBtn'),
    townNpcBtn: document.getElementById('townNpcBtn')
};

// 初始化遊戲
function initGame() {
    // 初始化所有數據，確保沒有 NaN
    DataManager.initPlayer(gameState.player);
    gameState.locations.forEach(loc => DataManager.initLocation(loc));
    
    // 確保當前地點設置為起始村莊
    const startingLocation = gameState.locations.find(loc => loc.name === '起始村莊');
    if (startingLocation) {
        gameState.currentLocation = { ...startingLocation };
    } else {
        // 如果找不到，使用第一個地點
        gameState.currentLocation = { ...gameState.locations[0] };
    }
    
    // 確保 isTown 屬性正確設置
    if (!gameState.currentLocation.hasOwnProperty('isTown')) {
        gameState.currentLocation.isTown = gameState.currentLocation.name === '起始村莊';
    }
    
    // 強制設置 isTown 屬性
    gameState.currentLocation.isTown = (gameState.currentLocation.name === '起始村莊');
    
    // 確保 locations 數組中的起始村莊也有 isTown 屬性
    const startingLocInArray = gameState.locations.find(loc => loc.name === '起始村莊');
    if (startingLocInArray) {
        startingLocInArray.isTown = true;
    }
    
    updateUI();
    updateInfoPanel('default'); // 初始化右側資訊面板
    
    // 立即更新按鈕顯示（多次確保）
    updateActionButtons();
    setTimeout(() => {
        updateActionButtons();
    }, 50);
    setTimeout(() => {
        updateActionButtons();
    }, 200);
    
    addLog('遊戲開始！歡迎來到文字RPG世界！');
    addLog('在起始村莊中，你可以進行訓練來提升能力。');
    addLog('使用城鎮按鈕：商店、行動、旅館、NPC');
    checkQuests();
    checkAchievements();
}

// 訓練補正計算系統
const TrainingSystem = {
    // 計算訓練效果（帶補正）
    calculateTrainingGain(baseGain, currentValue, level, trainingCount, statType) {
        // 基礎增益
        let gain = baseGain;
        
        // 等級補正：等級越高，單次訓練效果越好（但遞增幅度遞減）
        const levelBonus = Math.sqrt(level) * 0.5;
        gain += levelBonus;
        
        // 當前數值補正：數值越高，提升越困難（遞減效果）
        const diminishingFactor = Math.max(0.3, 1 - (currentValue / (currentValue + 100)));
        gain *= diminishingFactor;
        
        // 訓練次數補正：訓練次數越多，效果遞減（疲勞度）
        const fatigueFactor = Math.max(0.5, 1 - (trainingCount / (trainingCount + 50)));
        gain *= fatigueFactor;
        
        // 隨機波動（±15%）
        const variance = 0.15;
        const randomFactor = 1 + (Math.random() * 2 - 1) * variance;
        gain *= randomFactor;
        
        // 根據屬性類型調整
        switch(statType) {
            case 'maxHealth':
                gain = Math.floor(gain * 2); // 生命值提升較多
                break;
            case 'attack':
            case 'defense':
                gain = Math.floor(gain * 1.5); // 攻擊防禦中等提升
                break;
            case 'critChance':
            case 'dodgeChance':
                gain = Math.floor(gain * 100) / 1000; // 百分比屬性提升較少
                break;
            case 'expMultiplier':
                gain = Math.floor(gain * 100) / 1000; // 經驗倍率提升較少
                break;
            default:
                gain = Math.floor(gain);
        }
        
        return DataManager.getNumber(gain, 0);
    },
    
    // 執行訓練
    performTraining(trainingType) {
        const player = gameState.player;
        const location = gameState.currentLocation;
        
        // 檢查是否在城鎮
        if (!location.isTown) {
            addLog('只有在城鎮中才能進行訓練！');
            return;
        }
        
        if (gameState.currentEnemy) {
            addLog('戰鬥中無法訓練！');
            return;
        }
        
        const level = DataManager.getNumber(player.level, 1);
        const trainingCount = DataManager.getNumber(player.trainingCount[trainingType], 0);
        
        let baseGain = 0;
        let statType = '';
        let statName = '';
        let currentValue = 0;
        let trainingName = '';
        
        switch(trainingType) {
            case 'stamina':
                trainingName = '體能訓練';
                baseGain = 5;
                statType = 'maxHealth';
                statName = '最大生命值';
                currentValue = DataManager.getNumber(player.maxHealth, 100);
                break;
            case 'strength':
                trainingName = '力量訓練';
                baseGain = 3;
                statType = 'attack';
                statName = '攻擊力';
                currentValue = DataManager.getNumber(player.attack, 10);
                break;
            case 'defense':
                trainingName = '防禦訓練';
                baseGain = 2;
                statType = 'defense';
                statName = '防禦力';
                currentValue = DataManager.getNumber(player.defense, 5);
                break;
            case 'precision':
                trainingName = '精準訓練';
                baseGain = 0.01;
                statType = 'critChance';
                statName = '暴擊率';
                currentValue = DataManager.getNumber(player.critChance, 0.1);
                break;
            case 'agility':
                trainingName = '敏捷訓練';
                baseGain = 0.008;
                statType = 'dodgeChance';
                statName = '閃避率';
                currentValue = DataManager.getNumber(player.dodgeChance, 0.05);
                break;
            case 'meditation':
                trainingName = '冥想訓練';
                baseGain = 0.005;
                statType = 'expMultiplier';
                statName = '經驗獲取倍率';
                currentValue = DataManager.getNumber(player.expMultiplier, 1.0);
                break;
            default:
                addLog('未知的訓練類型！');
                return;
        }
        
        // 計算訓練增益
        const gain = this.calculateTrainingGain(baseGain, currentValue, level, trainingCount, statType);
        
        if (gain <= 0) {
            addLog(`${trainingName}效果不佳，你感到疲憊，需要休息一下。`);
            return;
        }
        
        // 應用增益
        const newValue = currentValue + gain;
        
        switch(statType) {
            case 'maxHealth':
                player.maxHealth = newValue;
                player.health = Math.min(player.health + gain, player.maxHealth);
                addLog(`${trainingName}完成！${statName}提升了${Math.floor(gain)}點！`);
                break;
            case 'attack':
                player.attack = newValue;
                addLog(`${trainingName}完成！${statName}提升了${Math.floor(gain)}點！`);
                break;
            case 'defense':
                player.defense = newValue;
                addLog(`${trainingName}完成！${statName}提升了${Math.floor(gain)}點！`);
                break;
            case 'critChance':
                player.critChance = Math.min(newValue, 0.5); // 最高50%
                addLog(`${trainingName}完成！${statName}提升了${(gain * 100).toFixed(2)}%！`);
                break;
            case 'dodgeChance':
                player.dodgeChance = Math.min(newValue, 0.4); // 最高40%
                addLog(`${trainingName}完成！${statName}提升了${(gain * 100).toFixed(2)}%！`);
                break;
            case 'expMultiplier':
                player.expMultiplier = Math.min(newValue, 2.0); // 最高2倍
                addLog(`${trainingName}完成！${statName}提升了${(gain * 100).toFixed(2)}%！`);
                break;
        }
        
        // 增加訓練次數
        player.trainingCount[trainingType] = trainingCount + 1;
        
        updateUI();
    }
};

// 更新UI
function updateUI() {
    const player = gameState.player;
    
    // 確保所有數值都是有效的
    const health = DataManager.getNumber(player.health, 0);
    const maxHealth = DataManager.getNumber(player.maxHealth, 100);
    const level = DataManager.getNumber(player.level, 1);
    const exp = DataManager.getNumber(player.exp, 0);
    const expToNext = DataManager.getNumber(player.expToNext, 100);
    const attack = DataManager.getNumber(player.attack, 10);
    const defense = DataManager.getNumber(player.defense, 5);
    const gold = DataManager.getNumber(player.gold, 0);
    
    // 更新生命值
    const healthPercent = Math.max(0, Math.min(100, (health / maxHealth) * 100));
    if (elements.healthFill) {
        elements.healthFill.style.width = healthPercent + '%';
    }
    if (elements.healthText) {
        elements.healthText.textContent = `${health}/${maxHealth}`;
    }
    
    // 更新其他狀態
    if (elements.level) elements.level.textContent = level;
    if (elements.exp) elements.exp.textContent = `${exp}/${expToNext}`;
    if (elements.attack) elements.attack.textContent = attack;
    if (elements.defense) elements.defense.textContent = defense;
    if (elements.gold) elements.gold.textContent = gold;
    
    // 更新位置資訊
    if (elements.locationName) {
        elements.locationName.textContent = gameState.currentLocation.name || '未知地點';
    }
    if (elements.locationDescription) {
        elements.locationDescription.textContent = gameState.currentLocation.description || '';
    }
    
    // 根據地點類型顯示/隱藏按鈕
    updateActionButtons();
}

// 更新行動按鈕顯示
function updateActionButtons() {
    const location = gameState.currentLocation;
    // 確保 isTown 屬性正確判斷（強制檢查）
    const isTown = (location && (location.isTown === true || location.name === '起始村莊'));
    
    // 強制設置 isTown 屬性
    if (location) {
        location.isTown = (location.name === '起始村莊');
    }
    
    // 在城鎮中隱藏探索按鈕和一般行動按鈕，顯示城鎮專用按鈕
    if (elements.exploreBtn) {
        elements.exploreBtn.style.display = isTown ? 'none' : 'inline-block';
        // 同時禁用按鈕
        elements.exploreBtn.disabled = isTown;
    }
    
    // 隱藏一般行動按鈕區域（在城鎮中）- 使用更直接的方式
    const actionButtons = document.getElementById('actionButtons');
    if (actionButtons) {
        if (isTown) {
            actionButtons.style.display = 'none';
            actionButtons.style.visibility = 'hidden';
        } else {
            actionButtons.style.display = 'flex';
            actionButtons.style.visibility = 'visible';
        }
    }
    
    // 顯示/隱藏城鎮專用按鈕
    const townButtons = document.getElementById('townButtons');
    if (townButtons) {
        if (isTown) {
            townButtons.style.display = 'flex';
            townButtons.style.visibility = 'visible';
        } else {
            townButtons.style.display = 'none';
            townButtons.style.visibility = 'hidden';
        }
    }
    
    // 顯示/隱藏訓練區域（強化設施）
    if (elements.trainingArea) {
        elements.trainingArea.style.display = isTown ? 'block' : 'none';
    }
    
    // 在城鎮中，右側面板顯示訓練說明
    if (isTown) {
        updateInfoPanel('training');
    }
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
    const safeLevel = DataManager.getNumber(locationLevel, 1);
    const multiplier = DataManager.safeMath(() => 1 + (safeLevel - 1) * 0.3, 1.0);
    const goldMultiplier = DataManager.getNumber(gameState.currentLocation.goldMultiplier, 1.0);
    
    const enemy = {
        name: baseEnemy.name || '未知敵人',
        health: DataManager.safeMath(() => Math.floor(DataManager.getNumber(baseEnemy.baseHealth, 30) * multiplier), 30),
        maxHealth: DataManager.safeMath(() => Math.floor(DataManager.getNumber(baseEnemy.baseHealth, 30) * multiplier), 30),
        attack: DataManager.safeMath(() => Math.floor(DataManager.getNumber(baseEnemy.baseAttack, 5) * multiplier), 5),
        defense: DataManager.safeMath(() => Math.floor(DataManager.getNumber(baseEnemy.baseDefense, 2) * multiplier), 2),
        exp: DataManager.safeMath(() => Math.floor(DataManager.getNumber(baseEnemy.baseExp, 20) * multiplier), 20),
        gold: DataManager.safeMath(() => Math.floor(DataManager.getNumber(baseEnemy.baseGold, 10) * multiplier * goldMultiplier), 10)
    };
    
    return DataManager.initEnemy(enemy);
}

// 探索功能
function explore() {
    if (gameState.currentEnemy) {
        addLog('你正在戰鬥中，無法探索！');
        return;
    }
    
    const location = gameState.currentLocation;
    
    // 城鎮不能探索（強制檢查）
    const isTown = (location && (location.isTown === true || location.name === '起始村莊'));
    if (isTown) {
        addLog('在城鎮中不需要探索，這裡很安全。你可以進行訓練來提升能力。');
        addLog('請使用城鎮按鈕：商店、行動、旅館、NPC');
        return;
    }
    
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
    const enemyLevel = DataManager.getNumber(location.enemyLevel, 1);
    
    gameState.currentEnemy = calculateEnemyStats(baseEnemy, enemyLevel);
    gameState.currentEnemy = DataManager.initEnemy(gameState.currentEnemy);
    
    addLog(`你遇到了${gameState.currentEnemy.name}！`);
    showBattleUI();
    updateEnemyUI();
}

// 遇到Boss
function encounterBoss() {
    const location = gameState.currentLocation;
    const playerLevel = DataManager.getNumber(gameState.player.level, 1);
    const bossIndex = Math.min(
        Math.floor((playerLevel - 1) / 3),
        gameState.bosses.length - 1
    );
    const baseBoss = gameState.bosses[bossIndex];
    
    // Boss根據玩家等級調整
    const levelMultiplier = DataManager.safeMath(() => 1 + (playerLevel - 1) * 0.2, 1.0);
    const goldMultiplier = DataManager.getNumber(location.goldMultiplier, 1.0);
    
    const boss = {
        name: baseBoss.name || '未知Boss',
        health: DataManager.safeMath(() => Math.floor(DataManager.getNumber(baseBoss.baseHealth, 150) * levelMultiplier), 150),
        maxHealth: DataManager.safeMath(() => Math.floor(DataManager.getNumber(baseBoss.baseHealth, 150) * levelMultiplier), 150),
        attack: DataManager.safeMath(() => Math.floor(DataManager.getNumber(baseBoss.baseAttack, 15) * levelMultiplier), 15),
        defense: DataManager.safeMath(() => Math.floor(DataManager.getNumber(baseBoss.baseDefense, 8) * levelMultiplier), 8),
        exp: DataManager.safeMath(() => Math.floor(DataManager.getNumber(baseBoss.baseExp, 200) * levelMultiplier), 200),
        gold: DataManager.safeMath(() => Math.floor(DataManager.getNumber(baseBoss.baseGold, 100) * levelMultiplier * goldMultiplier), 100),
        isBoss: true
    };
    
    gameState.currentEnemy = DataManager.initEnemy(boss);
    
    addLog(`強大的${gameState.currentEnemy.name}出現了！`);
    showBattleUI();
    updateEnemyUI();
}

// 找到金幣
function findGold() {
    const location = gameState.currentLocation;
    const baseGold = Math.floor(Math.random() * 30) + 10;
    const goldMultiplier = DataManager.getNumber(location.goldMultiplier, 1.0);
    const goldFound = DataManager.safeMath(() => Math.floor(baseGold * goldMultiplier), baseGold);
    
    const currentGold = DataManager.getNumber(gameState.player.gold, 0);
    const currentTotalGold = DataManager.getNumber(gameState.player.totalGold, 0);
    
    gameState.player.gold = currentGold + goldFound;
    gameState.player.totalGold = currentTotalGold + goldFound;
    
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
        const baseGold = Math.random() * 100 + 50;
        const goldMultiplier = DataManager.getNumber(location.goldMultiplier, 1.0);
        const gold = DataManager.safeMath(() => Math.floor(baseGold * goldMultiplier), 50);
        
        const currentGold = DataManager.getNumber(gameState.player.gold, 0);
        const currentTotalGold = DataManager.getNumber(gameState.player.totalGold, 0);
        
        gameState.player.gold = currentGold + gold;
        gameState.player.totalGold = currentTotalGold + gold;
        addLog(`你發現了一個寶箱！獲得${gold}枚金幣！`);
    } else if (rand < 0.7) {
        // 經驗值
        const baseExp = Math.random() * 50 + 30;
        const enemyLevel = DataManager.getNumber(location.enemyLevel, 1);
        const exp = DataManager.safeMath(() => Math.floor(baseExp * enemyLevel), 30);
        
        const currentExp = DataManager.getNumber(gameState.player.exp, 0);
        gameState.player.exp = currentExp + exp;
        addLog(`你發現了一個經驗水晶！獲得${exp}點經驗值！`);
        checkLevelUp();
    } else {
        // 生命值恢復
        const maxHealth = DataManager.getNumber(gameState.player.maxHealth, 100);
        const currentHealth = DataManager.getNumber(gameState.player.health, 0);
        const heal = DataManager.safeMath(() => Math.floor(maxHealth * 0.5), 50);
        
        gameState.player.health = Math.min(maxHealth, currentHealth + heal);
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
                const discount = DataManager.safeMath(() => Math.floor(Math.random() * 20 + 10), 15);
                const currentGold = DataManager.getNumber(gameState.player.gold, 0);
                const currentTotalGold = DataManager.getNumber(gameState.player.totalGold, 0);
                gameState.player.gold = currentGold + discount;
                gameState.player.totalGold = currentTotalGold + discount;
                addLog(`你遇到了神秘商人，他給你${discount}枚金幣作為見面禮！`);
            }
        },
        {
            name: '訓練場',
            action: () => {
                const expGain = DataManager.safeMath(() => Math.floor(Math.random() * 30 + 20), 25);
                const currentExp = DataManager.getNumber(gameState.player.exp, 0);
                gameState.player.exp = currentExp + expGain;
                addLog(`你發現了一個訓練場，進行訓練獲得${expGain}點經驗值！`);
                checkLevelUp();
            }
        },
        {
            name: '受傷的旅人',
            action: () => {
                const gold = DataManager.safeMath(() => Math.floor(Math.random() * 40 + 20), 30);
                const currentGold = DataManager.getNumber(gameState.player.gold, 0);
                const currentTotalGold = DataManager.getNumber(gameState.player.totalGold, 0);
                gameState.player.gold = currentGold + gold;
                gameState.player.totalGold = currentTotalGold + gold;
                addLog(`你幫助了一位受傷的旅人，他給了你${gold}枚金幣作為報酬！`);
            }
        },
        {
            name: '危險陷阱',
            action: () => {
                const maxHealth = DataManager.getNumber(gameState.player.maxHealth, 100);
                const currentHealth = DataManager.getNumber(gameState.player.health, 0);
                const damage = DataManager.safeMath(() => Math.floor(maxHealth * 0.1), 10);
                gameState.player.health = Math.max(1, currentHealth - damage);
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
    if (!gameState.currentEnemy) return;
    
    elements.battleArea.style.display = 'block';
    elements.battleBtn.style.display = 'inline-block';
    elements.exploreBtn.disabled = true;
    updateEnemyUI();
}

// 隱藏戰鬥UI
function hideBattleUI() {
    elements.battleArea.style.display = 'none';
    elements.battleBtn.style.display = 'none';
    elements.bossBtn.style.display = 'none';
    elements.exploreBtn.disabled = false;
    if (elements.battleStatus) {
        elements.battleStatus.textContent = '準備戰鬥！';
    }
    gameState.currentEnemy = null;
    updateInfoPanel('default'); // 恢復默認顯示
}

// 更新右側資訊面板
function updateInfoPanel(type, data = {}) {
    if (!elements.infoPanel || !elements.infoPanelTitle || !elements.infoPanelContent) return;
    
    switch(type) {
        case 'enemy':
            if (!gameState.currentEnemy) {
                updateInfoPanel('default');
                return;
            }
            const enemy = DataManager.initEnemy(gameState.currentEnemy);
            const health = DataManager.getNumber(enemy.health, 0);
            const maxHealth = DataManager.getNumber(enemy.maxHealth, 1);
            const attack = DataManager.getNumber(enemy.attack, 0);
            const defense = DataManager.getNumber(enemy.defense, 0);
            const exp = DataManager.getNumber(enemy.exp, 0);
            const gold = DataManager.getNumber(enemy.gold, 0);
            const healthPercent = Math.max(0, Math.min(100, (health / maxHealth) * 100));
            
            elements.infoPanelTitle.textContent = '敵人資訊';
            elements.infoPanelContent.innerHTML = `
                <div class="enemy-name-display">${enemy.name}${enemy.isBoss ? ' [BOSS]' : ''}</div>
                <div class="enemy-health-bar">
                    <div class="enemy-health-fill" style="width: ${healthPercent}%"></div>
                </div>
                <p class="enemy-health-text">${health}/${maxHealth}</p>
                <div class="enemy-details">
                    <p><strong>攻擊力:</strong> ${attack}</p>
                    <p><strong>防禦力:</strong> ${defense}</p>
                    <p><strong>經驗值:</strong> ${exp}</p>
                    <p><strong>金幣:</strong> ${gold}</p>
                </div>
            `;
            break;
            
        case 'shop':
            elements.infoPanelTitle.textContent = '商店';
            let shopHTML = '<div class="shop-items-list">';
            gameState.shop.forEach((item, index) => {
                const canAfford = DataManager.getNumber(gameState.player.gold, 0) >= DataManager.getNumber(item.cost, 0);
                const isOutOfStock = item.stock === 0;
                shopHTML += `
                    <div class="shop-item">
                        <h4>${item.name}</h4>
                        <p>${item.description}</p>
                        <p><strong>價格: ${item.cost} 金幣</strong></p>
                        <button class="btn btn-shop" ${!canAfford || isOutOfStock ? 'disabled' : ''} onclick="buyItem(${index})">
                            ${isOutOfStock ? '已售完' : !canAfford ? '金幣不足' : '購買'}
                        </button>
                    </div>
                `;
            });
            shopHTML += '</div>';
            elements.infoPanelContent.innerHTML = shopHTML;
            break;
            
        case 'training':
            elements.infoPanelTitle.textContent = '訓練設施';
            elements.infoPanelContent.innerHTML = `
                <div style="color: #666; line-height: 1.6;">
                    <p style="margin-bottom: 15px;"><strong>在城鎮中，你可以通過訓練來提升各項能力：</strong></p>
                    <ul style="list-style: none; padding: 0;">
                        <li style="margin: 8px 0;">• <strong>體能訓練</strong> - 提升最大生命值</li>
                        <li style="margin: 8px 0;">• <strong>力量訓練</strong> - 提升攻擊力</li>
                        <li style="margin: 8px 0;">• <strong>防禦訓練</strong> - 提升防禦力</li>
                        <li style="margin: 8px 0;">• <strong>精準訓練</strong> - 提升暴擊率</li>
                        <li style="margin: 8px 0;">• <strong>敏捷訓練</strong> - 提升閃避率</li>
                        <li style="margin: 8px 0;">• <strong>冥想訓練</strong> - 提升經驗獲取倍率</li>
                    </ul>
                    <p style="margin-top: 15px; font-size: 0.9em; color: #888;">訓練效果會根據你的等級、當前能力和訓練次數進行補正。</p>
                </div>
            `;
            break;
            
        case 'npc':
            elements.infoPanelTitle.textContent = 'NPC對話';
            let npcHTML = '<div style="color: #666; line-height: 1.6;">';
            
            // 顯示未完成的任務
            const activeQuests = gameState.quests.filter(q => !q.completed);
            if (activeQuests.length > 0) {
                npcHTML += '<p style="margin-bottom: 10px;"><strong>可接取的任務：</strong></p>';
                activeQuests.forEach(quest => {
                    let progress = 0;
                    switch(quest.target) {
                        case 'kills':
                            progress = DataManager.getNumber(gameState.player.kills, 0);
                            break;
                        case 'bossKills':
                            progress = DataManager.getNumber(gameState.player.bossKills, 0);
                            break;
                        case 'totalGold':
                            progress = DataManager.getNumber(gameState.player.totalGold, 0);
                            break;
                    }
                    const targetValue = DataManager.getNumber(quest.targetValue, 0);
                    npcHTML += `
                        <div style="background: #f5f5f5; padding: 10px; margin: 8px 0; border-radius: 5px; border-left: 3px solid #4caf50;">
                            <p style="margin: 0; font-weight: 600;">${quest.name}</p>
                            <p style="margin: 5px 0; font-size: 0.9em;">${quest.description}</p>
                            <p style="margin: 5px 0; font-size: 0.85em; color: #888;">進度: ${progress}/${targetValue}</p>
                            <p style="margin: 5px 0; font-size: 0.85em; color: #666;">獎勵: ${quest.reward.gold}金幣, ${quest.reward.exp}經驗值</p>
                        </div>
                    `;
                });
            } else {
                npcHTML += '<p>目前沒有可接取的任務。</p>';
            }
            
            npcHTML += '</div>';
            elements.infoPanelContent.innerHTML = npcHTML;
            break;
            
        case 'inn':
            elements.infoPanelTitle.textContent = '旅館';
            const innMaxHealth = DataManager.getNumber(gameState.player.maxHealth, 100);
            const innCurrentHealth = DataManager.getNumber(gameState.player.health, 0);
            const innHealthPercent = Math.floor((innCurrentHealth / innMaxHealth) * 100);
            
            elements.infoPanelContent.innerHTML = `
                <div style="color: #666; line-height: 1.6;">
                    <p style="margin-bottom: 15px;">歡迎來到旅館！這裡可以完全恢復你的生命值。</p>
                    <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin-bottom: 15px;">
                        <p style="margin: 5px 0;"><strong>當前生命值:</strong> ${innCurrentHealth}/${innMaxHealth} (${innHealthPercent}%)</p>
                    </div>
                    <p style="margin-bottom: 10px;"><strong>服務選項：</strong></p>
                    <button class="btn btn-inn-rest" onclick="stayAtInn()" style="width: 100%; padding: 12px; margin-top: 10px; background: #4caf50; color: white; border: none; border-radius: 4px; cursor: pointer;">
                        住宿休息（完全恢復生命值）
                    </button>
                </div>
            `;
            break;
            
        case 'action':
            elements.infoPanelTitle.textContent = '城鎮行動';
            elements.infoPanelContent.innerHTML = `
                <div style="color: #666; line-height: 1.6;">
                    <p style="margin-bottom: 15px;"><strong>可執行的行動：</strong></p>
                    <ul style="list-style: none; padding: 0;">
                        <li style="margin: 8px 0; padding: 10px; background: #f5f5f5; border-radius: 5px;">
                            <strong>查看公告欄</strong> - 了解最新的冒險資訊
                        </li>
                        <li style="margin: 8px 0; padding: 10px; background: #f5f5f5; border-radius: 5px;">
                            <strong>打聽情報</strong> - 獲得關於附近地區的資訊
                        </li>
                        <li style="margin: 8px 0; padding: 10px; background: #f5f5f5; border-radius: 5px;">
                            <strong>查看排行榜</strong> - 查看你的冒險統計
                        </li>
                    </ul>
                    <button class="btn btn-action-view" onclick="viewTownAction()" style="width: 100%; padding: 12px; margin-top: 15px; background: #2196f3; color: white; border: none; border-radius: 4px; cursor: pointer;">
                        執行行動
                    </button>
                </div>
            `;
            break;
            
        case 'default':
        default:
            const location = gameState.currentLocation;
            const isTown = (location && location.isTown === true) || (location && location.name === '起始村莊');
            
            if (isTown) {
                updateInfoPanel('training');
            } else {
                elements.infoPanelTitle.textContent = '資訊';
                elements.infoPanelContent.innerHTML = '<p style="color: #666; text-align: center; padding: 20px;">選擇行動來查看詳細資訊</p>';
            }
            break;
    }
}

// 更新敵人UI（保留用於戰鬥區域）
function updateEnemyUI() {
    if (!gameState.currentEnemy) {
        updateInfoPanel('default');
        return;
    }
    
    const enemy = DataManager.initEnemy(gameState.currentEnemy);
    
    // 更新中央戰鬥區域的敵人名稱和狀態
    if (elements.enemyName) {
        elements.enemyName.textContent = enemy.name + (enemy.isBoss ? ' [BOSS]' : '');
    }
    if (elements.battleStatus) {
        elements.battleStatus.textContent = `正在與 ${enemy.name} 戰鬥中...`;
    }
    
    // 更新右側資訊面板
    updateInfoPanel('enemy');
}

// 計算傷害（包含暴擊）
function calculateDamage(attacker, defender, isPlayer = false) {
    const attackerAttack = DataManager.getNumber(attacker.attack, 0);
    const defenderDefense = DataManager.getNumber(defender.defense, 0);
    
    let baseDamage = attackerAttack - defenderDefense;
    if (baseDamage < 1) baseDamage = 1;
    
    // 傷害波動（±20%）
    const variance = 0.2;
    const damageMultiplier = 1 + (Math.random() * 2 - 1) * variance;
    let finalDamage = DataManager.safeMath(() => Math.floor(baseDamage * damageMultiplier), baseDamage);
    
    // 暴擊判定
    if (isPlayer) {
        const critChance = DataManager.getNumber(gameState.player.critChance, 0.1);
        if (Math.random() < critChance) {
            finalDamage = DataManager.safeMath(() => Math.floor(finalDamage * 2), finalDamage);
            return { damage: finalDamage, isCrit: true };
        }
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
    const currentEnemyHealth = DataManager.getNumber(enemy.health, 0);
    enemy.health = Math.max(0, currentEnemyHealth - playerAttack.damage);
    
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
        const dodgeChance = DataManager.getNumber(player.dodgeChance, 0.05);
        if (Math.random() < dodgeChance) {
            addLog(`你成功閃避了${enemy.name}的攻擊！`);
            updateUI();
            return;
        }
        
        const enemyAttack = calculateDamage(enemy, player, false);
        const currentHealth = DataManager.getNumber(player.health, 0);
        player.health = Math.max(0, currentHealth - enemyAttack.damage);
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
    
    // 獲得經驗值（應用經驗倍率）
    const baseExp = DataManager.getNumber(enemy.exp, 0);
    const expMultiplier = DataManager.getNumber(gameState.player.expMultiplier, 1.0);
    const expGain = DataManager.safeMath(() => Math.floor(baseExp * expMultiplier), baseExp);
    const currentExp = DataManager.getNumber(gameState.player.exp, 0);
    gameState.player.exp = currentExp + expGain;
    addLog(`獲得${expGain}點經驗值！${expMultiplier > 1.0 ? `(倍率: ${expMultiplier.toFixed(2)}x)` : ''}`);
    
    // 獲得金幣
    const goldGain = DataManager.getNumber(enemy.gold, 0);
    const currentGold = DataManager.getNumber(gameState.player.gold, 0);
    const currentTotalGold = DataManager.getNumber(gameState.player.totalGold, 0);
    gameState.player.gold = currentGold + goldGain;
    gameState.player.totalGold = currentTotalGold + goldGain;
    addLog(`獲得${goldGain}枚金幣！`);
    
    // 更新擊殺數
    if (enemy.isBoss) {
        const currentBossKills = DataManager.getNumber(gameState.player.bossKills, 0);
        gameState.player.bossKills = currentBossKills + 1;
    } else {
        const currentKills = DataManager.getNumber(gameState.player.kills, 0);
        gameState.player.kills = currentKills + 1;
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
    let currentExp = DataManager.getNumber(gameState.player.exp, 0);
    let expToNext = DataManager.getNumber(gameState.player.expToNext, 100);
    
    while (currentExp >= expToNext) {
        currentExp -= expToNext;
        const currentLevel = DataManager.getNumber(gameState.player.level, 1);
        gameState.player.level = currentLevel + 1;
        gameState.player.exp = currentExp;
        
        expToNext = DataManager.safeMath(() => Math.floor(expToNext * 1.5), 150);
        gameState.player.expToNext = expToNext;
        
        // 升級獎勵
        const currentMaxHealth = DataManager.getNumber(gameState.player.maxHealth, 100);
        const currentAttack = DataManager.getNumber(gameState.player.attack, 10);
        const currentDefense = DataManager.getNumber(gameState.player.defense, 5);
        
        gameState.player.maxHealth = currentMaxHealth + 20;
        gameState.player.health = gameState.player.maxHealth;
        gameState.player.attack = currentAttack + 3;
        gameState.player.defense = currentDefense + 2;
        
        addLog(`恭喜升級！你現在是${gameState.player.level}級！`);
        addLog('生命值、攻擊力、防禦力都提升了！');
        
        checkAchievements();
        
        // 更新循環變量
        currentExp = DataManager.getNumber(gameState.player.exp, 0);
        expToNext = DataManager.getNumber(gameState.player.expToNext, 100);
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
    
    const maxHealth = DataManager.getNumber(gameState.player.maxHealth, 100);
    const currentHealth = DataManager.getNumber(gameState.player.health, 0);
    const healAmount = DataManager.safeMath(() => Math.floor(maxHealth * 0.3), 30);
    
    gameState.player.health = Math.min(maxHealth, currentHealth + healAmount);
    
    addLog(`你休息了一會兒，恢復了${healAmount}點生命值。`);
    updateUI();
    
    // 重新啟用按鈕
    elements.battleBtn.disabled = false;
    elements.bossBtn.disabled = false;
}

// 旅館住宿（完全恢復生命值）
function stayAtInn() {
    if (gameState.currentEnemy) {
        addLog('戰鬥中無法住宿！');
        return;
    }
    
    const location = gameState.currentLocation;
    const isTown = (location && (location.isTown === true || location.name === '起始村莊'));
    
    if (!isTown) {
        addLog('只有在城鎮中才能使用旅館！');
        return;
    }
    
    const maxHealth = DataManager.getNumber(gameState.player.maxHealth, 100);
    const currentHealth = DataManager.getNumber(gameState.player.health, 0);
    
    if (currentHealth >= maxHealth) {
        addLog('你的生命值已經滿了，不需要住宿。');
        updateInfoPanel('inn');
        return;
    }
    
    const healAmount = maxHealth - currentHealth;
    gameState.player.health = maxHealth;
    
    addLog(`你在旅館中好好休息了一晚，完全恢復了生命值！恢復了${healAmount}點生命值。`);
    updateUI();
    updateInfoPanel('inn');
}

// 城鎮行動
function viewTownAction() {
    const actions = [
        {
            name: '查看公告欄',
            description: '你查看了村莊的公告欄，上面寫著各種冒險者的消息和懸賞任務。',
            effect: () => {
                addLog('你從公告欄上了解到，最近黑暗森林中出現了強大的怪物。');
                addLog('有冒險者懸賞擊敗這些怪物，獎勵豐厚！');
            }
        },
        {
            name: '打聽情報',
            description: '你向村莊的居民打聽情報，了解附近地區的情況。',
            effect: () => {
                const tips = [
                    '據說荒蕪平原的怪物比黑暗森林更強，但獎勵也更豐厚。',
                    '惡魔洞穴是Boss的巢穴，只有強大的冒險者才敢進入。',
                    '有傳聞說，擊敗Boss可以獲得特殊的獎勵。'
                ];
                const tip = tips[Math.floor(Math.random() * tips.length)];
                addLog(tip);
            }
        },
        {
            name: '查看排行榜',
            description: '你查看了冒險者排行榜，了解自己的排名。',
            effect: () => {
                const player = gameState.player;
                addLog(`你的冒險統計：`);
                addLog(`等級: ${player.level} | 擊殺數: ${player.kills} | Boss擊殺: ${player.bossKills}`);
                addLog(`總獲得金幣: ${player.totalGold}`);
            }
        }
    ];
    
    const action = actions[Math.floor(Math.random() * actions.length)];
    addLog(`執行行動：${action.name}`);
    addLog(action.description);
    action.effect();
}

// 移動到新地點
function moveToLocation() {
    if (gameState.currentEnemy) {
        addLog('戰鬥中無法移動！');
        return;
    }
    
    const locationIndex = parseInt(elements.locationSelect.value);
    const newLocation = gameState.locations[locationIndex];
    
    if (!newLocation) {
        addLog('無效的地點！');
        return;
    }
    
    if (gameState.currentLocation.name === newLocation.name) {
        addLog('你已經在這個地點了！');
        return;
    }
    
    gameState.currentLocation = { ...newLocation };
    
    // 確保 isTown 屬性正確設置
    if (!gameState.currentLocation.hasOwnProperty('isTown')) {
        gameState.currentLocation.isTown = gameState.currentLocation.name === '起始村莊';
    }
    
    if (gameState.currentLocation.isTown) {
        addLog(`你來到了${gameState.currentLocation.name}。這裡很安全，可以進行訓練。`);
    } else {
        addLog(`你來到了${gameState.currentLocation.name}。這裡充滿危險，準備好戰鬥吧！`);
    }
    
    updateUI();
    updateActionButtons(); // 更新按鈕顯示
    
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
                currentValue = DataManager.getNumber(gameState.player.kills, 0);
                break;
            case 'bossKills':
                currentValue = DataManager.getNumber(gameState.player.bossKills, 0);
                break;
            case 'totalGold':
                currentValue = DataManager.getNumber(gameState.player.totalGold, 0);
                break;
        }
        
        const targetValue = DataManager.getNumber(quest.targetValue, 0);
        if (currentValue >= targetValue) {
            quest.completed = true;
            
            const rewardGold = DataManager.getNumber(quest.reward.gold, 0);
            const rewardExp = DataManager.getNumber(quest.reward.exp, 0);
            
            const currentGold = DataManager.getNumber(gameState.player.gold, 0);
            const currentExp = DataManager.getNumber(gameState.player.exp, 0);
            const currentTotalGold = DataManager.getNumber(gameState.player.totalGold, 0);
            
            gameState.player.gold = currentGold + rewardGold;
            gameState.player.exp = currentExp + rewardExp;
            gameState.player.totalGold = currentTotalGold + rewardGold;
            
            addLog(`任務完成：${quest.name}！獲得${rewardGold}金幣和${rewardExp}經驗值！`);
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
    
    updateInfoPanel('shop');
}

// 購買物品
function buyItem(index) {
    const item = gameState.shop[index];
    const player = gameState.player;
    
    const itemCost = DataManager.getNumber(item.cost, 0);
    const currentGold = DataManager.getNumber(player.gold, 0);
    
    if (currentGold < itemCost) {
        addLog('金幣不足！');
        return;
    }
    
    if (item.stock === 0) {
        addLog('該物品已售完！');
        return;
    }
    
    player.gold = currentGold - itemCost;
    const itemValue = DataManager.getNumber(item.value, 0);
    
    switch (item.type) {
        case 'heal':
            const maxHealth = DataManager.getNumber(player.maxHealth, 100);
            const currentHealth = DataManager.getNumber(player.health, 0);
            player.health = Math.min(maxHealth, currentHealth + itemValue);
            addLog(`使用了${item.name}，恢復了${itemValue}點生命值！`);
            break;
        case 'attack':
            const currentAttack = DataManager.getNumber(player.attack, 10);
            player.attack = currentAttack + itemValue;
            addLog(`使用了${item.name}，攻擊力永久增加${itemValue}點！`);
            break;
        case 'defense':
            const currentDefense = DataManager.getNumber(player.defense, 5);
            player.defense = currentDefense + itemValue;
            addLog(`使用了${item.name}，防禦力永久增加${itemValue}點！`);
            break;
        case 'maxHealth':
            const currentMaxHealth = DataManager.getNumber(player.maxHealth, 100);
            const currentHealth2 = DataManager.getNumber(player.health, 0);
            player.maxHealth = currentMaxHealth + itemValue;
            player.health = currentHealth2 + itemValue;
            addLog(`使用了${item.name}，最大生命值永久增加${itemValue}點！`);
            break;
        case 'critChance':
            const currentCritChance = DataManager.getNumber(player.critChance, 0.1);
            player.critChance = currentCritChance + itemValue;
            addLog(`使用了${item.name}，暴擊率永久增加${Math.floor(itemValue * 100)}%！`);
            break;
        case 'dodgeChance':
            const currentDodgeChance = DataManager.getNumber(player.dodgeChance, 0.05);
            player.dodgeChance = currentDodgeChance + itemValue;
            addLog(`使用了${item.name}，閃避率永久增加${Math.floor(itemValue * 100)}%！`);
            break;
    }
    
    if (item.stock > 0) {
        item.stock--;
    }
    
    updateUI();
    updateInfoPanel('shop'); // 刷新商店
}

// 關閉商店（現在不需要，因為商店顯示在右側面板）
function closeShop() {
    updateInfoPanel('default');
}

// 事件監聽器
elements.exploreBtn.addEventListener('click', explore);
elements.battleBtn.addEventListener('click', battle);
elements.bossBtn.addEventListener('click', challengeBoss);
elements.restBtn.addEventListener('click', rest);
elements.shopBtn.addEventListener('click', openShop);
elements.closeShop.addEventListener('click', closeShop);
elements.moveBtn.addEventListener('click', moveToLocation);

// 城鎮按鈕事件監聽器
if (elements.townShopBtn) {
    elements.townShopBtn.addEventListener('click', openShop);
}
if (elements.townActionBtn) {
    elements.townActionBtn.addEventListener('click', () => updateInfoPanel('action'));
}
if (elements.townInnBtn) {
    elements.townInnBtn.addEventListener('click', () => updateInfoPanel('inn'));
}
if (elements.townNpcBtn) {
    elements.townNpcBtn.addEventListener('click', () => updateInfoPanel('npc'));
}

// 訓練按鈕事件監聽器
if (elements.trainStaminaBtn) {
    elements.trainStaminaBtn.addEventListener('click', () => TrainingSystem.performTraining('stamina'));
}
if (elements.trainStrengthBtn) {
    elements.trainStrengthBtn.addEventListener('click', () => TrainingSystem.performTraining('strength'));
}
if (elements.trainDefenseBtn) {
    elements.trainDefenseBtn.addEventListener('click', () => TrainingSystem.performTraining('defense'));
}
if (elements.trainPrecisionBtn) {
    elements.trainPrecisionBtn.addEventListener('click', () => TrainingSystem.performTraining('precision'));
}
if (elements.trainAgilityBtn) {
    elements.trainAgilityBtn.addEventListener('click', () => TrainingSystem.performTraining('agility'));
}
if (elements.trainMeditationBtn) {
    elements.trainMeditationBtn.addEventListener('click', () => TrainingSystem.performTraining('meditation'));
}


// 確保 DOM 載入完成後再初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGame);
} else {
    // DOM 已經載入完成
    initGame();
}

// 額外確保：在 window 載入後再次檢查
window.addEventListener('load', () => {
    setTimeout(() => {
        updateActionButtons();
    }, 100);
});

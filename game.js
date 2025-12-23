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
        this.setNumber(player, 'energy', player.energy, player.maxEnergy || 100);
        this.setNumber(player, 'maxEnergy', player.maxEnergy, 100);
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
        energy: 100,           // 體力
        maxEnergy: 100,        // 最大體力
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
        // 恢復類物品
        { name: '生命藥水', type: 'heal', value: 50, cost: 25, description: '恢復50點生命值', stock: -1, category: 'consumable', icon: '💊' },
        { name: '大生命藥水', type: 'heal', value: 100, cost: 50, description: '恢復100點生命值', stock: -1, category: 'consumable', icon: '🧪' },
        { name: '超級生命藥水', type: 'heal', value: 200, cost: 120, description: '恢復200點生命值', stock: -1, category: 'consumable', icon: '⚗️' },
        // 永久屬性提升
        { name: '攻擊藥劑', type: 'attack', value: 3, cost: 60, description: '永久增加3點攻擊力', stock: -1, category: 'permanent', icon: '⚔️' },
        { name: '防禦藥劑', type: 'defense', value: 3, cost: 60, description: '永久增加3點防禦力', stock: -1, category: 'permanent', icon: '🛡️' },
        { name: '生命上限藥劑', type: 'maxHealth', value: 20, cost: 100, description: '永久增加20點最大生命值', stock: -1, category: 'permanent', icon: '❤️' },
        { name: '暴擊藥劑', type: 'critChance', value: 0.05, cost: 150, description: '永久增加5%暴擊率', stock: -1, category: 'permanent', icon: '💥' },
        { name: '閃避藥劑', type: 'dodgeChance', value: 0.03, cost: 150, description: '永久增加3%閃避率', stock: -1, category: 'permanent', icon: '🌀' },
        // 高級物品
        { name: '力量精華', type: 'attack', value: 5, cost: 200, description: '永久增加5點攻擊力', stock: -1, category: 'premium', icon: '✨' },
        { name: '堅韌精華', type: 'defense', value: 5, cost: 200, description: '永久增加5點防禦力', stock: -1, category: 'premium', icon: '💎' },
        { name: '生命精華', type: 'maxHealth', value: 50, cost: 300, description: '永久增加50點最大生命值', stock: -1, category: 'premium', icon: '🌟' },
        { name: '經驗藥水', type: 'exp', value: 100, cost: 80, description: '立即獲得100點經驗值', stock: -1, category: 'consumable', icon: '📚' }
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
    energyFill: document.getElementById('energyFill'),
    energyText: document.getElementById('energyText'),
    level: document.getElementById('level'),
    exp: document.getElementById('exp'),
    expFill: document.getElementById('expFill'),
    attack: document.getElementById('attack'),
    defense: document.getElementById('defense'),
    critChance: document.getElementById('critChance'),
    dodgeChance: document.getElementById('dodgeChance'),
    gold: document.getElementById('gold'),
    expMultiplier: document.getElementById('expMultiplier'),
    kills: document.getElementById('kills'),
    bossKills: document.getElementById('bossKills'),
    totalGold: document.getElementById('totalGold'),
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
    townNpcBtn: document.getElementById('townNpcBtn'),
    townTrainingBtn: document.getElementById('townTrainingBtn')
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
        // 強制設置 isTown 為 true
        gameState.currentLocation.isTown = true;
    } else {
        // 如果找不到，使用第一個地點
        gameState.currentLocation = { ...gameState.locations[0] };
        gameState.currentLocation.isTown = (gameState.currentLocation.name === '起始村莊');
    }
    
    // 強制設置 isTown 屬性（確保是 true）
    if (gameState.currentLocation.name === '起始村莊') {
        gameState.currentLocation.isTown = true;
    }
    
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
        
        // 檢查體力
        if (!consumeEnergy(20, '訓練')) {
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
        // 根據生命值百分比改變顏色
        if (healthPercent > 60) {
            elements.healthFill.style.background = '#4caf50';
        } else if (healthPercent > 30) {
            elements.healthFill.style.background = '#ff9800';
        } else {
            elements.healthFill.style.background = '#f44336';
        }
    }
    if (elements.healthText) {
        elements.healthText.textContent = `${health}/${maxHealth}`;
    }
    
    // 更新等級
    if (elements.level) elements.level.textContent = level;
    
    // 更新經驗值（帶進度條）
    if (elements.exp) {
        elements.exp.textContent = `${exp}/${expToNext}`;
    }
    if (elements.expFill) {
        const expPercent = Math.max(0, Math.min(100, (exp / expToNext) * 100));
        elements.expFill.style.width = expPercent + '%';
    }
    
    // 更新戰鬥屬性
    if (elements.attack) elements.attack.textContent = attack;
    if (elements.defense) elements.defense.textContent = defense;
    
    const critChance = DataManager.getNumber(player.critChance, 0.1);
    const dodgeChance = DataManager.getNumber(player.dodgeChance, 0.05);
    if (elements.critChance) {
        elements.critChance.textContent = Math.floor(critChance * 100) + '%';
    }
    if (elements.dodgeChance) {
        elements.dodgeChance.textContent = Math.floor(dodgeChance * 100) + '%';
    }
    
    // 更新資源
    if (elements.gold) elements.gold.textContent = gold.toLocaleString();
    
    const expMultiplier = DataManager.getNumber(player.expMultiplier, 1.0);
    if (elements.expMultiplier) {
        elements.expMultiplier.textContent = expMultiplier.toFixed(1) + 'x';
    }
    
    // 更新體力
    const energy = DataManager.getNumber(player.energy, 100);
    const maxEnergy = DataManager.getNumber(player.maxEnergy, 100);
    if (elements.energyFill) {
        const energyPercent = Math.max(0, Math.min(100, (energy / maxEnergy) * 100));
        elements.energyFill.style.width = energyPercent + '%';
        // 根據體力百分比改變顏色
        if (energyPercent > 60) {
            elements.energyFill.style.background = '#2196f3';
        } else if (energyPercent > 30) {
            elements.energyFill.style.background = '#ff9800';
        } else {
            elements.energyFill.style.background = '#f44336';
        }
    }
    if (elements.energyText) {
        elements.energyText.textContent = `${energy}/${maxEnergy}`;
    }
    
    // 更新戰鬥統計
    const kills = DataManager.getNumber(player.kills, 0);
    const bossKills = DataManager.getNumber(player.bossKills, 0);
    const totalGold = DataManager.getNumber(player.totalGold, 0);
    if (elements.kills) elements.kills.textContent = kills;
    if (elements.bossKills) elements.bossKills.textContent = bossKills;
    if (elements.totalGold) elements.totalGold.textContent = totalGold.toLocaleString();
    
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
    // 強制檢查並設置 isTown 屬性
    const isTown = (location.name === '起始村莊');
    location.isTown = isTown; // 強制設置
    
    console.log('updateActionButtons - location:', location.name, 'isTown:', isTown);
    
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

// 檢查並消耗體力
function consumeEnergy(amount, actionName) {
    const player = gameState.player;
    const currentEnergy = DataManager.getNumber(player.energy, 100);
    const energyCost = DataManager.getNumber(amount, 0);
    
    if (currentEnergy < energyCost) {
        addLog(`⚡ 體力不足！需要 ${energyCost} 點體力，你只有 ${currentEnergy} 點體力。`);
        addLog('💡 提示：可以通過休息或旅館來恢復體力。');
        return false;
    }
    
    player.energy = Math.max(0, currentEnergy - energyCost);
    addLog(`⚡ 消耗了 ${energyCost} 點體力（剩餘: ${player.energy}/${player.maxEnergy}）`);
    updateUI();
    return true;
}

// 探索功能
function explore() {
    if (gameState.currentEnemy) {
        addLog('你正在戰鬥中，無法探索！');
        return;
    }
    
    // 檢查體力
    if (!consumeEnergy(15, '探索')) {
        return;
    }
    
    const location = gameState.currentLocation;
    
    // 城鎮不能探索（強制檢查）
    const isTown = (location && (location.isTown === true || location.name === '起始村莊'));
    if (isTown) {
        addLog('在城鎮中不需要探索，這裡很安全。你可以進行訓練來提升能力。');
        addLog('請使用城鎮按鈕：商店、行動、旅館、NPC');
        // 退還體力
        const player = gameState.player;
        player.energy = Math.min(player.maxEnergy, player.energy + 15);
        updateUI();
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
            const currentGold = DataManager.getNumber(gameState.player.gold, 0);
            let shopHTML = `
                <div style="margin-bottom: 15px; padding: 10px; background: #f0f0f0; border-radius: 5px;">
                    <p style="margin: 0; font-size: 1.1em;"><strong>💰 當前金幣: ${currentGold}</strong></p>
                </div>
                <div class="shop-items-list">`;
            
            // 按類別分組顯示
            const categories = {
                consumable: { name: '消耗品', items: [] },
                permanent: { name: '永久提升', items: [] },
                premium: { name: '高級物品', items: [] }
            };
            
            gameState.shop.forEach((item, index) => {
                const category = item.category || 'consumable';
                if (categories[category]) {
                    categories[category].items.push({ item, index });
                }
            });
            
            // 顯示每個類別
            Object.keys(categories).forEach(categoryKey => {
                const category = categories[categoryKey];
                if (category.items.length > 0) {
                    shopHTML += `<div style="margin-bottom: 20px;"><h3 style="color: #666; font-size: 1em; margin-bottom: 10px; padding-bottom: 5px; border-bottom: 2px solid #e0e0e0;">${category.name}</h3>`;
                    
                    category.items.forEach(({ item, index }) => {
                        const canAfford = currentGold >= DataManager.getNumber(item.cost, 0);
                        const isOutOfStock = item.stock === 0;
                        const icon = item.icon || '📦';
                        
                        shopHTML += `
                            <div class="shop-item" style="background: ${canAfford ? '#fff' : '#f5f5f5'}; border: 1px solid ${canAfford ? '#4caf50' : '#ccc'}; border-radius: 6px; padding: 12px; margin-bottom: 10px;">
                                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                                    <span style="font-size: 1.5em;">${icon}</span>
                                    <h4 style="margin: 0; color: #333; font-size: 1em;">${item.name}</h4>
                                </div>
                                <p style="margin: 5px 0; color: #666; font-size: 0.9em; line-height: 1.4;">${item.description}</p>
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
                                    <p style="margin: 0; font-weight: 600; color: #ff9800;"><strong>💰 ${item.cost} 金幣</strong></p>
                                    <button class="btn btn-shop" ${!canAfford || isOutOfStock ? 'disabled' : ''} onclick="buyItem(${index})" style="padding: 8px 16px; font-size: 0.9em;">
                                        ${isOutOfStock ? '已售完' : !canAfford ? '💰不足' : '購買'}
                                    </button>
                                </div>
                            </div>
                        `;
                    });
                    
                    shopHTML += '</div>';
                }
            });
            
            shopHTML += '</div>';
            elements.infoPanelContent.innerHTML = shopHTML;
            break;
            
        case 'training':
            elements.infoPanelTitle.textContent = '訓練設施';
            elements.infoPanelContent.innerHTML = `
                <div style="color: #666; line-height: 1.6;">
                    <p style="margin-bottom: 15px;"><strong>在城鎮中，你可以通過訓練來提升各項能力。訓練效果會根據你的等級、當前能力和訓練次數進行補正。</strong></p>
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-top: 15px;">
                        <button class="btn btn-training" onclick="TrainingSystem.performTraining('stamina')" style="padding: 15px 10px; background: white; border: 2px solid #4caf50; border-radius: 8px; cursor: pointer; transition: all 0.2s ease; font-size: 14px; font-weight: 500; color: #2e7d32; text-align: center;">
                            體能訓練<br><small style="display: block; font-size: 0.85em; margin-top: 5px; opacity: 0.8;">提升最大生命值</small>
                        </button>
                        <button class="btn btn-training" onclick="TrainingSystem.performTraining('strength')" style="padding: 15px 10px; background: white; border: 2px solid #4caf50; border-radius: 8px; cursor: pointer; transition: all 0.2s ease; font-size: 14px; font-weight: 500; color: #2e7d32; text-align: center;">
                            力量訓練<br><small style="display: block; font-size: 0.85em; margin-top: 5px; opacity: 0.8;">提升攻擊力</small>
                        </button>
                        <button class="btn btn-training" onclick="TrainingSystem.performTraining('defense')" style="padding: 15px 10px; background: white; border: 2px solid #4caf50; border-radius: 8px; cursor: pointer; transition: all 0.2s ease; font-size: 14px; font-weight: 500; color: #2e7d32; text-align: center;">
                            防禦訓練<br><small style="display: block; font-size: 0.85em; margin-top: 5px; opacity: 0.8;">提升防禦力</small>
                        </button>
                        <button class="btn btn-training" onclick="TrainingSystem.performTraining('precision')" style="padding: 15px 10px; background: white; border: 2px solid #4caf50; border-radius: 8px; cursor: pointer; transition: all 0.2s ease; font-size: 14px; font-weight: 500; color: #2e7d32; text-align: center;">
                            精準訓練<br><small style="display: block; font-size: 0.85em; margin-top: 5px; opacity: 0.8;">提升暴擊率</small>
                        </button>
                        <button class="btn btn-training" onclick="TrainingSystem.performTraining('agility')" style="padding: 15px 10px; background: white; border: 2px solid #4caf50; border-radius: 8px; cursor: pointer; transition: all 0.2s ease; font-size: 14px; font-weight: 500; color: #2e7d32; text-align: center;">
                            敏捷訓練<br><small style="display: block; font-size: 0.85em; margin-top: 5px; opacity: 0.8;">提升閃避率</small>
                        </button>
                        <button class="btn btn-training" onclick="TrainingSystem.performTraining('meditation')" style="padding: 15px 10px; background: white; border: 2px solid #4caf50; border-radius: 8px; cursor: pointer; transition: all 0.2s ease; font-size: 14px; font-weight: 500; color: #2e7d32; text-align: center;">
                            冥想訓練<br><small style="display: block; font-size: 0.85em; margin-top: 5px; opacity: 0.8;">提升經驗獲取倍率</small>
                        </button>
                    </div>
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
            elements.infoPanelTitle.textContent = '🏨 旅館';
            const innMaxHealth = DataManager.getNumber(gameState.player.maxHealth, 100);
            const innCurrentHealth = DataManager.getNumber(gameState.player.health, 0);
            const innHealthPercent = Math.floor((innCurrentHealth / innMaxHealth) * 100);
            const innCurrentGold = DataManager.getNumber(gameState.player.gold, 0);
            const healAmount = innMaxHealth - innCurrentHealth;
            
            // 計算不同服務的價格
            const basicRestCost = 10; // 基礎休息：恢復30%
            const goodRestCost = 25; // 良好休息：恢復60%
            const luxuryRestCost = 50; // 豪華休息：完全恢復
            
            const canAffordBasic = innCurrentGold >= basicRestCost;
            const canAffordGood = innCurrentGold >= goodRestCost;
            const canAffordLuxury = innCurrentGold >= luxuryRestCost;
            
            elements.infoPanelContent.innerHTML = `
                <div style="color: #666; line-height: 1.6;">
                    <p style="margin-bottom: 15px; font-size: 1.05em;">🏨 歡迎來到旅館！這裡提供各種休息服務來恢復你的生命值。</p>
                    
                    <div style="background: #f5f5f5; padding: 12px; border-radius: 6px; margin-bottom: 15px; border-left: 3px solid #4caf50;">
                        <p style="margin: 5px 0; font-size: 0.95em;"><strong>當前生命值:</strong> <span style="color: ${innHealthPercent > 60 ? '#4caf50' : innHealthPercent > 30 ? '#ff9800' : '#f44336'}; font-weight: 600;">${innCurrentHealth}/${innMaxHealth}</span> (${innHealthPercent}%)</p>
                        <p style="margin: 5px 0; font-size: 0.95em;"><strong>💰 當前金幣:</strong> ${innCurrentGold}</p>
                        ${healAmount > 0 ? `<p style="margin: 5px 0; font-size: 0.9em; color: #888;">可恢復: ${healAmount} 點生命值</p>` : '<p style="margin: 5px 0; font-size: 0.9em; color: #4caf50;">生命值已滿！</p>'}
                    </div>
                    
                    <p style="margin-bottom: 10px; font-weight: 600; color: #333;">服務選項：</p>
                    
                    <div style="display: flex; flex-direction: column; gap: 10px;">
                        <!-- 基礎休息 -->
                        <div style="background: ${canAffordBasic ? '#fff' : '#f5f5f5'}; border: 1px solid ${canAffordBasic ? '#4caf50' : '#ccc'}; border-radius: 6px; padding: 12px;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                                <div>
                                    <h4 style="margin: 0; color: #333; font-size: 1em;">🛏️ 基礎休息</h4>
                                    <p style="margin: 5px 0 0 0; color: #666; font-size: 0.85em;">恢復30%生命值</p>
                                </div>
                                <span style="font-weight: 600; color: #ff9800;">💰 ${basicRestCost}</span>
                            </div>
                            <button class="btn btn-inn-basic" onclick="stayAtInn('basic')" ${!canAffordBasic || healAmount <= 0 ? 'disabled' : ''} style="width: 100%; padding: 10px; background: ${canAffordBasic ? '#4caf50' : '#ccc'}; color: white; border: none; border-radius: 4px; cursor: ${canAffordBasic ? 'pointer' : 'not-allowed'}; font-size: 0.9em;">
                                ${!canAffordBasic ? '💰不足' : healAmount <= 0 ? '生命值已滿' : '選擇此服務'}
                            </button>
                        </div>
                        
                        <!-- 良好休息 -->
                        <div style="background: ${canAffordGood ? '#fff' : '#f5f5f5'}; border: 1px solid ${canAffordGood ? '#2196f3' : '#ccc'}; border-radius: 6px; padding: 12px;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                                <div>
                                    <h4 style="margin: 0; color: #333; font-size: 1em;">🛋️ 良好休息</h4>
                                    <p style="margin: 5px 0 0 0; color: #666; font-size: 0.85em;">恢復60%生命值</p>
                                </div>
                                <span style="font-weight: 600; color: #ff9800;">💰 ${goodRestCost}</span>
                            </div>
                            <button class="btn btn-inn-good" onclick="stayAtInn('good')" ${!canAffordGood || healAmount <= 0 ? 'disabled' : ''} style="width: 100%; padding: 10px; background: ${canAffordGood ? '#2196f3' : '#ccc'}; color: white; border: none; border-radius: 4px; cursor: ${canAffordGood ? 'pointer' : 'not-allowed'}; font-size: 0.9em;">
                                ${!canAffordGood ? '💰不足' : healAmount <= 0 ? '生命值已滿' : '選擇此服務'}
                            </button>
                        </div>
                        
                        <!-- 豪華休息 -->
                        <div style="background: ${canAffordLuxury ? '#fff' : '#f5f5f5'}; border: 1px solid ${canAffordLuxury ? '#ff9800' : '#ccc'}; border-radius: 6px; padding: 12px;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                                <div>
                                    <h4 style="margin: 0; color: #333; font-size: 1em;">✨ 豪華休息</h4>
                                    <p style="margin: 5px 0 0 0; color: #666; font-size: 0.85em;">完全恢復生命值</p>
                                </div>
                                <span style="font-weight: 600; color: #ff9800;">💰 ${luxuryRestCost}</span>
                            </div>
                            <button class="btn btn-inn-luxury" onclick="stayAtInn('luxury')" ${!canAffordLuxury || healAmount <= 0 ? 'disabled' : ''} style="width: 100%; padding: 10px; background: ${canAffordLuxury ? '#ff9800' : '#ccc'}; color: white; border: none; border-radius: 4px; cursor: ${canAffordLuxury ? 'pointer' : 'not-allowed'}; font-size: 0.9em;">
                                ${!canAffordLuxury ? '💰不足' : healAmount <= 0 ? '生命值已滿' : '選擇此服務'}
                            </button>
                        </div>
                    </div>
                    
                    <div style="margin-top: 15px; padding: 10px; background: #fff3cd; border-radius: 5px; border-left: 3px solid #ffc107;">
                        <p style="margin: 0; font-size: 0.85em; color: #856404;">💡 提示：選擇合適的休息服務可以節省金幣。如果生命值損失不多，基礎休息就足夠了！</p>
                    </div>
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
            elements.infoPanelTitle.textContent = '資訊';
            elements.infoPanelContent.innerHTML = '<p style="color: #666; text-align: center; padding: 20px;">選擇行動來查看詳細資訊</p>';
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
    
    // 檢查體力
    if (!consumeEnergy(10, '戰鬥')) {
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
    
    // 檢查體力
    if (!consumeEnergy(25, '挑戰Boss')) {
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
        
        // 升級時也提升最大體力
        const currentMaxEnergy = DataManager.getNumber(gameState.player.maxEnergy, 100);
        gameState.player.maxEnergy = currentMaxEnergy + 10;
        gameState.player.energy = gameState.player.maxEnergy; // 升級時完全恢復體力
        
        addLog(`恭喜升級！你現在是${gameState.player.level}級！`);
        addLog('生命值、攻擊力、防禦力、最大體力都提升了！');
        addLog('✨ 體力完全恢復！');
        
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
    
    const player = gameState.player;
    const maxHealth = DataManager.getNumber(player.maxHealth, 100);
    const currentHealth = DataManager.getNumber(player.health, 0);
    const healAmount = DataManager.safeMath(() => Math.floor(maxHealth * 0.3), 30);
    
    player.health = Math.min(maxHealth, currentHealth + healAmount);
    
    // 恢復體力（休息恢復50%體力）
    const maxEnergy = DataManager.getNumber(player.maxEnergy, 100);
    const currentEnergy = DataManager.getNumber(player.energy, 0);
    const energyRestore = DataManager.safeMath(() => Math.floor(maxEnergy * 0.5), 50);
    player.energy = Math.min(maxEnergy, currentEnergy + energyRestore);
    
    addLog(`你休息了一會兒，恢復了${healAmount}點生命值和${energyRestore}點體力。`);
    updateUI();
    
    // 重新啟用按鈕
    elements.battleBtn.disabled = false;
    elements.bossBtn.disabled = false;
}

// 旅館住宿
function stayAtInn(restType = 'luxury') {
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
    const currentGold = DataManager.getNumber(gameState.player.gold, 0);
    
    if (currentHealth >= maxHealth) {
        addLog('你的生命值已經滿了，不需要住宿。');
        updateInfoPanel('inn');
        return;
    }
    
    // 根據休息類型計算價格和恢復量
    let restCost = 0;
    let healPercent = 0;
    let restName = '';
    let restDescription = '';
    
    switch(restType) {
        case 'basic':
            restCost = 10;
            healPercent = 0.3;
            restName = '基礎休息';
            restDescription = '你在旅館的普通房間休息了一晚';
            break;
        case 'good':
            restCost = 25;
            healPercent = 0.6;
            restName = '良好休息';
            restDescription = '你在旅館的舒適房間好好休息了一晚';
            break;
        case 'luxury':
        default:
            restCost = 50;
            healPercent = 1.0;
            restName = '豪華休息';
            restDescription = '你在旅館的豪華套房中享受了完美的休息';
            break;
    }
    
    // 檢查金幣
    if (currentGold < restCost) {
        addLog(`💰 金幣不足！需要 ${restCost} 金幣，你只有 ${currentGold} 金幣。`);
        updateInfoPanel('inn');
        return;
    }
    
    // 扣除金幣
    gameState.player.gold = currentGold - restCost;
    
    // 計算恢復量
    const healAmount = Math.min(
        Math.floor(maxHealth * healPercent),
        maxHealth - currentHealth
    );
    
    // 恢復生命值
    gameState.player.health = Math.min(currentHealth + healAmount, maxHealth);
    
    // 恢復體力（根據休息類型恢復不同比例的體力）
    const maxEnergy = DataManager.getNumber(gameState.player.maxEnergy, 100);
    const currentEnergy = DataManager.getNumber(gameState.player.energy, 0);
    let energyRestore = 0;
    switch(restType) {
        case 'basic':
            energyRestore = Math.floor(maxEnergy * 0.3);
            break;
        case 'good':
            energyRestore = Math.floor(maxEnergy * 0.6);
            break;
        case 'luxury':
        default:
            energyRestore = maxEnergy; // 完全恢復
            break;
    }
    gameState.player.energy = Math.min(maxEnergy, currentEnergy + energyRestore);
    
    // 顯示結果
    addLog(`🏨 ${restDescription}，恢復了${healAmount}點生命值和${energyRestore}點體力！`);
    addLog(`💰 花費了 ${restCost} 金幣。剩餘金幣: ${gameState.player.gold}`);
    
    if (restType === 'luxury' && gameState.player.health >= maxHealth) {
        addLog('✨ 你感覺精力充沛，完全恢復了！');
    }
    
    updateUI();
    updateInfoPanel('inn');
}

// 執行城鎮行動
function executeTownAction(actionType) {
    const player = gameState.player;
    const playerLevel = DataManager.getNumber(player.level, 1);
    
    switch(actionType) {
        case 'bulletin':
            // 查看公告欄
            if (!consumeEnergy(5, '查看公告欄')) {
                return;
            }
            addLog('📋 你查看了村莊的公告欄，上面寫著各種冒險者的消息和懸賞任務。');
            
            const bulletins = [
                {
                    title: '黑暗森林的威脅',
                    content: '最近黑暗森林中出現了強大的怪物，有冒險者懸賞擊敗這些怪物，獎勵豐厚！',
                    reward: () => {
                        const goldGain = 10 + playerLevel * 2;
                        const expGain = 5 + playerLevel;
                        player.gold = DataManager.getNumber(player.gold, 0) + goldGain;
                        player.exp = DataManager.getNumber(player.exp, 0) + expGain;
                        addLog(`💰 獲得 ${goldGain} 金幣和 ${expGain} 經驗值！`);
                    }
                },
                {
                    title: '荒蕪平原的寶藏',
                    content: '有傳聞說荒蕪平原深處隱藏著珍貴的寶藏，但需要強大的實力才能獲得。',
                    reward: () => {
                        const goldGain = 15 + playerLevel * 3;
                        player.gold = DataManager.getNumber(player.gold, 0) + goldGain;
                        addLog(`💰 獲得 ${goldGain} 金幣！`);
                    }
                },
                {
                    title: '惡魔洞穴的挑戰',
                    content: '惡魔洞穴是Boss的巢穴，只有最強大的冒險者才敢進入。成功者將獲得豐厚獎勵！',
                    reward: () => {
                        const expGain = 10 + playerLevel * 2;
                        player.exp = DataManager.getNumber(player.exp, 0) + expGain;
                        addLog(`📚 獲得 ${expGain} 經驗值！`);
                    }
                }
            ];
            
            const bulletin = bulletins[Math.floor(Math.random() * bulletins.length)];
            addLog(`📌 ${bulletin.title}`);
            addLog(bulletin.content);
            bulletin.reward();
            checkLevelUp();
            break;
            
        case 'gossip':
            // 打聽情報
            if (!consumeEnergy(5, '打聽情報')) {
                return;
            }
            addLog('💬 你向村莊的居民打聽情報，了解附近地區的情況。');
            
            const tips = [
                {
                    content: '據說荒蕪平原的怪物比黑暗森林更強，但獎勵也更豐厚。',
                    reward: () => {
                        const goldGain = 5 + playerLevel;
                        player.gold = DataManager.getNumber(player.gold, 0) + goldGain;
                        addLog(`💰 獲得 ${goldGain} 金幣作為感謝！`);
                    }
                },
                {
                    content: '惡魔洞穴是Boss的巢穴，只有強大的冒險者才敢進入。',
                    reward: () => {
                        const expGain = 3 + playerLevel;
                        player.exp = DataManager.getNumber(player.exp, 0) + expGain;
                        addLog(`📚 獲得 ${expGain} 經驗值！`);
                    }
                },
                {
                    content: '有傳聞說，擊敗Boss可以獲得特殊的獎勵和稱號。',
                    reward: () => {
                        const goldGain = 8 + playerLevel * 2;
                        player.gold = DataManager.getNumber(player.gold, 0) + goldGain;
                        addLog(`💰 獲得 ${goldGain} 金幣！`);
                    }
                },
                {
                    content: '聽說訓練設施可以大幅提升能力，但需要持續訓練才能看到效果。',
                    reward: () => {
                        const expGain = 5 + playerLevel;
                        player.exp = DataManager.getNumber(player.exp, 0) + expGain;
                        addLog(`📚 獲得 ${expGain} 經驗值！`);
                    }
                }
            ];
            
            const tip = tips[Math.floor(Math.random() * tips.length)];
            addLog(`💡 ${tip.content}`);
            tip.reward();
            checkLevelUp();
            break;
            
        case 'ranking':
            // 查看排行榜
            if (!consumeEnergy(5, '查看排行榜')) {
                return;
            }
            addLog('🏆 你查看了冒險者排行榜，了解自己的排名。');
            addLog(`📊 你的冒險統計：`);
            addLog(`等級: ${player.level} | 擊殺數: ${player.kills} | Boss擊殺: ${player.bossKills}`);
            addLog(`總獲得金幣: ${player.totalGold.toLocaleString()}`);
            
            // 根據統計給予獎勵
            const statsReward = Math.floor((player.kills + player.bossKills * 5) * 0.5);
            if (statsReward > 0) {
                const goldGain = statsReward;
                player.gold = DataManager.getNumber(player.gold, 0) + goldGain;
                addLog(`💰 根據你的成就，獲得 ${goldGain} 金幣獎勵！`);
            }
            break;
            
        case 'help':
            // 幫助村民
            if (!consumeEnergy(15, '幫助村民')) {
                return;
            }
            addLog('🤝 你幫助村民完成了任務。');
            
            const helpRewards = [
                {
                    name: '搬運貨物',
                    gold: 20 + playerLevel * 3,
                    exp: 10 + playerLevel * 2
                },
                {
                    name: '驅趕野獸',
                    gold: 25 + playerLevel * 4,
                    exp: 15 + playerLevel * 3
                },
                {
                    name: '修復建築',
                    gold: 30 + playerLevel * 5,
                    exp: 20 + playerLevel * 4
                }
            ];
            
            const helpTask = helpRewards[Math.floor(Math.random() * helpRewards.length)];
            addLog(`✅ 完成了「${helpTask.name}」任務！`);
            
            player.gold = DataManager.getNumber(player.gold, 0) + helpTask.gold;
            player.exp = DataManager.getNumber(player.exp, 0) + helpTask.exp;
            player.totalGold = DataManager.getNumber(player.totalGold, 0) + helpTask.gold;
            
            addLog(`💰 獲得 ${helpTask.gold} 金幣！`);
            addLog(`📚 獲得 ${helpTask.exp} 經驗值！`);
            checkLevelUp();
            break;
            
        case 'arena':
            // 參加競技場
            if (!consumeEnergy(20, '參加競技場')) {
                return;
            }
            addLog('⚔️ 你參加了城鎮競技場的挑戰！');
            
            const arenaLevel = Math.floor(playerLevel / 2) + 1;
            const arenaGold = 50 + arenaLevel * 10 + Math.floor(Math.random() * 30);
            const arenaExp = 30 + arenaLevel * 5 + Math.floor(Math.random() * 20);
            
            addLog(`🎯 你在第 ${arenaLevel} 級競技場中取得了勝利！`);
            
            player.gold = DataManager.getNumber(player.gold, 0) + arenaGold;
            player.exp = DataManager.getNumber(player.exp, 0) + arenaExp;
            player.totalGold = DataManager.getNumber(player.totalGold, 0) + arenaGold;
            
            addLog(`💰 獲得 ${arenaGold} 金幣！`);
            addLog(`📚 獲得 ${arenaExp} 經驗值！`);
            
            // 有機率獲得額外獎勵
            if (Math.random() < 0.3) {
                const bonusGold = 20 + playerLevel * 2;
                player.gold = DataManager.getNumber(player.gold, 0) + bonusGold;
                addLog(`✨ 額外獲得 ${bonusGold} 金幣的獎勵！`);
            }
            
            checkLevelUp();
            break;
            
        case 'treasure':
            // 尋找寶藏
            if (!consumeEnergy(10, '尋找寶藏')) {
                return;
            }
            addLog('💎 你在城鎮中尋找隱藏的寶藏...');
            
            const treasureChance = Math.random();
            if (treasureChance < 0.4) {
                // 找到小寶藏
                const smallGold = 15 + playerLevel * 2 + Math.floor(Math.random() * 20);
                player.gold = DataManager.getNumber(player.gold, 0) + smallGold;
                player.totalGold = DataManager.getNumber(player.totalGold, 0) + smallGold;
                addLog(`💰 找到了一個小寶箱！獲得 ${smallGold} 金幣！`);
            } else if (treasureChance < 0.7) {
                // 找到中等寶藏
                const mediumGold = 30 + playerLevel * 4 + Math.floor(Math.random() * 30);
                const mediumExp = 10 + playerLevel * 2;
                player.gold = DataManager.getNumber(player.gold, 0) + mediumGold;
                player.exp = DataManager.getNumber(player.exp, 0) + mediumExp;
                player.totalGold = DataManager.getNumber(player.totalGold, 0) + mediumGold;
                addLog(`💰 找到了一個寶箱！獲得 ${mediumGold} 金幣和 ${mediumExp} 經驗值！`);
                checkLevelUp();
            } else if (treasureChance < 0.9) {
                // 找到大寶藏
                const largeGold = 50 + playerLevel * 6 + Math.floor(Math.random() * 50);
                const largeExp = 20 + playerLevel * 3;
                player.gold = DataManager.getNumber(player.gold, 0) + largeGold;
                player.exp = DataManager.getNumber(player.exp, 0) + largeExp;
                player.totalGold = DataManager.getNumber(player.totalGold, 0) + largeGold;
                addLog(`💰✨ 找到了一個大寶箱！獲得 ${largeGold} 金幣和 ${largeExp} 經驗值！`);
                checkLevelUp();
            } else {
                // 找到稀有寶藏
                const rareGold = 100 + playerLevel * 10;
                const rareExp = 50 + playerLevel * 5;
                player.gold = DataManager.getNumber(player.gold, 0) + rareGold;
                player.exp = DataManager.getNumber(player.exp, 0) + rareExp;
                player.totalGold = DataManager.getNumber(player.totalGold, 0) + rareGold;
                addLog(`💰💎 找到了稀有寶箱！獲得 ${rareGold} 金幣和 ${rareExp} 經驗值！`);
                checkLevelUp();
            }
            break;
            
        case 'blacksmith':
            // 拜訪鐵匠
            const blacksmithCost = 30;
            const currentGold = DataManager.getNumber(player.gold, 0);
            
            if (currentGold < blacksmithCost) {
                addLog(`💰 金幣不足！需要 ${blacksmithCost} 金幣，你只有 ${currentGold} 金幣。`);
                return;
            }
            
            if (!consumeEnergy(15, '拜訪鐵匠')) {
                return;
            }
            
            player.gold = currentGold - blacksmithCost;
            addLog('🔨 你拜訪了鐵匠，向他學習了武器和防具的知識。');
            
            // 隨機提升一項屬性
            const statTypes = ['attack', 'defense', 'critChance', 'dodgeChance'];
            const statType = statTypes[Math.floor(Math.random() * statTypes.length)];
            
            switch(statType) {
                case 'attack':
                    const currentAttack = DataManager.getNumber(player.attack, 10);
                    const attackGain = 2 + Math.floor(playerLevel / 3);
                    player.attack = currentAttack + attackGain;
                    addLog(`⚔️ 攻擊力提升了 ${attackGain} 點！`);
                    break;
                case 'defense':
                    const currentDefense = DataManager.getNumber(player.defense, 5);
                    const defenseGain = 1 + Math.floor(playerLevel / 4);
                    player.defense = currentDefense + defenseGain;
                    addLog(`🛡️ 防禦力提升了 ${defenseGain} 點！`);
                    break;
                case 'critChance':
                    const currentCrit = DataManager.getNumber(player.critChance, 0.1);
                    const critGain = 0.01 + Math.floor(playerLevel / 10) * 0.005;
                    player.critChance = Math.min(currentCrit + critGain, 0.5);
                    addLog(`💥 暴擊率提升了 ${(critGain * 100).toFixed(1)}%！`);
                    break;
                case 'dodgeChance':
                    const currentDodge = DataManager.getNumber(player.dodgeChance, 0.05);
                    const dodgeGain = 0.008 + Math.floor(playerLevel / 10) * 0.004;
                    player.dodgeChance = Math.min(currentDodge + dodgeGain, 0.4);
                    addLog(`🌀 閃避率提升了 ${(dodgeGain * 100).toFixed(1)}%！`);
                    break;
            }
            
            addLog(`💰 花費了 ${blacksmithCost} 金幣。`);
            break;
            
        default:
            addLog('未知的行動類型！');
            return;
    }
    
    updateUI();
    updateInfoPanel('action');
}

// 城鎮行動（保留舊函數以兼容）
function viewTownAction() {
    // 直接顯示行動面板，不消耗體力
    updateInfoPanel('action');
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
    
    if (!item) {
        addLog('錯誤：找不到該物品！');
        return;
    }
    
    const itemCost = DataManager.getNumber(item.cost, 0);
    const currentGold = DataManager.getNumber(player.gold, 0);
    
    if (currentGold < itemCost) {
        addLog(`💰 金幣不足！需要 ${itemCost} 金幣，你只有 ${currentGold} 金幣。`);
        return;
    }
    
    if (item.stock === 0) {
        addLog('該物品已售完！');
        return;
    }
    
    // 扣除金幣
    player.gold = currentGold - itemCost;
    const itemValue = DataManager.getNumber(item.value, 0);
    const icon = item.icon || '📦';
    
    // 根據物品類型處理效果
    switch (item.type) {
        case 'heal':
            const maxHealth = DataManager.getNumber(player.maxHealth, 100);
            const currentHealth = DataManager.getNumber(player.health, 0);
            const healAmount = Math.min(itemValue, maxHealth - currentHealth);
            player.health = Math.min(maxHealth, currentHealth + itemValue);
            if (healAmount > 0) {
                addLog(`${icon} 使用了${item.name}，恢復了${healAmount}點生命值！`);
            } else {
                addLog(`${icon} 使用了${item.name}，但你的生命值已經滿了！`);
            }
            break;
            
        case 'attack':
            const currentAttack = DataManager.getNumber(player.attack, 10);
            player.attack = currentAttack + itemValue;
            addLog(`${icon} 使用了${item.name}，攻擊力永久增加${itemValue}點！(現在: ${player.attack})`);
            break;
            
        case 'defense':
            const currentDefense = DataManager.getNumber(player.defense, 5);
            player.defense = currentDefense + itemValue;
            addLog(`${icon} 使用了${item.name}，防禦力永久增加${itemValue}點！(現在: ${player.defense})`);
            break;
            
        case 'maxHealth':
            const currentMaxHealth = DataManager.getNumber(player.maxHealth, 100);
            const currentHealth2 = DataManager.getNumber(player.health, 0);
            player.maxHealth = currentMaxHealth + itemValue;
            player.health = currentHealth2 + itemValue; // 同時增加當前生命值
            addLog(`${icon} 使用了${item.name}，最大生命值永久增加${itemValue}點！(現在: ${player.maxHealth})`);
            break;
            
        case 'critChance':
            const currentCritChance = DataManager.getNumber(player.critChance, 0.1);
            player.critChance = currentCritChance + itemValue;
            const newCritPercent = Math.floor(player.critChance * 100);
            addLog(`${icon} 使用了${item.name}，暴擊率永久增加${Math.floor(itemValue * 100)}%！(現在: ${newCritPercent}%)`);
            break;
            
        case 'dodgeChance':
            const currentDodgeChance = DataManager.getNumber(player.dodgeChance, 0.05);
            player.dodgeChance = currentDodgeChance + itemValue;
            const newDodgePercent = Math.floor(player.dodgeChance * 100);
            addLog(`${icon} 使用了${item.name}，閃避率永久增加${Math.floor(itemValue * 100)}%！(現在: ${newDodgePercent}%)`);
            break;
            
        case 'exp':
            const currentExp = DataManager.getNumber(player.exp, 0);
            player.exp = currentExp + itemValue;
            addLog(`${icon} 使用了${item.name}，獲得了${itemValue}點經驗值！`);
            // 檢查是否升級
            checkLevelUp();
            break;
            
        default:
            addLog(`未知的物品類型：${item.type}`);
            // 退還金幣
            player.gold = currentGold;
            return;
    }
    
    // 更新庫存（如果有限制）
    if (item.stock > 0) {
        item.stock--;
    }
    
    // 更新UI和商店顯示
    updateUI();
    updateInfoPanel('shop');
    
    // 顯示購買成功訊息
    addLog(`💰 購買成功！剩餘金幣: ${player.gold}`);
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
// closeShop 已移除（商店現在在右側面板顯示）
if (elements.closeShop) {
    elements.closeShop.addEventListener('click', closeShop);
}
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
if (elements.townTrainingBtn) {
    elements.townTrainingBtn.addEventListener('click', () => updateInfoPanel('training'));
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

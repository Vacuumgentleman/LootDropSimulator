export const RARITIES = {
  COMMON: 'Common',
  RARE: 'Rare',
  EPIC: 'Epic',
};

export const RARITY_CONFIG = {
  Common: {
    color: '#9E9E9E',
    bgColor: '#1c1c1c',
    borderColor: '#616161',
    glowColor: '#424242',
    label: 'Común',
    probability: 0.60,
  },
  Rare: {
    color: '#42A5F5',
    bgColor: '#0a1929',
    borderColor: '#1565C0',
    glowColor: '#0d47a1',
    label: 'Raro',
    probability: 0.30,
  },
  Epic: {
    color: '#CE93D8',
    bgColor: '#1a0a2e',
    borderColor: '#7B1FA2',
    glowColor: '#4a148c',
    label: 'Épico',
    probability: 0.10,
  },
};

const LOOT_TABLES = {
  Common: [
    { name: 'Escudo de Madera',   emoji: '🛡️',  baseColor: '#8B7355' },
    { name: 'Espada de Hierro',   emoji: '⚔️',  baseColor: '#B0BEC5' },
    { name: 'Poción de Salud',    emoji: '🧪',  baseColor: '#EF5350' },
    { name: 'Botas de Cuero',     emoji: '👢',  baseColor: '#8D6E63' },
    { name: 'Moneda de Bronce',   emoji: '🪙',  baseColor: '#CD7F32' },
    { name: 'Anillo de Piedra',   emoji: '💍',  baseColor: '#90A4AE' },
  ],
  Rare: [
    { name: 'Arco Encantado',     emoji: '🏹',  baseColor: '#42A5F5' },
    { name: 'Armadura de Plata',  emoji: '🦺',  baseColor: '#78909C' },
    { name: 'Pergamino Mágico',   emoji: '📜',  baseColor: '#7E57C2' },
    { name: 'Escama de Dragón',   emoji: '🐉',  baseColor: '#26C6DA' },
    { name: 'Orbe Místico',       emoji: '🔮',  baseColor: '#26A69A' },
    { name: 'Bastón de Truenos',  emoji: '⚡',  baseColor: '#29B6F6' },
  ],
  Epic: [
    { name: 'Excalibur',             emoji: '🗡️',  baseColor: '#FFD700' },
    { name: 'Corazón de Dragón',     emoji: '🔥',  baseColor: '#F44336' },
    { name: 'Corona Ancestral',      emoji: '👑',  baseColor: '#FFC107' },
    { name: 'Pluma de Fénix',        emoji: '✨',  baseColor: '#FF7043' },
    { name: 'Cristal de Alma',       emoji: '💠',  baseColor: '#E040FB' },
    { name: 'Fragmento del Vacío',   emoji: '🌑',  baseColor: '#7C4DFF' },
  ],
};

let _idCounter = 0;

export function rollLoot() {
  const rand = Math.random();
  if (rand < 0.60) return RARITIES.COMMON;
  if (rand < 0.90) return RARITIES.RARE;
  return RARITIES.EPIC;
}

export function generateItem(rarity) {
  const table = LOOT_TABLES[rarity];
  const item = table[Math.floor(Math.random() * table.length)];
  const config = RARITY_CONFIG[rarity];

  return {
    id: `${Date.now()}_${_idCounter++}`,
    name: item.name,
    rarity,
    visualConfig: {
      emoji: item.emoji,
      baseColor: item.baseColor,
      rarityColor: config.color,
      bgColor: config.bgColor,
      borderColor: config.borderColor,
      glowColor: config.glowColor,
    },
  };
}

export function openLootBoxes(amount) {
  const results = [];
  for (let i = 0; i < amount; i++) {
    results.push(generateItem(rollLoot()));
  }
  return results;
}

export function validateInput(value) {
  const trimmed = String(value).trim();
  if (trimmed === '') {
    return { valid: false, error: 'Ingresa un número' };
  }
  const num = parseInt(trimmed, 10);
  if (isNaN(num) || num <= 0) {
    return { valid: false, error: 'Debe ser un número entero mayor a 0' };
  }
  if (num > 100) {
    return { valid: false, error: 'Máximo 100 cofres por vez' };
  }
  return { valid: true, value: num };
}

export function calculateStats(history) {
  const total = history.length;
  const counts = { Common: 0, Rare: 0, Epic: 0 };

  history.forEach(item => {
    if (counts[item.rarity] !== undefined) {
      counts[item.rarity]++;
    }
  });

  const percentages = {};
  Object.keys(counts).forEach(rarity => {
    percentages[rarity] = total > 0
      ? ((counts[rarity] / total) * 100).toFixed(1)
      : '0.0';
  });

  return { total, counts, percentages };
}

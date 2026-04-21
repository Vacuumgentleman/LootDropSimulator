# 🎲 Loot Drop Simulator

A mobile app built with React Native (Expo) that simulates opening loot boxes with animated reveals, rarity-based probabilities, item history, and real-time statistics.

---

## Features

- **Loot box opening** with configurable quantity (1–100 per roll)
- **Three rarity tiers** with weighted probabilities:
  - Common — 60% (gray)
  - Rare — 30% (blue)
  - Epic — 10% (purple)
- **18 unique items** across all rarities (6 per tier), each with a distinct emoji and color
- **Animated reveal system:**
  - Chest shake suspense before each reveal
  - Spring scale + rotation wobble entrance
  - Rarity-specific glow ring pulsing in loop
  - Epic items trigger a 360° card spin and 6-particle burst
  - History rows slide in from the top
  - Stat bars animate to new percentages
- **History panel** — last 20 items with rarity color coding
- **Statistics panel** — total chests opened, count per rarity, real vs. expected percentage bars
- **Reset** to clear all data and start fresh

---

## Tech Stack

- React Native (JavaScript ES6)
- Expo SDK 54
- React 19 / React Native 0.81
- Only built-in APIs — no external animation libraries

---

## Project Structure

```
├── App.js                   # Root component, state management
├── components/
│   ├── LootResult.js        # Animated reveal card for latest item
│   ├── LootCard.js          # Individual item visual with glow and spin
│   ├── LootHistory.js       # Scrollable list of last 20 items
│   └── StatsPanel.js        # Animated stat bars and counters
└── utils/
    └── lootLogic.js         # Probabilities, item tables, input validation
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- Expo Go app on your phone ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent) / [iOS](https://apps.apple.com/app/expo-go/id982107779))

### Run locally

```bash
git clone https://github.com/Vacuumgentleman/LootDropSimulator.git
cd LootDropSimulator
npm install
npx expo start
```

Scan the QR code with Expo Go (SDK 54) to launch on your device.

### Run on web

```bash
npx expo start --web
```

---

## Download APK

> **[⬇ Download latest APK]()**
>
> _(link will be added once the build is ready)_

---

## Build APK (Android)

```bash
npm install -g eas-cli
eas login
eas build:configure
eas build --platform android --profile preview
```

---

## Loot Tables

| Rarity | Items |
|--------|-------|
| Common (60%) | Escudo de Madera, Espada de Hierro, Poción de Salud, Botas de Cuero, Moneda de Bronce, Anillo de Piedra |
| Rare (30%) | Arco Encantado, Armadura de Plata, Pergamino Mágico, Escama de Dragón, Orbe Místico, Bastón de Truenos |
| Epic (10%) | Excalibur, Corazón de Dragón, Corona Ancestral, Pluma de Fénix, Cristal de Alma, Fragmento del Vacío |

# Protocol: MELTDOWN

<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

> **CRITICAL ALERT**: System lockdown in progress. Core temperature rising. Initialize override protocol immediately.

Protocol: MELTDOWN is a hacking-themed puzzle game that challenges players to solve technical and logic-based problems under pressure. This repository contains the project recreated through **four progressive stages of web development architecture**, ranging from raw Vanilla Web to Advanced React with performance optimizations.

---

## 🚀 The 4-Stage Evolution

This project demonstrates the transition of a codebase through different architectural patterns while maintaining 100% feature parity.

### 1. [Vanilla Web](file:///v1-vanilla/) 
**Focus: Fundamentals & Direct DOM Manipulation**
- Zero dependencies.
- Native ES6+ JavaScript.
- CSS Variables for themes.
- Semantic HTML5.

### 2. [Advanced JavaScript](file:///v2-advanced-js/)
**Focus: Object-Oriented & Modular Design**
- ES Modules for code organization.
- Class-based architecture (`GameEngine`, `SoundSystem`).
- Separated UI components from core logic.
- Modularized puzzle definitions.

### 3. [React Version](file:///v3-react/)
**Focus: Declarative UI & Reactive State**
- Built with **Vite** and **TypeScript**.
- Functional Components & React Hooks (`useState`, `useEffect`).
- **Tailwind CSS** for modern utility-first styling.
- Component-based puzzle implementation.

### 4. [Advanced React Version](file:///v4-advanced-react/)
**Focus: Scalability & Performance**
- **Context API** for global state management.
- **Custom Hooks** for reusable logic (`useGame`, `useSound`).
- **Lazy Loading** (Code Splitting) for heavy puzzle modules.
- **Memoization** (`memo`, `useCallback`) to prevent unnecessary re-renders.

---

## 🛠️ Tech Stack

- **Languages**: HTML5, CSS3, JavaScript (ES6+), TypeScript
- **Frameworks**: React 18, Vite
- **Styling**: Vanilla CSS, Tailwind CSS
- **APIs**: Web Audio API (Custom Synthesizer)
- **Icons/Fonts**: Google Fonts (Orbitron, JetBrains Mono, Share Tech Mono), Material Symbols

---

## 🎮 Game Features

- **6 Distinct Puzzles**:
    - `ASYNC_HANDLER`: Debugging a JavaScript Promise race condition.
    - `CIRCUIT_LOGIC`: Configuring Boolean logic gates (AND/OR/XOR).
    - `BITWISE_OPERATIONS`: Calculating permission flags using XOR masks.
    - `ALGORITHM_OPTIMIZER`: Identifying Big O notation for sensor processing.
    - `VISUAL_OVERRIDE`: Fixing CSS z-index and pointer-event conflicts.
    - `DEADLOCK_RESOLUTION`: Forcing resource release in a process gridlock.
- **Dynamic Sound System**: A self-contained audio engine generating real-time synth effects.
- **Hacker Mode**: An encrypted Easter egg activated via the classic Konami Code.
- **Meltdown Timer**: A countdown system with visual and audio red-alerts.
- **Interactive Dev Log**: Hidden lore accessible via system title manipulation.

---

## 💻 How to Run

### Vanilla Versions (1 & 2)
1. Navigate to the folder.
2. Open `index.html` (for v2, use a local server like Live Server).

### React Versions (3 & 4)
```bash
# Navigate to the version
cd v3-react # or cd v4-advanced-react

# Install dependencies
npm install

# Start development server
npm run dev
```

---

## 🎨 Aesthetic Design

Protocol: MELTDOWN uses a high-contrast "Hacker" aesthetic:
- **Primary**: `#00ff41` (Classic Matrix Green)
- **Secondary**: `#00f3ff` (Cyber Blue)
- **Danger**: `#ff003c` (Neon Red)
- **Special Effects**: CRT Scanlines, radial vignettes, and pulse animations.

---

**Developed by Antigravity**  
*Building the future, one protocol at a time.*

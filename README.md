# 🚀 Rocket Casino - Crash Game

A premium web-based crash game built with React, TypeScript, Supabase, and TailwindCSS.

## ✨ Features

- 🔐 **Authentication**: Full user authentication with email/password
- 🎮 **Real-time Game**: Crash game with live multiplier and rocket animation
- 💰 **Wallet System**: Balance management with instant updates
- 🎁 **Bonus System**: Claim free bonuses every minute with streak tracking
- 📊 **User Profile**: Track stats, edit username, and manage account
- 🎨 **Premium Design**: Beautiful gradient UI with smooth animations
- 📱 **Responsive**: Works perfectly on desktop and mobile

## 🛠 Tech Stack

- **Frontend**: React 19, TypeScript, TailwindCSS
- **State Management**: Zustand
- **Backend**: Supabase
- **Routing**: React Router DOM
- **Build Tool**: Vite

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── Header.tsx
│   ├── GameCanvas.tsx
│   ├── BettingPanel.tsx
│   └── BonusPanel.tsx
├── pages/              # Page components
│   ├── Login.tsx
│   ├── Register.tsx
│   └── Game.tsx
├── store/              # Zustand stores
│   ├── authStore.ts
│   ├── walletStore.ts
│   ├── gameStore.ts
│   └── bonusStore.ts
├── services/           # API services
│   └── supabase.ts
├── types/              # TypeScript types
│   └── index.ts
└── assets/             # Static assets
```

## 🎮 How to Play

1. **Register/Login**: Create an account or log in
2. **Place a Bet**: Enter your bet amount (or use quick bet buttons)
3. **Optional**: Set an auto cash-out multiplier
4. **Launch**: Click "Launch Rocket" to start the round
5. **Cash Out**: Click "Cash Out" before the rocket crashes to win!
6. **Claim Bonuses**: Get free $10 every minute from the bonus panel

# 🚀 Rocket Casino - Crash Game

[DEMO GAME](https://rocket-casino-iota.vercel.app/) 

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

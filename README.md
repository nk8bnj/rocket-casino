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
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Routing**: React Router DOM
- **Build Tool**: Vite

## 📦 Installation

1. **Clone the repository**

   ```bash
   cd rocket-casino
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up Supabase**

   a. Create a new project at [supabase.com](https://supabase.com)

   b. Copy your project URL and anon key

   c. Create a `.env` file based on `.env.example`:

   ```bash
   cp .env.example .env
   ```

   d. Update `.env` with your Supabase credentials:

   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

4. **Set up database**

   Run the following SQL in your Supabase SQL Editor:

   ```sql
   -- Create users table
   CREATE TABLE users (
     id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
     email TEXT NOT NULL UNIQUE,
     username TEXT,
     avatar_url TEXT,
     created_at TIMESTAMPTZ DEFAULT NOW()
   );

   -- Create wallet table
   CREATE TABLE wallet (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
     balance DECIMAL(10, 2) DEFAULT 1000.00,
     updated_at TIMESTAMPTZ DEFAULT NOW(),
     UNIQUE(user_id)
   );

   -- Create bets table
   CREATE TABLE bets (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
     round_id UUID,
     amount DECIMAL(10, 2) NOT NULL,
     multiplier DECIMAL(10, 2),
     profit DECIMAL(10, 2),
     created_at TIMESTAMPTZ DEFAULT NOW()
   );

   -- Create rounds table
   CREATE TABLE rounds (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     crash_point DECIMAL(10, 2) NOT NULL,
     started_at TIMESTAMPTZ DEFAULT NOW(),
     ended_at TIMESTAMPTZ,
     status TEXT DEFAULT 'waiting'
   );

   -- Create bonuses table
   CREATE TABLE bonuses (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
     amount DECIMAL(10, 2) NOT NULL,
     claimed_at TIMESTAMPTZ DEFAULT NOW(),
     streak INTEGER DEFAULT 0
   );

   -- Enable Row Level Security
   ALTER TABLE users ENABLE ROW LEVEL SECURITY;
   ALTER TABLE wallet ENABLE ROW LEVEL SECURITY;
   ALTER TABLE bets ENABLE ROW LEVEL SECURITY;
   ALTER TABLE rounds ENABLE ROW LEVEL SECURITY;
   ALTER TABLE bonuses ENABLE ROW LEVEL SECURITY;

   -- Create policies for users table
   CREATE POLICY "Users can view own profile" ON users
     FOR SELECT USING (auth.uid() = id);

   CREATE POLICY "Users can update own profile" ON users
     FOR UPDATE USING (auth.uid() = id);

   CREATE POLICY "Users can insert own profile" ON users
     FOR INSERT WITH CHECK (auth.uid() = id);

   -- Create policies for wallet table
   CREATE POLICY "Users can view own wallet" ON wallet
     FOR SELECT USING (auth.uid() = user_id);

   CREATE POLICY "Users can update own wallet" ON wallet
     FOR UPDATE USING (auth.uid() = user_id);

   CREATE POLICY "Users can insert own wallet" ON wallet
     FOR INSERT WITH CHECK (auth.uid() = user_id);

   -- Create policies for bets table
   CREATE POLICY "Users can view own bets" ON bets
     FOR SELECT USING (auth.uid() = user_id);

   CREATE POLICY "Users can insert own bets" ON bets
     FOR INSERT WITH CHECK (auth.uid() = user_id);

   -- Create policies for rounds table
   CREATE POLICY "Anyone can view rounds" ON rounds
     FOR SELECT TO authenticated USING (true);

   CREATE POLICY "Anyone can insert rounds" ON rounds
     FOR INSERT TO authenticated WITH CHECK (true);

   -- Create policies for bonuses table
   CREATE POLICY "Users can view own bonuses" ON bonuses
     FOR SELECT USING (auth.uid() = user_id);

   CREATE POLICY "Users can insert own bonuses" ON bonuses
     FOR INSERT WITH CHECK (auth.uid() = user_id);

   -- Create indexes for better performance
   CREATE INDEX idx_wallet_user_id ON wallet(user_id);
   CREATE INDEX idx_bets_user_id ON bets(user_id);
   CREATE INDEX idx_bets_round_id ON bets(round_id);
   CREATE INDEX idx_bonuses_user_id ON bonuses(user_id);
   ```

5. **Run the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**

   Navigate to `http://localhost:5173`

## 🎮 How to Play

1. **Register/Login**: Create an account or log in
2. **Place a Bet**: Enter your bet amount (or use quick bet buttons)
3. **Optional**: Set an auto cash-out multiplier
4. **Launch**: Click "Launch Rocket" to start the round
5. **Cash Out**: Click "Cash Out" before the rocket crashes to win!
6. **Claim Bonuses**: Get free $10 every minute from the bonus panel

## 🎨 Design Features

- **Gradient Backgrounds**: Beautiful animated gradients
- **Glass Morphism**: Modern frosted glass effect on cards
- **Smooth Animations**: Rocket flight, multiplier updates, cash-out effects
- **Responsive Design**: Works on all screen sizes
- **Premium Typography**: Inter font family for clean, modern look

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

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Netlify

1. Build the project: `npm run build`
2. Deploy the `dist` folder to Netlify
3. Add environment variables in Netlify dashboard

## 📝 Environment Variables

Required environment variables:

- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key

## 🔒 Security

- Row Level Security (RLS) enabled on all tables
- Users can only access their own data
- Authentication required for all game features
- Secure password handling via Supabase Auth

## 🎯 Future Enhancements

- [ ] Multiplayer mode with real-time player list
- [ ] Chat system
- [ ] Leaderboards
- [ ] Achievement system
- [ ] More game modes
- [ ] Social features (friends, challenges)
- [ ] Mobile app (React Native)

## 📄 License

MIT License - feel free to use this project for learning or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 💬 Support

For issues or questions, please open an issue on GitHub.

---

Built with ❤️ using React, TypeScript, and Supabase

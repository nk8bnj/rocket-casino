import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useWalletStore } from '../../store/walletStore';
import { useGameStore } from '../../store/gameStore';
import { GameTab } from '../../types';
import { useBonusStore } from '../../store/bonusStore';
import Header from '../../components/Header/Header';
import GameCanvas from '../../components/GameCanvas/GameCanvas';
import BettingPanel from '../../components/BettingPanel/BettingPanel';
import BonusPanel from '../../components/BonusPanel/BonusPanel';
import Leaderboard from '../../components/Leaderboard/Leaderboard';
import CasesGame from '../../components/CasesGame/CasesGame';
import MinesGame from '../../components/MinesGame/MinesGame';
import GameTabButton from '../../components/ui/GameTabButton';
import './Game.css';

export default function Game() {
	const navigate = useNavigate();
	const { user } = useAuthStore();
	const { fetchBalance, updateBalance } = useWalletStore();
	const { currentBet, cashOut } = useGameStore();
	const { checkStreak } = useBonusStore();
	const [activeTab, setActiveTab] = useState<GameTab>(GameTab.Rocket);
	const [showCashOutAnimation, setShowCashOutAnimation] = useState(false);
	const [cashOutAmount, setCashOutAmount] = useState(0);

	const tabs = [
		{
			id: GameTab.Rocket as GameTab,
			label: 'Rocket',
			icon: '🚀',
		},
		{
			id: GameTab.Cases as GameTab,
			label: 'Cases',
			icon: '📦',
		},
		{
			id: GameTab.Mines as GameTab,
			label: 'Mines',
			icon: '💣',
		},
	] as const;

	useEffect(() => {
		if (!user) {
			navigate('/login');
			return;
		}

		fetchBalance(user.id);
		checkStreak(user.id);
	}, [user, navigate, fetchBalance, checkStreak]);

	const handleCashOut = async () => {
		if (!user || !currentBet) return;

		const profit = cashOut();
		if (profit) {
			setCashOutAmount(profit);
			setShowCashOutAnimation(true);
			await updateBalance(user.id, profit);

			setTimeout(() => {
				setShowCashOutAnimation(false);
			}, 2000);
		}
	};

	return (
		<div className="game-page">
			<Header />

			<main className="game-content">
				<div className="game-layout">
					<div className="game-main">
						<div className="game-header">
							{tabs.map((tab) => (
								<GameTabButton
									key={tab.id}
									tab={tab}
									isActive={activeTab === tab.id}
									onClick={() => setActiveTab(tab.id)}
								/>
							))}
						</div>

						{activeTab === GameTab.Rocket ? (
							<>
								<GameCanvas />

								{showCashOutAnimation && (
									<div className="cash-out-animation">
										<div className="cash-out-amount">
											+${cashOutAmount.toFixed(2)}
										</div>
									</div>
								)}

								<BettingPanel onCashOut={handleCashOut} />
							</>
						) : activeTab === GameTab.Cases ? (
							<CasesGame />
						) : activeTab === GameTab.Mines ? (
							<MinesGame />
						) : null}
					</div>

					<div className="game-sidebar">
						<BonusPanel />
						<Leaderboard />
					</div>
				</div>
			</main>
		</div>
	);
}

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useWalletStore } from '../../store/walletStore';
import { useGameStore } from '../../store/gameStore';
import { useBonusStore } from '../../store/bonusStore';
import Header from '../../components/Header/Header';
import GameCanvas from '../../components/GameCanvas/GameCanvas';
import BettingPanel from '../../components/BettingPanel/BettingPanel';
import BonusPanel from '../../components/BonusPanel/BonusPanel';
import Leaderboard from '../../components/Leaderboard/Leaderboard';
import './Game.css';

export default function Game() {
	const navigate = useNavigate();
	const { user } = useAuthStore();
	const { fetchBalance, updateBalance } = useWalletStore();
	const { currentBet, cashOut } = useGameStore();
	const { checkStreak } = useBonusStore();
	const [showCashOutAnimation, setShowCashOutAnimation] = useState(false);
	const [cashOutAmount, setCashOutAmount] = useState(0);

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
							<div className="game-tab active">
								<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
									<path
										d="M10 2L12 8L18 10L12 12L10 18L8 12L2 10L8 8L10 2Z"
										fill="currentColor"
									/>
								</svg>
								Rocket
							</div>
						</div>

						<GameCanvas />

						{showCashOutAnimation && (
							<div className="cash-out-animation">
								<div className="cash-out-amount">
									+${cashOutAmount.toFixed(2)}
								</div>
							</div>
						)}

						<BettingPanel onCashOut={handleCashOut} />
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

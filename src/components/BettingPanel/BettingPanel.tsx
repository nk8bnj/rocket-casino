import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useWalletStore } from '../../store/walletStore';
import { useGameStore } from '../../store/gameStore';
import { GameStatus } from '../../types';
import './BettingPanel.css';

interface BettingPanelProps {
	onCashOut: () => void;
}

const QUICK_BETS = [10, 50, 100, 500];

export default function BettingPanel({ onCashOut }: BettingPanelProps) {
	const { user } = useAuthStore();
	const { balance, updateBalance } = useWalletStore();
	const { status, startRound, placeBet, currentBet, hasCashedOut } = useGameStore();
	const [betAmount, setBetAmount] = useState('10');
	const [autoCashOut, setAutoCashOut] = useState('');
	const [error, setError] = useState('');

	const handlePlaceBet = async () => {
		if (!user) return;

		const amount = parseFloat(betAmount);
		const autoOut = autoCashOut ? parseFloat(autoCashOut) : undefined;

		if (isNaN(amount) || amount <= 0) {
			setError('Please enter a valid bet amount');
			return;
		}

		if (amount > balance) {
			setError('Insufficient balance');
			return;
		}

		if (autoOut && (isNaN(autoOut) || autoOut < 1.01)) {
			setError('Auto cash out must be at least 1.01x');
			return;
		}

		setError('');

		try {
			await updateBalance(user.id, -amount);
			placeBet(amount, autoOut);
			startRound();
		} catch (err: unknown) {
			setError(err instanceof Error ? err.message : 'An error occurred');
		}
	};

	const handleQuickBet = (amount: number) => {
		setBetAmount(amount.toString());
	};

	const canPlaceBet = status === GameStatus.Waiting && !currentBet;
	const canCashOut = status === GameStatus.Running && currentBet && !hasCashedOut;

	return (
		<div className="betting-panel glass-card">
			<div className="betting-header">
				<h3>Bet Amount</h3>
			</div>

			<div className="betting-content">
				<div className="bet-input-group">
					<input
						type="number"
						className="input-field bet-input"
						placeholder="10"
						value={betAmount}
						onChange={(e) => setBetAmount(e.target.value)}
						disabled={!canPlaceBet}
					/>
				</div>

				<div className="quick-bets">
					{QUICK_BETS.map((amount) => (
						<button
							key={amount}
							className={amount === parseFloat(betAmount) ? 'quick-bet-btn selected' : 'quick-bet-btn'}
							onClick={() => handleQuickBet(amount)}
							disabled={!canPlaceBet}
						>
							${amount}
						</button>
					))}
				</div>

				<div className="auto-cashout-group">
					<label htmlFor="autoCashOut">Auto Cash Out (optional)</label>
					<input
						id="autoCashOut"
						type="number"
						className="input-field"
						placeholder="e.g., 2.00"
						value={autoCashOut}
						onChange={(e) => setAutoCashOut(e.target.value)}
						disabled={!canPlaceBet}
						step="0.01"
						min="1.01"
					/>
				</div>

				{error && <div className="error-message">{error}</div>}

				{canPlaceBet && (
					<button className="btn btn-primary action-btn" onClick={handlePlaceBet}>
						Launch Rocket
					</button>
				)}

				{canCashOut && (
					<button className="btn btn-success action-btn" onClick={onCashOut}>
						Cash Out
					</button>
				)}

				{status === GameStatus.Won && (
					<button className="btn action-btn" disabled style={{ opacity: 0.6 }}>
						Wait...
					</button>
				)}

				{status === GameStatus.Crashed && (
					<button className="btn action-btn" disabled style={{ opacity: 0.6 }}>
						Round Ended
					</button>
				)}
			</div>
		</div>
	);
}

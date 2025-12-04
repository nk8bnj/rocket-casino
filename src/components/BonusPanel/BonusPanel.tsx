import { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useWalletStore } from '../../store/walletStore';
import { useBonusStore } from '../../store/bonusStore';
import { BonusMainIcon, TimerIcon, StreakIcon } from '../icons/Icons';
import './BonusPanel.css';

export default function BonusPanel() {
	const { user } = useAuthStore();
	const { updateBalance } = useWalletStore();
	const { canClaim, claimBonus, getTimeUntilNextClaim, streak } = useBonusStore();
	const [timeLeft, setTimeLeft] = useState(0);
	const [isClaiming, setIsClaiming] = useState(false);

	useEffect(() => {
		const interval = setInterval(() => {
			setTimeLeft(getTimeUntilNextClaim());
		}, 1000);

		return () => clearInterval(interval);
	}, [getTimeUntilNextClaim]);

	const handleClaimBonus = async () => {
		if (!user || !canClaim()) return;

		try {
			setIsClaiming(true);
			const amount = await claimBonus(user.id);
			await updateBalance(user.id, amount);
		} catch (err) {
			console.error('Failed to claim bonus:', err);
		} finally {
			setIsClaiming(false);
		}
	};

	const formatTime = (ms: number) => {
		const seconds = Math.floor(ms / 1000);
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
	};

	return (
		<div className="bonus-panel glass-card">
			<div className="bonus-header">
				<div className="bonus-icon">
					<BonusMainIcon />
				</div>
				<div>
					<h3>Claim Bonus</h3>
					<p>Free money every minute</p>
				</div>
			</div>

			<div className="bonus-content">
				<div className="bonus-info">
					<div className="bonus-info-item">
						<span className="bonus-label">Next claim:</span>
						<span className="bonus-value timer">
							<TimerIcon />
							{canClaim() ? 'Ready!' : formatTime(timeLeft)}
						</span>
					</div>
					<div className="bonus-info-item">
						<span className="bonus-label">Amount:</span>
						<span className="bonus-value amount">$10</span>
					</div>
				</div>

				<button
					className="btn btn-success bonus-btn"
					onClick={handleClaimBonus}
					disabled={!canClaim() || isClaiming}
				>
					{isClaiming ? 'Claiming...' : canClaim() ? 'Claim Now!' : 'Wait...'}
				</button>

				{streak > 0 && (
					<div className="streak-display">
						<StreakIcon />
						<span>Streak: {streak} days</span>
					</div>
				)}
			</div>
		</div>
	);
}

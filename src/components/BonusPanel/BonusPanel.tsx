import { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useWalletStore } from '../../store/walletStore';
import { useBonusStore } from '../../store/bonusStore';
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
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
						<path
							d="M12 2L14 10L22 12L14 14L12 22L10 14L2 12L10 10L12 2Z"
							fill="url(#bonusGradient)"
						/>
						<defs>
							<linearGradient id="bonusGradient" x1="2" y1="2" x2="22" y2="22">
								<stop offset="0%" stopColor="#10b981" />
								<stop offset="100%" stopColor="#059669" />
							</linearGradient>
						</defs>
					</svg>
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
							<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
								<circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="2" />
								<path d="M8 4V8L11 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
							</svg>
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
						<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
							<path
								d="M8 2L9 6L13 7L9 8L8 12L7 8L3 7L7 6L8 2Z"
								fill="currentColor"
							/>
						</svg>
						<span>Streak: {streak} days</span>
					</div>
				)}
			</div>
		</div>
	);
}

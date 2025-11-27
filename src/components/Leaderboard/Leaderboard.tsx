import { useEffect, useState } from 'react';
import { supabase } from '../../services/supabase';
import { useAuthStore } from '../../store/authStore';
import { useWalletStore } from '../../store/walletStore';
import './Leaderboard.css';

interface LeaderboardEntry {
	user_id: string;
	username: string;
	avatar_url: string;
	balance: number;
}

export default function Leaderboard() {
	const [leaders, setLeaders] = useState<LeaderboardEntry[]>([]);
	const { user } = useAuthStore();
	const { balance } = useWalletStore();

	const fetchLeaderboard = async () => {
		const { data, error } = await supabase.rpc('get_leaderboard');
		if (error) {
			console.error('Error fetching leaderboard:', error);
		} else {
			setLeaders(data || []);
		}
	};

	const updatedLeaders = leaders.map((item) =>
		user && item.user_id === user.id ? { ...item, balance } : item
	);

	useEffect(() => {
		const initializeLeaderboard = async () => {
			await fetchLeaderboard();
		};

		initializeLeaderboard();

		const subscription = supabase
			.channel('leaderboard_updates')
			.on(
				'postgres_changes',
				{
					event: 'UPDATE',
					schema: 'public',
					table: 'wallet',
				},
				(payload) => {
					const newRecord = payload.new as { user_id: string; balance: number };
					setLeaders((prev) =>
						prev.map((item) =>
							item.user_id === newRecord.user_id
								? { ...item, balance: newRecord.balance }
								: item
						)
					);
					fetchLeaderboard();
				}
			)
			.subscribe();

		return () => {
			subscription.unsubscribe();
		};
	}, []);

	return (
		<div className="leaderboard">
			<div className="leaderboard-header">
				<div className="leaderboard-icon">
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
						<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
						<path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
						<path d="M4 22h16" />
						<path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
						<path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
						<path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
					</svg>
				</div>
				<div className="leaderboard-title">
					<h3>Leaderboard</h3>
					<span className="subtitle">Top players</span>
				</div>
			</div>
			<div className="leaderboard-list">
				{updatedLeaders.map((entry, index) => (
					<div
						key={entry.user_id}
						className={`leaderboard-item ${user?.id === entry.user_id ? 'current-user' : ''}`}
					>
						<span className="rank">#{index + 1}</span>
						<div className="user-info">
							<span className="username">{entry.username || 'Anonymous'}</span>
						</div>
						<span className="balance">${entry.balance.toFixed(2)}</span>
					</div>
				))}
			</div>
		</div>
	);
}

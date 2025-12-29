import { useEffect, useState } from 'react';
import { supabase } from '../../services/supabase';
import { useAuthStore } from '../../store/authStore';
import { useWalletStore } from '../../store/walletStore';
import { LeaderboardIcon } from '../icons/Icons';
import { formatCurrency } from '../../utils/formatCurrency';
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
					<LeaderboardIcon />
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
						<span className="balance">
							{formatCurrency(entry.balance)}
						</span>
					</div>
				))}
			</div>
		</div>
	);
}

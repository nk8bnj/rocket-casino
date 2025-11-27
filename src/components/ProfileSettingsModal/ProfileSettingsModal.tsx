import { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useAuthStore } from '../../store/authStore';
import { useWalletStore } from '../../store/walletStore';
import './ProfileSettingsModal.css';

interface ProfileSettingsModalProps {
	isOpen: boolean;
	onClose: () => void;
}

export default function ProfileSettingsModal({ isOpen, onClose }: ProfileSettingsModalProps) {
	const { user, updateProfile, isLoading } = useAuthStore();
	const { balance } = useWalletStore();
	const [username, setUsername] = useState(user?.username || '');
	const [isSaving, setIsSaving] = useState(false);

	const stats = {
		gamesPlayed: 2,
		totalWagered: 20.00,
		totalWon: 45.54
	};

	useEffect(() => {
		if (isOpen && user?.username) {
			setUsername(user.username);
		}
	}, [isOpen, user?.username]);

	const handleSave = async () => {
		if (!username.trim() || username === user?.username) {
			onClose();
			return;
		}

		try {
			setIsSaving(true);
			await updateProfile({ username });
			onClose();
		} catch (error) {
			console.error('Failed to update profile:', error);
		} finally {
			setIsSaving(false);
		}
	};

	if (!isOpen) return null;

	return ReactDOM.createPortal(
		<div className="modal-overlay" onClick={onClose}>
			<div className="modal-content" onClick={e => e.stopPropagation()}>
				<button className="close-btn" onClick={onClose}>
					<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
						<path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
					</svg>
				</button>

				<div className="modal-header">
					<h2 className="modal-title">Profile Settings</h2>
					<p className="modal-subtitle">Customize your profile and manage your account</p>
				</div>

				<div className="form-group">
					<label className="form-label">
						<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
							<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
							<circle cx="12" cy="7" r="4"></circle>
						</svg>
						Username
					</label>
					<input
						type="text"
						className="form-input"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						maxLength={20}
						placeholder={user?.username || 'Enter username'}
					/>
					<span className="char-count">{username.length}/20 characters</span>
				</div>

				<div className="stats-container">
					<div className="stat-item">
						<span className="stat-label">Balance</span>
						<span className="stat-value">${balance.toFixed(2)}</span>
					</div>
					<div className="stat-item">
						<span className="stat-label">Games Played</span>
						<span className="stat-value">{stats.gamesPlayed}</span>
					</div>
					<div className="stat-item">
						<span className="stat-label">Total Wagered</span>
						<span className="stat-value">${stats.totalWagered.toFixed(2)}</span>
					</div>
					<div className="stat-item">
						<span className="stat-label">Total Won</span>
						<span className="stat-value">${stats.totalWon.toFixed(2)}</span>
					</div>
				</div>

				<div className="modal-actions">
					<button
						className="btn btn-save"
						onClick={handleSave}
						disabled={isSaving || isLoading}
					>
						{isSaving ? 'Saving...' : 'Save Changes'}
					</button>
					<button className="btn btn-reset">Reset Account</button>
				</div>
			</div>
		</div>,
		document.body
	);
}

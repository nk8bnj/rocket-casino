import { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useAuthStore } from '../../store/authStore';
import { useWalletStore } from '../../store/walletStore';
import { CloseIcon, UserIcon } from '../icons/Icons';
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
					<CloseIcon />
				</button>

				<div className="modal-header">
					<h2 className="modal-title">Profile Settings</h2>
					<p className="modal-subtitle">Customize your profile and manage your account</p>
				</div>

				<div className="form-group">
					<label className="form-label">
						<UserIcon />
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

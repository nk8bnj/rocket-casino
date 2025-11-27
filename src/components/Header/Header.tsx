import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useWalletStore } from '../../store/walletStore';
import ProfileSettingsModal from '../ProfileSettingsModal/ProfileSettingsModal';
import './Header.css';

export default function Header() {
	const navigate = useNavigate();
	const { signOut } = useAuthStore();
	const { balance } = useWalletStore();
	const [isSettingsOpen, setIsSettingsOpen] = useState(false);

	const handleLogout = async () => {
		await signOut();
		navigate('/login');
	};

	return (
		<header className="header">
			<div className="header-content">
				<div className="header-left">
					<div className="logo">
						<svg width="32" height="32" viewBox="0 0 32 32" fill="none">
							<path
								d="M16 2L19 13L30 16L19 19L16 30L13 19L2 16L13 13L16 2Z"
								fill="url(#headerGradient)"
							/>
							<defs>
								<linearGradient id="headerGradient" x1="2" y1="2" x2="30" y2="30">
									<stop offset="0%" stopColor="#3b82f6" />
									<stop offset="100%" stopColor="#8b5cf6" />
								</linearGradient>
							</defs>
						</svg>
						<span className="logo-text">Rocket Casino</span>
					</div>
				</div>

				<div className="header-right">
					<div className="balance-display">
						<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
							<rect x="2" y="4" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="2" />
							<path d="M6 4V2M14 4V2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
						</svg>
						<span className="balance-amount">${balance.toFixed(2)}</span>
					</div>

					<button
						className="settings-btn"
						title="Settings"
						onClick={() => setIsSettingsOpen(true)}
					>
						<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
							<path
								d="M10 12.5C11.3807 12.5 12.5 11.3807 12.5 10C12.5 8.61929 11.3807 7.5 10 7.5C8.61929 7.5 7.5 8.61929 7.5 10C7.5 11.3807 8.61929 12.5 10 12.5Z"
								stroke="currentColor"
								strokeWidth="2"
							/>
							<path
								d="M16.5 10C16.5 10.5 16.4 11 16.2 11.4L18 12.5L16.5 15L14.5 14C13.9 14.5 13.2 14.9 12.5 15.1V17.5H7.5V15.1C6.8 14.9 6.1 14.5 5.5 14L3.5 15L2 12.5L3.8 11.4C3.6 11 3.5 10.5 3.5 10C3.5 9.5 3.6 9 3.8 8.6L2 7.5L3.5 5L5.5 6C6.1 5.5 6.8 5.1 7.5 4.9V2.5H12.5V4.9C13.2 5.1 13.9 5.5 14.5 6L16.5 5L18 7.5L16.2 8.6C16.4 9 16.5 9.5 16.5 10Z"
								stroke="currentColor"
								strokeWidth="2"
							/>
						</svg>
					</button>

					<button className="logout-btn" onClick={handleLogout}>
						<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
							<path
								d="M13 14L17 10L13 6M17 10H7M7 2H5C3.89543 2 3 2.89543 3 4V16C3 17.1046 3.89543 18 5 18H7"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
						Logout
					</button>
				</div>
			</div>
			<ProfileSettingsModal
				isOpen={isSettingsOpen}
				onClose={() => setIsSettingsOpen(false)}
			/>
		</header>
	);
}

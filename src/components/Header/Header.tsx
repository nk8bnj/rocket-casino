import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useWalletStore } from '../../store/walletStore';
import {
	AppLogoSmall,
	BalanceIcon,
	SettingsIcon,
	LogoutIcon,
} from '../icons/Icons';
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
						<AppLogoSmall />
						<span className="logo-text">Rocket Casino</span>
					</div>
				</div>

				<div className="header-right">
					<div className="balance-display">
						<BalanceIcon />
						<span className="balance-amount">
							${Number(balance ?? 0).toFixed(2)}
						</span>
					</div>

					<button
						className="settings-btn"
						title="Settings"
						onClick={() => setIsSettingsOpen(true)}
					>
						<SettingsIcon />
					</button>

					<button className="logout-btn" onClick={handleLogout}>
						<LogoutIcon />
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

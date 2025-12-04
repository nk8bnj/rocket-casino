export const AppLogoLarge = () => (
	<svg width="48" height="48" viewBox="0 0 48 48" fill="none">
		<path
			d="M24 4L28 20L44 24L28 28L24 44L20 28L4 24L20 20L24 4Z"
			fill="url(#appLogoGradient)"
		/>
		<defs>
			<linearGradient id="appLogoGradient" x1="4" y1="4" x2="44" y2="44">
				<stop offset="0%" stopColor="#3b82f6" />
				<stop offset="100%" stopColor="#8b5cf6" />
			</linearGradient>
		</defs>
	</svg>
);

export const AppLogoSmall = () => (
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
);

export const BalanceIcon = () => (
	<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
		<rect x="2" y="4" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="2" />
		<path d="M6 4V2M14 4V2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
	</svg>
);

export const SettingsIcon = () => (
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
);

export const LogoutIcon = () => (
	<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
		<path
			d="M13 14L17 10L13 6M17 10H7M7 2H5C3.89543 2 3 2.89543 3 4V16C3 17.1046 3.89543 18 5 18H7"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
);

export const BonusMainIcon = () => (
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
);

export const TimerIcon = () => (
	<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
		<circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="2" />
		<path d="M8 4V8L11 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
	</svg>
);

export const StreakIcon = () => (
	<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
		<path
			d="M8 2L9 6L13 7L9 8L8 12L7 8L3 7L7 6L8 2Z"
			fill="currentColor"
		/>
	</svg>
);

export const LeaderboardIcon = () => (
	<svg
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
		<path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
		<path d="M4 22h16" />
		<path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
		<path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
		<path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
	</svg>
);

export const CloseIcon = () => (
	<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
		<path
			d="M15 5L5 15M5 5L15 15"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
);

export const UserIcon = () => (
	<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
		<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
		<circle cx="12" cy="7" r="4"></circle>
	</svg>
);

export const ButtonRocketIcon = () => (
	<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
		<path
			d="M10 2L12 8L18 10L12 12L10 18L8 12L2 10L8 8L10 2Z"
			fill="currentColor"
		/>
	</svg>
);



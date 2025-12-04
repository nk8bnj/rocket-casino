import { GameTab } from '../../types';

export type GameTabButtonProps = {
	tab: {
		id: GameTab;
		label: string;
		icon: string;
	};
	isActive: boolean;
	onClick: () => void;
};

const GameTabButton = ({ tab, isActive, onClick }: GameTabButtonProps) => (
	<button
		type="button"
		className={`game-tab ${isActive ? 'active' : ''}`}
		onClick={onClick}
	>
		<span className="game-tab-icon" aria-hidden="true">
			{tab.icon}
		</span>
		{tab.label}
	</button>
);

export default GameTabButton;



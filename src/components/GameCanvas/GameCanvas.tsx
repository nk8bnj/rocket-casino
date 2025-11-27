import { useEffect, useRef } from 'react';
import { useGameStore } from '../../store/gameStore';
import rocketImage from '../../assets/images/rocket.png';
import rocketFailImage from '../../assets/images/rocket-fail.png';
import rocketWinImage from '../../assets/images/rocket-win.png';
import './GameCanvas.css';

export default function GameCanvas() {
	const canvasRef = useRef<HTMLDivElement>(null);
	const { status, multiplier, hasCashedOut } = useGameStore();

	useEffect(() => {
		if (!canvasRef.current) return;

		const canvas = canvasRef.current;
		const rocket = canvas.querySelector('.rocket') as HTMLElement;

		if (status === 'running' && rocket) {
			const progress = Math.min((multiplier - 1) / 9, 1);
			const translateX = progress * 800;
			const translateY = -progress * 250;

			const rotation = 25 + (progress * 15) + Math.sin(multiplier * 25) * 2;
			const scale = 1 + (progress * 1.25);

			rocket.style.transform = `translate(${translateX}px, ${translateY}px) rotate(${rotation}deg) scale(${scale})`;
		} else if (status === 'crashed' && rocket) {
			rocket.style.opacity = '0';
			rocket.style.transform = 'scale(2) rotate(180deg)';
		} else if (status === 'waiting' && rocket) {
			rocket.style.opacity = '1';
			rocket.style.transform = 'translate(0, 0) rotate(0deg)';
		}
	}, [status, multiplier]);

	return (
		<div className="game-canvas glass-card">
			<div className="canvas-content" ref={canvasRef}>
				{status === 'waiting' && (
					<div className="waiting-message">
						<img src={rocketImage} alt="Rocket" className="rocket-icon" width="150" height="150" />
						<p>Place your bet and ride!</p>
					</div>
				)}

				{status === 'running' && !hasCashedOut && (
					<>
						<div className="multiplier-display">
							{multiplier.toFixed(2)}x
						</div>
						<div className="rocket">
							<img src={rocketImage} alt="Rocket" width="80" height="80" />
						</div>
					</>
				)}

				{status === 'won' && (
					<div className="win-message">
						<img src={rocketWinImage} alt="Rocket Win" className="rocket-win-icon" width="120" height="170" />
						<div className="win-text">YOU WON!</div>
						<div className="win-multiplier">{multiplier.toFixed(2)}x</div>
					</div>
				)}

				{status === 'crashed' && (
					<div className="crashed-message">
						<img src={rocketFailImage} alt="Rocket Failed" className="rocket-fail-icon" width="150" height="150" />
						<div className="crashed-text">CRASHED!</div>
						<div className="crashed-multiplier">{multiplier.toFixed(2)}x</div>
					</div>
				)}
			</div>
		</div>
	);
}

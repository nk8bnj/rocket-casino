import { useAuthStore } from "../../store/authStore";
import { useWalletStore } from "../../store/walletStore";
import { useMinesStore } from "../../store/minesStore";
import MinesGrid from "./MinesGrid";
import MinesControls from "./MinesControls";
import MinesStats from "./MinesStats";
import "./MinesGame.css";

export default function MinesGame() {
  const { user } = useAuthStore();
  const { balance, updateBalance } = useWalletStore();
  const { startGame, revealTile, cashOut } = useMinesStore();

  const handleStartGame = async (betAmount: number, minesCount: number) => {
    if (!user) {
      alert("Please log in to play");
      return;
    }

    try {
      await startGame(betAmount, minesCount, user.id, updateBalance);
    } catch (error) {
      console.error("Failed to start game:", error);
      alert("Failed to start game. Please try again.");
    }
  };

  const handleTileClick = async (index: number) => {
    try {
      await revealTile(index);
    } catch (error) {
      console.error("Failed to reveal tile:", error);
    }
  };

  const handleCashOut = async () => {
    if (!user) return;

    try {
      await cashOut(user.id, updateBalance);
    } catch (error) {
      console.error("Failed to cash out:", error);
      alert("Failed to cash out. Please try again.");
    }
  };

  return (
    <div className="mines-game">
      <div className="mines-game__container">
        <div className="mines-game__grid-section">
          <MinesGrid onTileClick={handleTileClick} />
        </div>

        <div className="mines-game__controls-section">
          <MinesControls
            balance={balance}
            onStartGame={handleStartGame}
            onCashOut={handleCashOut}
          />
          <MinesStats />
        </div>
      </div>
    </div>
  );
}


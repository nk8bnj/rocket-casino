import { useAuthStore } from "../../store/authStore";
import { useWalletStore } from "../../store/walletStore";
import { usePlinkoStore } from "../../store/plinkoStore";
import PlinkoBoard from "./PlinkoBoard";
import PlinkoControls from "./PlinkoControls";
import PlinkoHistory from "./PlinkoHistory";
import "./PlinkoGame.css";

export default function PlinkoGame() {
  const { user } = useAuthStore();
  const { balance, updateBalance } = useWalletStore();
  const { startDrop } = usePlinkoStore();

  const handleDrop = async () => {
    if (!user) {
      alert("Please log in to play");
      return;
    }

    try {
      await startDrop(user.id, updateBalance);
    } catch (error) {
      console.error("Failed to start drop:", error);
      alert("Failed to start drop. Please try again.");
    }
  };

  return (
    <div className="plinko-game">
      <div className="plinko-game__container">
        <div className="plinko-game__controls">
          <PlinkoControls balance={balance} onDrop={handleDrop} />
        </div>

        <div className="plinko-game__board">
          <PlinkoBoard />
        </div>
      </div>
      <div className="plinko-game__history">
        <PlinkoHistory />
      </div>
    </div>
  );
}

import { useMinesStore } from "../../store/minesStore";
import type { TileState } from "../../types/mines";

interface MinesGridProps {
  onTileClick: (index: number) => void;
}

export default function MinesGrid({ onTileClick }: MinesGridProps) {
  const { tileStates, status, isRevealing } = useMinesStore();

  const getTileIcon = (state: TileState) => {
    switch (state) {
      case "safe":
        return "💎";
      case "mine":
        return "💣";
      default:
        return "";
    }
  };

  const getTileClass = (state: TileState) => {
    const baseClass = "mines-tile";
    const stateClass = `mines-tile--${state}`;
    
    return `${baseClass} ${stateClass}`;
  };

  const handleTileClick = (index: number) => {
    if (status !== "playing" || isRevealing) {
      return;
    }

    const state = tileStates[index];
    if (state !== "hidden") {
      return;
    }

    onTileClick(index);
  };

  return (
    <div className="mines-grid">
      {tileStates.map((state, index) => (
        <button
          key={index}
          className={getTileClass(state)}
          onClick={() => handleTileClick(index)}
          disabled={state !== "hidden" || status !== "playing" || isRevealing}
          type="button"
        >
          <span className="mines-tile__icon">{getTileIcon(state)}</span>
        </button>
      ))}
    </div>
  );
}


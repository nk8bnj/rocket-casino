import { useMinesStore } from "../../store/minesStore";
import { calculateMinesMultiplier } from "../../utils/minesMultiplier";

export default function MinesStats() {
  const { status, minesCount, revealedTiles, potentialProfit, betAmount } =
    useMinesStore();


  const nextMultiplier = calculateMinesMultiplier(minesCount, revealedTiles.length + 1);
  const safeTilesLeft = 25 - minesCount - revealedTiles.length;

  return (
    <div className="mines-stats">
      <h3 className="mines-stats__title">Current Game</h3>
      
      <div className="mines-stats__row">
        <span className="mines-stats__label">Bet Amount:</span>
        <span className="mines-stats__value mines-stats__value--bet">
          ${betAmount.toFixed(2)}
        </span>
      </div>

      <div className="mines-stats__row">
        <span className="mines-stats__label">Current Value:</span>
        <span className="mines-stats__value mines-stats__value--current">
          ${potentialProfit.toFixed(2)}
        </span>
      </div>

      <div className="mines-stats__row">
        <span className="mines-stats__label">Next Tile:</span>
        <span className="mines-stats__value mines-stats__value--next">
          {nextMultiplier.toFixed(2)}x
        </span>
      </div>

      <div className="mines-stats__separator"></div>

      <div className="mines-stats__row">
        <span className="mines-stats__label">Safe Tiles Left:</span>
        <span className="mines-stats__value mines-stats__value--safe">
          {safeTilesLeft}
        </span>
      </div>

      {status === "won" && (
        <div className="mines-stats__result mines-stats__result--won">
          🎉 You Won ${potentialProfit.toFixed(2)}!
        </div>
      )}

      {status === "lost" && (
        <div className="mines-stats__result mines-stats__result--lost">
          💥 You Lost ${betAmount.toFixed(2)}
        </div>
      )}
    </div>
  );
}


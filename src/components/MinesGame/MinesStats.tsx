import { useMinesStore } from "../../store/minesStore";
import { calculateMinesMultiplier } from "../../utils/minesMultiplier";
import { MinesGameStatus } from "../../types/mines";
import { formatCurrency } from "../../utils/formatCurrency";
import MinesStatsRows from "./MinesStatsRows";

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
          {formatCurrency(betAmount)}
        </span>
      </div>

      <MinesStatsRows
        potentialProfit={potentialProfit}
        nextMultiplier={nextMultiplier}
        safeTilesLeft={safeTilesLeft}
      />

      {status === MinesGameStatus.Won && (
        <div className="mines-stats__result mines-stats__result--won">
          🎉 You Won {formatCurrency(potentialProfit)}!
        </div>
      )}

      {status === MinesGameStatus.Lost && (
        <div className="mines-stats__result mines-stats__result--lost">
          💥 You Lost {formatCurrency(betAmount)}
        </div>
      )}
    </div>
  );
}


import { formatCurrency } from "../../utils/formatCurrency";

interface MinesStatsRowsProps {
  potentialProfit: number;
  nextMultiplier: number;
  safeTilesLeft: number;
}

export default function MinesStatsRows({
  potentialProfit,
  nextMultiplier,
  safeTilesLeft,
}: MinesStatsRowsProps) {
  return (
    <>
      <div className="mines-stats__row">
        <span className="mines-stats__label">Current Value:</span>
        <span className="mines-stats__value mines-stats__value--current">
          {formatCurrency(potentialProfit)}
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
    </>
  );
}

import { usePlinkoStore } from "../../store/plinkoStore";
import type { RiskLevel, LinesCount, BallsCount } from "../../types/plinko";

const RISK_LEVELS: RiskLevel[] = ["low", "medium", "high"];
const LINES_OPTIONS: LinesCount[] = [8, 9, 10, 11, 12, 13, 14, 15, 16];
const BALLS_OPTIONS: { count: BallsCount; price: number }[] = [
  { count: 1, price: 2.0 },
  { count: 2, price: 4.0 },
  { count: 5, price: 10.0 },
  { count: 10, price: 20.0 },
];

interface PlinkoControlsProps {
  balance: number;
  onDrop: () => void;
}

export default function PlinkoControls({ balance, onDrop }: PlinkoControlsProps) {
  const { riskLevel, linesCount, ballsCount, status, updateSettings } = usePlinkoStore();

  const isIdle = status === "idle";
  const isDropping = status === "dropping";

  const selectedBallOption = BALLS_OPTIONS.find((opt) => opt.count === ballsCount);
  const totalBet = selectedBallOption?.price || 2.0;
  const canAfford = balance >= totalBet;

  const handleRiskChange = (direction: "prev" | "next") => {
    const currentIndex = RISK_LEVELS.indexOf(riskLevel);
    let newIndex: number;

    if (direction === "prev") {
      newIndex = currentIndex === 0 ? RISK_LEVELS.length - 1 : currentIndex - 1;
    } else {
      newIndex = currentIndex === RISK_LEVELS.length - 1 ? 0 : currentIndex + 1;
    }

    updateSettings({ riskLevel: RISK_LEVELS[newIndex] });
  };

  const handleLinesChange = (lines: LinesCount) => {
    updateSettings({ linesCount: lines });
  };

  const handleBallsChange = (balls: BallsCount) => {
    updateSettings({ ballsCount: balls });
  };

  const handleDrop = () => {
    if (!canAfford) {
      alert(`Insufficient balance. You need $${totalBet.toFixed(2)} but have $${balance.toFixed(2)}`);
      return;
    }

    onDrop();
  };

  return (
    <div className="plinko-controls glass-card">
      <h3 className="plinko-controls__title">PLINKO+</h3>

      <div className="plinko-controls__section plinko-controls__section--risk">
        <label className="plinko-controls__label">RISK</label>
        <div className="plinko-controls__risk-selector">
          <button
            className="plinko-controls__risk-arrow"
            onClick={() => handleRiskChange("prev")}
            disabled={!isIdle}
          >
            -
          </button>
          <span className="plinko-controls__risk-value">
            {riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)}
          </span>
          <button
            className="plinko-controls__risk-arrow"
            onClick={() => handleRiskChange("next")}
            disabled={!isIdle}
          >
            +
          </button>
        </div>
      </div>

      <div className="plinko-controls__section plinko-controls__section--balls">
        <label className="plinko-controls__label">BALLS</label>
        <div className="plinko-controls__balls-grid">
          {BALLS_OPTIONS.map((option) => (
            <button
              key={option.count}
              className={`plinko-controls__balls-button ${
                ballsCount === option.count ? "plinko-controls__balls-button--active" : ""
              }`}
              onClick={() => handleBallsChange(option.count)}
              disabled={!isIdle}
            >
              <div className="plinko-controls__balls-count">{option.count}</div>
              <div className="plinko-controls__balls-price">${option.price.toFixed(2)}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="plinko-controls__section plinko-controls__section--lines">
        <label className="plinko-controls__label">LINES</label>
        <div className="plinko-controls__lines-grid">
          {LINES_OPTIONS.map((lines) => (
            <button
              key={lines}
              className={`plinko-controls__lines-button ${
                linesCount === lines ? "plinko-controls__lines-button--active" : ""
              }`}
              onClick={() => handleLinesChange(lines)}
              disabled={!isIdle}
            >
              {lines}
            </button>
          ))}
        </div>
      </div>

      <button
        className={`btn btn-success plinko-controls__drop-button ${
          isDropping ? "plinko-controls__drop-button--dropping" : ""
        } ${!canAfford ? "plinko-controls__drop-button--disabled" : ""}`}
        onClick={handleDrop}
        disabled={!isIdle || !canAfford}
      >
        {isDropping
          ? "Dropping..."
          : `Drop ${ballsCount} Ball${ballsCount > 1 ? "s" : ""} ($${totalBet.toFixed(2)})`}
      </button>

      {!canAfford && isIdle && (
        <div className="plinko-controls__warning">
          Insufficient balance
        </div>
      )}
    </div>
  );
}

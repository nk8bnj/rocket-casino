import { useState } from "react";
import { useMinesStore } from "../../store/minesStore";
import { MinesGameStatus } from "../../types/mines";
import { cn } from "../../utils/cn";

interface MinesControlsProps {
  balance: number;
  onStartGame: (betAmount: number, minesCount: number) => Promise<void>;
  onCashOut: () => Promise<void>;
}

const MINES_OPTIONS = [1, 3, 5, 10, 24];
const MIN_BET = 0.1;

export default function MinesControls({
  balance,
  onStartGame,
  onCashOut,
}: MinesControlsProps) {
  const { status } = useMinesStore();
  const [betAmount, setBetAmount] = useState<string>("1.00");
  const [minesCount, setMinesCount] = useState<number>(3);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeBetButton, setActiveBetButton] = useState<string>("1/2");

  const isIdle = status === MinesGameStatus.Idle;
  const isPlaying = status === MinesGameStatus.Playing;
  const isControlsDisabled = !isIdle || isProcessing;

  const handleBetChange = (value: string) => {
    if (value === "" || /^\d*\.?\d{0,2}$/.test(value)) {
      setBetAmount(value);
    }
  };

  const handleBetInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleBetChange(e.target.value);
  };

  const handleHalfBet = () => {
    const current = parseFloat(betAmount) || 0;
    const newAmount = Math.max(MIN_BET, current / 2);
    setBetAmount(newAmount.toFixed(2));
    setActiveBetButton("1/2");
  };

  const handleDoubleBet = () => {
    const current = parseFloat(betAmount) || 0;
    const newAmount = Math.min(balance, current * 2);
    setBetAmount(newAmount.toFixed(2));
    setActiveBetButton("2x");
  };

  const handleMaxBet = () => {
    setBetAmount(balance.toFixed(2));
    setActiveBetButton("max");
  };

  const handleStartGame = async () => {
    const bet = parseFloat(betAmount);

    if (isNaN(bet) || bet < MIN_BET) {
      alert(`Minimum bet is $${MIN_BET.toFixed(2)}`);
      return;
    }

    if (bet > balance) {
      alert("Insufficient balance");
      return;
    }

    setIsProcessing(true);
    try {
      await onStartGame(bet, minesCount);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCashOut = async () => {
    setIsProcessing(true);
    try {
      await onCashOut();
    } finally {
      setIsProcessing(false);
    }
  };

  const betButtons = [
    { label: "½", activeKey: "1/2", onClick: handleHalfBet },
    { label: "2×", activeKey: "2x", onClick: handleDoubleBet },
    { label: "Max", activeKey: "max", onClick: handleMaxBet },
  ];

  return (
    <div className="mines-controls">
      <div className="mines-controls__section">
        <label className="mines-controls__label">Bet Amount</label>
        <div className="mines-controls__bet-input-wrapper">
          <input
            type="text"
            className="mines-controls__input"
            value={betAmount}
            onChange={handleBetInputChange}
            disabled={isControlsDisabled}
            placeholder="0.00"
          />
          <span className="mines-controls__currency">$</span>
        </div>
        <div className="mines-controls__bet-buttons">
          {betButtons.map((button) => (
            <button
              key={button.activeKey}
              type="button"
              className={cn(
                "mines-controls__bet-btn",
                activeBetButton === button.activeKey && "active"
              )}
              onClick={button.onClick}
              disabled={isControlsDisabled}
            >
              {button.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mines-controls__section">
        <label className="mines-controls__label">Mines</label>
        <div className="mines-controls__mines-buttons">
          {MINES_OPTIONS.map((count) => (
            <button
              key={count}
              type="button"
              className={cn(
                "mines-controls__mines-btn",
                minesCount === count && "active"
              )}
              onClick={() => setMinesCount(count)}
              disabled={isControlsDisabled}
            >
              {count}
            </button>
          ))}
        </div>
      </div>

      {isIdle ? (
        <button
          type="button"
          className="mines-controls__action-btn mines-controls__action-btn--start"
          onClick={handleStartGame}
          disabled={isProcessing}
        >
          {isProcessing ? "Starting..." : "Start Game"}
        </button>
      ) : isPlaying ? (
        <button
          type="button"
          className="mines-controls__action-btn mines-controls__action-btn--cashout"
          onClick={handleCashOut}
          disabled={isProcessing}
        >
          {isProcessing ? "Cashing Out..." : "Cash Out"}
        </button>
      ) : null}
    </div>
  );
}


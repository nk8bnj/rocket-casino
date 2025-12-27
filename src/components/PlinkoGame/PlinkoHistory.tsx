import { useState, useEffect, useRef } from "react";
import { usePlinkoStore } from "../../store/plinkoStore";
import { getMultiplierColor } from "../../utils/plinkoMultiplier";
import type { HistoryEntry } from "../../types/plinko";

export default function PlinkoHistory() {
  const { getHistory } = usePlinkoStore();
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [currentTime, setCurrentTime] = useState(() => Date.now());
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadHistory = () => {
      setHistory(getHistory());
      setCurrentTime(Date.now());
    };

    loadHistory();

    const intervalId = setInterval(loadHistory, 1000);

    return () => clearInterval(intervalId);
  }, [getHistory]);

  useEffect(() => {
    if (scrollContainerRef.current && history.length > 0) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [history.length]);

  const formatTimestamp = (timestamp: number): string => {
    const diff = currentTime - timestamp;

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    if (seconds > 5) return `${seconds}s ago`;
    return "just now";
  };

  const getProfitDisplay = (netProfit: number) => {
    if (netProfit > 0) {
      return {
        emoji: "🟢",
        color: "var(--color-success)",
        sign: "+",
      };
    } else if (netProfit < 0) {
      return {
        emoji: "🔴",
        color: "var(--color-danger)",
        sign: "",
      };
    } else {
      return {
        emoji: "⚪",
        color: "var(--text-secondary)",
        sign: "",
      };
    }
  };

  return (
    <div className="plinko-history">
      <h3 className="plinko-history__title">Recent Drops</h3>

      {history.length === 0 ? (
        <div className="plinko-history__empty">
          No drops yet
        </div>
      ) : (
        <div className="plinko-history__list" ref={scrollContainerRef}>
          {history.slice(0, 20).map((entry) => {
            const profitDisplay = getProfitDisplay(entry.netProfit);
            const avgMultiplier = entry.totalProfit / entry.totalBet;

            return (
              <div key={entry.id} className="plinko-history__entry">
                <div className="plinko-history__entry-header">
                  <span className="plinko-history__entry-emoji">{profitDisplay.emoji}</span>
                  <span className="plinko-history__entry-time">{formatTimestamp(entry.timestamp)}</span>
                </div>

                <div className="plinko-history__entry-details">
                  <div className="plinko-history__entry-detail">
                    <span className="plinko-history__entry-label">Balls:</span>
                    <span className="plinko-history__entry-value">{entry.ballsCount}</span>
                  </div>

                  <div className="plinko-history__entry-detail">
                    <span className="plinko-history__entry-label">Avg:</span>
                    <span
                      className="plinko-history__entry-value"
                      style={{ color: getMultiplierColor(avgMultiplier) }}
                    >
                      {avgMultiplier.toFixed(2)}x
                    </span>
                  </div>

                  <div className="plinko-history__entry-detail">
                    <span className="plinko-history__entry-label">Risk:</span>
                    <span className="plinko-history__entry-value">
                      {entry.riskLevel.charAt(0).toUpperCase() + entry.riskLevel.slice(1)}
                    </span>
                  </div>
                </div>

                <div
                  className="plinko-history__entry-profit"
                  style={{ color: profitDisplay.color }}
                >
                  {profitDisplay.sign}${Math.abs(entry.netProfit).toFixed(2)}
                </div>

                <div className="plinko-history__entry-bet">
                  Bet ${entry.totalBet.toFixed(2)} → ${entry.totalProfit.toFixed(2)}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

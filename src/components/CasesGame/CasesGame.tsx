import { useAuthStore } from "../../store/authStore";
import { useWalletStore } from "../../store/walletStore";
import type { CaseItem, CaseType, Rarity } from "../../types/cases";
import { CASES, RARITY_CONFIG } from "../../data/cases";
import { useCaseGameState } from "../../hooks/useCaseGameState";
import "./CasesGame.css";

const CARD_WIDTH = 140;
const WINDOW_WIDTH = 600;
const CENTER_OFFSET = WINDOW_WIDTH / 2 - CARD_WIDTH / 2;
const SPIN_ITEM_COUNT = 32;
const SPIN_DURATION_MS = 5500;

function pickWeightedItem(items: CaseItem[]): CaseItem {
  const weights = items.map((item) => RARITY_CONFIG[item.rarity].chance);
  const total = weights.reduce((sum, w) => sum + w, 0);
  const r = Math.random() * total;
  let acc = 0;

  for (let i = 0; i < items.length; i += 1) {
    acc += weights[i];
    if (r <= acc) {
      return items[i];
    }
  }

  return items[items.length - 1];
}

function getRarityClass(rarity: Rarity) {
  return `rarity-${rarity}`;
}

export default function CasesGame() {
  const { user } = useAuthStore();
  const { balance, updateBalance } = useWalletStore();

  const {
    isOpening,
    isSpinning,
    spinItems,
    translateX,
    winLossNotification,
    setSelectedCaseId,
    setIsOpening,
    setIsSpinning,
    setSpinItems,
    setTranslateX,
    setResultItem,
    setWinLossNotification,
    showStrip,
    showIdleOverlay,
    selectedCase,
    rarityEntries,
  } = useCaseGameState();

  const handleSelectCase = (id: CaseType["id"]) => {
    if (isOpening) return;

    setSelectedCaseId(id);
    setResultItem(null);
    setSpinItems([]);
    setIsSpinning(false);
    setTranslateX(0);
  };

  const handleOpen = async () => {
    if (!user || !selectedCase || isOpening) return;

    const price = selectedCase.price;

    setIsOpening(true);
    setResultItem(null);

    try {
      await updateBalance(user.id, -price);

      const winningItem = pickWeightedItem(selectedCase.items);

      const items: CaseItem[] = [];
      for (let i = 0; i < SPIN_ITEM_COUNT; i += 1) {
        const randomItem =
          selectedCase.items[
            Math.floor(Math.random() * selectedCase.items.length)
          ];
        items.push(randomItem);
      }

      const targetIndex = SPIN_ITEM_COUNT - 19;
      items[targetIndex] = winningItem;

      setSpinItems(items);
      setIsSpinning(false);
      setTranslateX(0);

      setTimeout(() => {
        const targetTranslate = -targetIndex * CARD_WIDTH + CENTER_OFFSET;
        setIsSpinning(true);
        setTranslateX(targetTranslate);
      }, 50);

      const rarityConfig = RARITY_CONFIG[winningItem.rarity];
      const cardValue = rarityConfig.value;
      const profitOrLoss = cardValue - price;

      setTimeout(async () => {
        await updateBalance(user.id, cardValue);
        setResultItem(winningItem);
        setIsSpinning(false);
        setIsOpening(false);

        setWinLossNotification({ amount: profitOrLoss, visible: true });
        setTimeout(() => {
          setWinLossNotification(null);
        }, 2000);
      }, SPIN_DURATION_MS + 150);
    } catch {
      setIsOpening(false);
    }
  };

  return (
    <div className="cases-root">
      <div className="cases-card">
        <div className="cases-header-row">
          <span className="cases-section-title">Select a Case</span>
        </div>

        <div className="cases-list">
          {CASES.map((caseType: CaseType) => {
            const isActive = caseType.id === selectedCase.id;
            return (
              <button
                key={caseType.id}
                type="button"
                className={`case-tile ${isActive ? "active" : ""}`}
                onClick={() => handleSelectCase(caseType.id)}
              >
                <div className="case-icon">{caseType.icon}</div>
                <div className="case-name">{caseType.name}</div>
                <div className="case-price">${caseType.price}</div>
              </button>
            );
          })}
        </div>

        <div className="cases-roulette-wrapper">
          <div className="cases-roulette-window">
            {showIdleOverlay && (
              <div className="cases-roulette-idle-overlay">
                <div className="cases-roulette-idle-icon">📦</div>
                <div className="cases-roulette-idle-text">
                  Select a case and click Open to start
                </div>
              </div>
            )}
            <div
              className="cases-roulette-strip"
              style={{
                transform: `translateX(${translateX}px)`,
                transition: isSpinning
                  ? `transform ${SPIN_DURATION_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`
                  : "none",
              }}
            >
              {showStrip &&
                spinItems.map((item, idx) => (
                  <div
                    key={`${item.id}-${idx}`}
                    className={`cases-roulette-card ${getRarityClass(item.rarity)}`}
                  >
                    <div className="cases-roulette-emoji">{item.emoji}</div>
                    <div className="cases-roulette-label">{item.name}</div>
                  </div>
                ))}
            </div>
            <div className="cases-roulette-indicator" />
          </div>
        </div>

        {winLossNotification?.visible && (
          <div
            className={`cases-win-loss-notification ${
              winLossNotification.amount >= 0 ? "win" : "loss"
            }`}
          >
            {winLossNotification.amount >= 0 ? "+" : ""}$
            {winLossNotification.amount.toFixed(2)}
          </div>
        )}

        <button
          type="button"
          className="cases-open-button"
          onClick={handleOpen}
          disabled={isOpening || !user || balance < selectedCase.price}
        >
          <span className="cases-open-icon">🎲</span>
          {isOpening
            ? "Opening..."
            : `Open ${selectedCase.name} – $${selectedCase.price}`}
        </button>

        <div className="cases-bottom-row">
          <div className="cases-items-grid">
            {selectedCase.items.map((item) => (
              <div
                key={item.id}
                className={`cases-item ${getRarityClass(item.rarity)}`}
              >
                <span className="cases-item-emoji">{item.emoji}</span>
              </div>
            ))}
          </div>

          <div className="cases-rarity-guide">
            <div className="cases-subtitle">Rarity Guide</div>
            <div className="cases-rarity-list">
              {rarityEntries.map(([rarity, config]) => (
                <div key={rarity} className="cases-rarity-row">
                  <span
                    className={`cases-rarity-dot ${getRarityClass(rarity)}`}
                  />
                  <span className="cases-rarity-label">{config.label}</span>
                  <span className="cases-rarity-chance">
                    ({config.chance}
                    %)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

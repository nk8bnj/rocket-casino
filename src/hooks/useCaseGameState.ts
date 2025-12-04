import { useMemo, useState } from "react";
import type { CaseItem, CaseType, Rarity } from "../types/cases";
import { CASES, RARITY_CONFIG } from "../data/cases";

export function useCaseGameState(initialCaseId: CaseType["id"] = "animal") {
  const [selectedCaseId, setSelectedCaseId] =
    useState<CaseType["id"]>(initialCaseId);
  const [isOpening, setIsOpening] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinItems, setSpinItems] = useState<CaseItem[]>([]);
  const [translateX, setTranslateX] = useState(0);
  const [resultItem, setResultItem] = useState<CaseItem | null>(null);
  const [winLossNotification, setWinLossNotification] = useState<{
    amount: number;
    visible: boolean;
  } | null>(null);

  const showStrip = isOpening || isSpinning || !!resultItem;
  const showIdleOverlay = !showStrip;

  const selectedCase = useMemo(
    () => CASES.find((c) => c.id === selectedCaseId) ?? CASES[0],
    [selectedCaseId],
  );

  const rarityEntries = useMemo(
    () =>
      Object.entries(RARITY_CONFIG) as [
        Rarity,
        (typeof RARITY_CONFIG)[Rarity],
      ][],
    [],
  );

  return {
    // state
    selectedCaseId,
    isOpening,
    isSpinning,
    spinItems,
    translateX,
    resultItem,
    winLossNotification,
    // setters
    setSelectedCaseId,
    setIsOpening,
    setIsSpinning,
    setSpinItems,
    setTranslateX,
    setResultItem,
    setWinLossNotification,
    // derived
    showStrip,
    showIdleOverlay,
    selectedCase,
    rarityEntries,
  };
}



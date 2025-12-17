export function calculateMinesMultiplier(
  minesCount: number,
  revealedTilesCount: number
): number {
  if (revealedTilesCount === 0) {
    return 1.0;
  }

  const safeSpots = 25 - minesCount;
  let multiplier = 1.0;

  for (let i = 0; i < revealedTilesCount; i++) {
    multiplier *= (25 - i) / (safeSpots - i);
  }

  multiplier *= 0.97;

  return multiplier;
}

export function generateMultiplierTable(minesCount: number): number[] {
  const safeSpots = 25 - minesCount;
  const table: number[] = [];

  for (let revealed = 0; revealed <= safeSpots; revealed++) {
    table.push(calculateMinesMultiplier(minesCount, revealed));
  }

  return table;
}


import type { BallPath, VisualPathPoint } from "../types/plinko";

const PEG_SPACING_X = 35;
const PEG_SPACING_Y = 45;
const BALL_BOUNCE_ROTATION = 15;
const BOUNCE_RANDOMNESS = 8;
const VERTICAL_BOUNCE_OFFSET = 5;

export function generateBallPath(linesCount: number): BallPath {
  const path: number[] = [];
  let position = linesCount / 2;

  for (let row = 0; row < linesCount; row++) {
    const direction = Math.random() < 0.5 ? -0.5 : 0.5;
    position += direction;
    path.push(direction);
  }

  const slotIndex = Math.max(0, Math.min(linesCount, Math.round(position)));

  const visualPath = calculateVisualCoordinates(path, linesCount, slotIndex);

  return {
    path,
    slotIndex,
    visualPath,
  };
}

function calculateVisualCoordinates(
  path: number[],
  linesCount: number,
  slotIndex: number
): VisualPathPoint[] {
  const visualPath: VisualPathPoint[] = [];

  const SLOT_SPACING = 40;
  const slotCount = linesCount + 1;
  console.log('slotCount', slotCount);
  const totalWidth = (slotCount - 1) * SLOT_SPACING;
  const xOffset = -totalWidth / 2;
  const finalSlotX = xOffset + slotIndex * SLOT_SPACING;

  let xPos = 0;
  let yPos = 0;
  let rotationAccum = 0;

  visualPath.push({ x: xPos, y: yPos, rotation: 0 });

  const INITIAL_DROP_DISTANCE = PEG_SPACING_Y * 0.5;
  yPos += INITIAL_DROP_DISTANCE;
  visualPath.push({ x: xPos, y: yPos, rotation: 0 });

  path.forEach((direction, index) => {
    const isLastPeg = index === path.length - 1;

    const targetX = xPos + (direction * PEG_SPACING_X);

    const randomFactor = isLastPeg ? 0 : (1 - (index / path.length) * 0.6);
    const randomOffset = (Math.random() - 0.5) * BOUNCE_RANDOMNESS * randomFactor;

    const preBounceY = yPos + (PEG_SPACING_Y * 0.4);
    visualPath.push({
      x: xPos + (direction * PEG_SPACING_X * 0.3) + randomOffset * 0.3,
      y: preBounceY,
      rotation: rotationAccum + (direction * BALL_BOUNCE_ROTATION * 0.5),
    });

    xPos = targetX + randomOffset;
    const collisionY = preBounceY + (PEG_SPACING_Y * 0.3) - VERTICAL_BOUNCE_OFFSET;
    rotationAccum += direction * BALL_BOUNCE_ROTATION * 2;

    visualPath.push({
      x: xPos,
      y: collisionY,
      rotation: rotationAccum,
    });

    yPos = preBounceY + (PEG_SPACING_Y * 0.6);

    if (isLastPeg) {
      visualPath.push({
        x: finalSlotX,
        y: yPos,
        rotation: rotationAccum + (direction * BALL_BOUNCE_ROTATION),
      });
    } else {
      visualPath.push({
        x: xPos + (Math.random() - 0.5) * (BOUNCE_RANDOMNESS * 0.5 * randomFactor),
        y: yPos,
        rotation: rotationAccum + (direction * BALL_BOUNCE_ROTATION),
      });
    }
  });

  const SLOT_DROP_DISTANCE = 60;
  yPos += SLOT_DROP_DISTANCE;

  visualPath.push({
    x: finalSlotX,
    y: yPos,
    rotation: rotationAccum,
  });

  return visualPath;
}

export function calculateAnimationDuration(linesCount: number): number {
  const BASE_DURATION_PER_ROW = 300;
  const BASE_DURATION = 300;
  return BASE_DURATION + (linesCount * BASE_DURATION_PER_ROW);
}

export function generateBallKeyframes(
  ballId: string,
  visualPath: VisualPathPoint[]
): string {
  const keyframes: string[] = [];
  const stepPercent = 100 / (visualPath.length - 1);

  visualPath.forEach((point, index) => {
    const percent = Math.round(index * stepPercent);
    keyframes.push(
      `${percent}% { transform: translate(${point.x}px, ${point.y}px) rotate(${point.rotation}deg); }`
    );
  });

  return `
    @keyframes ballDrop-${ballId} {
      ${keyframes.join("\n      ")}
    }
  `;
}

export function getPegPositions(linesCount: number): { x: number; y: number; row: number; col: number }[] {
  const pegs: { x: number; y: number; row: number; col: number }[] = [];

  for (let row = 0; row < linesCount; row++) {
    const pegsInRow = row + 3;

    for (let col = 0; col < pegsInRow; col++) {
      const rowWidth = (pegsInRow - 1) * PEG_SPACING_X;
      const xOffset = -rowWidth / 2;

      const x = xOffset + col * PEG_SPACING_X;
      const y = row * PEG_SPACING_Y;

      pegs.push({ x, y, row, col });
    }
  }

  return pegs;
}

export function getSlotPositions(linesCount: number): { x: number; index: number }[] {
  const slotCount = linesCount + 1;
  const slots: { x: number; index: number }[] = [];
  const SLOT_SPACING = 42;

  for (let i = 0; i < slotCount; i++) {
    const totalWidth = (slotCount - 1) * SLOT_SPACING;
    const xOffset = -totalWidth / 2;
    const x = xOffset + i * SLOT_SPACING;

    slots.push({ x, index: i });
  }

  return slots;
}

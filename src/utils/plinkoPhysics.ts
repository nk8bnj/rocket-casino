import type { BallPath, VisualPathPoint } from "../types/plinko";

const PEG_SPACING_X = 35;
const PEG_SPACING_Y = 45;
const PEG_RADIUS = 5;
const BALL_RADIUS = 7;

const GRAVITY = 0.5;
const BOUNCE_DAMPING = 0.75;
const FRICTION = 0.98;
const COLLISION_DISTANCE = PEG_RADIUS + BALL_RADIUS;

export interface PhysicsState {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  angularVelocity: number;
}

export interface Peg {
  x: number;
  y: number;
  row: number;
  col: number;
}

export function generateBallPath(linesCount: number): BallPath {
  const path: number[] = [];
  let position = linesCount / 2;

  for (let row = 0; row < linesCount; row++) {
    const direction = Math.random() < 0.5 ? -0.5 : 0.5;
    position += direction;
    path.push(direction);
  }

  const slotIndex = Math.max(0, Math.min(linesCount, Math.round(position)));

  const visualPath: VisualPathPoint[] = [{ x: 0, y: 0, rotation: 0 }];

  return {
    path,
    slotIndex,
    visualPath,
  };
}

export function getPegPositions(linesCount: number): Peg[] {
  const pegs: Peg[] = [];

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

  const bottomRowPegs = linesCount + 2;
  const totalWidth = (bottomRowPegs - 1) * PEG_SPACING_X;
  const xOffset = -totalWidth / 2;

  for (let i = 0; i < slotCount; i++) {
    const x = xOffset + (i * totalWidth) / (slotCount - 1);
    slots.push({ x, index: i });
  }

  return slots;
}

export function checkCollision(
  ball: PhysicsState,
  pegs: Peg[]
): Peg | null {
  for (const peg of pegs) {
    const dx = ball.x - peg.x;
    const dy = ball.y - peg.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < COLLISION_DISTANCE) {
      return peg;
    }
  }
  return null;
}

export function handleCollision(
  ball: PhysicsState,
  peg: Peg
): void {
  const dx = ball.x - peg.x;
  const dy = ball.y - peg.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance === 0) return;

  const nx = dx / distance;
  const ny = dy / distance;

  const overlap = COLLISION_DISTANCE - distance;
  ball.x += nx * overlap;
  ball.y += ny * overlap;

  const relativeVelocity = ball.vx * nx + ball.vy * ny;

  if (relativeVelocity > 0) return;

  const bounceImpulse = relativeVelocity * (1 + BOUNCE_DAMPING);
  ball.vx -= bounceImpulse * nx;
  ball.vy -= bounceImpulse * ny;

  const randomFactor = 0.3;
  ball.vx += (Math.random() - 0.5) * randomFactor;
  ball.vy += (Math.random() - 0.5) * randomFactor * 0.5;

  const impactAngle = Math.atan2(dy, dx);
  const velocityAngle = Math.atan2(ball.vy, ball.vx);
  const angleDiff = velocityAngle - impactAngle;
  ball.angularVelocity += Math.sin(angleDiff) * 2;
  ball.angularVelocity *= 0.9;
}

function getBoundariesAtY(y: number, linesCount: number): { left: number; right: number } {
  const PYRAMID_SLOPE = 17.5 / 45;
  const BORDER_OFFSET = 20;
  const slopeFactor = Math.sqrt(1 + PYRAMID_SLOPE * PYRAMID_SLOPE);
  const borderOffsetX = BORDER_OFFSET * slopeFactor;

  const topY = -10;
  const topX = PEG_SPACING_X + borderOffsetX;
  const bottomY = (linesCount - 1) * PEG_SPACING_Y + 10;
  const bottomX = (linesCount + 1) * 18.5 + borderOffsetX;

  let width: number;
  if (y < 0) {
    const t = (y - topY) / (bottomY - topY);
    width = topX + (bottomX - topX) * t;
  } else if (y >= bottomY) {
    width = bottomX;
  } else {
    const t = (y - topY) / (bottomY - topY);
    width = topX + (bottomX - topX) * t;
  }

  const margin = BALL_RADIUS + 2;

  return {
    left: -width - margin,
    right: width + margin
  };
}

export function updatePhysics(
  ball: PhysicsState,
  pegs: Peg[],
  deltaTime: number
): void {
  ball.vy += GRAVITY * deltaTime;

  ball.vx *= Math.pow(FRICTION, deltaTime);
  ball.vy *= Math.pow(FRICTION, deltaTime);

  ball.x += ball.vx * deltaTime;
  ball.y += ball.vy * deltaTime;

  ball.angularVelocity += (ball.vx * 0.01) * deltaTime;
  ball.angularVelocity *= 0.95;
  ball.rotation += ball.angularVelocity * deltaTime;

  if (pegs.length > 0) {
    const linesCount = pegs[pegs.length - 1].row + 1;
    const boundaries = getBoundariesAtY(ball.y, linesCount);

    if (ball.x < boundaries.left) {
      ball.x = boundaries.left;
      ball.vx = Math.abs(ball.vx) * BOUNCE_DAMPING;
      ball.angularVelocity += 2;
    }

    if (ball.x > boundaries.right) {
      ball.x = boundaries.right;
      ball.vx = -Math.abs(ball.vx) * BOUNCE_DAMPING;
      ball.angularVelocity -= 2;
    }
  }

  const collidedPeg = checkCollision(ball, pegs);
  if (collidedPeg) {
    handleCollision(ball, collidedPeg);
  }
}

export function findNearestSlot(
  ball: PhysicsState,
  slots: { x: number; index: number }[],
  finalY: number
): number {
  if (ball.y < finalY - 30) {
    return Math.floor(slots.length / 2);
  }

  let nearestSlot = 0;
  let minDistance = Math.abs(ball.x - slots[0].x);

  for (let i = 1; i < slots.length; i++) {
    const distance = Math.abs(ball.x - slots[i].x);
    if (distance < minDistance) {
      minDistance = distance;
      nearestSlot = i;
    }
  }

  return nearestSlot;
}

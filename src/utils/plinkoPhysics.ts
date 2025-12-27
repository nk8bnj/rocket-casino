import type { BallPath, VisualPathPoint } from "../types/plinko";

const PEG_SPACING_X = 35;
const PEG_SPACING_Y = 45;
const PEG_RADIUS = 5;
const BALL_RADIUS = 7;
const SLOT_SPACING = 35; // Must match PEG_SPACING_X for proper alignment

// Physics constants
const GRAVITY = 0.5; // pixels per frame squared
const BOUNCE_DAMPING = 0.75; // Energy loss on bounce (0-1)
const FRICTION = 0.98; // Air resistance
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

  // Generate a simple visual path for compatibility (will be overridden by physics)
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

  for (let i = 0; i < slotCount; i++) {
    const totalWidth = (slotCount - 1) * SLOT_SPACING;
    const xOffset = -totalWidth / 2;
    const x = xOffset + i * SLOT_SPACING;

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

  // Normalize collision vector
  const nx = dx / distance;
  const ny = dy / distance;

  // Move ball out of collision
  const overlap = COLLISION_DISTANCE - distance;
  ball.x += nx * overlap;
  ball.y += ny * overlap;

  // Calculate relative velocity along collision normal
  const relativeVelocity = ball.vx * nx + ball.vy * ny;

  // Only bounce if moving towards the peg
  if (relativeVelocity > 0) return;

  // Reflect velocity with damping
  const bounceImpulse = relativeVelocity * (1 + BOUNCE_DAMPING);
  ball.vx -= bounceImpulse * nx;
  ball.vy -= bounceImpulse * ny;

  // Add some randomness to make it more interesting
  const randomFactor = 0.3;
  ball.vx += (Math.random() - 0.5) * randomFactor;
  ball.vy += (Math.random() - 0.5) * randomFactor * 0.5;

  // Update angular velocity based on collision
  const impactAngle = Math.atan2(dy, dx);
  const velocityAngle = Math.atan2(ball.vy, ball.vx);
  const angleDiff = velocityAngle - impactAngle;
  ball.angularVelocity += Math.sin(angleDiff) * 2;
  ball.angularVelocity *= 0.9; // Angular damping
}

function getBoundariesAtY(y: number, linesCount: number): { left: number; right: number } {
  // Calculate which row we're at based on Y position
  const row = Math.max(0, Math.min(linesCount - 1, Math.floor(y / PEG_SPACING_Y)));

  // Calculate the width at this row
  const pegsInRow = row + 3;
  const rowWidth = (pegsInRow - 1) * PEG_SPACING_X;

  // Add margin for the ball radius plus some extra space
  const margin = BALL_RADIUS + 2;

  return {
    left: -rowWidth / 2 - margin,
    right: rowWidth / 2 + margin
  };
}

export function updatePhysics(
  ball: PhysicsState,
  pegs: Peg[],
  deltaTime: number
): void {
  // Apply gravity
  ball.vy += GRAVITY * deltaTime;

  // Apply friction
  ball.vx *= Math.pow(FRICTION, deltaTime);
  ball.vy *= Math.pow(FRICTION, deltaTime);

  // Update position
  ball.x += ball.vx * deltaTime;
  ball.y += ball.vy * deltaTime;

  // Update rotation based on velocity
  ball.angularVelocity += (ball.vx * 0.01) * deltaTime;
  ball.angularVelocity *= 0.95; // Angular damping
  ball.rotation += ball.angularVelocity * deltaTime;

  // Check for boundary collisions
  if (pegs.length > 0) {
    const linesCount = pegs[pegs.length - 1].row + 1;
    const boundaries = getBoundariesAtY(ball.y, linesCount);

    // Left boundary collision
    if (ball.x < boundaries.left) {
      ball.x = boundaries.left;
      ball.vx = Math.abs(ball.vx) * BOUNCE_DAMPING; // Bounce right
      ball.angularVelocity += 2; // Add spin
    }

    // Right boundary collision
    if (ball.x > boundaries.right) {
      ball.x = boundaries.right;
      ball.vx = -Math.abs(ball.vx) * BOUNCE_DAMPING; // Bounce left
      ball.angularVelocity -= 2; // Add spin
    }
  }

  // Check for collisions
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
    // Still falling, return middle slot as placeholder
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

export function calculateAnimationDuration(linesCount: number): number {
  // Estimate based on physics - will be determined by actual simulation
  const BASE_DURATION_PER_ROW = 400;
  const BASE_DURATION = 500;
  return BASE_DURATION + (linesCount * BASE_DURATION_PER_ROW);
}

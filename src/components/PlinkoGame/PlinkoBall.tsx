import { useEffect, useRef, useState } from "react";
import type { BallState } from "../../types/plinko";
import { usePlinkoStore } from "../../store/plinkoStore";
import {
  type PhysicsState,
  type Peg,
  getPegPositions,
  getSlotPositions,
  updatePhysics,
} from "../../utils/plinkoPhysics";

interface PlinkoBallProps {
  ball: BallState;
}

const INITIAL_VELOCITY_X = (Math.random() - 0.5) * 0.5;
const INITIAL_VELOCITY_Y = 0.2;

export default function PlinkoBall({ ball }: PlinkoBallProps) {
  const { completeBall, linesCount } = usePlinkoStore();
  const ballRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const physicsStateRef = useRef<PhysicsState>({
    x: 0,
    y: -40, // Start above the pyramid
    vx: INITIAL_VELOCITY_X,
    vy: INITIAL_VELOCITY_Y,
    rotation: 0,
    angularVelocity: 0,
  });
  const lastTimeRef = useRef<number>(0);
  const hasCompletedRef = useRef(false);
  const hasStartedRef = useRef(false);
  const [position, setPosition] = useState({ x: 0, y: 10, rotation: 0 });

  const pegsRef = useRef<Peg[]>([]);
  const slotsRef = useRef<{ x: number; index: number }[]>([]);
  const finalYRef = useRef(600);
  const scaleRef = useRef(1);
  const offsetYRef = useRef(0);

  useEffect(() => {
    pegsRef.current = getPegPositions(linesCount);
    slotsRef.current = getSlotPositions(linesCount);
    if (pegsRef.current.length > 0) {
      const lastPegY = pegsRef.current[pegsRef.current.length - 1].y;
      finalYRef.current = lastPegY + 60;

      const container = ballRef.current?.parentElement;
      if (container) {
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;

        const viewBoxWidth = 600;
        const viewBoxHeight = (linesCount - 1) * 45 + 180;

        const scaleX = containerWidth / viewBoxWidth;
        const scaleY = containerHeight / viewBoxHeight;
        scaleRef.current = Math.min(scaleX, scaleY);

        const scaledHeight = viewBoxHeight * scaleRef.current;
        offsetYRef.current = (containerHeight - scaledHeight) / 2;
      }
    }
  }, [linesCount]);

  useEffect(() => {
    const now = Date.now();
    const delay = Math.max(0, ball.startTime - now);

    const startTimer = setTimeout(() => {
      if (hasStartedRef.current) return;
      hasStartedRef.current = true;
      lastTimeRef.current = performance.now();

      const animate = (currentTime: number) => {
        if (hasCompletedRef.current) return;

        const deltaTime = Math.min((currentTime - lastTimeRef.current) / 16.67, 2);
        lastTimeRef.current = currentTime;

        const physics = physicsStateRef.current;

        updatePhysics(physics, pegsRef.current, deltaTime);

        if (physics.y >= finalYRef.current) {
          if (!hasCompletedRef.current) {
            hasCompletedRef.current = true;
            let nearestSlotIndex = 0;
            let minDistance = Math.abs(physics.x - slotsRef.current[0].x);

            for (let i = 1; i < slotsRef.current.length; i++) {
              const distance = Math.abs(physics.x - slotsRef.current[i].x);
              if (distance < minDistance) {
                minDistance = distance;
                nearestSlotIndex = i;
              }
            }

            const nearestSlot = slotsRef.current[nearestSlotIndex];
            if (nearestSlot) {
              setPosition({
                x: nearestSlot.x * scaleRef.current,
                y: (finalYRef.current + 50) * scaleRef.current + offsetYRef.current,
                rotation: physics.rotation,
              });
            }
            completeBall(ball.id, nearestSlotIndex);
          }
          return;
        }

        setPosition({
          x: physics.x * scaleRef.current,
          y: (physics.y + 50) * scaleRef.current + offsetYRef.current,
          rotation: physics.rotation,
        });

        animationFrameRef.current = requestAnimationFrame(animate);
      };

      animationFrameRef.current = requestAnimationFrame(animate);
    }, delay);

    return () => {
      clearTimeout(startTimer);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [ball, completeBall, linesCount]);

  return (
    <div
      ref={ballRef}
      className="plinko-ball"
      style={{
        transform: `translate(${position.x}px, ${position.y}px) rotate(${position.rotation}deg)`,
        transition: "none",
      }}
    />
  );
}

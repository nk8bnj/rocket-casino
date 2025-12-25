import { useEffect, useRef } from "react";
import type { BallState } from "../../types/plinko";
import { usePlinkoStore } from "../../store/plinkoStore";
import { calculateAnimationDuration } from "../../utils/plinkoPhysics";

interface PlinkoBallProps {
  ball: BallState;
}

export default function PlinkoBall({ ball }: PlinkoBallProps) {
  const { completeBall, linesCount } = usePlinkoStore();
  const ballRef = useRef<HTMLDivElement>(null);
  const hasCompletedRef = useRef(false);
  const hasStartedRef = useRef(false);

  useEffect(() => {
    const duration = calculateAnimationDuration(linesCount);
    const now = Date.now();
    const delay = Math.max(0, ball.startTime - now);

    const startTimer = setTimeout(() => {
      if (hasStartedRef.current) return;
      hasStartedRef.current = true;

      if (ballRef.current) {
        ballRef.current.style.animationPlayState = 'running';
      }

      const animationTimer = setTimeout(() => {
        if (!hasCompletedRef.current) {
          hasCompletedRef.current = true;
          completeBall(ball.id);
        }
      }, duration);

      return () => {
        clearTimeout(animationTimer);
      };
    }, delay);

    return () => {
      clearTimeout(startTimer);
    };
  }, [ball, completeBall, linesCount]);

  const keyframes = ball.visualPath
    .map((point, index) => {
      const percent = (index / (ball.visualPath.length - 1)) * 100;
      return `${percent}% { transform: translate(${point.x}px, ${point.y}px) rotate(${point.rotation}deg); }`;
    })
    .join("\n    ");

  const animationName = `ballDrop-${ball.id}`;
  const duration = calculateAnimationDuration(linesCount);

  return (
    <>
      <style>
        {`
          @keyframes ${animationName} {
            ${keyframes}
          }
        `}
      </style>

      <div
        ref={ballRef}
        className="plinko-ball"
        style={{
          animation: `${animationName} ${duration}ms ease-in forwards`,
          animationPlayState: 'paused',
        }}
      />
    </>
  );
}

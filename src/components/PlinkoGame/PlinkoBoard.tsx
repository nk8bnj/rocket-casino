import { usePlinkoStore } from "../../store/plinkoStore";
import { getPegPositions, getSlotPositions } from "../../utils/plinkoPhysics";
import { getMultipliers, getMultiplierColor } from "../../utils/plinkoMultiplier";
import PlinkoBall from "./PlinkoBall";

export default function PlinkoBoard() {
  const { linesCount, riskLevel, activeBalls, completedBalls, status } = usePlinkoStore();

  const pegs = getPegPositions(linesCount);

  const slots = getSlotPositions(linesCount);
  const multipliers = getMultipliers(riskLevel, linesCount);

  const highlightedSlots = status === "completed"
    ? completedBalls.map((ball) => ball.slotIndex)
    : [];

  const viewBoxHeight = (linesCount - 1) * 45 + 180;

  return (
    <div className="plinko-board">
      <div className="plinko-board__container">
        <svg className="plinko-board__svg" viewBox={`-300 -50 600 ${viewBoxHeight}`} preserveAspectRatio="xMidYMid meet">
          <defs>
            <radialGradient id="pegGradient" cx="30%" cy="30%">
              <stop offset="0%" stopColor="#a78bfa" stopOpacity="1" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="1" />
            </radialGradient>

            <filter id="slotGlow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {pegs.map((peg, index) => (
            <circle
              key={`peg-${index}`}
              cx={peg.x}
              cy={peg.y}
              r={5}
              fill="url(#pegGradient)"
              className="plinko-board__peg"
            />
          ))}

          {slots.map((slot, index) => {
            const multiplier = multipliers[index];
            const color = getMultiplierColor(multiplier);
            const isHighlighted = highlightedSlots.includes(index);

            return (
              <g key={`slot-${index}`} transform={`translate(${slot.x}, ${pegs[pegs.length - 1].y + 60})`}>
                <rect
                  x={-19}
                  y={-24}
                  width={38}
                  height={48}
                  fill={`${color}22`}
                  stroke={color}
                  strokeWidth={isHighlighted ? 3 : 2}
                  rx={6}
                  className={`plinko-board__slot ${isHighlighted ? "plinko-board__slot--highlighted" : ""}`}
                  filter={isHighlighted ? "url(#slotGlow)" : undefined}
                />

                <text
                  x={0}
                  y={5}
                  textAnchor="middle"
                  fontSize="13"
                  fontWeight="700"
                  fill={color}
                  className="plinko-board__slot-text"
                >
                  {multiplier}x
                </text>
              </g>
            );
          })}
        </svg>

        <div className="plinko-board__balls-container">
          {activeBalls.map((ball) => (
            <PlinkoBall key={ball.id} ball={ball} />
          ))}
        </div>
      </div>
    </div>
  );
}

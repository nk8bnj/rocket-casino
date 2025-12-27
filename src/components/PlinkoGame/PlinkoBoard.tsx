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

  // Calculate border positions to run parallel to pyramid edges
  const PEG_SPACING_X = 35;
  const PEG_SPACING_Y = 45;

  // The pyramid expands by 17.5 pixels horizontally for each 45 pixels vertically
  // This is the slope of the pyramid edge
  const PYRAMID_SLOPE = 17.5 / 45;

  // Border margin to clear pegs and balls
  const BORDER_OFFSET = 20; // Distance perpendicular to the pyramid edge

  // Calculate the perpendicular offset components
  // For a line with slope m, perpendicular distance d translates to:
  // dx = d / sqrt(1 + m²), dy = d * m / sqrt(1 + m²)
  const slopeFactor = Math.sqrt(1 + PYRAMID_SLOPE * PYRAMID_SLOPE);
  const borderOffsetX = BORDER_OFFSET * slopeFactor;

  // Top row (row 0): outermost pegs at ±35
  const topY = -10;
  const topX = 35 + borderOffsetX;

  // Bottom row: outermost pegs at ±(linesCount + 1) * 17.5
  const bottomY = (linesCount - 1) * PEG_SPACING_Y + 10;
  const bottomX = (linesCount + 1) * 18.5 + borderOffsetX;

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

          {/* Pyramid borders - left and right angled walls */}
          <line
            x1={-topX}
            y1={topY}
            x2={-bottomX}
            y2={bottomY}
            stroke="#8b5cf6"
            strokeWidth="3"
            strokeLinecap="round"
            className="plinko-board__border"
          />
          <line
            x1={topX}
            y1={topY}
            x2={bottomX}
            y2={bottomY}
            stroke="#8b5cf6"
            strokeWidth="3"
            strokeLinecap="round"
            className="plinko-board__border"
          />

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

        {/* Slots overlay - renders on top of balls */}
        <svg className="plinko-board__slots-overlay" viewBox={`-300 -50 600 ${viewBoxHeight}`} preserveAspectRatio="xMidYMid meet">
          <defs>
            <filter id="slotGlowOverlay">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {slots.map((slot, index) => {
            const multiplier = multipliers[index];
            const color = getMultiplierColor(multiplier);
            const isHighlighted = highlightedSlots.includes(index);

            return (
              <g key={`slot-overlay-${index}`} transform={`translate(${slot.x}, ${pegs[pegs.length - 1].y + 60})`}>
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
                  filter={isHighlighted ? "url(#slotGlowOverlay)" : undefined}
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
      </div>
    </div>
  );
}

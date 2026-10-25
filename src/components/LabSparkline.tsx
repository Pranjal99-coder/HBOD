import React, { useState } from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

export interface LabHistoryPoint {
  dayLabel: string; // e.g. 'Day -30', 'Day -21', 'Day -14', 'Day -7', 'Today'
  value: number;
}

interface LabSparklineProps {
  label: string;
  unit: string;
  history: LabHistoryPoint[];
  currentValue: number;
  normalRange?: string;
  isHigherWorse?: boolean; // If true (e.g. Bilirubin, CA 19-9, BNP), increase is red. If false (e.g. eGFR, Albumin, FEV1), decrease is red.
  height?: number;
  width?: number;
}

export const LabSparkline: React.FC<LabSparklineProps> = ({
  label,
  unit,
  history,
  currentValue,
  normalRange,
  isHigherWorse = true,
  height = 36,
  width = 130
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Combine history with latest current value as the last point
  const points = [...history];
  if (points.length > 0) {
    points[points.length - 1] = {
      ...points[points.length - 1],
      value: currentValue
    };
  }

  const values = points.map(p => p.value);
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const delta = maxVal - minVal || 1;

  // 30-day delta calculation
  const startVal = points[0]?.value || currentValue;
  const changePct = startVal !== 0 ? ((currentValue - startVal) / startVal) * 100 : 0;
  const isWorsening = isHigherWorse ? changePct > 5 : changePct < -5;
  const isImproving = isHigherWorse ? changePct < -5 : changePct > 5;

  // SVG Coordinates calculation with 4px padding
  const padX = 6;
  const padY = 5;
  const innerW = width - padX * 2;
  const innerH = height - padY * 2;

  const getX = (idx: number) => padX + (idx / (points.length - 1)) * innerW;
  const getY = (val: number) => {
    // Invert Y so high values are at top
    const normalized = (val - minVal) / delta;
    return padY + (1 - normalized) * innerH;
  };

  // Build SVG path
  let pathD = '';
  points.forEach((p, idx) => {
    const x = getX(idx);
    const y = getY(p.value);
    pathD += idx === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`;
  });

  const areaD = `${pathD} L ${getX(points.length - 1)} ${height} L ${getX(0)} ${height} Z`;

  // Colors
  const strokeColor = isWorsening ? '#DC2626' : isImproving ? '#2D6A5F' : '#64748B';
  const gradientId = `spark-grad-${label.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;

  const activeHover = hoveredIndex !== null ? points[hoveredIndex] : null;

  return (
    <div className="flex flex-col gap-1 w-full select-none">
      <div className="flex items-center justify-between text-[10px]">
        <div className="flex items-center gap-1.5 text-[#5C6E6B] font-mono">
          <span className="font-semibold text-[#253835]">30-Day Trend</span>
          {normalRange && (
            <span className="text-[#849491]">· Ref: {normalRange}</span>
          )}
        </div>

        <div className="flex items-center gap-1 font-mono tabular-nums font-semibold">
          {Math.abs(changePct) < 3 ? (
            <span className="text-[#64748B] flex items-center gap-0.5">
              <Minus className="w-2.5 h-2.5" />
              <span>Stable</span>
            </span>
          ) : changePct > 0 ? (
            <span className={`flex items-center gap-0.5 ${isWorsening ? 'text-[#B91C1C]' : 'text-[#2D6A5F]'}`}>
              <ArrowUpRight className="w-2.5 h-2.5" />
              <span>+{changePct.toFixed(0)}%</span>
            </span>
          ) : (
            <span className={`flex items-center gap-0.5 ${isWorsening ? 'text-[#B91C1C]' : 'text-[#2D6A5F]'}`}>
              <ArrowDownRight className="w-2.5 h-2.5" />
              <span>{changePct.toFixed(0)}%</span>
            </span>
          )}
        </div>
      </div>

      {/* Mini SVG Sparkline Canvas */}
      <div className="relative w-full h-[38px] bg-white rounded-lg border border-[#E8E6DF] overflow-hidden px-1">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full overflow-visible"
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={strokeColor} stopOpacity="0.25" />
              <stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Area under curve */}
          <path d={areaD} fill={`url(#${gradientId})`} />

          {/* Sparkline curve */}
          <path
            d={pathD}
            fill="none"
            stroke={strokeColor}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Interactive timepoints */}
          {points.map((p, idx) => {
            const cx = getX(idx);
            const cy = getY(p.value);
            const isLast = idx === points.length - 1;
            const isSelected = hoveredIndex === idx;

            return (
              <g
                key={idx}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <circle
                  cx={cx}
                  cy={cy}
                  r={isSelected ? 4 : isLast ? 3 : 2}
                  fill={isLast || isSelected ? '#FFFFFF' : strokeColor}
                  stroke={strokeColor}
                  strokeWidth={isLast || isSelected ? 1.8 : 0.5}
                />
              </g>
            );
          })}
        </svg>

        {/* Hover inspection pill */}
        {activeHover && (
          <div className="absolute inset-x-1 bottom-0.5 top-0.5 bg-white/95 backdrop-blur-xs flex items-center justify-between px-2 text-[10px] rounded font-mono z-10 border border-[#DFDDD4] shadow-2xs">
            <span className="text-[#6C7D7A] font-medium">{activeHover.dayLabel}:</span>
            <span className="font-bold text-[#182C29]">
              {activeHover.value} <span className="text-[#788885] font-normal">{unit}</span>
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-[9px] text-[#7B8B88] font-mono px-0.5">
        <span>Day -30</span>
        <span>Day -14</span>
        <span className="font-semibold text-[#2D6A5F]">Today</span>
      </div>
    </div>
  );
};

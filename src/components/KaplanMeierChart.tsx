import React, { useState } from 'react';
import { SurvivalCurvePoint } from '../types/clinical';

interface KaplanMeierChartProps {
  data: SurvivalCurvePoint[];
  conditionName: string;
  medianSurvivalMonths: number;
}

export const KaplanMeierChart: React.FC<KaplanMeierChartProps> = ({
  data,
  conditionName,
  medianSurvivalMonths
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // SVG coordinate calculations
  const width = 640;
  const height = 240;
  const paddingLeft = 46;
  const paddingRight = 24;
  const paddingTop = 20;
  const paddingBottom = 34;

  const innerWidth = width - paddingLeft - paddingRight;
  const innerHeight = height - paddingTop - paddingBottom;

  const maxMonth = 36;

  const getX = (month: number) => paddingLeft + (month / maxMonth) * innerWidth;
  const getY = (prob: number) => paddingTop + (1 - prob / 100) * innerHeight;

  // Build SVG path for primary curve (step-down style typical of Kaplan-Meier)
  let linePath = `M ${getX(data[0].month)} ${getY(data[0].survivalProbability)}`;
  let areaUpperPath = `M ${getX(data[0].month)} ${getY(data[0].upperBound)}`;
  let areaLowerPath = '';

  for (let i = 1; i < data.length; i++) {
    const prev = data[i - 1];
    const curr = data[i];

    // Stepped Kaplan-Meier trajectory
    linePath += ` L ${getX(curr.month)} ${getY(prev.survivalProbability)} L ${getX(curr.month)} ${getY(curr.survivalProbability)}`;
    areaUpperPath += ` L ${getX(curr.month)} ${getY(prev.upperBound)} L ${getX(curr.month)} ${getY(curr.upperBound)}`;
  }

  // Reverse for lower bound to form confidence polygon
  for (let i = data.length - 1; i >= 0; i--) {
    const curr = data[i];
    if (i === data.length - 1) {
      areaLowerPath += ` L ${getX(curr.month)} ${getY(curr.lowerBound)}`;
    } else {
      const next = data[i + 1];
      areaLowerPath += ` L ${getX(next.month)} ${getY(curr.lowerBound)} L ${getX(curr.month)} ${getY(curr.lowerBound)}`;
    }
  }

  const confidenceBandPath = `${areaUpperPath} ${areaLowerPath} Z`;

  // Median 50% line y coordinate
  const y50 = getY(50);
  const xMedian = getX(medianSurvivalMonths);

  const activePoint = hoveredIndex !== null ? data[hoveredIndex] : data[data.length - 1];

  return (
    <div className="w-full bg-[#FCFCFA] rounded-xl border border-[#E7E5E0] p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#EBE9E3] gap-2">
        <div>
          <h4 className="text-sm font-semibold text-[#182625] flex items-center gap-2">
            Kaplan-Meier Estimated Survival Function
            <span className="text-xs font-normal text-[#606E6B] font-mono tabular-nums">(95% Confidence Band)</span>
          </h4>
          <p className="text-xs text-[#707D7A] mt-0.5">
            Calibrated against institutional clinical trial registries and palliative longitudinal cohorts
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs text-[#4F5E5B] shrink-0 font-mono tabular-nums">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-[#2D6A5F] inline-block"></span>
            <span>Median: {medianSurvivalMonths} mo</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-2 bg-[#2D6A5F]/15 inline-block border border-[#2D6A5F]/30 rounded-[1px]"></span>
            <span>95% CI</span>
          </div>
        </div>
      </div>

      <div className="relative mt-4">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible select-none"
        >
          {/* Horizontal gridlines */}
          {[100, 75, 50, 25, 0].map(val => (
            <g key={val}>
              <line
                x1={paddingLeft}
                y1={getY(val)}
                x2={width - paddingRight}
                y2={getY(val)}
                stroke="#EAE8E2"
                strokeDasharray={val === 50 ? '3 3' : 'none'}
                strokeWidth={val === 50 ? '1.5' : '1'}
              />
              <text
                x={paddingLeft - 8}
                y={getY(val) + 3.5}
                textAnchor="end"
                className="text-[10px] fill-[#7E8B88] font-mono"
              >
                {val}%
              </text>
            </g>
          ))}

          {/* Vertical month gridlines */}
          {[0, 6, 12, 18, 24, 30, 36].map(m => (
            <g key={m}>
              <line
                x1={getX(m)}
                y1={paddingTop}
                x2={getX(m)}
                y2={height - paddingBottom}
                stroke="#F1EFEA"
                strokeWidth="1"
              />
              <text
                x={getX(m)}
                y={height - paddingBottom + 16}
                textAnchor="middle"
                className="text-[10px] fill-[#7E8B88] font-mono"
              >
                {m}m
              </text>
            </g>
          ))}

          {/* 50% Median benchmark crosshair */}
          <line
            x1={paddingLeft}
            y1={y50}
            x2={xMedian}
            y2={y50}
            stroke="#D97706"
            strokeWidth="1.2"
            strokeDasharray="2 2"
          />
          <line
            x1={xMedian}
            y1={y50}
            x2={xMedian}
            y2={height - paddingBottom}
            stroke="#D97706"
            strokeWidth="1.2"
            strokeDasharray="2 2"
          />
          <circle
            cx={xMedian}
            cy={y50}
            r="3.5"
            fill="#D97706"
          />

          {/* 95% Confidence Band polygon */}
          <path
            d={confidenceBandPath}
            fill="#2D6A5F"
            fillOpacity="0.12"
          />

          {/* Primary Step Curve */}
          <path
            d={linePath}
            fill="none"
            stroke="#2D6A5F"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />

          {/* Interactive milestone markers */}
          {data.map((pt, idx) => (
            <g
              key={pt.month}
              className="cursor-pointer"
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <circle
                cx={getX(pt.month)}
                cy={getY(pt.survivalProbability)}
                r={hoveredIndex === idx ? '6' : '3.5'}
                fill="#FFFFFF"
                stroke="#2D6A5F"
                strokeWidth="2"
                className="transition-all"
              />
            </g>
          ))}
        </svg>

        {/* Hover info tooltip */}
        {activePoint && (
          <div className="mt-2 py-2 px-3 bg-[#F4F3EE] rounded-lg border border-[#E2DFD6] flex flex-wrap items-center justify-between text-xs text-[#32403E]">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[#182625]">{activePoint.month} Months Post-Diagnosis:</span>
              <span className="font-mono tabular-nums text-[#2D6A5F] font-bold">{activePoint.survivalProbability}% Probability</span>
            </div>
            <div className="text-[#647370] font-mono tabular-nums text-[11px]">
              95% Confidence Interval: [{activePoint.lowerBound}% – {activePoint.upperBound}%]
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

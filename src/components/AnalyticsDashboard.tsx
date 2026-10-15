import React, { useState, useMemo } from 'react';
import {
  Users,
  TrendingUp,
  Activity,
  HeartHandshake,
  ShieldCheck,
  Calendar,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  Download,
  Share2,
  Clock,
  Sparkles,
  Stethoscope
} from 'lucide-react';
import { MOCK_PATIENT_COHORTS } from '../data/mockPatients';

interface AnalyticsDashboardProps {
  onLoadPatientIntoWorkbench: (patientId: string) => void;
  onOpenWorkbench: () => void;
}

type SpecialtyFilter = 'all' | 'neuro' | 'onco' | 'cardio' | 'hepato' | 'pulmo';
type TimeRangeFilter = '30d' | '6m' | '12m';

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  onLoadPatientIntoWorkbench,
  onOpenWorkbench
}) => {
  const [specialty, setSpecialty] = useState<SpecialtyFilter>('all');
  const [timeRange, setTimeRange] = useState<TimeRangeFilter>('12m');
  const [hoveredMonthIndex, setHoveredMonthIndex] = useState<number | null>(null);
  const [hoveredCohortTrend, setHoveredCohortTrend] = useState<string | null>(null);

  // 12-Month trend data for Patient Volume & Prognostic Inferences
  const monthlyInferenceData = useMemo(() => {
    return [
      { month: 'Oct 2025', inferences: 88, highRiskFlagged: 41, palliativeInitiated: 34, leadTimeMonths: 3.6 },
      { month: 'Nov 2025', inferences: 96, highRiskFlagged: 46, palliativeInitiated: 39, leadTimeMonths: 3.8 },
      { month: 'Dec 2025', inferences: 104, highRiskFlagged: 52, palliativeInitiated: 44, leadTimeMonths: 4.0 },
      { month: 'Jan 2026', inferences: 115, highRiskFlagged: 59, palliativeInitiated: 51, leadTimeMonths: 4.2 },
      { month: 'Feb 2026', inferences: 126, highRiskFlagged: 64, palliativeInitiated: 58, leadTimeMonths: 4.4 },
      { month: 'Mar 2026', inferences: 138, highRiskFlagged: 71, palliativeInitiated: 65, leadTimeMonths: 4.5 },
      { month: 'Apr 2026', inferences: 147, highRiskFlagged: 76, palliativeInitiated: 70, leadTimeMonths: 4.7 },
      { month: 'May 2026', inferences: 159, highRiskFlagged: 82, palliativeInitiated: 77, leadTimeMonths: 4.9 },
      { month: 'Jun 2026', inferences: 168, highRiskFlagged: 88, palliativeInitiated: 83, leadTimeMonths: 5.1 },
      { month: 'Jul 2026', inferences: 182, highRiskFlagged: 94, palliativeInitiated: 89, leadTimeMonths: 5.3 },
      { month: 'Aug 2026', inferences: 194, highRiskFlagged: 102, palliativeInitiated: 97, leadTimeMonths: 5.5 },
      { month: 'Sep 2026', inferences: 212, highRiskFlagged: 110, palliativeInitiated: 106, leadTimeMonths: 5.8 }
    ];
  }, []);

  // Filtered dataset slice
  const displayedMonthlyData = useMemo(() => {
    if (timeRange === '30d') return monthlyInferenceData.slice(-3);
    if (timeRange === '6m') return monthlyInferenceData.slice(-6);
    return monthlyInferenceData;
  }, [timeRange, monthlyInferenceData]);

  // Cohort comparative survival trajectories
  const cohortSurvivalCurves = [
    {
      id: 'als',
      name: 'ALS (Motor Neuron)',
      color: '#2D6A5F',
      points: [
        { m: 0, s: 100 },
        { m: 6, s: 88 },
        { m: 12, s: 71 },
        { m: 18, s: 51 },
        { m: 24, s: 33 },
        { m: 36, s: 16 }
      ],
      median: 18
    },
    {
      id: 'pancreatic',
      name: 'Pancreatic Adeno (St IV)',
      color: '#DC2626',
      points: [
        { m: 0, s: 100 },
        { m: 3, s: 79 },
        { m: 6, s: 58 },
        { m: 9, s: 38 },
        { m: 12, s: 21 },
        { m: 18, s: 8 }
      ],
      median: 7.5
    },
    {
      id: 'heart_failure',
      name: 'Heart Failure (NYHA IV)',
      color: '#D97706',
      points: [
        { m: 0, s: 100 },
        { m: 3, s: 84 },
        { m: 6, s: 69 },
        { m: 9, s: 54 },
        { m: 12, s: 42 },
        { m: 24, s: 22 }
      ],
      median: 11
    },
    {
      id: 'cirrhosis',
      name: 'Decompensated Cirrhosis',
      color: '#7C3AED',
      points: [
        { m: 0, s: 100 },
        { m: 3, s: 77 },
        { m: 6, s: 59 },
        { m: 9, s: 44 },
        { m: 12, s: 31 },
        { m: 24, s: 14 }
      ],
      median: 8
    },
    {
      id: 'ipf',
      name: 'Pulmonary Fibrosis (GAP III)',
      color: '#0284C7',
      points: [
        { m: 0, s: 100 },
        { m: 6, s: 86 },
        { m: 12, s: 68 },
        { m: 18, s: 49 },
        { m: 24, s: 34 },
        { m: 36, s: 18 }
      ],
      median: 14
    }
  ];

  // Specialty multiplier for dynamic KPI scaling
  const multiplier = useMemo(() => {
    switch (specialty) {
      case 'onco': return 0.38;
      case 'neuro': return 0.24;
      case 'cardio': return 0.22;
      case 'hepato': return 0.16;
      case 'pulmo': return 0.18;
      default: return 1.0;
    }
  }, [specialty]);

  const totalPatients = Math.round(1482 * multiplier);
  const highRiskIntakes = Math.round(786 * multiplier);
  const leadTimeGain = specialty === 'onco' ? '4.2 Mo' : specialty === 'neuro' ? '5.6 Mo' : '4.8 Mo';

  // SVG Chart Dimensions for Trend 1
  const chartWidth = 720;
  const chartHeight = 240;
  const padLeft = 46;
  const padRight = 20;
  const padTop = 20;
  const padBottom = 34;
  const innerW = chartWidth - padLeft - padRight;
  const innerH = chartHeight - padTop - padBottom;

  const maxVal = Math.max(...displayedMonthlyData.map(d => d.inferences)) * 1.15;

  const getLineX = (index: number) =>
    padLeft + (index / (displayedMonthlyData.length - 1)) * innerW;

  const getLineY = (val: number) =>
    padTop + (1 - val / maxVal) * innerH;

  // Build SVG path for Total Inferences
  const inferencesPath = displayedMonthlyData.reduce((acc, curr, idx) => {
    const x = getLineX(idx);
    const y = getLineY(curr.inferences);
    return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
  }, '');

  // Area path for gradient fill
  const inferencesAreaPath = `${inferencesPath} L ${getLineX(displayedMonthlyData.length - 1)} ${padTop + innerH} L ${padLeft} ${padTop + innerH} Z`;

  // Build SVG path for High Risk Flagged
  const highRiskPath = displayedMonthlyData.reduce((acc, curr, idx) => {
    const x = getLineX(idx);
    const y = getLineY(curr.highRiskFlagged);
    return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
  }, '');

  // Build SVG path for Palliative Initiated
  const palliativePath = displayedMonthlyData.reduce((acc, curr, idx) => {
    const x = getLineX(idx);
    const y = getLineY(curr.palliativeInitiated);
    return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
  }, '');

  const activeHoverData =
    hoveredMonthIndex !== null ? displayedMonthlyData[hoveredMonthIndex] : displayedMonthlyData[displayedMonthlyData.length - 1];

  return (
    <div className="w-full bg-[#F6F5F1] py-8 lg:py-12 border-b border-[#E3E1D7]">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 space-y-8">
        
        {/* Top Header & Contextual Ribbon */}
        <div className="bg-white rounded-2xl border border-[#DFDDD4] p-6 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#EBE9E1]">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#2D6A5F] mb-1">
                <Activity className="w-4 h-4" />
                <span>Executive & Population Health Intelligence</span>
                <span aria-hidden="true" className="text-[#9DB3AF]">·</span>
                <span className="text-[#596D69] normal-case tracking-normal">Multi-Hospital Network Registry</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#142624]">
                Clinical Prognostics & Terminal Cohort KPI Dashboard
              </h1>
              <p className="text-xs sm:text-sm text-[#4D5F5B] mt-1 max-w-2xl">
                Real-time tracking of patient enrollment, predictive diagnostic lead time, avoidable emergency crisis rates, and goal-of-care palliative concordance.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={onOpenWorkbench}
                className="px-5 py-2.5 text-xs font-semibold text-white bg-[#1A3330] hover:bg-[#254642] active:scale-[0.98] rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer"
              >
                <Stethoscope className="w-3.5 h-3.5 text-[#6EE7B7]" />
                <span>Open Patient Workbench</span>
              </button>
            </div>
          </div>

          {/* Interactive Filters Strip */}
          <div className="pt-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Specialty Segmented Filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              <span className="text-[#687875] font-medium mr-1 whitespace-nowrap">Specialty:</span>
              {[
                { id: 'all', label: 'All Cohorts' },
                { id: 'onco', label: 'Medical Oncology' },
                { id: 'neuro', label: 'Neuro-Palliative' },
                { id: 'cardio', label: 'Cardiopulmonary' },
                { id: 'hepato', label: 'Hepato-Renal' },
                { id: 'pulmo', label: 'Pulmonary ILD' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSpecialty(tab.id as SpecialtyFilter)}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer whitespace-nowrap border ${
                    specialty === tab.id
                      ? 'bg-[#182C29] text-white border-[#182C29] shadow-xs'
                      : 'bg-[#FAFAF8] text-[#3E4F4C] border-[#DEDBD2] hover:bg-[#EFEFE8]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Time Range Filter */}
            <div className="flex items-center gap-1 text-xs shrink-0 bg-[#F1F0E9] p-1 rounded-lg border border-[#DEDBD2]">
              {[
                { id: '30d', label: 'Last 30 Days' },
                { id: '6m', label: 'Last 6 Months' },
                { id: '12m', label: '12 Months' }
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTimeRange(t.id as TimeRangeFilter)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                    timeRange === t.id
                      ? 'bg-white text-[#152725] shadow-xs font-semibold'
                      : 'text-[#627571] hover:text-[#152725]'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

          </div>
        </div>

        {/* ================= 5 PRIMARY CLINICAL KPI CARDS ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          
          {/* KPI 1: Total Monitored Patients */}
          <div className="bg-white rounded-2xl p-5 border border-[#DFDDD4] shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-[#6B7C79] mb-2">
                <span className="font-semibold uppercase tracking-wider text-[11px]">Total Patients</span>
                <Users className="w-4 h-4 text-[#2D6A5F]" />
              </div>
              <div className="text-3xl font-serif font-bold text-[#142624] font-mono tabular-nums">
                {totalPatients.toLocaleString()}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-[#2D6A5F] font-mono mt-1">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span className="font-semibold">+14.2% YoY</span>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-[#EFECE5] text-[11px] text-[#71827E] flex items-center justify-between">
              <span>High-Risk Stratified:</span>
              <span className="font-mono font-bold text-[#142624]">{highRiskIntakes}</span>
            </div>
          </div>

          {/* KPI 2: Mean Diagnostic Lead Time */}
          <div className="bg-white rounded-2xl p-5 border border-[#DFDDD4] shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-[#6B7C79] mb-2">
                <span className="font-semibold uppercase tracking-wider text-[11px]">Diagnostic Foresight</span>
                <Clock className="w-4 h-4 text-[#2D6A5F]" />
              </div>
              <div className="text-3xl font-serif font-bold text-[#142624] font-mono tabular-nums">
                {leadTimeGain}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-[#2D6A5F] font-mono mt-1">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span className="font-semibold">+1.6 mo vs standard</span>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-[#EFECE5] text-[11px] text-[#71827E] flex items-center justify-between">
              <span>Palliative Transition:</span>
              <span className="font-mono font-bold text-[#142624]">Stage-Aligned</span>
            </div>
          </div>

          {/* KPI 3: Avoidable ICU Transfers Spared */}
          <div className="bg-white rounded-2xl p-5 border border-[#DFDDD4] shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-[#6B7C79] mb-2">
                <span className="font-semibold uppercase tracking-wider text-[11px]">ICU Crisis Avoidance</span>
                <ShieldCheck className="w-4 h-4 text-[#2D6A5F]" />
              </div>
              <div className="text-3xl font-serif font-bold text-[#142624] font-mono tabular-nums">
                64.2%
              </div>
              <div className="flex items-center gap-1.5 text-xs text-[#2D6A5F] font-mono mt-1">
                <ArrowDownRight className="w-3.5 h-3.5 text-[#2D6A5F]" />
                <span className="font-semibold">-412 Acute Crises</span>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-[#EFECE5] text-[11px] text-[#71827E] flex items-center justify-between">
              <span>Bed-Days Preserved:</span>
              <span className="font-mono font-bold text-[#142624]">18 d/pt</span>
            </div>
          </div>

          {/* KPI 4: Goals-of-Care Concordance */}
          <div className="bg-white rounded-2xl p-5 border border-[#DFDDD4] shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-[#6B7C79] mb-2">
                <span className="font-semibold uppercase tracking-wider text-[11px]">Goals Concordance</span>
                <HeartHandshake className="w-4 h-4 text-[#2D6A5F]" />
              </div>
              <div className="text-3xl font-serif font-bold text-[#142624] font-mono tabular-nums">
                91.8%
              </div>
              <div className="flex items-center gap-1.5 text-xs text-[#2D6A5F] font-mono mt-1">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span className="font-semibold">+29.4% post-ML</span>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-[#EFECE5] text-[11px] text-[#71827E] flex items-center justify-between">
              <span>Advance Directives:</span>
              <span className="font-mono font-bold text-[#142624]">Documented</span>
            </div>
          </div>

          {/* KPI 5: Model Calibration (AUROC) */}
          <div className="bg-white rounded-2xl p-5 border border-[#DFDDD4] shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-[#6B7C79] mb-2">
                <span className="font-semibold uppercase tracking-wider text-[11px]">ROC-AUC Calibration</span>
                <Activity className="w-4 h-4 text-[#2D6A5F]" />
              </div>
              <div className="text-3xl font-serif font-bold text-[#142624] font-mono tabular-nums">
                0.942
              </div>
              <div className="flex items-center gap-1.5 text-xs text-[#2D6A5F] font-mono mt-1">
                <span className="font-semibold font-mono">Brier: 0.076</span>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-[#EFECE5] text-[11px] text-[#71827E] flex items-center justify-between">
              <span>Validations Run:</span>
              <span className="font-mono font-bold text-[#142624]">184k</span>
            </div>
          </div>

        </div>

        {/* ================= 2 COLUMN TREND LINE CHARTS SECTION ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Trend Chart 1: Monthly Patient Enrollment & Inference Volume Trend Line (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-[#DFDDD4] p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#EAE8E0] gap-3">
              <div>
                <h3 className="text-base font-serif font-bold text-[#142624]">
                  Longitudinal Patient Intake & ML Inference Trend
                </h3>
                <p className="text-xs text-[#627571] mt-0.5">
                  Monthly volume of terminal risk evaluations vs. proactive palliative transitions
                </p>
              </div>

              {/* Legend */}
              <div className="flex flex-wrap items-center gap-4 text-xs font-mono shrink-0">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 bg-[#182C29]"></span>
                  <span className="text-[#182C29]">Inferences Run</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 bg-[#DC2626]"></span>
                  <span className="text-[#DC2626]">High-Risk Flagged</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 bg-[#2D6A5F]"></span>
                  <span className="text-[#2D6A5F]">Palliative Active</span>
                </div>
              </div>
            </div>

            {/* SVG Trend Line Chart */}
            <div className="mt-5 relative">
              <svg
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                className="w-full h-auto overflow-visible select-none"
              >
                <defs>
                  <linearGradient id="inferencesGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#182C29" stopOpacity="0.12" />
                    <stop offset="100%" stopColor="#182C29" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Horizontal reference lines */}
                {[200, 150, 100, 50, 0].map(val => (
                  <g key={val}>
                    <line
                      x1={padLeft}
                      y1={getLineY(val)}
                      x2={chartWidth - padRight}
                      y2={getLineY(val)}
                      stroke="#EFECE5"
                      strokeWidth="1"
                    />
                    <text
                      x={padLeft - 8}
                      y={getLineY(val) + 3.5}
                      textAnchor="end"
                      className="text-[10px] fill-[#7D8E8B] font-mono tabular-nums"
                    >
                      {val}
                    </text>
                  </g>
                ))}

                {/* Vertical month lines */}
                {displayedMonthlyData.map((d, idx) => (
                  <g key={d.month}>
                    <line
                      x1={getLineX(idx)}
                      y1={padTop}
                      x2={getLineX(idx)}
                      y2={chartHeight - padBottom}
                      stroke="#F4F2EC"
                      strokeWidth="1"
                    />
                    <text
                      x={getLineX(idx)}
                      y={chartHeight - padBottom + 16}
                      textAnchor="middle"
                      className="text-[10px] fill-[#6D7F7B] font-mono"
                    >
                      {d.month.split(' ')[0]}
                    </text>
                  </g>
                ))}

                {/* Area Gradient Fill */}
                <path d={inferencesAreaPath} fill="url(#inferencesGradient)" />

                {/* Line 1: Total Inferences */}
                <path
                  d={inferencesPath}
                  fill="none"
                  stroke="#182C29"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                />

                {/* Line 2: High Risk Flagged */}
                <path
                  d={highRiskPath}
                  fill="none"
                  stroke="#DC2626"
                  strokeWidth="2"
                  strokeDasharray="4 2"
                  strokeLinejoin="round"
                />

                {/* Line 3: Palliative Active */}
                <path
                  d={palliativePath}
                  fill="none"
                  stroke="#2D6A5F"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                />

                {/* Interactive Points */}
                {displayedMonthlyData.map((d, idx) => {
                  const x = getLineX(idx);
                  const y = getLineY(d.inferences);
                  const isHovered = hoveredMonthIndex === idx;

                  return (
                    <g
                      key={idx}
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredMonthIndex(idx)}
                      onMouseLeave={() => setHoveredMonthIndex(null)}
                    >
                      <circle
                        cx={x}
                        cy={y}
                        r={isHovered ? '6' : '3.5'}
                        fill="#FFFFFF"
                        stroke="#182C29"
                        strokeWidth="2"
                        className="transition-all"
                      />
                    </g>
                  );
                })}
              </svg>

              {/* Dynamic Month Tooltip Card */}
              {activeHoverData && (
                <div className="mt-3 p-3 bg-[#FAF9F5] rounded-xl border border-[#DFDDD4] flex flex-wrap items-center justify-between text-xs text-[#283C39] gap-3">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#142624] font-serif">{activeHoverData.month}:</span>
                    <span className="font-mono text-[#182C29] font-bold tabular-nums">
                      {activeHoverData.inferences} Inferences Run
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-[11px] font-mono tabular-nums">
                    <span className="text-[#DC2626] font-semibold">
                      {activeHoverData.highRiskFlagged} High-Risk Flags
                    </span>
                    <span aria-hidden="true" className="text-[#C1CECB]">·</span>
                    <span className="text-[#2D6A5F] font-semibold">
                      {activeHoverData.palliativeInitiated} Palliative Initiations
                    </span>
                    <span aria-hidden="true" className="text-[#C1CECB]">·</span>
                    <span className="text-[#566864]">
                      Lead Time: {activeHoverData.leadTimeMonths} mo
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-[#EAE8E0] flex items-center justify-between text-[11px] text-[#697A77]">
              <span>Clinical registry updated continuously across all participating hospital oncology and neurology floors</span>
              <span className="font-mono">Inference Growth: +141% over 12m</span>
            </div>
          </div>

          {/* Trend Chart 2: Comparative Cohort Survival Trajectories (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-[#DFDDD4] p-6 shadow-sm">
            <div className="pb-4 border-b border-[#EAE8E0]">
              <h3 className="text-base font-serif font-bold text-[#142624]">
                Multi-Cohort Survival Trajectories
              </h3>
              <p className="text-xs text-[#627571] mt-0.5">
                Comparative Kaplan-Meier curves across primary terminal disease archetypes
              </p>
            </div>

            {/* Interactive Cohort Toggle Buttons */}
            <div className="mt-4 flex flex-wrap gap-1.5 text-xs">
              {cohortSurvivalCurves.map(c => (
                <button
                  key={c.id}
                  onClick={() => setHoveredCohortTrend(hoveredCohortTrend === c.id ? null : c.id)}
                  className={`px-2.5 py-1 rounded-md font-mono text-[11px] transition-all cursor-pointer border ${
                    hoveredCohortTrend === c.id || hoveredCohortTrend === null
                      ? 'bg-white border-[#DCDAD0] shadow-2xs font-semibold'
                      : 'bg-[#F6F5F0] text-[#869794] border-transparent opacity-60'
                  }`}
                  style={{
                    color: hoveredCohortTrend === c.id || hoveredCohortTrend === null ? c.color : undefined
                  }}
                >
                  {c.name.split(' ')[0]} ({c.median}m)
                </button>
              ))}
            </div>

            {/* Mini Multi-line SVG Chart */}
            <div className="mt-4 relative">
              <svg
                viewBox="0 0 460 220"
                className="w-full h-auto overflow-visible select-none"
              >
                {/* Horizontal reference lines */}
                {[100, 75, 50, 25, 0].map(val => {
                  const y = 15 + (1 - val / 100) * 170;
                  return (
                    <g key={val}>
                      <line x1={36} y1={y} x2={440} y2={y} stroke="#F0EDE6" strokeWidth="1" />
                      <text x={30} y={y + 3} textAnchor="end" className="text-[9px] fill-[#869693] font-mono">
                        {val}%
                      </text>
                    </g>
                  );
                })}

                {/* 50% median cross line */}
                <line
                  x1={36}
                  y1={15 + 0.5 * 170}
                  x2={440}
                  y2={15 + 0.5 * 170}
                  stroke="#D97706"
                  strokeWidth="1"
                  strokeDasharray="2 2"
                />

                {/* Month labels */}
                {[0, 12, 24, 36].map(m => {
                  const x = 36 + (m / 36) * (440 - 36);
                  return (
                    <text key={m} x={x} y={202} textAnchor="middle" className="text-[9px] fill-[#869693] font-mono">
                      {m}m
                    </text>
                  );
                })}

                {/* Render Each Cohort Trend Line */}
                {cohortSurvivalCurves.map(c => {
                  const isHighlighted = hoveredCohortTrend === null || hoveredCohortTrend === c.id;
                  const opacity = isHighlighted ? 1 : 0.2;
                  const strokeW = hoveredCohortTrend === c.id ? 3 : 2;

                  const pointsPath = c.points.reduce((acc, pt, i) => {
                    const x = 36 + (pt.m / 36) * (440 - 36);
                    const y = 15 + (1 - pt.s / 100) * 170;
                    return i === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
                  }, '');

                  return (
                    <g key={c.id}>
                      <path
                        d={pointsPath}
                        fill="none"
                        stroke={c.color}
                        strokeWidth={strokeW}
                        strokeOpacity={opacity}
                        strokeLinejoin="round"
                        className="transition-all duration-300"
                      />
                    </g>
                  );
                })}
              </svg>
            </div>

            <div className="mt-4 p-3 bg-[#FAF9F5] rounded-xl border border-[#DFDDD4] text-xs text-[#485B57] space-y-1">
              <span className="font-semibold text-[#182C29] block">Clinical Takeaway:</span>
              <p className="text-[11px] leading-relaxed">
                Pancreatic and Cirrhosis cohorts demonstrate early steep mortality slopes within 9 months, prioritizing immediate biliary/symptom palliation. In contrast, ALS patients follow a 18-month trajectory where early respiratory monitoring preserves vital months of communication.
              </p>
            </div>

          </div>

        </div>

        {/* ================= RECENT PROGNOSTIC ADMISSIONS ROSTER TABLE ================= */}
        <div className="bg-white rounded-2xl border border-[#DFDDD4] p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#EAE8E0] gap-4">
            <div>
              <h3 className="text-base font-serif font-bold text-[#142624]">
                Active Cohort Intakes & Longitudinal Records
              </h3>
              <p className="text-xs text-[#627571] mt-0.5">
                Detailed clinical profiles loaded in the Prognosis Flow institutional registry
              </p>
            </div>

            <span className="text-xs font-mono text-[#576B67]">
              Showing {MOCK_PATIENT_COHORTS.length} Fully Calibrated Cases
            </span>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#EAE8E0] text-[11px] uppercase tracking-wider text-[#687B77] bg-[#FAFAF8]">
                  <th className="py-3 px-4 font-semibold">Patient Name & MRN</th>
                  <th className="py-3 px-4 font-semibold">Demographics</th>
                  <th className="py-3 px-4 font-semibold">Primary Predicted Condition</th>
                  <th className="py-3 px-4 font-semibold">Diagnostic Confidence</th>
                  <th className="py-3 px-4 font-semibold">Median Survival</th>
                  <th className="py-3 px-4 font-semibold">Care Setting</th>
                  <th className="py-3 px-4 font-semibold text-right">Workbench Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFECE5]">
                {MOCK_PATIENT_COHORTS.map(pt => {
                  let conditionTitle = 'ALS (King\'s Stage 3B)';
                  let medianStr = '18 mo';
                  let probStr = '91.4%';

                  if (pt.id === 'pt-pancreatic-02') {
                    conditionTitle = 'Pancreatic Adeno (Stage IV)';
                    medianStr = '7.5 mo';
                    probStr = '94.2%';
                  } else if (pt.id === 'pt-heartfailure-03') {
                    conditionTitle = 'End-Stage Heart Failure (NYHA IV)';
                    medianStr = '11.0 mo';
                    probStr = '88.6%';
                  } else if (pt.id === 'pt-cirrhosis-04') {
                    conditionTitle = 'Decompensated Cirrhosis (MELD 31)';
                    medianStr = '8.0 mo';
                    probStr = '89.5%';
                  } else if (pt.id === 'pt-ipf-05') {
                    conditionTitle = 'Pulmonary Fibrosis (GAP III)';
                    medianStr = '14.0 mo';
                    probStr = '92.1%';
                  }

                  return (
                    <tr
                      key={pt.id}
                      className="hover:bg-[#FAF9F5] transition-colors group"
                    >
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-[#182C29] font-serif block text-sm">
                          {pt.fullName}
                        </span>
                        <span className="text-[10px] text-[#788A86] font-mono">
                          {pt.mrn}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-[#3C4E4B]">
                        <span>{pt.age}y {pt.gender}</span>
                        <span className="text-[10px] text-[#788A86] block font-mono">
                          ECOG {pt.ecogPerformanceStatus}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-medium text-[#182C29] block">
                          {conditionTitle}
                        </span>
                        <span className="text-[10px] text-[#2D6A5F] font-mono">
                          Palliative Pathway Assigned
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-mono font-bold text-[#2D6A5F] tabular-nums">
                        {probStr}
                      </td>

                      <td className="py-3.5 px-4 font-mono font-bold text-[#182C29] tabular-nums">
                        {medianStr}
                      </td>

                      <td className="py-3.5 px-4 text-[#4C5E5A]">
                        {pt.admissionStatus}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => onLoadPatientIntoWorkbench(pt.id)}
                          className="px-3 py-1.5 text-xs font-semibold text-[#182C29] bg-[#F1F0E9] hover:bg-[#182C29] hover:text-white rounded-lg border border-[#D8D6CC] transition-colors inline-flex items-center gap-1 cursor-pointer"
                        >
                          <span>Analyze</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

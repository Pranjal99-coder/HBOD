import React from 'react';
import { ShapFeatureImpact } from '../types/clinical';
import { HelpCircle, AlertCircle, CheckCircle2 } from 'lucide-react';

interface ShapAttributionChartProps {
  features: ShapFeatureImpact[];
  primaryDiagnosis: string;
}

export const ShapAttributionChart: React.FC<ShapAttributionChartProps> = ({
  features,
  primaryDiagnosis
}) => {
  return (
    <div className="w-full bg-[#FCFCFA] rounded-xl border border-[#E7E5E0] p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#EBE9E3] gap-2">
        <div>
          <h4 className="text-sm font-semibold text-[#182625] flex items-center gap-1.5">
            Model Explainability & Feature Contribution (SHAP)
          </h4>
          <p className="text-xs text-[#707D7A] mt-0.5">
            Quantified marginal impact of individual patient factors toward {primaryDiagnosis}
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono shrink-0">
          <div className="flex items-center gap-1.5 text-[#B91C1C]">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#DC2626]"></span>
            <span>Increases Risk</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#2D6A5F]">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#2D6A5F]"></span>
            <span>Decreases / Counter-indicates</span>
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {features.map((item, idx) => {
          const isRisk = item.direction === 'increases_risk';
          const absImpact = Math.abs(item.impactScore);
          const barWidth = Math.min(100, Math.round(absImpact * 220));

          return (
            <div key={idx} className="group py-1.5 px-2 hover:bg-[#F5F4EF] rounded-lg transition-colors">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-[#1E2E2C]">{item.featureName}</span>
                  <span className="text-[11px] text-[#707D7A] font-mono">[{item.category}]</span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`font-mono text-xs font-bold tabular-nums ${
                      isRisk ? 'text-[#B91C1C]' : 'text-[#2D6A5F]'
                    }`}
                  >
                    {isRisk ? '+' : ''}{(item.impactScore * 100).toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* Bi-directional horizontal bar container */}
              <div className="relative w-full h-2.5 bg-[#EFECE6] rounded-full overflow-hidden flex items-center">
                {/* Center marker line */}
                <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-[#CBD5E1] z-10" />

                {isRisk ? (
                  // Extends from center to right
                  <div
                    className="absolute left-1/2 top-0 bottom-0 bg-gradient-to-r from-[#F87171] to-[#DC2626] rounded-r-full transition-all duration-500"
                    style={{ width: `${barWidth / 2}%` }}
                  />
                ) : (
                  // Extends from center to left
                  <div
                    className="absolute top-0 bottom-0 bg-gradient-to-l from-[#34D399] to-[#2D6A5F] rounded-l-full transition-all duration-500"
                    style={{ right: '50%', width: `${barWidth / 2}%` }}
                  />
                )}
              </div>

              <div className="text-[11px] text-[#697875] mt-1 italic flex items-center gap-1">
                <span>{item.clinicalContext}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-3 pt-3 border-t border-[#EAE8E1] text-[11px] text-[#788784] flex items-center justify-between">
        <span>Trained on Shapley additive explanation algorithm</span>
        <span className="font-mono tabular-nums">Additive Baseline: E[f(x)] = 0.14</span>
      </div>
    </div>
  );
};

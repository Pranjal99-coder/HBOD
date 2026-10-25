import React from 'react';
import { ShieldCheck, FileCheck, CheckCircle2, Lock, Scale, AlertOctagon } from 'lucide-react';

export const EthicsValidationSection: React.FC = () => {
  return (
    <section id="validation" className="py-20 lg:py-28 bg-[#FAFAF8] border-b border-[#E8E6E0]">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        
        {/* Section Header */}
        <div className="max-w-3xl">
          <div className="text-xs font-semibold tracking-wider uppercase text-[#2D6A5F] mb-2 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2D6A5F]" />
            <span>Clinical Governance & Safety Standards</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#142624] tracking-tight">
            Designed strictly as clinical decision support. Physician in the loop.
          </h2>
          <p className="mt-4 text-[#4D5E5A] text-base leading-relaxed">
            PrognosAI adheres to rigorous AI ethics, transparent Bayesian calibration, and hospital data protection protocols. The platform never operates autonomously—every forecast empowers the attending physician's expert judgment.
          </p>
        </div>

        {/* 3 Pillars of Clinical Trust */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="p-6 bg-white rounded-2xl border border-[#DFDDD4] shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#EAF2EE] flex items-center justify-center text-[#2D6A5F]">
              <Scale className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-serif font-bold text-[#142624]">
              Demographic & Age Calibration
            </h3>
            <p className="text-xs text-[#526461] leading-relaxed">
              Trained across diverse geriatric populations (ages 50–92), explicitly audited against ageism biases and frailty score confounders to ensure equitable risk stratification.
            </p>
            <div className="pt-3 border-t border-[#EFECE5] text-[11px] font-mono text-[#2D6A5F]">
              Fairness Metric: Equalized Odds &gt; 0.92
            </div>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-[#DFDDD4] shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#EAF2EE] flex items-center justify-center text-[#2D6A5F]">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-serif font-bold text-[#142624]">
              HIPAA & SOC-2 Architecture
            </h3>
            <p className="text-xs text-[#526461] leading-relaxed">
              Zero persistent retention of identifiable patient health information (PHI). Client-side tokenization, TLS 1.3 encryption, and seamless BAA integration for health systems.
            </p>
            <div className="pt-3 border-t border-[#EFECE5] text-[11px] font-mono text-[#2D6A5F]">
              Zero PHI Ingestion Policy
            </div>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-[#DFDDD4] shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#EAF2EE] flex items-center justify-center text-[#2D6A5F]">
              <FileCheck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-serif font-bold text-[#142624]">
              Prospective Clinical Audits
            </h3>
            <p className="text-xs text-[#526461] leading-relaxed">
              Continuously calibrated against MIMIC-IV ICU outcomes, UK Biobank longitudinal data, and multicenter palliative registry benchmarks with Brier score monitoring.
            </p>
            <div className="pt-3 border-t border-[#EFECE5] text-[11px] font-mono text-[#2D6A5F]">
              Brier Calibration Score 0.076
            </div>
          </div>

        </div>

        {/* Clinical Disclaimer Banner */}
        <div className="mt-10 p-5 bg-[#F6F5F0] rounded-xl border border-[#DEDBD2] flex items-start gap-3.5 text-xs text-[#485B57]">
          <AlertOctagon className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-semibold text-[#182C29]">Official Clinical Decision Support Disclaimer:</span>
            <p className="leading-relaxed">
              PrognosAI is an investigational clinical decision support system intended solely for licensed medical professionals. Predictions, survival functions, and differential rankings do not replace comprehensive histological biopsy, expert radiologic interpretation, or individualized multidisciplinary tumor/palliative board consultation.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};

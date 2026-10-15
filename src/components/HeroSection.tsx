import React from 'react';
import { ArrowRight, Activity, ShieldCheck, HeartPulse, Sparkles, Database, Stethoscope, ChevronRight } from 'lucide-react';
import { PatientProfile } from '../types/clinical';

interface HeroSectionProps {
  onLaunchWorkbench: () => void;
  onSelectSamplePatient: (patientId: string) => void;
  featuredPatient: PatientProfile;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onLaunchWorkbench,
  onSelectSamplePatient,
  featuredPatient
}) => {
  return (
    <section className="relative overflow-hidden pt-12 pb-18 lg:pt-16 lg:pb-24 border-b border-[#E8E6E0] bg-[#FAFAF8]">
      {/* Subtle warm decorative ambient shapes (gentle clinical lighting) */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#E9EFEA] rounded-full blur-3xl opacity-50 -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-[420px] h-[420px] bg-[#F2EDE2] rounded-full blur-3xl opacity-40 -z-10 pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Hero Narrative */}
          <div className="lg:col-span-7 flex flex-col items-start">
            
            {/* Quiet unboxed kicker without pill box */}
            <div className="text-xs font-semibold tracking-wider uppercase text-[#2D6A5F] mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2D6A5F]" />
              <span>Calibrated Clinical Decision Support</span>
              <span aria-hidden="true" className="text-[#A5B2AF]">·</span>
              <span className="text-[#556764] normal-case tracking-normal">Terminal & Complex Illness AI</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[56px] leading-[1.12] font-serif font-bold text-[#112321] tracking-tight max-w-2xl text-balance">
              Predict terminal illness trajectories with clinical precision.
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-[#4A5B57] leading-relaxed max-w-2xl font-normal">
              Prognosis Flow synthesizes patient-reported symptoms, longitudinal history, and biomarker panels using multi-modal machine learning models. Built to assist oncologists, neurologists, and palliative care specialists in early diagnosis, staging, and compassionate care planning.
            </p>

            {/* Primary Action Row */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                onClick={onLaunchWorkbench}
                className="px-6 py-3.5 text-sm font-semibold text-white bg-[#1A3330] hover:bg-[#254642] active:scale-[0.98] rounded-xl transition-all shadow-md flex items-center gap-2.5 cursor-pointer"
              >
                <span>Launch Clinical Workbench</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onSelectSamplePatient('pt-als-01')}
                className="px-5 py-3.5 text-sm font-semibold text-[#1A3330] bg-[#FFFFFF] hover:bg-[#F3F2EC] border border-[#DCDAD0] rounded-xl transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Review ALS Diagnostic Case</span>
                <ChevronRight className="w-4 h-4 text-[#7C8D89]" />
              </button>
            </div>

            {/* Quick unboxed trust markers */}
            <div className="mt-10 pt-6 border-t border-[#E8E6DF] w-full flex flex-wrap items-center gap-y-3 gap-x-6 text-xs text-[#5D6F6B]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#2D6A5F]" />
                <span className="font-medium text-[#223533]">AUROC 0.942 Calibrated</span>
              </div>
              <span aria-hidden="true" className="text-[#C6D0CD]">·</span>
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-[#2D6A5F]" />
                <span className="font-medium text-[#223533]">184,000+ Patient Trajectories</span>
              </div>
              <span aria-hidden="true" className="text-[#C6D0CD]">·</span>
              <div className="flex items-center gap-2">
                <HeartPulse className="w-4 h-4 text-[#2D6A5F]" />
                <span className="font-medium text-[#223533]">NCCN & WHO Palliative Aligned</span>
              </div>
            </div>

          </div>

          {/* Right Column: High-Fidelity Clinical Consultation & Live Diagnostic Preview Card */}
          <div className="lg:col-span-5 w-full">
            <div className="bg-white rounded-2xl border border-[#DFDDD4] shadow-xl overflow-hidden transition-all">
              
              {/* Header ribbon of the card */}
              <div className="bg-[#172D29] text-white px-5 py-3.5 flex items-center justify-between border-b border-[#25423D]">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-md bg-[#2D6A5F] flex items-center justify-center">
                    <Activity className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold block tracking-wide">Live Clinical Inference Engine</span>
                    <span className="text-[11px] text-[#A6C4BE] font-mono">Case MRN-8942-01</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono tabular-nums text-[#6EE7B7] font-semibold">91.4% Match</span>
                  <span className="text-[10px] text-[#A6C4BE] block">Confidence Index</span>
                </div>
              </div>

              {/* Patient preview body */}
              <div className="p-6 bg-[#FCFCFB] space-y-5">
                
                {/* Visual Medical Scene Illustration Container (Zero Broken Image compliant fallback) */}
                <div className="relative w-full h-44 rounded-xl overflow-hidden bg-gradient-to-br from-[#1A3330] to-[#0E1E1C] p-4 text-white flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Stethoscope className="w-4 h-4 text-[#6EE7B7]" />
                      <span className="text-xs font-medium text-[#E2ECE9]">Geriatric & Palliative Neurology</span>
                    </div>
                    <span className="text-[11px] font-mono text-[#A8C7C0] bg-white/10 px-2 py-0.5 rounded">
                      King's Stage 3B
                    </span>
                  </div>

                  {/* Compassionate bedside illustration graphics */}
                  <div className="my-auto flex items-center justify-between gap-4 py-2">
                    <div className="space-y-1">
                      <div className="text-xs text-[#9CC0B8]">Patient Consultation</div>
                      <div className="text-base font-serif font-semibold text-white">Evelyn Thorne, 69 yrs</div>
                      <div className="text-[11px] text-[#D2E2DE]">Multiregional Motor Denervation Pattern</div>
                    </div>
                    {/* Simulated ECG / Biomarker waveform */}
                    <div className="w-24 h-12 flex items-center justify-center">
                      <svg viewBox="0 0 100 40" className="w-full h-full stroke-[#6EE7B7] fill-none stroke-[1.8]">
                        <path d="M 0 20 L 20 20 L 25 10 L 30 30 L 35 15 L 40 22 L 45 20 L 70 20 L 75 5 L 80 32 L 85 18 L 90 20 L 100 20" />
                      </svg>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-[#B8D5CF] border-t border-white/10 pt-2">
                    <span>Dominant Marker: Fasciculations + Progressive Weakness</span>
                    <span className="font-mono tabular-nums">Median: 18 mo</span>
                  </div>
                </div>

                {/* Patient Key Telemetry Strip */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 bg-[#F6F5F0] rounded-xl border border-[#E7E5DC]">
                    <span className="text-[11px] text-[#697A76] block">Biomarker eGFR</span>
                    <span className="text-base font-bold text-[#182B28] font-mono tabular-nums">78</span>
                    <span className="text-[10px] text-[#7A8E89] block">mL/min/1.73m²</span>
                  </div>
                  <div className="p-3 bg-[#F6F5F0] rounded-xl border border-[#E7E5DC]">
                    <span className="text-[11px] text-[#697A76] block">Pulmonary FVC</span>
                    <span className="text-base font-bold text-[#D97706] font-mono tabular-nums">64%</span>
                    <span className="text-[10px] text-[#7A8E89] block">Predicted</span>
                  </div>
                  <div className="p-3 bg-[#F6F5F0] rounded-xl border border-[#E7E5DC]">
                    <span className="text-[11px] text-[#697A76] block">Weight Delta</span>
                    <span className="text-base font-bold text-[#B91C1C] font-mono tabular-nums">-7.2 kg</span>
                    <span className="text-[10px] text-[#7A8E89] block">In 5 months</span>
                  </div>
                </div>

                {/* Predicted Primary Terminal Condition */}
                <div className="p-4 bg-[#F8FAF9] rounded-xl border border-[#D4E2DC]">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#1F413B]">ML Primary Predictive Output:</span>
                    <span className="text-xs font-bold text-[#2D6A5F] font-mono">91.4% Probability</span>
                  </div>
                  <p className="text-sm font-semibold text-[#122824] mt-1 font-serif">
                    Amyotrophic Lateral Sclerosis (ALS)
                  </p>
                  <p className="text-xs text-[#526460] mt-1">
                    Progressive lower and upper motor neuron degeneration with emerging bulbar involvement. Riluzole and diaphragmatic monitoring advised.
                  </p>
                </div>

                {/* Quick interactive trigger */}
                <button
                  onClick={onLaunchWorkbench}
                  className="w-full py-2.5 px-4 bg-[#F1F0E9] hover:bg-[#EAE8DE] text-[#1E3532] text-xs font-semibold rounded-xl border border-[#D8D6CB] transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Open Full Assessment & Kaplan-Meier Curve</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#2D6A5F]" />
                </button>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

import React from 'react';
import { Stethoscope } from 'lucide-react';

interface FooterProps {
  onSelectTab: (tab: 'landing' | 'workbench' | 'analytics') => void;
  onSelectSamplePatient: (patientId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectTab,
  onSelectSamplePatient
}) => {
  return (
    <footer className="bg-[#142624] text-[#BACEC9] py-16 border-t border-[#233F3B]">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#233F3B]">
          
          {/* Col 1 & 2: Brand Information */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5 text-white font-serif font-bold text-xl">
              <span className="w-8 h-8 rounded-lg bg-[#2D6A5F] flex items-center justify-center text-white shrink-0">
                <Stethoscope className="w-4 h-4" />
              </span>
              <span>Prognosis Flow</span>
            </div>
            <p className="text-xs text-[#95ACA6] max-w-sm leading-relaxed">
              Clinical decision support and calibrated machine learning models predicting terminal illness trajectories, disease staging, and supportive palliative pathways for healthcare professionals.
            </p>
            <div className="text-[11px] font-mono text-[#7B958E]">
              ISO 13485 & HIPAA Security Compliant Architecture
            </div>
          </div>

          {/* Col 3: Clinical Models */}
          <div className="space-y-3 text-xs">
            <h4 className="font-semibold text-white uppercase tracking-wider text-[11px]">
              Predictive Models
            </h4>
            <ul className="space-y-2 text-[#95ACA6]">
              <li>
                <button
                  onClick={() => onSelectSamplePatient('pt-als-01')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Neuro-ALS (King's Staging)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectSamplePatient('pt-pancreatic-02')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Onco-Trajectory GI (Stage IV)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectSamplePatient('pt-heartfailure-03')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Cardio-Support (NYHA IV)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectSamplePatient('pt-cirrhosis-04')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Hepato-Renal (MELD-Na)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectSamplePatient('pt-ipf-05')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Pulmo-Fibrosis (GAP-AI)
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Clinical Resources */}
          <div className="space-y-3 text-xs">
            <h4 className="font-semibold text-white uppercase tracking-wider text-[11px]">
              Clinical Resources
            </h4>
            <ul className="space-y-2 text-[#95ACA6]">
              <li>
                <button
                  onClick={() => {
                    onSelectTab('workbench');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Clinical Workbench
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onSelectTab('analytics');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Cohort Analytics & KPIs
                </button>
              </li>
              <li>
                <a href="#models" className="hover:text-white transition-colors">
                  Model Specifications & ROC
                </a>
              </li>
              <li>
                <a href="#cohorts" className="hover:text-white transition-colors">
                  Longitudinal Patient Cohorts
                </a>
              </li>
              <li>
                <a href="#care-philosophy" className="hover:text-white transition-colors">
                  Palliative Care Guidelines
                </a>
              </li>
              <li>
                <a href="#validation" className="hover:text-white transition-colors">
                  Safety & Ethics Standards
                </a>
              </li>
            </ul>
          </div>

          {/* Col 5: Institution & Governance */}
          <div className="space-y-3 text-xs">
            <h4 className="font-semibold text-white uppercase tracking-wider text-[11px]">
              Institutional Governance
            </h4>
            <ul className="space-y-2 text-[#95ACA6]">
              <li>Institutional Review Board (IRB)</li>
              <li>MIMIC-IV Benchmark Calibration</li>
              <li>HIPAA Business Associate Agreement</li>
              <li>Explainable AI / SHAP Attribution</li>
              <li>Physician-in-the-Loop Protocol</li>
            </ul>
          </div>

        </div>

        {/* Quiet copyright & metadata bottom row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#7B958E]">
          <div>
            &copy; {new Date().getFullYear()} Prognosis Flow Inc. All rights reserved. Built for licensed healthcare professionals.
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Clinical Decision Support System</span>
            <span aria-hidden="true">·</span>
            <span>Not for direct consumer diagnosis</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

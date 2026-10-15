import React from 'react';
import { ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { MOCK_PATIENT_COHORTS } from '../data/mockPatients';

interface ClinicalCaseStudiesSectionProps {
  onSelectPatient: (patientId: string) => void;
}

export const ClinicalCaseStudiesSection: React.FC<ClinicalCaseStudiesSectionProps> = ({
  onSelectPatient
}) => {
  return (
    <section id="cohorts" className="py-20 lg:py-28 bg-[#FAFAF8] border-b border-[#E8E6E0]">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        
        {/* Section Header */}
        <div className="max-w-3xl">
          <div className="text-xs font-semibold tracking-wider uppercase text-[#2D6A5F] mb-2 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2D6A5F]" />
            <span>Validated Clinical Case Cohorts</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#142624] tracking-tight">
            Explore how early ML prognosis shapes real patient care trajectories.
          </h2>
          <p className="mt-4 text-[#4D5E5A] text-base leading-relaxed">
            Select any patient case study to load their full laboratory panels, longitudinal history, and interactive Kaplan-Meier survival curves directly into the Clinical Workbench.
          </p>
        </div>

        {/* Case Cards Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_PATIENT_COHORTS.map((pt) => {
            const isAls = pt.id === 'pt-als-01';
            const isPancreatic = pt.id === 'pt-pancreatic-02';
            const isHeart = pt.id === 'pt-heartfailure-03';
            const isCirrhosis = pt.id === 'pt-cirrhosis-04';
            const isIpf = pt.id === 'pt-ipf-05';

            let conditionTag = 'Amyotrophic Lateral Sclerosis (ALS)';
            let medianMo = '18 mo';
            let keyFinding = 'Widespread fasciculations & bulbar dysarthria';
            let intervention = 'Early NIV initiation & PEG timing preservation';

            if (isPancreatic) {
              conditionTag = 'Pancreatic Ductal Adenocarcinoma';
              medianMo = '7.5 mo';
              keyFinding = 'CA 19-9 >900 U/mL & painless obstructive icterus';
              intervention = 'Urgent ERCP stenting & celiac plexus neurolysis';
            } else if (isHeart) {
              conditionTag = 'End-Stage Heart Failure (NYHA IV)';
              medianMo = '11 mo';
              keyFinding = 'NT-proBNP >8,000 pg/mL with 3-pillow orthopnea';
              intervention = 'Palliative inotropes & cardiorenal volume control';
            } else if (isCirrhosis) {
              conditionTag = 'Decompensated Hepatic Cirrhosis';
              medianMo = '8 mo';
              keyFinding = 'Refractory ascites, MELD-Na 31, asterixis';
              intervention = 'Albumin-supported paracentesis & encephalopathy care';
            } else if (isIpf) {
              conditionTag = 'Advanced Pulmonary Fibrosis (IPF)';
              medianMo = '14 mo';
              keyFinding = 'Velcro crackles, severe clubbing, FVC 44%';
              intervention = 'Home oxygen titration & AE-IPF crisis planning';
            }

            return (
              <div
                key={pt.id}
                className="bg-white rounded-2xl border border-[#DFDDD4] p-6 shadow-xs hover:shadow-md hover:border-[#2D6A5F]/50 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs pb-3 border-b border-[#EAE8E0]">
                    <span className="font-mono text-[#6C7E7A]">{pt.mrn}</span>
                    <span className="font-semibold text-[#2D6A5F]">{pt.admissionStatus}</span>
                  </div>

                  <div className="mt-4">
                    <span className="text-xs font-mono text-[#D97706] font-semibold uppercase">
                      {conditionTag}
                    </span>
                    <h3 className="text-xl font-serif font-bold text-[#142624] mt-0.5">
                      {pt.fullName}
                    </h3>
                    <p className="text-xs text-[#5D6F6B] mt-0.5">
                      {pt.age} years old · {pt.gender} · ECOG {pt.ecogPerformanceStatus}
                    </p>
                  </div>

                  <div className="mt-4 space-y-2 text-xs">
                    <div className="p-2.5 bg-[#FAF9F5] rounded-xl border border-[#E7E5DD]">
                      <span className="text-[10px] text-[#71827E] uppercase block font-semibold">Key Clinical Biomarker Signature</span>
                      <span className="text-[#203431] font-medium block mt-0.5">{keyFinding}</span>
                    </div>

                    <div className="p-2.5 bg-[#F6F8F7] rounded-xl border border-[#D5E4DF]">
                      <span className="text-[10px] text-[#2D6A5F] uppercase block font-semibold">Palliative & Clinical Pathway</span>
                      <span className="text-[#1D3530] font-medium block mt-0.5">{intervention}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[#EAE8E0] flex items-center justify-between">
                  <div className="text-xs font-mono">
                    <span className="text-[#758682] block text-[10px]">Forecast Median</span>
                    <span className="font-bold text-[#142624] text-sm tabular-nums">{medianMo}</span>
                  </div>

                  <button
                    onClick={() => onSelectPatient(pt.id)}
                    className="px-4 py-2 text-xs font-semibold text-[#182C29] bg-[#F1F0E9] hover:bg-[#182C29] hover:text-white rounded-xl border border-[#DCDAD0] transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Load Case Chart</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

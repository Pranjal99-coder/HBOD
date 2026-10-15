import React, { useState } from 'react';
import { Brain, Heart, Stethoscope, Activity, ShieldCheck, Check, ArrowRight } from 'lucide-react';

interface ModelInfo {
  id: string;
  name: string;
  category: string;
  targetConditions: string[];
  auroc: number;
  brierScore: number;
  sampleSize: string;
  keyBiomarkers: string[];
  description: string;
}

const MODELS: ModelInfo[] = [
  {
    id: 'neuro-als',
    name: 'Neuro-Prognosis v4.2',
    category: 'Motor Neuron & Neurodegenerative',
    targetConditions: ['Amyotrophic Lateral Sclerosis', 'Frontotemporal Dementia Variant', 'Progressive Bulbar Palsy'],
    auroc: 0.948,
    brierScore: 0.068,
    sampleSize: '24,600 verified clinical trajectories',
    keyBiomarkers: ['FVC % Predicted', 'Serum Neurofilament Light (NfL)', 'El Escorial / Gold Coast Criteria', 'Fasciculation Distribution'],
    description: 'Predicts rate of functional motor decline, non-invasive ventilation (NIV) initiation milestones, and diaphragmatic survival windows in adult motor neuron disease.'
  },
  {
    id: 'onco-pancreatic',
    name: 'Onco-Trajectory GI v5.1',
    category: 'Advanced & Metastatic Oncology',
    targetConditions: ['Pancreatic Ductal Adenocarcinoma', 'Cholangiocarcinoma', 'Metastatic Colorectal'],
    auroc: 0.952,
    brierScore: 0.054,
    sampleSize: '48,900 patient trajectories (SEER + MIMIC-IV)',
    keyBiomarkers: ['Serum CA 19-9', 'Total Bilirubin', 'Albumin / Cachexia Index', 'Perineural Encasement'],
    description: 'Calibrated survival forecasting for unresectable and metastatic gastrointestinal malignancies, optimizing timing for biliary stenting and palliative celiac neurolysis.'
  },
  {
    id: 'cardio-nyha',
    name: 'Cardio-Support NYHA IV',
    category: 'Refractory Cardiovascular Failure',
    targetConditions: ['Stage D Dilated Cardiomyopathy', 'Ischemic End-Stage Heart Failure', 'Cardiorenal Syndrome'],
    auroc: 0.936,
    brierScore: 0.082,
    sampleSize: '52,100 cardiology cohort records',
    keyBiomarkers: ['NT-proBNP / BNP', 'eGFR & Serum Creatinine', 'LVEF & RVSP', 'Diuretic Resistance Index'],
    description: 'Differentiates reversible cardiorenal congestion from terminal hemodynamic decline, supporting shared decision-making regarding inotropic palliation and ICD deactivation.'
  },
  {
    id: 'hepato-meld',
    name: 'Hepato-Renal Decompensation v3.8',
    category: 'End-Stage Liver Disease',
    targetConditions: ['Decompensated Cirrhosis', 'Hepatorenal Syndrome Type 1/2', 'MELD-Na > 30'],
    auroc: 0.941,
    brierScore: 0.071,
    sampleSize: '31,400 transplant and palliative registries',
    keyBiomarkers: ['MELD-Na Score', 'Child-Pugh Classification', 'Platelet / Spleen Ratio', 'Hepatic Encephalopathy Grade'],
    description: 'Quantifies 90-day and 1-year mortality probabilities for refractory ascites and portosystemic encephalopathy when curative transplantation is contraindicated.'
  },
  {
    id: 'pulmo-ipf',
    name: 'Pulmo-Fibrosis GAP-AI',
    category: 'Interstitial & Restrictive Lung Disease',
    targetConditions: ['Idiopathic Pulmonary Fibrosis', 'Fibrotic Hypersensitivity Pneumonitis', 'End-Stage COPD'],
    auroc: 0.939,
    brierScore: 0.079,
    sampleSize: '27,200 pulmonary trajectories',
    keyBiomarkers: ['GAP Index (Gender, Age, Physiology)', 'FVC & DLCO decline rate', 'HRCT Honeycombing Volume', 'Ambulatory Desaturation'],
    description: 'Anticipates rapid decline phases and acute exacerbations (AE-IPF), providing precise survival estimates and proactive home oxygen and morphine titration pathways.'
  }
];

export const ModelDirectorySection: React.FC<{ onLaunchWorkbench: () => void }> = ({ onLaunchWorkbench }) => {
  const [selectedModel, setSelectedModel] = useState<ModelInfo>(MODELS[0]);

  return (
    <section id="models" className="py-20 lg:py-28 bg-[#FAFAF8] border-b border-[#E8E6E0]">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        
        {/* Section Header */}
        <div className="max-w-2xl">
          <div className="text-xs font-semibold tracking-wider uppercase text-[#2D6A5F] mb-2 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2D6A5F]" />
            <span>Multi-Modal Predictive Architecture</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#112321] tracking-tight">
            Specialized terminal illness ML models calibrated for clinical practice.
          </h2>
          <p className="mt-4 text-[#4D5E5A] text-base leading-relaxed">
            Each model is trained on multi-center prospective and retrospective cohorts, strictly calibrated with Brier score validation and explainable Bayesian feature weighting.
          </p>
        </div>

        {/* 2-Column Layout: Left Model Navigation | Right Model Detailed Card */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Model Selector List */}
          <div className="lg:col-span-5 space-y-3">
            {MODELS.map((m) => {
              const isSelected = selectedModel.id === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setSelectedModel(m)}
                  className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                    isSelected
                      ? 'bg-white border-[#2D6A5F] shadow-sm ring-1 ring-[#2D6A5F]'
                      : 'bg-[#FCFCFA] border-[#E2E0D6] hover:bg-white hover:border-[#D0CDC2]'
                  }`}
                >
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-[#697B77] block">
                      {m.category}
                    </span>
                    <span className="text-sm font-semibold text-[#182C29] block mt-0.5 font-serif">
                      {m.name}
                    </span>
                    <span className="text-xs text-[#526561] line-clamp-1 mt-0.5">
                      {m.targetConditions.join(' · ')}
                    </span>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-mono font-bold text-[#2D6A5F] tabular-nums block">
                      AUC {m.auroc}
                    </span>
                    <span className="text-[10px] text-[#788A86] block">Calibrated</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Selected Model Details Card */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-[#DFDDD4] p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#EAE8E0]">
              <div>
                <span className="text-xs font-mono text-[#2D6A5F] font-semibold uppercase tracking-wider">
                  {selectedModel.category}
                </span>
                <h3 className="text-2xl font-serif font-bold text-[#142624] mt-1">
                  {selectedModel.name}
                </h3>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono shrink-0">
                <div className="p-2.5 bg-[#F6F5F0] rounded-xl border border-[#E7E5DC] text-center">
                  <span className="text-[10px] text-[#697976] block">ROC-AUC</span>
                  <span className="text-base font-bold text-[#1A3330] tabular-nums">{selectedModel.auroc}</span>
                </div>
                <div className="p-2.5 bg-[#F6F5F0] rounded-xl border border-[#E7E5DC] text-center">
                  <span className="text-[10px] text-[#697976] block">Brier Score</span>
                  <span className="text-base font-bold text-[#2D6A5F] tabular-nums">{selectedModel.brierScore}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-6 text-sm text-[#384A47]">
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#637571] mb-2">
                  Clinical Overview & Mechanism
                </h4>
                <p className="leading-relaxed text-[#445653]">
                  {selectedModel.description}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#637571] mb-2">
                  Target Pathologies Evaluated
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedModel.targetConditions.map((cond, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-[#F4F3EE] rounded-lg text-xs font-medium text-[#2C413D] border border-[#DDD9CE]"
                    >
                      {cond}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#637571] mb-2">
                  Core Predictive Inputs & Biological Biomarkers
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {selectedModel.keyBiomarkers.map((bio, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 bg-[#FAFAF8] rounded-lg border border-[#E9E7E0]">
                      <Check className="w-3.5 h-3.5 text-[#2D6A5F] shrink-0" />
                      <span className="text-[#2C3F3B]">{bio}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-[#EAE8E0] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <span className="text-xs text-[#738480] font-mono">
                  Training Foundation: {selectedModel.sampleSize}
                </span>

                <button
                  onClick={onLaunchWorkbench}
                  className="px-5 py-2.5 text-xs font-semibold text-white bg-[#1A3330] hover:bg-[#264844] rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Test with Active Patient Chart</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

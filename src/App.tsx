import React, { useState } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { ClinicalWorkbench } from './components/ClinicalWorkbench';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { ModelDirectorySection } from './components/ModelDirectorySection';
import { ElderCareValuesSection } from './components/ElderCareValuesSection';
import { ClinicalCaseStudiesSection } from './components/ClinicalCaseStudiesSection';
import { EthicsValidationSection } from './components/EthicsValidationSection';
import { Footer } from './components/Footer';
import { MOCK_PATIENT_COHORTS } from './data/mockPatients';
import { Activity, BarChart3, Users, ArrowRight } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'landing' | 'workbench' | 'analytics'>('landing');
  const [activePatientId, setActivePatientId] = useState<string>('pt-als-01');

  const handleLaunchWorkbench = () => {
    setActiveTab('workbench');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLaunchAnalytics = () => {
    setActiveTab('analytics');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectSamplePatient = (patientId: string) => {
    setActivePatientId(patientId);
    setActiveTab('workbench');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF8] text-[#1A2624] selection:bg-[#2D6A5F]/20 selection:text-[#142624]">
      {/* 3-Zone Header */}
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
      />

      {/* Main Viewport Content */}
      <main className="flex-1">
        {activeTab === 'workbench' ? (
          <div className="animate-in fade-in duration-300">
            {/* Contextual Back Banner */}
            <div className="bg-[#182C29] text-white py-3 px-6 lg:px-12 border-b border-[#24423D]">
              <div className="max-w-[1440px] mx-auto flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#6EE7B7]" />
                  <span className="font-semibold">Interactive Healthcare Professional Workspace</span>
                  <span aria-hidden="true" className="text-white/40">·</span>
                  <span className="text-[#A8C7C0]">Multi-Modal Predictive Engine Active</span>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleLaunchAnalytics}
                    className="text-xs text-[#A8C7C0] hover:text-[#6EE7B7] transition-colors cursor-pointer"
                  >
                    View Cohort Analytics &rarr;
                  </button>
                  <button
                    onClick={() => setActiveTab('landing')}
                    className="text-xs text-[#6EE7B7] hover:underline font-medium cursor-pointer"
                  >
                    &larr; Return to Institutional Overview
                  </button>
                </div>
              </div>
            </div>

            <ClinicalWorkbench initialPatientId={activePatientId} />
          </div>
        ) : activeTab === 'analytics' ? (
          <div className="animate-in fade-in duration-300">
            {/* Contextual Banner for Analytics */}
            <div className="bg-[#182C29] text-white py-3 px-6 lg:px-12 border-b border-[#24423D]">
              <div className="max-w-[1440px] mx-auto flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#6EE7B7]" />
                  <span className="font-semibold">Population Health & Executive Clinical KPI Dashboard</span>
                  <span aria-hidden="true" className="text-white/40">·</span>
                  <span className="text-[#A8C7C0]">1,482 Active Patients Monitored</span>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleLaunchWorkbench}
                    className="text-xs text-[#A8C7C0] hover:text-[#6EE7B7] transition-colors cursor-pointer"
                  >
                    Open Active Patient Chart &rarr;
                  </button>
                  <button
                    onClick={() => setActiveTab('landing')}
                    className="text-xs text-[#6EE7B7] hover:underline font-medium cursor-pointer"
                  >
                    &larr; Return to Institutional Overview
                  </button>
                </div>
              </div>
            </div>

            <AnalyticsDashboard
              onLoadPatientIntoWorkbench={handleSelectSamplePatient}
              onOpenWorkbench={handleLaunchWorkbench}
            />
          </div>
        ) : (
          <div className="animate-in fade-in duration-300">
            {/* Hero Section */}
            <HeroSection
              onLaunchWorkbench={handleLaunchWorkbench}
              onSelectSamplePatient={handleSelectSamplePatient}
              featuredPatient={MOCK_PATIENT_COHORTS[0]}
            />

            {/* Dual Quick Launch Banner: Workbench & Cohort Analytics */}
            <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Card 1: Patient-Level Workbench */}
                <div className="p-8 bg-[#F5F4EE] rounded-3xl border border-[#DFDDD4] flex flex-col justify-between hover:border-[#CFCCC0] transition-colors">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#2D6A5F]">
                      <Activity className="w-4 h-4" />
                      <span>Point-of-Care Diagnostics</span>
                    </div>
                    <h3 className="text-2xl font-serif font-bold text-[#142624]">
                      Clinical Prognosis Workbench
                    </h3>
                    <p className="text-xs sm:text-sm text-[#4D5E5A] leading-relaxed">
                      Evaluate individual patients by adjusting symptom severity sliders (1-10) and laboratory biomarkers (eGFR, CA 19-9, NT-proBNP, FEV1%). Generates instantaneous Kaplan-Meier curves and SHAP explainability.
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-[#E6E3D8] flex items-center justify-between">
                    <span className="text-xs font-mono text-[#6E807D]">5 Pre-loaded Cases Ready</span>
                    <button
                      onClick={handleLaunchWorkbench}
                      className="px-5 py-2.5 text-xs font-semibold text-white bg-[#1A3330] hover:bg-[#254642] active:scale-[0.98] rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Launch Workbench</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Card 2: Population Health KPI Dashboard */}
                <div className="p-8 bg-white rounded-3xl border border-[#DFDDD4] flex flex-col justify-between shadow-xs hover:border-[#CFCCC0] transition-colors">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#2D6A5F]">
                      <BarChart3 className="w-4 h-4" />
                      <span>Population Health Intelligence</span>
                    </div>
                    <h3 className="text-2xl font-serif font-bold text-[#142624]">
                      Cohort KPIs & Trend Lines
                    </h3>
                    <p className="text-xs sm:text-sm text-[#4D5E5A] leading-relaxed">
                      Explore hospital-wide metrics: 1,482 monitored terminal illness patients, longitudinal inference growth curves, 64.2% reduction in emergency ICU decompensations, and comparative survival trajectories.
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-[#EAE8DF] flex items-center justify-between">
                    <span className="text-xs font-mono text-[#6E807D] tabular-nums">1,482 Enrolled Cohorts</span>
                    <button
                      onClick={handleLaunchAnalytics}
                      className="px-5 py-2.5 text-xs font-semibold text-[#182C29] bg-[#F1F0E9] hover:bg-[#E7E5DC] active:scale-[0.98] rounded-xl border border-[#D5D3C8] transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Explore KPI Dashboard</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#2D6A5F]" />
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* Models Directory */}
            <ModelDirectorySection onLaunchWorkbench={handleLaunchWorkbench} />

            {/* Human-Centered Elder Care Philosophy */}
            <ElderCareValuesSection />

            {/* Validated Case Cohorts */}
            <ClinicalCaseStudiesSection onSelectPatient={handleSelectSamplePatient} />

            {/* Governance, Ethics & Validation */}
            <EthicsValidationSection />
          </div>
        )}
      </main>

      {/* Institutional Clean Footer */}
      <Footer
        onSelectTab={setActiveTab}
        onSelectSamplePatient={handleSelectSamplePatient}
      />
    </div>
  );
}

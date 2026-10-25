import React, { useState, useEffect } from 'react';
import {
  PatientProfile,
  PrognosticPredictionResult,
  ReportedSymptom
} from '../types/clinical';
import { MOCK_PATIENT_COHORTS, AVAILABLE_SYMPTOM_DICTIONARY } from '../data/mockPatients';
import { runClinicalPrognosisModel, generateGeminiClinicalConsult } from '../services/prognosticEngine';
import { KaplanMeierChart } from './KaplanMeierChart';
import { ShapAttributionChart } from './ShapAttributionChart';
import { ExportSummaryModal } from './ExportSummaryModal';
import {
  User,
  Activity,
  Heart,
  FlaskConical,
  FileText,
  AlertTriangle,
  CheckCircle,
  Plus,
  Trash2,
  RefreshCw,
  Share2,
  Stethoscope,
  ChevronRight,
  TrendingDown,
  Calendar,
  Sparkles,
  Search,
  Lock,
  Copy,
  Check,
  RotateCcw,
  FileEdit,
  ShieldCheck,
  Download
} from 'lucide-react';
import { generatePatientPdfReport } from '../services/pdfReportGenerator';
import { LabSparkline } from './LabSparkline';
import { getPatient30DayLabHistory } from '../services/labHistoryService';

interface ClinicalWorkbenchProps {
  initialPatientId?: string;
}

export const ClinicalWorkbench: React.FC<ClinicalWorkbenchProps> = ({ initialPatientId }) => {
  // Current patient state
  const [selectedCohortIndex, setSelectedCohortIndex] = useState<number>(0);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState<boolean>(false);
  const [currentPatient, setCurrentPatient] = useState<PatientProfile>(MOCK_PATIENT_COHORTS[0]);

  // Intake active tab: 'symptoms' | 'biomarkers' | 'vitals' | 'history'
  const [activeIntakeTab, setActiveIntakeTab] = useState<'symptoms' | 'biomarkers' | 'vitals' | 'history'>('symptoms');

  // Secure local-state temporary notes for clinicians (isolated per patient ID)
  const [sessionNotes, setSessionNotes] = useState<Record<string, string>>({});
  const [noteTimestamps, setNoteTimestamps] = useState<Record<string, string>>({});
  const [copiedNote, setCopiedNote] = useState<boolean>(false);

  const currentNote = sessionNotes[currentPatient.id] || '';
  const currentNoteTimestamp = noteTimestamps[currentPatient.id] || '';

  // Prediction and AI consultation state
  const [prediction, setPrediction] = useState<PrognosticPredictionResult>(() =>
    runClinicalPrognosisModel(MOCK_PATIENT_COHORTS[0])
  );
  const [aiRationale, setAiRationale] = useState<string>('');
  const [isInferencing, setIsInferencing] = useState<boolean>(false);
  const [isGeneratingAi, setIsGeneratingAi] = useState<boolean>(false);

  // Modal export
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);

  // New symptom addition dropdown
  const [selectedNewSymptomId, setSelectedNewSymptomId] = useState<string>('');
  const [newSymptomSeverity, setNewSymptomSeverity] = useState<number>(7);

  // Note actions
  const handleUpdateNote = (val: string) => {
    setSessionNotes(prev => ({ ...prev, [currentPatient.id]: val }));
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setNoteTimestamps(prev => ({ ...prev, [currentPatient.id]: timeStr }));
  };

  const handleAppendSnippet = (snippet: string) => {
    const existing = sessionNotes[currentPatient.id] || '';
    const updated = existing.trim() ? `${existing.trim()}\n• ${snippet}` : `• ${snippet}`;
    handleUpdateNote(updated);
  };

  const handleClearNote = () => {
    setSessionNotes(prev => ({ ...prev, [currentPatient.id]: '' }));
    setNoteTimestamps(prev => {
      const copy = { ...prev };
      delete copy[currentPatient.id];
      return copy;
    });
  };

  const handleCopyNote = () => {
    if (!currentNote.trim()) return;
    navigator.clipboard.writeText(currentNote);
    setCopiedNote(true);
    setTimeout(() => setCopiedNote(false), 2000);
  };

  const handleDownloadDirectPdf = () => {
    setIsDownloadingPdf(true);
    try {
      generatePatientPdfReport(currentPatient, prediction, currentNote, aiRationale);
    } catch (err) {
      console.error('Failed to generate PDF:', err);
    } finally {
      setTimeout(() => setIsDownloadingPdf(false), 800);
    }
  };

  // Handle initial patient if passed
  useEffect(() => {
    if (initialPatientId) {
      const idx = MOCK_PATIENT_COHORTS.findIndex(p => p.id === initialPatientId);
      if (idx !== -1) {
        setSelectedCohortIndex(idx);
        const pt = MOCK_PATIENT_COHORTS[idx];
        setCurrentPatient(pt);
        const result = runClinicalPrognosisModel(pt);
        setPrediction(result);
        setAiRationale(result.clinicalRationale);
      }
    }
  }, [initialPatientId]);

  // Load a patient cohort
  const handleSelectCohort = (idx: number) => {
    setSelectedCohortIndex(idx);
    const pt = MOCK_PATIENT_COHORTS[idx];
    setCurrentPatient(pt);
    setIsInferencing(true);
    setTimeout(() => {
      const res = runClinicalPrognosisModel(pt);
      setPrediction(res);
      setAiRationale(res.clinicalRationale);
      setIsInferencing(false);
    }, 280);
  };

  // Run or re-run inference
  const handleRunInference = () => {
    setIsInferencing(true);
    setTimeout(() => {
      const res = runClinicalPrognosisModel(currentPatient);
      setPrediction(res);
      setAiRationale(res.clinicalRationale);
      setIsInferencing(false);
    }, 350);
  };

  // Generate deeper AI multidisciplinary consult
  const handleGenerateAiConsult = async () => {
    setIsGeneratingAi(true);
    try {
      const consult = await generateGeminiClinicalConsult(currentPatient, prediction);
      setAiRationale(consult);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // Symptom handlers
  const handleUpdateSymptomSeverity = (symId: string, severity: number) => {
    const updatedSymptoms = currentPatient.reportedSymptoms.map(s =>
      s.id === symId ? { ...s, severity } : s
    );
    const updatedPatient = { ...currentPatient, reportedSymptoms: updatedSymptoms };
    setCurrentPatient(updatedPatient);
  };

  const handleRemoveSymptom = (symId: string) => {
    const updatedSymptoms = currentPatient.reportedSymptoms.filter(s => s.id !== symId);
    const updatedPatient = { ...currentPatient, reportedSymptoms: updatedSymptoms };
    setCurrentPatient(updatedPatient);
  };

  const handleAddSymptom = () => {
    if (!selectedNewSymptomId) return;
    const item = AVAILABLE_SYMPTOM_DICTIONARY.find(s => s.id === selectedNewSymptomId);
    if (!item) return;

    if (currentPatient.reportedSymptoms.some(s => s.name === item.name)) {
      return; // already added
    }

    const newSym: ReportedSymptom = {
      id: `custom-sym-${Date.now()}`,
      name: item.name,
      category: item.category,
      severity: newSymptomSeverity,
      durationMonths: 3,
      notes: item.description
    };

    const updatedPatient = {
      ...currentPatient,
      reportedSymptoms: [...currentPatient.reportedSymptoms, newSym]
    };
    setCurrentPatient(updatedPatient);
    setSelectedNewSymptomId('');
  };

  // Biomarker updates
  const handleUpdateBiomarker = (key: keyof PatientProfile['biomarkers'], value: number) => {
    const updatedBio = { ...currentPatient.biomarkers, [key]: value };
    setCurrentPatient({ ...currentPatient, biomarkers: updatedBio });
  };

  // Vitals updates
  const handleUpdateVital = (key: keyof PatientProfile['vitals'], value: number) => {
    const updatedVitals = { ...currentPatient.vitals, [key]: value };
    setCurrentPatient({ ...currentPatient, vitals: updatedVitals });
  };

  return (
    <div className="w-full bg-[#F6F5F1] py-8 lg:py-12 border-b border-[#E3E1D7]">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 space-y-8">
        
        {/* Top Control Ribbon: Patient Cohort Selector */}
        <div className="bg-white rounded-2xl border border-[#DFDDD4] p-5 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#EBE9E1]">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#2D6A5F]">
                <Stethoscope className="w-4 h-4" />
                <span>Clinical Decision Workspace</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#142624] mt-0.5">
                Terminal Illness Prognosis & Trajectory Analyzer
              </h2>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap shrink-0">
              <button
                onClick={handleDownloadDirectPdf}
                disabled={isDownloadingPdf}
                className="px-3.5 py-2 text-xs font-semibold text-white bg-[#2D6A5F] hover:bg-[#23554C] active:scale-[0.98] rounded-lg transition-all shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
                title="Download formatted clinical prognosis PDF report"
              >
                <Download className="w-3.5 h-3.5 text-[#6EE7B7]" />
                <span>{isDownloadingPdf ? 'Generating PDF...' : 'Download PDF Report'}</span>
              </button>

              <button
                onClick={() => setIsExportModalOpen(true)}
                className="px-3.5 py-2 text-xs font-semibold text-[#1F3633] bg-[#F3F2EC] hover:bg-[#EAE8DE] border border-[#D5D3C8] rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5 text-[#2D6A5F]" />
                <span>EHR Preview & Print</span>
              </button>

              <button
                onClick={handleRunInference}
                disabled={isInferencing}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#1A3330] hover:bg-[#254642] active:scale-[0.98] rounded-lg transition-all shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isInferencing ? 'animate-spin' : ''}`} />
                <span>{isInferencing ? 'Computing ML...' : 'Run ML Prognosis'}</span>
              </button>
            </div>
          </div>

          {/* Patient Quick Selector Tabs */}
          <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span className="text-xs font-medium text-[#657673] whitespace-nowrap">
              Select Patient Cohort Case Study:
            </span>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
              {MOCK_PATIENT_COHORTS.map((pt, idx) => (
                <button
                  key={pt.id}
                  onClick={() => handleSelectCohort(idx)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap cursor-pointer shrink-0 border ${
                    selectedCohortIndex === idx
                      ? 'bg-[#182C29] text-white border-[#182C29] shadow-xs'
                      : 'bg-[#FAFAF8] text-[#3E4F4C] border-[#DEDBD2] hover:bg-[#F0EFE9]'
                  }`}
                >
                  <span className="font-semibold">{pt.fullName}</span>
                  <span className="opacity-70 ml-1.5 font-mono">({pt.age}y {pt.gender[0]})</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Patient Demographics Banner */}
        <div className="bg-white rounded-xl border border-[#DFDDD4] p-5 shadow-xs grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-xs">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-[#738380] block">Patient Name</span>
            <span className="text-sm font-bold text-[#142624] font-serif">{currentPatient.fullName}</span>
            <span className="text-[11px] text-[#637370] font-mono">{currentPatient.mrn}</span>
          </div>
          <div>
            <span className="text-[11px] uppercase tracking-wider text-[#738380] block">Demographics</span>
            <span className="text-sm font-semibold text-[#142624]">{currentPatient.age} Years Old</span>
            <span className="text-[11px] text-[#637370]">{currentPatient.gender}</span>
          </div>
          <div>
            <span className="text-[11px] uppercase tracking-wider text-[#738380] block">Performance Status</span>
            <span className="text-sm font-bold text-[#D97706] font-mono">ECOG {currentPatient.ecogPerformanceStatus}</span>
            <span className="text-[11px] text-[#637370]">Karnofsky ~60%</span>
          </div>
          <div>
            <span className="text-[11px] uppercase tracking-wider text-[#738380] block">Care Setting</span>
            <span className="text-sm font-semibold text-[#142624]">{currentPatient.admissionStatus}</span>
            <span className="text-[11px] text-[#637370]">Active Chart</span>
          </div>
          <div className="col-span-2">
            <span className="text-[11px] uppercase tracking-wider text-[#738380] block">Attending Physician</span>
            <span className="text-sm font-semibold text-[#142624]">{currentPatient.primaryPhysician}</span>
            <span className="text-[11px] text-[#637370]">Comprehensive Supportive Team</span>
          </div>
        </div>

        {/* Main Grid: Left Side Intake & Parameters (5 cols) | Right Side ML Predictions & Staging (7 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ================= LEFT COLUMN: CLINICAL INTAKE CONTROLS ================= */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl border border-[#DFDDD4] shadow-sm overflow-hidden">
              
              {/* Intake Sub-navigation Tabs */}
              <div className="bg-[#FAF9F6] border-b border-[#E5E3D9] p-1.5 flex items-center gap-1">
                <button
                  onClick={() => setActiveIntakeTab('symptoms')}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    activeIntakeTab === 'symptoms'
                      ? 'bg-white text-[#182C29] shadow-xs border border-[#E0DED5]'
                      : 'text-[#5C6E6B] hover:text-[#182C29]'
                  }`}
                >
                  Symptoms ({currentPatient.reportedSymptoms.length})
                </button>

                <button
                  onClick={() => setActiveIntakeTab('biomarkers')}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    activeIntakeTab === 'biomarkers'
                      ? 'bg-white text-[#182C29] shadow-xs border border-[#E0DED5]'
                      : 'text-[#5C6E6B] hover:text-[#182C29]'
                  }`}
                >
                  Biomarkers & Labs
                </button>

                <button
                  onClick={() => setActiveIntakeTab('vitals')}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    activeIntakeTab === 'vitals'
                      ? 'bg-white text-[#182C29] shadow-xs border border-[#E0DED5]'
                      : 'text-[#5C6E6B] hover:text-[#182C29]'
                  }`}
                >
                  Vitals
                </button>

                <button
                  onClick={() => setActiveIntakeTab('history')}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    activeIntakeTab === 'history'
                      ? 'bg-white text-[#182C29] shadow-xs border border-[#E0DED5]'
                      : 'text-[#5C6E6B] hover:text-[#182C29]'
                  }`}
                >
                  History
                </button>
              </div>

              {/* Tab 1: Symptoms Matrix */}
              {activeIntakeTab === 'symptoms' && (
                <div className="p-5 space-y-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#182C29]">Reported Symptoms & Severity</span>
                    <span className="text-[#6C7E7A] font-mono tabular-nums">Scale: 1 (Mild) - 10 (Disabling)</span>
                  </div>

                  <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                    {currentPatient.reportedSymptoms.map((sym) => (
                      <div
                        key={sym.id}
                        className="p-3 bg-[#FCFCFA] rounded-xl border border-[#E7E5DF] hover:border-[#D5D2C8] transition-colors"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-xs font-semibold text-[#1A2E2B] block">{sym.name}</span>
                            <span className="text-[11px] text-[#697976] font-mono capitalize">
                              Category: {sym.category} · Duration: {sym.durationMonths} mo
                            </span>
                            {sym.notes && (
                              <p className="text-[11px] text-[#788885] italic mt-0.5">{sym.notes}</p>
                            )}
                          </div>
                          <button
                            onClick={() => handleRemoveSymptom(sym.id)}
                            className="text-[#98A8A4] hover:text-[#B91C1C] transition-colors p-1"
                            title="Remove symptom"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Severity Slider */}
                        <div className="mt-3 flex items-center gap-3">
                          <input
                            type="range"
                            min="1"
                            max="10"
                            value={sym.severity}
                            onChange={(e) => handleUpdateSymptomSeverity(sym.id, parseInt(e.target.value))}
                            className="flex-1 h-1.5 bg-[#E2DFD7] rounded-lg appearance-none cursor-pointer accent-[#2D6A5F]"
                          />
                          <span className={`text-xs font-mono font-bold tabular-nums w-8 text-right ${
                            sym.severity >= 8 ? 'text-[#B91C1C]' : sym.severity >= 5 ? 'text-[#D97706]' : 'text-[#2D6A5F]'
                          }`}>
                            {sym.severity}/10
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add Symptom from Dictionary */}
                  <div className="pt-3 border-t border-[#E8E6DF] space-y-2">
                    <span className="text-xs font-medium text-[#50625E] block">
                      Add Symptom from Clinical Dictionary:
                    </span>
                    <div className="flex items-center gap-2">
                      <select
                        value={selectedNewSymptomId}
                        onChange={(e) => setSelectedNewSymptomId(e.target.value)}
                        className="flex-1 py-1.5 px-2.5 text-xs bg-[#FAFAF8] border border-[#D5D3C8] rounded-lg text-[#1C2F2C] focus:outline-hidden focus:ring-1 focus:ring-[#2D6A5F]"
                      >
                        <option value="">-- Choose Symptom to Add --</option>
                        {AVAILABLE_SYMPTOM_DICTIONARY.map((dict) => (
                          <option key={dict.id} value={dict.id}>
                            {dict.name}
                          </option>
                        ))}
                      </select>

                      <button
                        onClick={handleAddSymptom}
                        disabled={!selectedNewSymptomId}
                        className="px-3 py-1.5 text-xs font-semibold text-white bg-[#2D6A5F] hover:bg-[#23554C] rounded-lg transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>

                </div>
              )}

              {/* Tab 2: Biomarkers Panel with 30-Day Sparklines */}
              {activeIntakeTab === 'biomarkers' && (
                <div className="p-5 space-y-4">
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <span className="font-semibold text-[#182C29] block">Quantitative Biomarkers & 30-Day Sparklines</span>
                      <span className="text-[#6C7E7A] text-[11px]">Hover over nodes to inspect 30-day trajectory</span>
                    </div>
                    <span className="text-[10px] font-mono text-[#2D6A5F] bg-[#2D6A5F]/8 px-2 py-0.5 rounded border border-[#2D6A5F]/20">
                      Live Recalibration
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {/* eGFR */}
                    <div className="p-3 bg-[#FAF9F5] rounded-xl border border-[#E7E5DD] flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between text-[#5C6E6B]">
                          <span className="font-semibold text-[#1A2E2A]">eGFR (Renal)</span>
                          <span className="text-[10px] font-mono">mL/min/1.73m²</span>
                        </div>
                        <div className="mt-1 flex items-center justify-between">
                          <input
                            type="number"
                            value={currentPatient.biomarkers.eGFR}
                            onChange={(e) => handleUpdateBiomarker('eGFR', parseFloat(e.target.value) || 0)}
                            className="w-18 py-0.5 px-1.5 text-sm font-bold font-mono bg-white border border-[#D8D6CC] rounded focus:ring-1 focus:ring-[#2D6A5F]"
                          />
                          <span className={`text-[10px] font-mono font-bold ${currentPatient.biomarkers.eGFR < 30 ? 'text-[#B91C1C]' : 'text-[#2D6A5F]'}`}>
                            {currentPatient.biomarkers.eGFR < 15 ? 'Stage 5 ESRD' : currentPatient.biomarkers.eGFR < 30 ? 'Severe CKD' : 'Adequate'}
                          </span>
                        </div>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-[#EAE8E0]">
                        <LabSparkline
                          label="eGFR"
                          unit="mL/min"
                          history={getPatient30DayLabHistory(currentPatient, 'eGFR')}
                          currentValue={currentPatient.biomarkers.eGFR}
                          normalRange="> 60"
                          isHigherWorse={false}
                        />
                      </div>
                    </div>

                    {/* CA 19-9 */}
                    <div className="p-3 bg-[#FAF9F5] rounded-xl border border-[#E7E5DD] flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between text-[#5C6E6B]">
                          <span className="font-semibold text-[#1A2E2A]">CA 19-9 (Pancreato-Biliary)</span>
                          <span className="text-[10px] font-mono">U/mL</span>
                        </div>
                        <div className="mt-1 flex items-center justify-between">
                          <input
                            type="number"
                            value={currentPatient.biomarkers.ca19_9}
                            onChange={(e) => handleUpdateBiomarker('ca19_9', parseFloat(e.target.value) || 0)}
                            className="w-20 py-0.5 px-1.5 text-sm font-bold font-mono bg-white border border-[#D8D6CC] rounded focus:ring-1 focus:ring-[#2D6A5F]"
                          />
                          <span className={`text-[10px] font-mono font-bold ${currentPatient.biomarkers.ca19_9 > 37 ? 'text-[#B91C1C]' : 'text-[#2D6A5F]'}`}>
                            {currentPatient.biomarkers.ca19_9 > 200 ? 'Severe Tumor Burden' : 'Normal <37'}
                          </span>
                        </div>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-[#EAE8E0]">
                        <LabSparkline
                          label="CA 19-9"
                          unit="U/mL"
                          history={getPatient30DayLabHistory(currentPatient, 'ca19_9')}
                          currentValue={currentPatient.biomarkers.ca19_9}
                          normalRange="< 37"
                          isHigherWorse={true}
                        />
                      </div>
                    </div>

                    {/* Total Bilirubin */}
                    <div className="p-3 bg-[#FAF9F5] rounded-xl border border-[#E7E5DD] flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between text-[#5C6E6B]">
                          <span className="font-semibold text-[#1A2E2A]">Total Bilirubin</span>
                          <span className="text-[10px] font-mono">mg/dL</span>
                        </div>
                        <div className="mt-1 flex items-center justify-between">
                          <input
                            type="number"
                            step="0.1"
                            value={currentPatient.biomarkers.totalBilirubin}
                            onChange={(e) => handleUpdateBiomarker('totalBilirubin', parseFloat(e.target.value) || 0)}
                            className="w-18 py-0.5 px-1.5 text-sm font-bold font-mono bg-white border border-[#D8D6CC] rounded focus:ring-1 focus:ring-[#2D6A5F]"
                          />
                          <span className={`text-[10px] font-mono font-bold ${currentPatient.biomarkers.totalBilirubin > 2.0 ? 'text-[#B91C1C]' : 'text-[#2D6A5F]'}`}>
                            {currentPatient.biomarkers.totalBilirubin > 3 ? 'Overt Icterus' : 'Normal <1.2'}
                          </span>
                        </div>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-[#EAE8E0]">
                        <LabSparkline
                          label="Total Bilirubin"
                          unit="mg/dL"
                          history={getPatient30DayLabHistory(currentPatient, 'totalBilirubin')}
                          currentValue={currentPatient.biomarkers.totalBilirubin}
                          normalRange="< 1.2"
                          isHigherWorse={true}
                        />
                      </div>
                    </div>

                    {/* NT-proBNP */}
                    <div className="p-3 bg-[#FAF9F5] rounded-xl border border-[#E7E5DD] flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between text-[#5C6E6B]">
                          <span className="font-semibold text-[#1A2E2A]">NT-proBNP (Cardiovascular)</span>
                          <span className="text-[10px] font-mono">pg/mL</span>
                        </div>
                        <div className="mt-1 flex items-center justify-between">
                          <input
                            type="number"
                            value={currentPatient.biomarkers.ntProBnp}
                            onChange={(e) => handleUpdateBiomarker('ntProBnp', parseFloat(e.target.value) || 0)}
                            className="w-22 py-0.5 px-1.5 text-sm font-bold font-mono bg-white border border-[#D8D6CC] rounded focus:ring-1 focus:ring-[#2D6A5F]"
                          />
                          <span className={`text-[10px] font-mono font-bold ${currentPatient.biomarkers.ntProBnp > 1800 ? 'text-[#B91C1C]' : 'text-[#2D6A5F]'}`}>
                            {currentPatient.biomarkers.ntProBnp > 5000 ? 'Severe Wall Stress' : 'Normal <450'}
                          </span>
                        </div>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-[#EAE8E0]">
                        <LabSparkline
                          label="NT-proBNP"
                          unit="pg/mL"
                          history={getPatient30DayLabHistory(currentPatient, 'ntProBnp')}
                          currentValue={currentPatient.biomarkers.ntProBnp}
                          normalRange="< 450"
                          isHigherWorse={true}
                        />
                      </div>
                    </div>

                    {/* Serum Albumin */}
                    <div className="p-3 bg-[#FAF9F5] rounded-xl border border-[#E7E5DD] flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between text-[#5C6E6B]">
                          <span className="font-semibold text-[#1A2E2A]">Serum Albumin</span>
                          <span className="text-[10px] font-mono">g/dL</span>
                        </div>
                        <div className="mt-1 flex items-center justify-between">
                          <input
                            type="number"
                            step="0.1"
                            value={currentPatient.biomarkers.serumAlbumin}
                            onChange={(e) => handleUpdateBiomarker('serumAlbumin', parseFloat(e.target.value) || 0)}
                            className="w-18 py-0.5 px-1.5 text-sm font-bold font-mono bg-white border border-[#D8D6CC] rounded focus:ring-1 focus:ring-[#2D6A5F]"
                          />
                          <span className={`text-[10px] font-mono font-bold ${currentPatient.biomarkers.serumAlbumin < 3.0 ? 'text-[#B91C1C]' : 'text-[#2D6A5F]'}`}>
                            {currentPatient.biomarkers.serumAlbumin < 2.8 ? 'Severe Sarcopenia' : 'Normal >3.5'}
                          </span>
                        </div>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-[#EAE8E0]">
                        <LabSparkline
                          label="Serum Albumin"
                          unit="g/dL"
                          history={getPatient30DayLabHistory(currentPatient, 'serumAlbumin')}
                          currentValue={currentPatient.biomarkers.serumAlbumin}
                          normalRange="> 3.5"
                          isHigherWorse={false}
                        />
                      </div>
                    </div>

                    {/* FEV1 % */}
                    <div className="p-3 bg-[#FAF9F5] rounded-xl border border-[#E7E5DD] flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between text-[#5C6E6B]">
                          <span className="font-semibold text-[#1A2E2A]">FEV1 % Predicted</span>
                          <span className="text-[10px] font-mono">%</span>
                        </div>
                        <div className="mt-1 flex items-center justify-between">
                          <input
                            type="number"
                            value={currentPatient.biomarkers.fev1Percent}
                            onChange={(e) => handleUpdateBiomarker('fev1Percent', parseFloat(e.target.value) || 0)}
                            className="w-18 py-0.5 px-1.5 text-sm font-bold font-mono bg-white border border-[#D8D6CC] rounded focus:ring-1 focus:ring-[#2D6A5F]"
                          />
                          <span className={`text-[10px] font-mono font-bold ${currentPatient.biomarkers.fev1Percent < 50 ? 'text-[#B91C1C]' : 'text-[#2D6A5F]'}`}>
                            {currentPatient.biomarkers.fev1Percent < 50 ? 'Severe Restriction' : 'Adequate'}
                          </span>
                        </div>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-[#EAE8E0]">
                        <LabSparkline
                          label="FEV1 %"
                          unit="%"
                          history={getPatient30DayLabHistory(currentPatient, 'fev1Percent')}
                          currentValue={currentPatient.biomarkers.fev1Percent}
                          normalRange="> 80%"
                          isHigherWorse={false}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-[#F4F8F7] rounded-xl border border-[#D4E4E0] text-xs text-[#2A524A] flex items-center justify-between">
                    <span>INR: <strong className="font-mono">{currentPatient.biomarkers.inr}</strong></span>
                    <span>Platelets: <strong className="font-mono">{currentPatient.biomarkers.plateletCount} k/uL</strong></span>
                    <span>CRP: <strong className="font-mono">{currentPatient.biomarkers.crp} mg/L</strong></span>
                  </div>
                </div>
              )}

              {/* Tab 3: Vitals */}
              {activeIntakeTab === 'vitals' && (
                <div className="p-5 space-y-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#182C29]">Patient Physical Vitals</span>
                    <span className="text-[#6C7E7A] text-[11px]">Bedside measurements</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-[#FAF9F5] rounded-xl border border-[#E7E5DD]">
                      <span className="text-[#5C6E6B] block">Blood Pressure (mmHg)</span>
                      <div className="flex items-center gap-1 mt-1 font-mono font-bold text-sm">
                        <input
                          type="number"
                          value={currentPatient.vitals.bpSystolic}
                          onChange={(e) => handleUpdateVital('bpSystolic', parseInt(e.target.value) || 0)}
                          className="w-14 py-0.5 px-1 border border-[#D8D6CC] rounded text-center bg-white"
                        />
                        <span>/</span>
                        <input
                          type="number"
                          value={currentPatient.vitals.bpDiastolic}
                          onChange={(e) => handleUpdateVital('bpDiastolic', parseInt(e.target.value) || 0)}
                          className="w-14 py-0.5 px-1 border border-[#D8D6CC] rounded text-center bg-white"
                        />
                      </div>
                    </div>

                    <div className="p-3 bg-[#FAF9F5] rounded-xl border border-[#E7E5DD]">
                      <span className="text-[#5C6E6B] block">SpO2 Oxygen Saturation</span>
                      <div className="mt-1 flex items-center justify-between">
                        <input
                          type="number"
                          value={currentPatient.vitals.spo2}
                          onChange={(e) => handleUpdateVital('spo2', parseInt(e.target.value) || 0)}
                          className="w-16 py-0.5 px-1.5 font-mono font-bold text-sm border border-[#D8D6CC] rounded bg-white"
                        />
                        <span className={`text-xs font-mono font-semibold ${currentPatient.vitals.spo2 < 92 ? 'text-[#B91C1C]' : 'text-[#2D6A5F]'}`}>
                          {currentPatient.vitals.spo2}%
                        </span>
                      </div>
                    </div>

                    <div className="p-3 bg-[#FAF9F5] rounded-xl border border-[#E7E5DD]">
                      <span className="text-[#5C6E6B] block">Respiratory Rate (/min)</span>
                      <div className="mt-1 flex items-center justify-between">
                        <input
                          type="number"
                          value={currentPatient.vitals.respRate}
                          onChange={(e) => handleUpdateVital('respRate', parseInt(e.target.value) || 0)}
                          className="w-16 py-0.5 px-1.5 font-mono font-bold text-sm border border-[#D8D6CC] rounded bg-white"
                        />
                        <span className="text-[11px] text-[#637571] font-mono">Tachypnea &gt;20</span>
                      </div>
                    </div>

                    <div className="p-3 bg-[#FAF9F5] rounded-xl border border-[#E7E5DD]">
                      <span className="text-[#5C6E6B] block">Weight Loss (6 mo)</span>
                      <div className="mt-1 flex items-center justify-between">
                        <input
                          type="number"
                          step="0.5"
                          value={currentPatient.vitals.weightLossKg6Mo}
                          onChange={(e) => handleUpdateVital('weightLossKg6Mo', parseFloat(e.target.value) || 0)}
                          className="w-16 py-0.5 px-1.5 font-mono font-bold text-sm border border-[#D8D6CC] rounded bg-white"
                        />
                        <span className="text-xs font-bold text-[#B91C1C] font-mono">-{currentPatient.vitals.weightLossKg6Mo} kg</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 4: History */}
              {activeIntakeTab === 'history' && (
                <div className="p-5 space-y-4 text-xs">
                  <div>
                    <span className="font-semibold text-[#182C29] block mb-1">Pre-existing Medical Conditions</span>
                    <ul className="space-y-1.5">
                      {currentPatient.medicalHistory.map((item, idx) => (
                        <li key={idx} className="p-2 bg-[#FAF9F6] rounded-lg border border-[#E8E6DF] text-[#354844]">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-2">
                    <span className="font-semibold text-[#182C29] block mb-1">Family & Hereditary Risk</span>
                    <div className="p-2.5 bg-[#FAF9F6] rounded-lg border border-[#E8E6DF] text-[#354844]">
                      {currentPatient.familyHistory.join('; ')}
                    </div>
                  </div>

                  <div className="pt-2">
                    <span className="font-semibold text-[#182C29] block mb-1">Clinical Admission Intake Summary</span>
                    <p className="p-2.5 bg-[#FAF9F6] rounded-lg border border-[#E8E6DF] text-[#4A5D5A] leading-relaxed">
                      {currentPatient.clinicalNarrative}
                    </p>
                  </div>
                </div>
              )}

              {/* Action footer on Intake card */}
              <div className="p-4 bg-[#FAF9F5] border-t border-[#E8E6DF] flex items-center justify-between">
                <span className="text-[11px] text-[#697976]">
                  Modified values will re-evaluate upon running ML inference.
                </span>
                <button
                  onClick={handleRunInference}
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#1A3330] hover:bg-[#254642] rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Update Prognosis</span>
                </button>
              </div>

            </div>

            {/* ================= SECURE CLINICIAN SCRATCHPAD / TEMPORARY NOTES ================= */}
            <div className="bg-white rounded-2xl border border-[#DFDDD4] shadow-sm overflow-hidden">
              <div className="p-4 bg-[#FAF9F6] border-b border-[#E5E3D9] flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[#2D6A5F]/10 flex items-center justify-center text-[#2D6A5F] shrink-0">
                    <FileEdit className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-[#182C29] flex items-center gap-1.5">
                      <span>Temporary Clinician Notes</span>
                    </h3>
                    <span className="text-[10px] text-[#657673] block">
                      Active: {currentPatient.fullName} · <span className="font-mono">{currentPatient.mrn}</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#2D6A5F] bg-[#2D6A5F]/8 px-2 py-0.5 rounded border border-[#2D6A5F]/20 shrink-0">
                  <Lock className="w-3 h-3 text-[#2D6A5F]" />
                  <span>Local Memory Only</span>
                </div>
              </div>

              <div className="p-4 space-y-3">
                {/* Text area */}
                <div className="relative">
                  <textarea
                    value={currentNote}
                    onChange={(e) => handleUpdateNote(e.target.value)}
                    rows={5}
                    placeholder={`Log temporary clinical observations, bedside findings, family conference notes, or differential thoughts for ${currentPatient.fullName}... (Ephemeral session scratchpad — saved in client-side memory only)`}
                    className="w-full p-3 text-xs bg-[#FCFCFA] text-[#1E2F2C] border border-[#DDD9CF] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#2D6A5F] focus:border-[#2D6A5F] placeholder:text-[#9AA7A4] leading-relaxed resize-y transition-all"
                  />
                </div>

                {/* Metadata and Stats bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#6A7B78] pt-1">
                  <div className="flex items-center gap-2.5 font-mono tabular-nums text-[10px]">
                    <span>{currentNote.length} chars</span>
                    <span aria-hidden="true" className="text-[#CCD7D4]">·</span>
                    <span>{currentNote.trim() ? currentNote.trim().split(/\s+/).length : 0} words</span>
                    {currentNoteTimestamp && (
                      <>
                        <span aria-hidden="true" className="text-[#CCD7D4]">·</span>
                        <span className="text-[#516461]">Saved {currentNoteTimestamp}</span>
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {currentNote.trim() && (
                      <button
                        type="button"
                        onClick={handleClearNote}
                        className="px-2 py-0.5 text-[10px] text-[#71827E] hover:text-[#B91C1C] hover:bg-[#FEE2E2]/40 rounded transition-colors flex items-center gap-1 cursor-pointer"
                        title="Clear this patient's temporary note"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Clear</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={handleCopyNote}
                      disabled={!currentNote.trim()}
                      className="px-2.5 py-1 text-[11px] font-semibold text-[#182C29] bg-[#F2F1EB] hover:bg-[#EAE8DE] disabled:opacity-40 rounded-lg border border-[#D5D3C8] transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      {copiedNote ? (
                        <>
                          <Check className="w-3 h-3 text-[#2D6A5F]" />
                          <span className="text-[#2D6A5F]">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handleDownloadDirectPdf}
                      disabled={isDownloadingPdf}
                      className="px-2.5 py-1 text-[11px] font-semibold text-[#2D6A5F] bg-[#2D6A5F]/8 hover:bg-[#2D6A5F]/15 rounded-lg border border-[#2D6A5F]/20 transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-40"
                      title="Download formatted PDF with current clinical notes"
                    >
                      <Download className="w-3 h-3 text-[#2D6A5F]" />
                      <span>{isDownloadingPdf ? 'Generating...' : 'PDF'}</span>
                    </button>
                  </div>
                </div>

                {/* Quick Clinical Observation Snippets */}
                <div className="pt-2 border-t border-[#EFECE5]">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-[#667774] block mb-1.5">
                    Insert Quick Clinical Observation Snippets:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      'Palliative comfort goals reviewed with patient & healthcare proxy',
                      'Diaphragmatic fatigue & nocturnal orthopnea noted on bedside assessment',
                      'Advance care directive (POLST/MOLST) documentation initiated',
                      'Symptom relief regimen adjusted; avoiding contraindicated nephrotoxic agents',
                      'Confirmatory diagnostic imaging and specialty multidisciplinary board pending'
                    ].map((snippet, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleAppendSnippet(snippet)}
                        className="text-[10px] text-[#334643] bg-[#F5F4EE] hover:bg-[#EAE8DE] border border-[#DDD9CE] rounded-md px-2 py-1 text-left transition-colors cursor-pointer"
                      >
                        + {snippet}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Security Assurance Guarantee Note */}
                <div className="pt-2 flex items-start gap-2 text-[10px] text-[#7A8A87] leading-relaxed">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#2D6A5F] shrink-0 mt-0.5" />
                  <span>
                    Local-state guarantee: Notes are kept in browser memory only and isolated per patient MRN. Notes are not transmitted across the network or logged to external telemetry, and will automatically accompany your EHR report export.
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* ================= RIGHT COLUMN: PREDICTIVE RESULTS & STAGING ================= */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Primary ML Prediction Card */}
            <div className="bg-white rounded-2xl border border-[#DFDDD4] shadow-sm overflow-hidden">
              <div className="bg-[#172D29] text-white p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs text-[#A8C7C0]">
                    <span className="w-2 h-2 rounded-full bg-[#34D399]" />
                    <span className="uppercase font-semibold tracking-wider">Primary Predicted Illness</span>
                    <span aria-hidden="true" className="text-white/40">·</span>
                    <span className="font-mono text-[#D1E7E2]">{prediction.modelMetadata.modelVersion}</span>
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-white mt-1">
                    {prediction.primaryDiagnosis}
                  </h3>
                  <p className="text-xs text-[#C5DCD6] mt-0.5">
                    {prediction.staging}
                  </p>
                </div>

                <div className="text-right sm:border-l sm:border-white/15 sm:pl-5 shrink-0">
                  <div className="text-2xl font-mono font-bold text-[#6EE7B7] tabular-nums">
                    {prediction.confidenceScore}%
                  </div>
                  <div className="text-[11px] text-[#A8C7C0]">ML Calibrated Probability</div>
                </div>
              </div>

              {/* Prognostic KPI Strip */}
              <div className="grid grid-cols-3 divide-x divide-[#EAE8E0] border-b border-[#EAE8E0] bg-[#FCFCFA] text-xs">
                <div className="p-4 text-center">
                  <span className="text-[#687875] text-[11px] block">Estimated Median Survival</span>
                  <span className="text-lg font-bold font-mono text-[#182B28] tabular-nums">
                    {prediction.medianSurvivalMonths} Mo
                  </span>
                  <span className="text-[10px] text-[#81928F] block font-mono">
                    CI: [{prediction.survivalRangeMonths[0]}–{prediction.survivalRangeMonths[1]} mo]
                  </span>
                </div>

                <div className="p-4 text-center">
                  <span className="text-[#687875] text-[11px] block">Progression Velocity</span>
                  <span className={`text-sm font-bold block mt-1 ${
                    prediction.progressionVelocity === 'Critical / Acute Decompensation'
                      ? 'text-[#B91C1C]'
                      : 'text-[#D97706]'
                  }`}>
                    {prediction.progressionVelocity}
                  </span>
                  <span className="text-[10px] text-[#81928F] block">Multi-Trajectory Curve</span>
                </div>

                <div className="p-4 text-center">
                  <span className="text-[#687875] text-[11px] block">Model Discrimination</span>
                  <span className="text-lg font-bold font-mono text-[#2D6A5F] tabular-nums">
                    AUROC {prediction.modelMetadata.rocAuc}
                  </span>
                  <span className="text-[10px] text-[#81928F] block font-mono">Brier: {prediction.modelMetadata.calibrationBrierScore}</span>
                </div>
              </div>

              {/* Differentials Comparison */}
              <div className="p-5 border-b border-[#EAE8E0] space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#576965]">
                  Differential Diagnoses & Separation Factors
                </h4>

                <div className="space-y-2 text-xs">
                  {prediction.differentialDiagnoses.map((diff, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-[#FAF9F5] rounded-xl border border-[#E7E5DD] flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-[#182B28]">{diff.condition}</span>
                          <span className="text-[10px] font-mono text-[#768784]">[{diff.code}]</span>
                        </div>
                        <p className="text-[11px] text-[#637571]">
                          <strong className="font-medium text-[#364945]">Distinguishing factor:</strong> {diff.differentiationFactor}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        <span className="text-xs font-mono font-bold tabular-nums text-[#3F524E]">
                          {diff.probability}%
                        </span>
                        <div className="w-16 h-2 bg-[#E5E2D9] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#52796F] rounded-full"
                            style={{ width: `${Math.min(100, diff.probability * 2.5)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Kaplan-Meier Survival Chart Container */}
              <div className="p-5 border-b border-[#EAE8E0]">
                <KaplanMeierChart
                  data={prediction.survivalCurve}
                  conditionName={prediction.primaryDiagnosis}
                  medianSurvivalMonths={prediction.medianSurvivalMonths}
                />
              </div>

              {/* Explainable AI SHAP Attribution Container */}
              <div className="p-5 border-b border-[#EAE8E0]">
                <ShapAttributionChart
                  features={prediction.shapFeatures}
                  primaryDiagnosis={prediction.primaryDiagnosis}
                />
              </div>

              {/* Recommended Diagnostic Confirmation Tests */}
              <div className="p-5 border-b border-[#EAE8E0] space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#576965]">
                    Recommended Diagnostic Confirmation Workup
                  </h4>
                  <span className="text-[11px] text-[#6C7E7A] font-mono">Evidence-Based Guidelines</span>
                </div>

                <div className="space-y-2.5 text-xs">
                  {prediction.recommendedTests.map((t, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-[#FAF9F5] rounded-xl border border-[#E7E5DD] flex items-start justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-[#182B28]">{t.testName}</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 bg-white border border-[#D5D3C9] rounded text-[#4B5E5A]">
                            {t.modality}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#556764] mt-1 leading-relaxed">
                          {t.rationale}
                        </p>
                      </div>

                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded whitespace-nowrap shrink-0 ${
                          t.priority.includes('Immediate')
                            ? 'bg-[#FEE2E2] text-[#991B1B] border border-[#FECACA]'
                            : 'bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]'
                        }`}
                      >
                        {t.priority}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Palliative Care & Goals of Care Pathways */}
              <div className="p-5 border-b border-[#EAE8E0] space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#2D6A5F]">
                    Elder Care & Supportive Palliative Pathways
                  </h4>
                  <span className="text-[11px] text-[#6C7E7A]">NCCN / WHO Stage-Aligned</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {prediction.palliativePathways.map((p, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-[#F8FAF9] rounded-xl border border-[#D4E3DE] space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-[#1F3D37]">{p.category}</span>
                        <span className="text-[10px] text-[#3B665E] font-mono">{p.evidenceGrade}</span>
                      </div>
                      <p className="text-[11px] text-[#475C57] leading-relaxed">
                        {p.recommendation}
                      </p>
                      {p.contraindicatedMedications && p.contraindicatedMedications.length > 0 && (
                        <div className="text-[10px] text-[#B91C1C] flex items-center gap-1 font-mono pt-1">
                          <AlertTriangle className="w-3 h-3 shrink-0" />
                          <span>Avoid: {p.contraindicatedMedications.join(', ')}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Clinical AI Multidisciplinary Consultation Note */}
              <div className="p-5 space-y-3 bg-[#FCFCFA]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#2D6A5F]" />
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-[#182C29]">
                      Multidisciplinary Clinical Consult Note
                    </h4>
                  </div>
                  <button
                    onClick={handleGenerateAiConsult}
                    disabled={isGeneratingAi}
                    className="px-3 py-1 text-xs font-medium text-[#1A3330] bg-[#F1F0E8] hover:bg-[#EAE8DE] border border-[#D4D2C6] rounded-md transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3 h-3 ${isGeneratingAi ? 'animate-spin text-[#2D6A5F]' : ''}`} />
                    <span>{isGeneratingAi ? 'Synthesizing Consult...' : 'Synthesize Deep Rationale'}</span>
                  </button>
                </div>

                <div className="p-4 bg-white rounded-xl border border-[#E4E2D8] text-xs text-[#324542] leading-relaxed whitespace-pre-wrap font-sans">
                  {aiRationale}
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>

      {/* Export Modal */}
      <ExportSummaryModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        patient={currentPatient}
        prediction={prediction}
        aiRationaleText={aiRationale}
        clinicianNotes={currentNote}
      />
    </div>
  );
};

import React, { useState } from 'react';
import { X, Copy, Check, Printer, FileText, Download } from 'lucide-react';
import { PatientProfile, PrognosticPredictionResult } from '../types/clinical';

interface ExportSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: PatientProfile;
  prediction: PrognosticPredictionResult;
  aiRationaleText: string;
}

export const ExportSummaryModal: React.FC<ExportSummaryModalProps> = ({
  isOpen,
  onClose,
  patient,
  prediction,
  aiRationaleText
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const fullReportText = `===================================================================
PROGNOSIS FLOW — CLINICAL DECISION SUPPORT & PROGNOSTIC REPORT
Generated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
===================================================================

PATIENT INFORMATION:
Full Name: ${patient.fullName}
MRN: ${patient.mrn}
Age: ${patient.age} | Gender: ${patient.gender}
ECOG Performance Status: ${patient.ecogPerformanceStatus}
Admission Status: ${patient.admissionStatus}
Attending Physician: ${patient.primaryPhysician}

MACHINE LEARNING PROGNOSTIC INFERENCE:
Primary Predicted Condition: ${prediction.primaryDiagnosis}
Diagnostic Confidence: ${prediction.confidenceScore}%
Clinical Staging: ${prediction.staging}
Estimated Median Survival: ${prediction.medianSurvivalMonths} months (Range: ${prediction.survivalRangeMonths[0]} - ${prediction.survivalRangeMonths[1]} months)
Progression Velocity: ${prediction.progressionVelocity}

DIFFERENTIAL DIAGNOSES EVALUATED:
${prediction.differentialDiagnoses.map(d => `• ${d.condition} [${d.code}] — Probability: ${d.probability}% | Differentiating factor: ${d.differentiationFactor}`).join('\n')}

EXPLAINABLE AI / SHAP ATTRIBUTION DRIVERS:
${prediction.shapFeatures.map(f => `• ${f.featureName} (${f.direction === 'increases_risk' ? '+' : '-'}${(Math.abs(f.impactScore) * 100).toFixed(1)}%): ${f.clinicalContext}`).join('\n')}

RECOMMENDED DIAGNOSTIC WORKUP:
${prediction.recommendedTests.map(t => `• [${t.priority}] ${t.testName} (${t.modality}): ${t.rationale}`).join('\n')}

PALLIATIVE & GOALS OF CARE PATHWAYS:
${prediction.palliativePathways.map(p => `• [${p.category} - ${p.evidenceGrade}] ${p.recommendation}${p.contraindicatedMedications ? ` (Contraindications: ${p.contraindicatedMedications.join(', ')})` : ''}`).join('\n')}

CLINICAL SYNTHESIS & RATIONALE:
${aiRationaleText || prediction.clinicalRationale}

MODEL SPECIFICATIONS:
Engine: ${prediction.modelMetadata.modelVersion}
Validation: ROC-AUC ${prediction.modelMetadata.rocAuc} | Brier Score ${prediction.modelMetadata.calibrationBrierScore}
Training Basis: ${prediction.modelMetadata.trainedOnCohortSize}

DISCLAIMER:
Prognosis Flow is a clinical decision support system for authorized healthcare professionals. 
Predictions must be corroborated with full clinical history, tissue biopsy/imaging, and multidisciplinary tumor/palliative board review.
===================================================================`;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullReportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-white rounded-2xl shadow-2xl border border-[#DFDDD4] flex flex-col overflow-hidden">
        
        {/* Modal Top Bar */}
        <div className="px-6 py-4 bg-[#182C29] text-white flex items-center justify-between border-b border-[#24423D]">
          <div className="flex items-center gap-2.5">
            <FileText className="w-5 h-5 text-[#6EE7B7]" />
            <div>
              <h3 className="text-base font-semibold">Clinical Prognosis Report & EHR Summary</h3>
              <p className="text-xs text-[#A8C7C0]">{patient.fullName} · {patient.mrn}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/70 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Scroll Area */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-[#273B38] bg-[#FAFAF8]">
          
          {/* Quick Header Banner */}
          <div className="p-4 bg-white rounded-xl border border-[#E4E2D8] flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs uppercase tracking-wider text-[#637571] block font-semibold">Predicted Terminal Condition</span>
              <span className="text-lg font-serif font-bold text-[#142825]">{prediction.primaryDiagnosis}</span>
              <span className="text-xs text-[#70827E] block mt-0.5">{prediction.staging}</span>
            </div>
            <div className="text-right">
              <span className="text-xs uppercase tracking-wider text-[#637571] block font-semibold">Median Survival</span>
              <span className="text-lg font-mono font-bold text-[#2D6A5F]">{prediction.medianSurvivalMonths} Months</span>
              <span className="text-xs text-[#70827E] block font-mono">Confidence: {prediction.confidenceScore}%</span>
            </div>
          </div>

          {/* Formatted Monospace Output Block */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-[#546562] block mb-2">
              EHR Formatted Clinical Consultation Note
            </label>
            <pre className="p-4 bg-white rounded-xl border border-[#E4E2D8] text-xs font-mono text-[#2B3E3B] whitespace-pre-wrap leading-relaxed max-h-80 overflow-y-auto">
              {fullReportText}
            </pre>
          </div>

          <div className="text-xs text-[#738380] italic">
            Note: This summary can be copied directly into Epic, Cerner, or local palliative EHR documentation templates.
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="px-6 py-4 bg-white border-t border-[#E8E6DF] flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-[#495B57] hover:text-[#182C29] transition-colors"
          >
            Close Window
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 text-xs font-medium text-[#182C29] bg-[#F3F2EC] hover:bg-[#EAE8E0] rounded-lg border border-[#D8D6CC] transition-colors flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>Print Note</span>
            </button>

            <button
              onClick={handleCopy}
              className="px-5 py-2 text-xs font-semibold text-white bg-[#182C29] hover:bg-[#25423E] rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
            >
              {copied ? <Check className="w-4 h-4 text-[#6EE7B7]" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied to Clipboard' : 'Copy Full Summary'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

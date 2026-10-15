export type TerminalConditionId =
  | 'als'
  | 'pancreatic_cancer_st4'
  | 'heart_failure_nyha4'
  | 'cirrhosis_decompensated'
  | 'idiopathic_pulmonary_fibrosis'
  | 'esrd_stage5'
  | 'glioblastoma_multiforme';

export interface PatientVitals {
  bpSystolic: number;
  bpDiastolic: number;
  heartRate: number;
  respRate: number;
  spo2: number;
  temperatureCelsius: number;
  weightLossKg6Mo: number;
}

export interface PatientBiomarkers {
  eGFR: number; // mL/min/1.73m2
  serumCreatinine: number; // mg/dL
  totalBilirubin: number; // mg/dL
  serumAlbumin: number; // g/dL
  troponinI: number; // ng/mL
  ntProBnp: number; // pg/mL
  ca19_9: number; // U/mL
  cea: number; // ng/mL
  fev1Percent: number; // % predicted
  crp: number; // mg/L
  plateletCount: number; // 10^3/uL
  inr: number;
}

export interface ReportedSymptom {
  id: string;
  name: string;
  category: 'neurological' | 'respiratory' | 'cardiovascular' | 'gastrointestinal' | 'constitutional' | 'musculoskeletal';
  severity: number; // 1 to 10
  durationMonths: number;
  notes?: string;
}

export interface PatientProfile {
  id: string;
  mrn: string;
  fullName: string;
  age: number;
  gender: 'Female' | 'Male' | 'Other';
  ecogPerformanceStatus: number; // 0 to 4
  admissionStatus: 'Outpatient Clinic' | 'Inpatient Palliative' | 'Geriatric Consult' | 'ICU Stepdown';
  primaryPhysician: string;
  medicalHistory: string[];
  familyHistory: string[];
  reportedSymptoms: ReportedSymptom[];
  vitals: PatientVitals;
  biomarkers: PatientBiomarkers;
  clinicalNarrative: string;
}

export interface DifferentialDiagnosis {
  condition: string;
  code: string;
  probability: number; // 0 to 100
  differentiationFactor: string;
  clinicalUrgency: 'Immediate (within 48h)' | 'High' | 'Moderate' | 'Low';
}

export interface ShapFeatureImpact {
  featureName: string;
  category: string;
  impactScore: number; // -1.0 to +1.0
  direction: 'increases_risk' | 'decreases_risk';
  clinicalContext: string;
}

export interface SurvivalCurvePoint {
  month: number;
  survivalProbability: number; // 0 to 100
  upperBound: number;
  lowerBound: number;
}

export interface DiagnosticTestRecommendation {
  testName: string;
  modality: 'Imaging' | 'Laboratory' | 'Electrophysiology' | 'Biopsy / Endoscopy' | 'Functional';
  rationale: string;
  priority: 'Immediate (within 48h)' | 'Urgent (1-2 weeks)' | 'Confirmatory';
}

export interface PalliativePathway {
  category: 'Symptom Relief' | 'Care Planning' | 'Nutrition & Comfort' | 'Caregiver Support';
  recommendation: string;
  evidenceGrade: 'Class I (Strong)' | 'Class IIa (Moderate)' | 'Consensus';
  contraindicatedMedications?: string[];
}

export interface PrognosticPredictionResult {
  primaryDiagnosis: string;
  primaryConditionId: TerminalConditionId;
  confidenceScore: number; // e.g. 88.5%
  staging: string;
  medianSurvivalMonths: number;
  survivalRangeMonths: [number, number];
  progressionVelocity: 'Accelerated' | 'Steady-Progressive' | 'Critical / Acute Decompensation';
  differentialDiagnoses: DifferentialDiagnosis[];
  shapFeatures: ShapFeatureImpact[];
  survivalCurve: SurvivalCurvePoint[];
  recommendedTests: DiagnosticTestRecommendation[];
  palliativePathways: PalliativePathway[];
  clinicalRationale: string;
  modelMetadata: {
    modelVersion: string;
    trainedOnCohortSize: string;
    rocAuc: number;
    calibrationBrierScore: number;
  };
}

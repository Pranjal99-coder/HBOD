import { PatientProfile, ReportedSymptom } from '../types/clinical';

export const MOCK_PATIENT_COHORTS: PatientProfile[] = [
  {
    id: 'pt-als-01',
    mrn: 'MRN-8942-01',
    fullName: 'Evelyn Thorne',
    age: 69,
    gender: 'Female',
    ecogPerformanceStatus: 2,
    admissionStatus: 'Geriatric Consult',
    primaryPhysician: 'Dr. Aris Thorne, MD (Neuro-Geriatrics)',
    medicalHistory: ['Hypertension (14 years)', 'Osteopenia', 'Mild Thyroid Hypofunction'],
    familyHistory: ['No known familial motor neuron disease or frontotemporal dementia'],
    reportedSymptoms: [
      { id: 'sym-1', name: 'Progressive right distal hand and arm weakness', category: 'neurological', severity: 8, durationMonths: 6, notes: 'Difficulty buttoning shirts and turning keys' },
      { id: 'sym-2', name: 'Widespread muscle fasciculations (twitches)', category: 'neurological', severity: 7, durationMonths: 5, notes: 'Prominent across arms, shoulders, and tongue' },
      { id: 'sym-3', name: 'Mild dysarthria and slurred speech after fatigue', category: 'neurological', severity: 5, durationMonths: 3, notes: 'Bulbar involvement evolving' },
      { id: 'sym-4', name: 'Involuntary weight loss (7.2 kg in 5 months)', category: 'constitutional', severity: 6, durationMonths: 5 },
      { id: 'sym-5', name: 'Preserved sensory perception with hyperreflexia', category: 'neurological', severity: 6, durationMonths: 6 }
    ],
    vitals: {
      bpSystolic: 128,
      bpDiastolic: 78,
      heartRate: 74,
      respRate: 18,
      spo2: 96,
      temperatureCelsius: 36.7,
      weightLossKg6Mo: 7.2
    },
    biomarkers: {
      eGFR: 78,
      serumCreatinine: 0.8,
      totalBilirubin: 0.6,
      serumAlbumin: 3.9,
      troponinI: 0.01,
      ntProBnp: 110,
      ca19_9: 14,
      cea: 1.8,
      fev1Percent: 68,
      crp: 2.1,
      plateletCount: 220,
      inr: 1.0
    },
    clinicalNarrative: '69-year-old female presents with progressive painless upper limb weakness and visible spontaneous fasciculations. Denies sensory loss or bowel/bladder disturbance. Reflexes brisk in all limbs with positive Hoffman sign.'
  },
  {
    id: 'pt-pancreatic-02',
    mrn: 'MRN-7731-04',
    fullName: 'Arthur Pendelton',
    age: 74,
    gender: 'Male',
    ecogPerformanceStatus: 3,
    admissionStatus: 'Inpatient Palliative',
    primaryPhysician: 'Dr. Eleanor Vance, MD (Surgical Oncology & Palliative Care)',
    medicalHistory: ['Type 2 Diabetes (New onset 8 months ago)', 'Hyperlipidemia', 'Former smoker (35 pack-years, quit 12 yrs ago)'],
    familyHistory: ['Maternal aunt with gastrointestinal malignancy at age 70'],
    reportedSymptoms: [
      { id: 'sym-201', name: 'Painless progressive scleral and cutaneous jaundice', category: 'gastrointestinal', severity: 9, durationMonths: 2, notes: 'Pruritus and dark tea-colored urine' },
      { id: 'sym-202', name: 'Deep epigastric gnawing pain radiating to mid-back', category: 'gastrointestinal', severity: 8, durationMonths: 4, notes: 'Partially relieved by leaning forward' },
      { id: 'sym-203', name: 'Profuse cachexia and anorexia', category: 'constitutional', severity: 9, durationMonths: 4, notes: 'Severe early satiety' },
      { id: 'sym-204', name: 'Unintentional weight loss (12.4 kg in 4 months)', category: 'constitutional', severity: 9, durationMonths: 4 },
      { id: 'sym-205', name: 'Profound fatigue and weakness', category: 'constitutional', severity: 8, durationMonths: 3 }
    ],
    vitals: {
      bpSystolic: 112,
      bpDiastolic: 68,
      heartRate: 88,
      respRate: 20,
      spo2: 95,
      temperatureCelsius: 37.1,
      weightLossKg6Mo: 12.4
    },
    biomarkers: {
      eGFR: 62,
      serumCreatinine: 1.2,
      totalBilirubin: 8.4,
      serumAlbumin: 2.7,
      troponinI: 0.02,
      ntProBnp: 240,
      ca19_9: 940,
      cea: 14.2,
      fev1Percent: 82,
      crp: 38.5,
      plateletCount: 165,
      inr: 1.25
    },
    clinicalNarrative: '74-year-old male with new-onset diabetes and unremitting epigastric back pain presenting with marked icterus. Courvoisier palpable gallbladder noted on physical exam. Liver panel confirms obstructive cholestasis with extreme CA 19-9 elevation.'
  },
  {
    id: 'pt-heartfailure-03',
    mrn: 'MRN-6218-09',
    fullName: 'Marcus Vance',
    age: 71,
    gender: 'Male',
    ecogPerformanceStatus: 3,
    admissionStatus: 'ICU Stepdown',
    primaryPhysician: 'Dr. Julian Sterling, MD (Heart Failure & Transplant)',
    medicalHistory: ['Ischemic Cardiomyopathy (status post CABG 2018)', 'Atrial Fibrillation on Apixaban', 'CKD Stage 3a', 'Type 2 Diabetes'],
    familyHistory: ['Father deceased from sudden cardiac arrest age 64'],
    reportedSymptoms: [
      { id: 'sym-301', name: 'Dyspnea at rest and minimal exertion (dressing/talking)', category: 'cardiovascular', severity: 9, durationMonths: 3, notes: 'NYHA Class IV functional limit' },
      { id: 'sym-302', name: 'Orthopnea requiring 3 pillows / sleeping in recliner', category: 'cardiovascular', severity: 9, durationMonths: 4 },
      { id: 'sym-303', name: 'Bilateral lower extremity edema to mid-thigh', category: 'cardiovascular', severity: 8, durationMonths: 2, notes: '3+ pitting edema, scrotal swelling' },
      { id: 'sym-304', name: 'Cardiac cachexia with persistent nausea and abdominal fullness', category: 'gastrointestinal', severity: 7, durationMonths: 3 },
      { id: 'sym-305', name: 'Refractory fatigue despite optimized guideline-directed medical therapy', category: 'constitutional', severity: 8, durationMonths: 5 }
    ],
    vitals: {
      bpSystolic: 94,
      bpDiastolic: 58,
      heartRate: 92,
      respRate: 24,
      spo2: 91,
      temperatureCelsius: 36.4,
      weightLossKg6Mo: 5.6
    },
    biomarkers: {
      eGFR: 34,
      serumCreatinine: 2.1,
      totalBilirubin: 1.8,
      serumAlbumin: 3.1,
      troponinI: 0.14,
      ntProBnp: 8650,
      ca19_9: 22,
      cea: 2.4,
      fev1Percent: 70,
      crp: 14.8,
      plateletCount: 180,
      inr: 1.4
    },
    clinicalNarrative: '71-year-old male with end-stage ischemic cardiomyopathy presenting with recurrent decompensation despite maximum tolerated neurohormonal blockade. Elevated JVP at 14 cm, S3 gallop, hepatojugular reflux, and cardiorenal syndrome.'
  },
  {
    id: 'pt-cirrhosis-04',
    mrn: 'MRN-5591-12',
    fullName: 'Clara Morales',
    age: 66,
    gender: 'Female',
    ecogPerformanceStatus: 3,
    admissionStatus: 'Outpatient Clinic',
    primaryPhysician: 'Dr. Sofia Chen, MD (Transplant Hepatology & Supportive Care)',
    medicalHistory: ['NASH Cirrhosis', 'Hypertension', 'Refractory Ascites status post recurrent paracentesis'],
    familyHistory: ['Non-contributory'],
    reportedSymptoms: [
      { id: 'sym-401', name: 'Tense abdominal distension and fluid accumulation (ascites)', category: 'gastrointestinal', severity: 9, durationMonths: 5, notes: 'Requiring large volume paracentesis every 10 days' },
      { id: 'sym-402', name: 'Intermittent confusion, day-night reversal, and asterixis', category: 'neurological', severity: 7, durationMonths: 2, notes: 'Grade 2 hepatic encephalopathy' },
      { id: 'sym-403', name: 'Severe sarcopenia and temporal wasting', category: 'constitutional', severity: 8, durationMonths: 6 },
      { id: 'sym-404', name: 'Easy bruising and spontaneous epistaxis', category: 'constitutional', severity: 6, durationMonths: 4 },
      { id: 'sym-405', name: 'Oliguria and declining renal filtration', category: 'gastrointestinal', severity: 7, durationMonths: 1 }
    ],
    vitals: {
      bpSystolic: 102,
      bpDiastolic: 62,
      heartRate: 86,
      respRate: 19,
      spo2: 95,
      temperatureCelsius: 36.8,
      weightLossKg6Mo: 8.5
    },
    biomarkers: {
      eGFR: 28,
      serumCreatinine: 2.3,
      totalBilirubin: 4.8,
      serumAlbumin: 2.2,
      troponinI: 0.02,
      ntProBnp: 310,
      ca19_9: 31,
      cea: 2.1,
      fev1Percent: 78,
      crp: 18.2,
      plateletCount: 68,
      inr: 2.45
    },
    clinicalNarrative: '66-year-old female with decompensated NASH cirrhosis presenting with diuretic-refractory ascites, worsening encephalopathy, and azotemia consistent with hepatorenal physiology. Child-Pugh Class C (score 12), MELD-Na score 31.'
  },
  {
    id: 'pt-ipf-05',
    mrn: 'MRN-4302-08',
    fullName: 'Robert Sterling',
    age: 76,
    gender: 'Male',
    ecogPerformanceStatus: 2,
    admissionStatus: 'Geriatric Consult',
    primaryPhysician: 'Dr. David O’Connor, MD (Pulmonology & Interstitial Lung Care)',
    medicalHistory: ['GERD (Gastroesophageal Reflux Disease)', 'Former metal fabricator (30 years occupational dust)', 'Hypertension'],
    familyHistory: ['Brother died of pulmonary fibrosis at age 72'],
    reportedSymptoms: [
      { id: 'sym-501', name: 'Progressive exertional breathlessness over 14 months', category: 'respiratory', severity: 8, durationMonths: 14, notes: 'Requires 4L nasal cannula at rest, desaturates to 82% on room air' },
      { id: 'sym-502', name: 'Dry, intractable hacking non-productive cough', category: 'respiratory', severity: 8, durationMonths: 12, notes: 'Paroxysms disturbing sleep' },
      { id: 'sym-503', name: 'Marked digital clubbing of fingers and toes', category: 'respiratory', severity: 7, durationMonths: 8 },
      { id: 'sym-504', name: 'Exertional presyncope and right heart strain', category: 'cardiovascular', severity: 6, durationMonths: 3 },
      { id: 'sym-505', name: 'Progressive functional deconditioning and fatigue', category: 'constitutional', severity: 7, durationMonths: 9 }
    ],
    vitals: {
      bpSystolic: 134,
      bpDiastolic: 82,
      heartRate: 88,
      respRate: 26,
      spo2: 89,
      temperatureCelsius: 36.6,
      weightLossKg6Mo: 4.8
    },
    biomarkers: {
      eGFR: 72,
      serumCreatinine: 1.0,
      totalBilirubin: 0.7,
      serumAlbumin: 3.8,
      troponinI: 0.04,
      ntProBnp: 780,
      ca19_9: 18,
      cea: 2.8,
      fev1Percent: 44,
      crp: 9.4,
      plateletCount: 245,
      inr: 1.05
    },
    clinicalNarrative: '76-year-old male with progressive dyspnea and clubbing. Auscultation reveals prominent fine bibasilar end-inspiratory Velcro crackles. High-resolution CT demonstrates UIP pattern with subpleural reticulation, traction bronchiectasis, and extensive honeycombing.'
  }
];

export const AVAILABLE_SYMPTOM_DICTIONARY: Array<{ id: string; name: string; category: ReportedSymptom['category']; description: string }> = [
  { id: 'sym-als-weakness', name: 'Asymmetric limb weakness & drop foot', category: 'neurological', description: 'Progressive painless motor deficit without sensory numbness' },
  { id: 'sym-fasciculations', name: 'Muscle fasciculations & visible cramping', category: 'neurological', description: 'Widespread spontaneous twitches in arms, legs, or tongue' },
  { id: 'sym-dysarthria', name: 'Dysarthria & dysphagia (bulbar signs)', category: 'neurological', description: 'Slurred speech, choking on liquids, or hypernasal voice' },
  { id: 'sym-jaundice', name: 'Painless obstructive jaundice & icterus', category: 'gastrointestinal', description: 'Yellowing of sclera/skin with dark urine and pale stools' },
  { id: 'sym-epigastric-pain', name: 'Gnawing epigastric pain radiating to back', category: 'gastrointestinal', description: 'Severe visceral pain, worse supine, relieved leaning forward' },
  { id: 'sym-cachexia', name: 'Profound cancer / cardiac cachexia', category: 'constitutional', description: 'Severe involuntary muscle and adipose wasting despite intake' },
  { id: 'sym-rest-dyspnea', name: 'Severe dyspnea at rest / orthopnea', category: 'cardiovascular', description: 'Inability to breathe lying flat; requiring 3+ pillows' },
  { id: 'sym-peripheral-edema', name: 'Gross lower extremity & dependent edema', category: 'cardiovascular', description: 'Pitting 3-4+ bilateral edema extending above the knees' },
  { id: 'sym-ascites', name: 'Tense refractory ascites & fluid wave', category: 'gastrointestinal', description: 'Rapid abdominal circumference expansion requiring drainage' },
  { id: 'sym-encephalopathy', name: 'Hepatic encephalopathy & asterixis', category: 'neurological', description: 'Flapping hand tremor, inverted sleep wake cycle, lethargy' },
  { id: 'sym-velcro-crackles', name: 'Fine end-inspiratory Velcro crackles', category: 'respiratory', description: 'High-pitched dry rales at bilateral lung bases' },
  { id: 'sym-dry-cough', name: 'Intractable non-productive cough', category: 'respiratory', description: 'Exhausting persistent dry cough non-responsive to antitussives' },
  { id: 'sym-digital-clubbing', name: 'Severe digital clubbing & cyanosis', category: 'respiratory', description: 'Loss of Lovibond angle in nailbeds due to chronic hypoxemia' },
  { id: 'sym-cognitive-decline', name: 'Rapid progressive cognitive / executive decline', category: 'neurological', description: 'Personality shifts, apraxia, or myoclonic jerking' },
  { id: 'sym-unintentional-weight-loss', name: 'Unintentional weight loss > 10% in 6 mo', category: 'constitutional', description: 'Objective loss of baseline body weight' }
];

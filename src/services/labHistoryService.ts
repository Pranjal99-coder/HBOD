import { PatientProfile } from '../types/clinical';
import { LabHistoryPoint } from '../components/LabSparkline';

const DAYS = ['Day -30', 'Day -21', 'Day -14', 'Day -7', 'Today'];

export function getPatient30DayLabHistory(
  patient: PatientProfile,
  key: keyof PatientProfile['biomarkers']
): LabHistoryPoint[] {
  const currentVal = patient.biomarkers[key];
  const pId = patient.id;

  // Tailored historical trajectories based on patient pathology
  if (pId === 'pt-als-01') {
    if (key === 'fev1Percent') {
      return [
        { dayLabel: DAYS[0], value: 76 },
        { dayLabel: DAYS[1], value: 73 },
        { dayLabel: DAYS[2], value: 70 },
        { dayLabel: DAYS[3], value: 68 },
        { dayLabel: DAYS[4], value: currentVal }
      ];
    }
    if (key === 'serumAlbumin') {
      return [
        { dayLabel: DAYS[0], value: 4.2 },
        { dayLabel: DAYS[1], value: 4.1 },
        { dayLabel: DAYS[2], value: 4.0 },
        { dayLabel: DAYS[3], value: 3.9 },
        { dayLabel: DAYS[4], value: currentVal }
      ];
    }
  } else if (pId === 'pt-pancreatic-02') {
    if (key === 'ca19_9') {
      return [
        { dayLabel: DAYS[0], value: 380 },
        { dayLabel: DAYS[1], value: 520 },
        { dayLabel: DAYS[2], value: 690 },
        { dayLabel: DAYS[3], value: 840 },
        { dayLabel: DAYS[4], value: currentVal }
      ];
    }
    if (key === 'totalBilirubin') {
      return [
        { dayLabel: DAYS[0], value: 2.8 },
        { dayLabel: DAYS[1], value: 4.4 },
        { dayLabel: DAYS[2], value: 6.2 },
        { dayLabel: DAYS[3], value: 7.5 },
        { dayLabel: DAYS[4], value: currentVal }
      ];
    }
    if (key === 'serumAlbumin') {
      return [
        { dayLabel: DAYS[0], value: 3.6 },
        { dayLabel: DAYS[1], value: 3.3 },
        { dayLabel: DAYS[2], value: 3.0 },
        { dayLabel: DAYS[3], value: 2.8 },
        { dayLabel: DAYS[4], value: currentVal }
      ];
    }
    if (key === 'eGFR') {
      return [
        { dayLabel: DAYS[0], value: 76 },
        { dayLabel: DAYS[1], value: 71 },
        { dayLabel: DAYS[2], value: 68 },
        { dayLabel: DAYS[3], value: 64 },
        { dayLabel: DAYS[4], value: currentVal }
      ];
    }
  } else if (pId === 'pt-heartfailure-03') {
    if (key === 'ntProBnp') {
      return [
        { dayLabel: DAYS[0], value: 3400 },
        { dayLabel: DAYS[1], value: 4900 },
        { dayLabel: DAYS[2], value: 6500 },
        { dayLabel: DAYS[3], value: 7800 },
        { dayLabel: DAYS[4], value: currentVal }
      ];
    }
    if (key === 'eGFR') {
      return [
        { dayLabel: DAYS[0], value: 54 },
        { dayLabel: DAYS[1], value: 48 },
        { dayLabel: DAYS[2], value: 42 },
        { dayLabel: DAYS[3], value: 37 },
        { dayLabel: DAYS[4], value: currentVal }
      ];
    }
    if (key === 'serumAlbumin') {
      return [
        { dayLabel: DAYS[0], value: 3.7 },
        { dayLabel: DAYS[1], value: 3.5 },
        { dayLabel: DAYS[2], value: 3.3 },
        { dayLabel: DAYS[3], value: 3.2 },
        { dayLabel: DAYS[4], value: currentVal }
      ];
    }
  } else if (pId === 'pt-cirrhosis-04') {
    if (key === 'totalBilirubin') {
      return [
        { dayLabel: DAYS[0], value: 2.2 },
        { dayLabel: DAYS[1], value: 2.9 },
        { dayLabel: DAYS[2], value: 3.7 },
        { dayLabel: DAYS[3], value: 4.3 },
        { dayLabel: DAYS[4], value: currentVal }
      ];
    }
    if (key === 'eGFR') {
      return [
        { dayLabel: DAYS[0], value: 62 },
        { dayLabel: DAYS[1], value: 51 },
        { dayLabel: DAYS[2], value: 41 },
        { dayLabel: DAYS[3], value: 32 },
        { dayLabel: DAYS[4], value: currentVal }
      ];
    }
    if (key === 'serumAlbumin') {
      return [
        { dayLabel: DAYS[0], value: 3.2 },
        { dayLabel: DAYS[1], value: 2.8 },
        { dayLabel: DAYS[2], value: 2.5 },
        { dayLabel: DAYS[3], value: 2.3 },
        { dayLabel: DAYS[4], value: currentVal }
      ];
    }
  } else if (pId === 'pt-ipf-05') {
    if (key === 'fev1Percent') {
      return [
        { dayLabel: DAYS[0], value: 60 },
        { dayLabel: DAYS[1], value: 55 },
        { dayLabel: DAYS[2], value: 51 },
        { dayLabel: DAYS[3], value: 47 },
        { dayLabel: DAYS[4], value: currentVal }
      ];
    }
    if (key === 'ntProBnp') {
      return [
        { dayLabel: DAYS[0], value: 280 },
        { dayLabel: DAYS[1], value: 410 },
        { dayLabel: DAYS[2], value: 560 },
        { dayLabel: DAYS[3], value: 690 },
        { dayLabel: DAYS[4], value: currentVal }
      ];
    }
  }

  // Generic fallback: stable baseline with slight variation leading to current value
  const step = (currentVal * 0.08);
  return [
    { dayLabel: DAYS[0], value: Number((currentVal * 0.94).toFixed(1)) },
    { dayLabel: DAYS[1], value: Number((currentVal * 0.96).toFixed(1)) },
    { dayLabel: DAYS[2], value: Number((currentVal * 0.97).toFixed(1)) },
    { dayLabel: DAYS[3], value: Number((currentVal * 0.99).toFixed(1)) },
    { dayLabel: DAYS[4], value: currentVal }
  ];
}

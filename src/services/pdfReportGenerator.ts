import { jsPDF } from 'jspdf';
import { PatientProfile, PrognosticPredictionResult } from '../types/clinical';

export function generatePatientPdfReport(
  patient: PatientProfile,
  prediction: PrognosticPredictionResult,
  clinicianNotes?: string,
  aiRationaleText?: string
): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const marginLeft = 15;
  const marginRight = 15;
  const contentWidth = pageWidth - marginLeft - marginRight; // 180mm
  const pageBottomThreshold = pageHeight - 20;

  let currentY = 15;

  const checkPageOverflow = (heightNeeded: number) => {
    if (currentY + heightNeeded > pageBottomThreshold) {
      doc.addPage();
      currentY = 18;
      drawSubHeader();
    }
  };

  const drawSubHeader = () => {
    doc.setFillColor(24, 44, 41);
    doc.rect(marginLeft, currentY, contentWidth, 8, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);
    doc.text(`PROGNOSIS FLOW CLINICAL REPORT — ${patient.fullName.toUpperCase()} (${patient.mrn})`, marginLeft + 4, currentY + 5.5);
    currentY += 12;
  };

  // ================= 1. DOCUMENT HEADER =================
  doc.setFillColor(24, 44, 41); // Deep medical slate #182C29
  doc.roundedRect(marginLeft, currentY, contentWidth, 22, 2, 2, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text('PROGNOSIS FLOW', marginLeft + 6, currentY + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(170, 205, 195);
  doc.text('Clinical Decision Support & Terminal Illness Prognostic Report', marginLeft + 6, currentY + 13);
  doc.text('CONFIDENTIAL MEDICAL RECORD · RESTRICTED TO AUTHORIZED CLINICIANS', marginLeft + 6, currentY + 17.5);

  const dateStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(255, 255, 255);
  doc.text(`Date: ${dateStr}`, pageWidth - marginRight - 6, currentY + 8, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.text(`MRN: ${patient.mrn}`, pageWidth - marginRight - 6, currentY + 13, { align: 'right' });

  currentY += 26;

  // ================= 2. PATIENT INFORMATION CARD =================
  doc.setFillColor(250, 250, 248);
  doc.setDrawColor(220, 218, 210);
  doc.setLineWidth(0.3);
  doc.roundedRect(marginLeft, currentY, contentWidth, 22, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 50, 46);
  doc.text('PATIENT IDENTIFICATION', marginLeft + 4, currentY + 5.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(50, 65, 62);

  const col1X = marginLeft + 4;
  const col2X = marginLeft + 60;
  const col3X = marginLeft + 120;

  doc.text(`Name: ${patient.fullName}`, col1X, currentY + 11);
  doc.text(`Age / Gender: ${patient.age}y / ${patient.gender}`, col1X, currentY + 16);

  doc.text(`ECOG Status: Grade ${patient.ecogPerformanceStatus}`, col2X, currentY + 11);
  doc.text(`Care Setting: ${patient.admissionStatus}`, col2X, currentY + 16);

  doc.text(`Attending: ${patient.primaryPhysician}`, col3X, currentY + 11);
  doc.text(`Model: ${prediction.modelMetadata.modelVersion}`, col3X, currentY + 16);

  currentY += 26;

  // ================= 3. PRIMARY PREDICTED ILLNESS & PROGNOSTIC STAGING =================
  doc.setFillColor(244, 247, 246);
  doc.setDrawColor(45, 106, 95);
  doc.setLineWidth(0.5);
  doc.roundedRect(marginLeft, currentY, contentWidth, 26, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(45, 106, 95);
  doc.text('PRIMARY PREDICTED TERMINAL / CRITICAL CONDITION', marginLeft + 4, currentY + 5.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(20, 38, 35);
  doc.text(prediction.primaryDiagnosis, marginLeft + 4, currentY + 11.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(60, 75, 72);
  doc.text(`Clinical Staging: ${prediction.staging}`, marginLeft + 4, currentY + 16.5);

  // Confidence & Median Survival box
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(200, 215, 210);
  doc.roundedRect(pageWidth - marginRight - 55, currentY + 3.5, 51, 19, 1, 1, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(45, 106, 95);
  doc.text(`${prediction.confidenceScore}% Confidence`, pageWidth - marginRight - 29.5, currentY + 9, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(20, 38, 35);
  doc.text(`Median: ${prediction.medianSurvivalMonths} Mo`, pageWidth - marginRight - 29.5, currentY + 14, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(100, 115, 112);
  doc.text(`CI: [${prediction.survivalRangeMonths[0]}–${prediction.survivalRangeMonths[1]} mo]`, pageWidth - marginRight - 29.5, currentY + 18, { align: 'center' });

  currentY += 30;

  // ================= 4. DIFFERENTIAL DIAGNOSES =================
  checkPageOverflow(26);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 50, 46);
  doc.text('EVALUATED DIFFERENTIAL DIAGNOSES & CLINICAL SEPARATION', marginLeft, currentY);
  currentY += 4;

  prediction.differentialDiagnoses.forEach(diff => {
    checkPageOverflow(7);
    doc.setFillColor(250, 250, 248);
    doc.setDrawColor(230, 228, 222);
    doc.setLineWidth(0.2);
    doc.roundedRect(marginLeft, currentY, contentWidth, 6.5, 1, 1, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(25, 40, 38);
    doc.text(`${diff.condition} [${diff.code}]`, marginLeft + 3, currentY + 4.5);

    doc.setFont('helvetica', 'normal');
    doc.text(`Probability: ${diff.probability}%`, marginLeft + 75, currentY + 4.5);

    doc.setTextColor(80, 95, 92);
    const sepText = doc.splitTextToSize(`Diff: ${diff.differentiationFactor}`, 65);
    doc.text(sepText[0] || '', marginLeft + 110, currentY + 4.5);

    currentY += 8;
  });

  currentY += 2;

  // ================= 5. KEY BIOMARKERS & VITALS SUMMARY =================
  checkPageOverflow(24);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 50, 46);
  doc.text('KEY BIOMARKERS & PHYSIOLOGICAL VITALS', marginLeft, currentY);
  currentY += 4;

  const vitalsText1 = `eGFR: ${patient.biomarkers.eGFR} mL/min · CA 19-9: ${patient.biomarkers.ca19_9} U/mL · Total Bilirubin: ${patient.biomarkers.totalBilirubin} mg/dL · NT-proBNP: ${patient.biomarkers.ntProBnp} pg/mL`;
  const vitalsText2 = `Serum Albumin: ${patient.biomarkers.serumAlbumin} g/dL · FEV1%: ${patient.biomarkers.fev1Percent}% · SpO2: ${patient.vitals.spo2}% · BP: ${patient.vitals.bpSystolic}/${patient.vitals.bpDiastolic} mmHg · 6Mo Wt Loss: -${patient.vitals.weightLossKg6Mo} kg`;

  doc.setFillColor(250, 250, 248);
  doc.setDrawColor(225, 223, 216);
  doc.setLineWidth(0.2);
  doc.roundedRect(marginLeft, currentY, contentWidth, 12, 1, 1, 'FD');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(40, 55, 52);
  doc.text(vitalsText1, marginLeft + 3, currentY + 4.5);
  doc.text(vitalsText2, marginLeft + 3, currentY + 9);

  currentY += 16;

  // ================= 6. EXPLAINABLE AI / SHAP ATTRIBUTION FACTORS =================
  checkPageOverflow(26);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 50, 46);
  doc.text('EXPLAINABLE AI: TOP FEATURE ATTRIBUTIONS (SHAP)', marginLeft, currentY);
  currentY += 4;

  prediction.shapFeatures.forEach(feature => {
    checkPageOverflow(6.5);
    const isRisk = feature.direction === 'increases_risk';
    const sign = isRisk ? '+' : '-';
    const impactVal = (Math.abs(feature.impactScore) * 100).toFixed(1);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    if (isRisk) {
      doc.setTextColor(185, 28, 28); // Dark Red
    } else {
      doc.setTextColor(45, 106, 95); // Deep Teal
    }
    doc.text(`[${sign}${impactVal}%]`, marginLeft + 2, currentY + 3.5);

    doc.setTextColor(30, 45, 42);
    doc.text(`${feature.featureName} (${feature.category}):`, marginLeft + 20, currentY + 3.5);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 95, 92);
    doc.text(feature.clinicalContext, marginLeft + 85, currentY + 3.5);

    currentY += 5.5;
  });

  currentY += 4;

  // ================= 7. RECOMMENDED DIAGNOSTIC WORKUP =================
  checkPageOverflow(26);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 50, 46);
  doc.text('RECOMMENDED CONFIRMATORY DIAGNOSTIC WORKUP', marginLeft, currentY);
  currentY += 4;

  prediction.recommendedTests.forEach(test => {
    checkPageOverflow(9);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(180, 83, 9);
    doc.text(`• [${test.priority}]`, marginLeft + 2, currentY + 3.5);

    doc.setTextColor(30, 45, 42);
    doc.text(`${test.testName} (${test.modality})`, marginLeft + 32, currentY + 3.5);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 95, 92);
    const ratLines = doc.splitTextToSize(test.rationale, contentWidth - 4);
    doc.text(ratLines[0] || '', marginLeft + 6, currentY + 7);

    currentY += 8.5;
  });

  currentY += 4;

  // ================= 8. SUPPORTIVE PALLIATIVE CARE PATHWAYS =================
  checkPageOverflow(26);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(45, 106, 95);
  doc.text('PALLIATIVE & SUPPORTIVE GOALS OF CARE PATHWAYS (NCCN / WHO ALIGNED)', marginLeft, currentY);
  currentY += 4;

  prediction.palliativePathways.forEach(p => {
    checkPageOverflow(11);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(30, 50, 46);
    doc.text(`• [${p.category} · ${p.evidenceGrade}]`, marginLeft + 2, currentY + 3.5);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(50, 65, 62);
    const recLines = doc.splitTextToSize(p.recommendation, contentWidth - 6);
    doc.text(recLines[0] || '', marginLeft + 6, currentY + 7.5);

    let step = 9;
    if (recLines.length > 1) {
      doc.text(recLines[1], marginLeft + 6, currentY + 11);
      step = 13;
    }

    if (p.contraindicatedMedications && p.contraindicatedMedications.length > 0) {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(185, 28, 28);
      doc.text(`Contraindicated: ${p.contraindicatedMedications.join(', ')}`, marginLeft + 6, currentY + step);
      step += 4.5;
    }

    currentY += step;
  });

  currentY += 4;

  // ================= 9. ATTENDING CLINICIAN SESSION NOTES (IF LOGGED) =================
  if (clinicianNotes && clinicianNotes.trim()) {
    checkPageOverflow(28);
    doc.setFillColor(255, 253, 245);
    doc.setDrawColor(217, 119, 6);
    doc.setLineWidth(0.4);

    const noteLines = doc.splitTextToSize(clinicianNotes.trim(), contentWidth - 8);
    const noteBoxHeight = Math.min(45, Math.max(16, noteLines.length * 4.2 + 8));

    doc.roundedRect(marginLeft, currentY, contentWidth, noteBoxHeight, 1.5, 1.5, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(180, 83, 9);
    doc.text('ATTENDING CLINICIAN SESSION NOTES & BEDSIDE OBSERVATIONS (LOCAL SCRATCHPAD)', marginLeft + 4, currentY + 5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(40, 50, 48);
    doc.text(noteLines.slice(0, 8), marginLeft + 4, currentY + 9.5);

    currentY += noteBoxHeight + 6;
  }

  // ================= 10. MULTIDISCIPLINARY CLINICAL RATIONALE =================
  const rationaleSource = (aiRationaleText || prediction.clinicalRationale).trim();
  if (rationaleSource) {
    checkPageOverflow(26);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(30, 50, 46);
    doc.text('MULTIDISCIPLINARY CLINICAL RATIONALE & CONSENSUS', marginLeft, currentY);
    currentY += 4;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(50, 65, 62);
    const ratLines = doc.splitTextToSize(rationaleSource, contentWidth);
    
    // Print up to 10 lines
    const linesToPrint = ratLines.slice(0, 10);
    doc.text(linesToPrint, marginLeft, currentY + 3.5);
    currentY += linesToPrint.length * 3.8 + 4;
  }

  // ================= 11. FOOTER & COMPLIANCE (EVERY PAGE) =================
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);

    doc.setDrawColor(220, 218, 210);
    doc.setLineWidth(0.2);
    doc.line(marginLeft, pageHeight - 12, pageWidth - marginRight, pageHeight - 12);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(130, 145, 142);
    doc.text(
      `Prognosis Flow CDS · AUROC ${prediction.modelMetadata.rocAuc} · Brier ${prediction.modelMetadata.calibrationBrierScore} · For licensed medical practitioner guidance only`,
      marginLeft,
      pageHeight - 8
    );

    doc.text(`Page ${i} of ${totalPages}`, pageWidth - marginRight, pageHeight - 8, { align: 'right' });
  }

  // Save the PDF file
  const sanitizedName = patient.fullName.replace(/[^a-zA-Z0-9]/g, '_');
  doc.save(`${sanitizedName}_${patient.mrn}_Prognosis_Report.pdf`);
}

import { jsPDF } from "jspdf";
import { AssessmentData, getBPStatus, getSugarStatus } from "./assessment-context";

interface PDFData {
  data: AssessmentData;
  bmi: number | null;
  bmiCategory: { label: string; color: string } | null;
  cbacScore: number;
  keyAdvice: string[];
  dietTips: string[];
  sugarTips: string[];
  activityTips: string[];
}

export function generateHealthPDF({
  data,
  bmi,
  bmiCategory,
  cbacScore,
  keyAdvice,
  dietTips,
  sugarTips,
  activityTips,
}: PDFData) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = 20;

  const bpStatus = getBPStatus(data.systolic, data.diastolic);
  const sugarStatus = getSugarStatus(data.sugarType, data.sugarValue);

  // Colors
  const emerald = [5, 150, 105]; // emerald-600
  const slate900 = [15, 23, 42];
  const slate600 = [71, 85, 105];
  const slate400 = [148, 163, 184];

  // Helper functions
  const addHeader = () => {
    // Green header bar
    doc.setFillColor(emerald[0], emerald[1], emerald[2]);
    doc.rect(0, 0, pageWidth, 35, "F");

    // Logo circle
    doc.setFillColor(255, 255, 255);
    doc.circle(margin + 8, 17.5, 8, "F");
    doc.setFillColor(emerald[0], emerald[1], emerald[2]);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(emerald[0], emerald[1], emerald[2]);
    doc.text("♥", margin + 5.5, 20);

    // Title
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Healthy Life Campaign", margin + 22, 15);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Health Risk Assessment Summary", margin + 22, 23);

    // Date
    const date = new Date().toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    doc.setFontSize(9);
    doc.text(date, pageWidth - margin - doc.getTextWidth(date), 23);

    y = 45;
  };

  const addSectionTitle = (title: string, icon?: string) => {
    if (y > 250) {
      doc.addPage();
      y = 20;
    }
    doc.setFillColor(241, 245, 249); // slate-100
    doc.roundedRect(margin, y, contentWidth, 10, 2, 2, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(slate900[0], slate900[1], slate900[2]);
    doc.text(`${icon ? icon + "  " : ""}${title}`, margin + 4, y + 7);
    y += 16;
  };

  const addMetricRow = (
    label: string,
    value: string,
    status: string,
    statusColor: string
  ) => {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }

    // Label
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(slate600[0], slate600[1], slate600[2]);
    doc.text(label, margin + 4, y);

    // Value
    doc.setFont("helvetica", "bold");
    doc.setTextColor(slate900[0], slate900[1], slate900[2]);
    doc.text(value, margin + 70, y);

    // Status badge
    const badgeX = pageWidth - margin - 35;
    let badgeColor: number[];
    let textColor: number[];
    
    switch (statusColor) {
      case "emerald":
        badgeColor = [209, 250, 229]; // emerald-100
        textColor = [6, 95, 70]; // emerald-800
        break;
      case "amber":
        badgeColor = [254, 243, 199]; // amber-100
        textColor = [146, 64, 14]; // amber-800
        break;
      case "rose":
        badgeColor = [255, 228, 230]; // rose-100
        textColor = [159, 18, 57]; // rose-800
        break;
      default:
        badgeColor = [241, 245, 249]; // slate-100
        textColor = [71, 85, 105]; // slate-600
    }

    doc.setFillColor(badgeColor[0], badgeColor[1], badgeColor[2]);
    doc.roundedRect(badgeX, y - 5, 32, 8, 2, 2, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    const statusWidth = doc.getTextWidth(status);
    doc.text(status, badgeX + 16 - statusWidth / 2, y);

    y += 12;
  };

  const addBulletList = (items: string[], checkmark = true) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(slate600[0], slate600[1], slate600[2]);
    
    items.forEach((item) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      const bullet = checkmark ? "✓  " : "•  ";
      const lines = doc.splitTextToSize(bullet + item, contentWidth - 8);
      doc.text(lines, margin + 4, y);
      y += lines.length * 5 + 2;
    });
  };

  // Generate PDF content
  addHeader();

  // Measurements Section
  addSectionTitle("Your Measurements", "📊");
  
  if (bmi && bmiCategory) {
    addMetricRow("Body Mass Index (BMI)", bmi.toString(), bmiCategory.label, bmiCategory.color);
  }
  
  if (data.bpEntered) {
    addMetricRow(
      "Blood Pressure",
      `${data.systolic}/${data.diastolic} mmHg`,
      bpStatus.label,
      bpStatus.color
    );
  } else {
    addMetricRow("Blood Pressure", "Not entered", "N/A", "slate");
  }

  if (data.sugarEntered) {
    const unit = data.sugarType === "hba1c" ? "%" : "mg/dL";
    addMetricRow(
      `Blood Sugar (${data.sugarType?.toUpperCase()})`,
      `${data.sugarValue} ${unit}`,
      sugarStatus.label,
      sugarStatus.color
    );
  } else {
    addMetricRow("Blood Sugar", "Not entered", "N/A", "slate");
  }

  y += 8;

  // Risk Scores Section
  addSectionTitle("Risk Assessment", "📋");
  
  const cbacRisk = cbacScore > 4 ? "Higher risk" : "Lower risk";
  const cbacColor = cbacScore > 4 ? "amber" : "emerald";
  addMetricRow("CBAC Score", cbacScore.toString(), cbacRisk, cbacColor);

  y += 8;

  // Key Advice Section
  if (keyAdvice.length > 0) {
    addSectionTitle("Key Recommendations", "💡");
    addBulletList(keyAdvice);
    y += 4;
  }

  // Diet Section
  if (dietTips.length > 0 || sugarTips.length > 0) {
    addSectionTitle("Diet Guidance", "🥗");
    if (dietTips.length > 0) {
      addBulletList(dietTips);
    }
    if (sugarTips.length > 0) {
      y += 2;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(slate600[0], slate600[1], slate600[2]);
      doc.text("For blood sugar management:", margin + 4, y);
      y += 6;
      addBulletList(sugarTips);
    }
    y += 4;
  }

  // Activity Section
  if (activityTips.length > 0) {
    addSectionTitle("Activity Guidance", "🏃");
    addBulletList(activityTips);
    y += 4;
  }

  // Disclaimer Section
  y += 4;
  doc.setFillColor(254, 243, 199); // amber-100
  doc.roundedRect(margin, y, contentWidth, 28, 3, 3, "F");
  doc.setDrawColor(251, 191, 36); // amber-400
  doc.roundedRect(margin, y, contentWidth, 28, 3, 3, "S");
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(146, 64, 14); // amber-800
  doc.text("⚠  Important Disclaimer", margin + 4, y + 7);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(120, 53, 15); // amber-900
  const disclaimer = "This tool provides general health risk information and is NOT a medical diagnosis. It does NOT provide treatment advice. If you have symptoms or concerns, please consult a doctor or visit your nearest health facility for proper evaluation.";
  const disclaimerLines = doc.splitTextToSize(disclaimer, contentWidth - 8);
  doc.text(disclaimerLines, margin + 4, y + 14);

  y += 36;

  // Privacy note
  doc.setFillColor(209, 250, 229); // emerald-100
  doc.roundedRect(margin, y, contentWidth, 16, 3, 3, "F");
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(6, 95, 70); // emerald-800
  doc.text("🔒  Privacy", margin + 4, y + 6);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.text(
    "No personal identifiers were collected. All calculations were performed on your device.",
    margin + 4,
    y + 12
  );

  // Footer
  const footerY = doc.internal.pageSize.getHeight() - 15;
  doc.setDrawColor(slate400[0], slate400[1], slate400[2]);
  doc.line(margin, footerY - 5, pageWidth - margin, footerY - 5);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(slate400[0], slate400[1], slate400[2]);
  doc.text(
    `© ${new Date().getFullYear()} Healthy Life Campaign`,
    margin,
    footerY
  );
  doc.text(
    "www.healthylife.campaign",
    pageWidth - margin - doc.getTextWidth("www.healthylife.campaign"),
    footerY
  );

  // Save PDF
  const filename = `health-assessment-${new Date().toISOString().split("T")[0]}.pdf`;
  doc.save(filename);
  
  return filename;
}




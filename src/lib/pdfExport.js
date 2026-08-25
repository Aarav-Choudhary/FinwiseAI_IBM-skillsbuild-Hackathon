/**
 * pdfExport.js — jsPDF + html2canvas export utilities
 */
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

/**
 * Export a DOM element to PDF
 * @param {string} elementId - ID of the DOM element to capture
 * @param {string} filename  - Output filename without extension
 * @param {object} options   - { title, studentName, subtitle }
 */
export async function exportToPDF(elementId, filename = "finwise-report", options = {}) {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error("Element not found:", elementId);
    return;
  }

  const canvas = await html2canvas(element, {
    backgroundColor: "#0B0B0D",
    scale: 2,
    useCORS: true,
    logging: false,
  });

  const imgData = canvas.toDataURL("image/png");
  const pdf     = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pdfW    = pdf.internal.pageSize.getWidth();
  const pdfH    = pdf.internal.pageSize.getHeight();

  // ─── Header ─────────────────────────────────────────────────
  pdf.setFillColor(11, 11, 13);
  pdf.rect(0, 0, pdfW, pdfH, "F");

  pdf.setFontSize(20);
  pdf.setTextColor(108, 99, 255);
  pdf.setFont("helvetica", "bold");
  pdf.text("FinWise AI", 14, 14);

  if (options.title) {
    pdf.setFontSize(12);
    pdf.setTextColor(236, 231, 221);
    pdf.setFont("helvetica", "normal");
    pdf.text(options.title, 14, 22);
  }

  if (options.studentName) {
    pdf.setFontSize(10);
    pdf.setTextColor(155, 150, 140);
    pdf.text(`Student: ${options.studentName}`, 14, 29);
  }

  const dateStr = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  pdf.setFontSize(9);
  pdf.setTextColor(155, 150, 140);
  pdf.text(`Generated: ${dateStr}`, pdfW - 14, 14, { align: "right" });

  // ─── Divider ─────────────────────────────────────────────────
  pdf.setDrawColor(42, 42, 46);
  pdf.line(14, 33, pdfW - 14, 33);

  // ─── Content ─────────────────────────────────────────────────
  const imgRatio  = canvas.width / canvas.height;
  const imgWidth  = pdfW - 28;
  const imgHeight = imgWidth / imgRatio;
  const startY    = 37;
  const maxH      = pdfH - startY - 12;

  if (imgHeight <= maxH) {
    pdf.addImage(imgData, "PNG", 14, startY, imgWidth, imgHeight);
  } else {
    // Multi-page
    let remaining = imgHeight;
    let pageY     = startY;
    let srcY      = 0;

    while (remaining > 0) {
      const sliceH = Math.min(maxH, remaining);
      pdf.addImage(imgData, "PNG", 14, pageY, imgWidth, imgHeight, "", "FAST", 0, srcY / imgHeight);
      remaining -= sliceH;
      srcY      += (sliceH / imgHeight) * canvas.height;
      if (remaining > 0) {
        pdf.addPage();
        pdf.setFillColor(11, 11, 13);
        pdf.rect(0, 0, pdfW, pdfH, "F");
        pageY = 14;
      }
    }
  }

  // ─── Footer ──────────────────────────────────────────────────
  pdf.setFontSize(8);
  pdf.setTextColor(155, 150, 140);
  pdf.text("Powered by IBM watsonx.ai · FinWise AI", pdfW / 2, pdfH - 8, { align: "center" });

  pdf.save(`${filename}.pdf`);
}

/** Quick summary PDF without capturing a DOM element */
export function exportSummaryPDF(data, filename = "finwise-summary") {
  const pdf  = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pdfW = pdf.internal.pageSize.getWidth();
  let y = 14;

  pdf.setFillColor(11, 11, 13);
  pdf.rect(0, 0, pdfW, pdf.internal.pageSize.getHeight(), "F");

  pdf.setFontSize(22);
  pdf.setTextColor(108, 99, 255);
  pdf.setFont("helvetica", "bold");
  pdf.text("FinWise AI Report", 14, y);
  y += 10;

  pdf.setFontSize(10);
  pdf.setTextColor(155, 150, 140);
  pdf.text(`Generated ${new Date().toLocaleDateString()}`, 14, y);
  y += 8;

  pdf.setDrawColor(42, 42, 46);
  pdf.line(14, y, pdfW - 14, y);
  y += 8;

  for (const [section, items] of Object.entries(data)) {
    pdf.setFontSize(13);
    pdf.setTextColor(0, 217, 163);
    pdf.setFont("helvetica", "bold");
    pdf.text(section, 14, y);
    y += 7;

    for (const [key, value] of Object.entries(items)) {
      pdf.setFontSize(10);
      pdf.setTextColor(236, 231, 221);
      pdf.setFont("helvetica", "normal");
      pdf.text(`${key}:`, 18, y);
      pdf.setTextColor(212, 175, 55);
      pdf.text(String(value), 80, y);
      y += 6;
    }
    y += 4;
  }

  pdf.setFontSize(8);
  pdf.setTextColor(155, 150, 140);
  pdf.text("Powered by IBM watsonx.ai · FinWise AI", pdfW / 2, pdf.internal.pageSize.getHeight() - 8, { align: "center" });

  pdf.save(`${filename}.pdf`);
}

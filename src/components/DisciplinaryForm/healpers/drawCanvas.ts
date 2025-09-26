import { VIOLATIONS, WARNING_TYPES } from "@/constants/writeup.constants";
import { wrapText } from "./wrapText";

export const drawCanvas = async (
  printCanvasRef: React.RefObject<HTMLCanvasElement>,
  formData: any,
  letterheadImgSrc: string
) => {
  try {
    const canvas = printCanvasRef.current;
    if (!canvas) throw new Error("Canvas ref is not initialized");

    // --- Setup canvas DPI ---
    const dpi = 300;
    const widthInches = 210 / 25.4; // A4 width in inches
    const heightInches = 297 / 25.4; // A4 height in inches
    canvas.width = Math.round(widthInches * dpi);
    canvas.height = Math.round(heightInches * dpi);

    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Failed to get canvas context");

    const scale = dpi / 96;
    ctx.scale(scale, scale);

    // --- Load Letterhead ---
    const letterheadImg = new Image();
    letterheadImg.src = letterheadImgSrc;
    letterheadImg.crossOrigin = "Anonymous";
    await new Promise((resolve, reject) => {
      letterheadImg.onload = resolve;
      letterheadImg.onerror = reject;
    });
    ctx.drawImage(letterheadImg, 0, 0, 210 * (96 / 25.4), 297 * (96 / 25.4));

    // --- Table Layout ---
    const tableX = 100;
    const tableWidth = 650;
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1.2;
    const outerTableY = 180;

    const rowHeights = {
      heading: 30,
      header: 25,
      warning: 25,
      violation: 20,
      employee: [25, 50, 50],
      signature: [25, 50, 50],
    };

    const outerTableHeight =
      rowHeights.heading +
      2 * rowHeights.header +
      rowHeights.warning +
      (VIOLATIONS.length + 1) * rowHeights.violation +
      rowHeights.employee.reduce((a, b) => a + b, 0) +
      rowHeights.signature.reduce((a, b) => a + b, 0);

    ctx.strokeRect(tableX, outerTableY, tableWidth, outerTableHeight);

    // helper to draw row lines
    const drawRowLine = (y: number, startX = tableX, endX = tableX + tableWidth) => {
      ctx.beginPath();
      ctx.moveTo(startX, y);
      ctx.lineTo(endX, y);
      ctx.stroke();
    };

    // --- Section Positions ---
    let currentY = outerTableY;

    // Heading
    currentY += rowHeights.heading;
    drawRowLine(currentY);

    // Employee Header
    for (let i = 0; i < 2; i++) {
      currentY += rowHeights.header;
      drawRowLine(currentY);
    }

    // Warning
    currentY += rowHeights.warning;
    drawRowLine(currentY);

    const companySectionStartY = currentY;
    currentY += rowHeights.violation;
    drawRowLine(currentY);

    ctx.font = "14px Cambria";
    const maxViolationWidth =
      Math.max(...VIOLATIONS.map((v) => ctx.measureText(v).width)) - 22;
    const companyStatementWidth = tableWidth - maxViolationWidth;

    for (let i = 0; i < VIOLATIONS.length; i++) {
      currentY += rowHeights.violation;
      drawRowLine(
        currentY,
        i === VIOLATIONS.length - 1 ? tableX : tableX + companyStatementWidth
      );
    }

    rowHeights.employee.forEach((h) => {
      currentY += h;
      drawRowLine(currentY);
    });
    rowHeights.signature.slice(0, -1).forEach((h) => {
      currentY += h;
      drawRowLine(currentY);
    });

    // --- Column Layout ---
    const headerColWidth = tableWidth / 2;
    const warningWidths = WARNING_TYPES.map((t) => ctx.measureText(t).width + 30);
    const totalWarningWidth = warningWidths.reduce((a, b) => a + b, 0);
    const warningScaleFactor = tableWidth / totalWarningWidth;
    const warningColWidths = warningWidths.map((w) => w * warningScaleFactor);
    const signatureColWidth = tableWidth / 2;

    // Draw column lines
    ctx.beginPath();
    ctx.moveTo(tableX + headerColWidth, outerTableY + rowHeights.heading);
    ctx.lineTo(tableX + headerColWidth, outerTableY + rowHeights.heading + 2 * rowHeights.header);
    ctx.stroke();

    let warningX = tableX;
    for (let i = 0; i < warningColWidths.length - 1; i++) {
      warningX += warningColWidths[i];
      ctx.beginPath();
      ctx.moveTo(warningX, outerTableY + rowHeights.heading + 2 * rowHeights.header);
      ctx.lineTo(warningX, outerTableY + rowHeights.heading + 2 * rowHeights.header + rowHeights.warning);
      ctx.stroke();
    }

    ctx.beginPath();
    ctx.moveTo(tableX + companyStatementWidth, companySectionStartY);
    ctx.lineTo(
      tableX + companyStatementWidth,
      companySectionStartY + (VIOLATIONS.length + 1) * rowHeights.violation
    );
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(tableX + signatureColWidth, outerTableY + outerTableHeight - 2 * rowHeights.signature[1]);
    ctx.lineTo(tableX + signatureColWidth, outerTableY + outerTableHeight);
    ctx.stroke();

    // --- Fill Content ---
    let contentY = outerTableY;

    // Title
    ctx.fillStyle = "#2E1A47";
    ctx.font = "bold 20px Cambria";
    ctx.textAlign = "center";
    ctx.fillText("Notice of Disciplinary Action", tableX + tableWidth / 2, contentY + 20);
    contentY += rowHeights.heading;

    // Employee Info
    ctx.font = "14px Cambria";
    ctx.textAlign = "left";
    const headerPadding = 10;
    wrapText(ctx, `EMPLOYEE NAME: ${formData.employeeName || ""}`, tableX + headerPadding, contentY + 15, headerColWidth - 20, 15);
    wrapText(ctx, `SUPERVISOR NAME: ${formData.supervisorName || ""}`, tableX + headerPadding, contentY + 40, headerColWidth - 20, 15);
    wrapText(ctx, `DATE: ${formData.date || ""}`, tableX + headerColWidth + headerPadding, contentY + 15, headerColWidth - 20, 15);
    wrapText(ctx, `LOCATION: ${formData.location || ""}`, tableX + headerColWidth + headerPadding, contentY + 40, headerColWidth - 20, 15);
    contentY += 2 * rowHeights.header;

    // Warning Types
    let warningXOffset = tableX + 25;
    WARNING_TYPES.forEach((type, idx) => {
      const isChecked = formData.warningType.includes(type) ? "✔" : "";
      wrapText(ctx, `${isChecked} ${type}`, warningXOffset, contentY + 20, warningColWidths[idx] - 10, 15);
      warningXOffset += warningColWidths[idx];
    });
    contentY += rowHeights.warning;

    // Company Statement
    ctx.font = "bold 14px Cambria";
    ctx.textAlign = "center";
    ctx.fillText("COMPANY STATEMENT", tableX + companyStatementWidth / 2, contentY + 15);
    ctx.fillText("Nature of Violation", tableX + companyStatementWidth + maxViolationWidth / 2, contentY + 15);
    contentY += rowHeights.violation;

    ctx.font = "12px Cambria";
    ctx.textAlign = "left";
    wrapText(ctx, formData.companyStatement || "", tableX + 10, contentY + 15, companyStatementWidth - 20, 15);

    VIOLATIONS.forEach((violation) => {
      const isChecked = formData.violation.includes(violation) ? "✔" : "";
      let displayText = `${isChecked} ${violation}`;
      if (violation === "Others (If Any):" && formData.otherViolationText) {
        displayText += ` ${formData.otherViolationText}`;
      }
      wrapText(ctx, displayText, tableX + companyStatementWidth + 10, contentY + 15, maxViolationWidth - 20, 15);
      contentY += rowHeights.violation;
    });

    // Employee Statement
    ctx.font = "bold 14px Cambria";
    ctx.textAlign = "center";
    ctx.fillText("EMPLOYEE STATEMENT", tableX + tableWidth / 2, contentY + 18);
    contentY += rowHeights.employee[0];

    ctx.font = "12px Cambria";
    ctx.textAlign = "left";
    const employeeStatement =
      "I Acknowledge receipt of this disciplinary notice and understand its contents...";
    wrapText(ctx, employeeStatement, tableX + 10, contentY + 15, tableWidth - 20, 15);
    contentY += rowHeights.employee[1];

    wrapText(ctx, `I DISAGREE: ${formData.disagree || ""}`, tableX + 10, contentY + 15, tableWidth - 20, 15);
    contentY += rowHeights.employee[2];

    // Signatures
    ctx.font = "bold 14px Cambria";
    ctx.textAlign = "center";
    ctx.fillText("SIGNATURE", tableX + tableWidth / 2, contentY + 17);
    contentY += rowHeights.signature[0];

    ctx.font = "14px Cambria";
    ctx.fillText("EMPLOYEE SIGNATURE:", tableX + signatureColWidth / 4, contentY + 20);
    ctx.fillText("SUPERVISOR SIGNATURE:", tableX + signatureColWidth + signatureColWidth / 4 + 10, contentY + 20);
    contentY += rowHeights.signature[1];

    ctx.fillText("DATE:", tableX + signatureColWidth / 10, contentY + 15);
    ctx.fillText("DATE:", tableX + signatureColWidth + signatureColWidth / 10, contentY + 15);

    // // --- Print Window ---
    // const printWindow = window.open("", "_blank");
    // if (!printWindow) {
    //   alert("Please allow pop-ups for printing.");
    //   return;
    // }

    // const imgData = canvas.toDataURL("image/png");
    // printWindow.document.write(`
    //   <!DOCTYPE html>
    //   <html>
    //     <head>
    //       <title>Print Document</title>
    //       <style> body { margin: 0; } img { width: 210mm; height: 297mm; } </style>
    //     </head>
    //     <body>
    //       <img src="${imgData}" onload="window.print(); window.close();" />
    //     </body>
    //   </html>
    // `);
    // printWindow.document.close();
  } catch (err) {
    console.error("Error during print:", err);
    alert("An error occurred while preparing the document for printing.");
  }
};

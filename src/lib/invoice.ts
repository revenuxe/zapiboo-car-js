import { jsPDF } from "jspdf";
import logoAsset from "@/assets/hulumart-logo.webp.asset.json";
import { formatPrice } from "@/lib/device-buyback";

export type BookingInvoiceData = {
  reference: string;
  createdAt: Date;
  customer: {
    name: string;
    phone: string;
    email?: string | null;
    address?: string | null;
    pincode?: string | null;
  };
  device: {
    category?: string | null;
    brand?: string | null;
    series?: string | null;
    model: string;
  };
  finalPrice: number;
  preferredDate?: string | null;
  slot?: string | null;
  notes?: string | null;
};

// Brand palette (approximate RGB of the oklch design tokens).
const NAVY: [number, number, number] = [15, 33, 49];
const GREEN: [number, number, number] = [16, 185, 129];
const MUTED: [number, number, number] = [110, 122, 133];
const LINE: [number, number, number] = [223, 228, 232];

/**
 * Doorstep evaluation terms shown on every buyback invoice. These mirror the
 * /terms "Used laptop & device buyback" policy so the customer keeps a copy.
 */
const EVALUATION_TERMS = [
  "This quote is an indicative offer based on the condition details you provided and is valid for 7 days from the date above.",
  "The final price is confirmed only after a free doorstep physical evaluation of the device by our trained executive.",
  "If the device condition matches your answers, you are paid the quoted amount instantly via UPI or bank transfer.",
  "If the actual condition differs (extra damage, faults, missing parts, locks/MDM, etc.), a revised price is offered. You are free to decline with no obligation.",
  "Please keep the device, original charger and any available bill/box ready. Carry a valid government photo ID for KYC.",
  "Before handover, remove all accounts and locks (e.g. Apple/Google/Windows account, Find My, anti-theft) and back up your data. We are not responsible for any data left on the device.",
  "Devices reported lost/stolen or with unremovable activation locks cannot be purchased.",
  "Ownership transfers to HuluMart only after payment is completed and you hand over the device.",
];

async function loadLogoPng(): Promise<{ dataUrl: string; w: number; h: number } | null> {
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const i = new Image();
      i.crossOrigin = "anonymous";
      i.onload = () => resolve(i);
      i.onerror = () => reject(new Error("logo load failed"));
      i.src = logoAsset.url;
    });
    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth || img.width;
    canvas.height = img.naturalHeight || img.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.drawImage(img, 0, 0);
    return { dataUrl: canvas.toDataURL("image/png"), w: canvas.width, h: canvas.height };
  } catch {
    return null;
  }
}

function formatDate(d: Date): string {
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export async function downloadBookingInvoice(data: BookingInvoiceData): Promise<void> {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 48;
  const contentW = pageW - margin * 2;

  // ---- Header band ----
  doc.setFillColor(...NAVY);
  doc.rect(0, 0, pageW, 110, "F");

  const logo = await loadLogoPng();
  if (logo) {
    const targetH = 34;
    const targetW = (logo.w / logo.h) * targetH;
    doc.addImage(logo.dataUrl, "PNG", margin, 30, targetW, targetH);
  } else {
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("HuluMart", margin, 56);
  }

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("Buyback Booking Invoice", pageW - margin, 48, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(180, 190, 198);
  doc.text("Powering Global Scrap Commerce", pageW - margin, 64, { align: "right" });
  doc.text(`Ref: ${data.reference}`, pageW - margin, 84, { align: "right" });
  doc.text(`Date: ${formatDate(data.createdAt)}`, pageW - margin, 98, { align: "right" });

  let y = 150;

  // ---- Quote highlight ----
  doc.setFillColor(240, 250, 246);
  doc.roundedRect(margin, y, contentW, 70, 10, 10, "F");
  doc.setTextColor(...MUTED);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("CONFIRMED QUOTE", margin + 18, y + 26);
  doc.setTextColor(...GREEN);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(28);
  doc.text(formatPrice(data.finalPrice), margin + 18, y + 54);
  doc.setTextColor(...MUTED);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("Payable instantly after doorstep evaluation", pageW - margin - 18, y + 50, { align: "right" });
  y += 100;

  // ---- Two columns: device + customer ----
  const colGap = 24;
  const colW = (contentW - colGap) / 2;

  const section = (x: number, title: string, rows: [string, string][]) => {
    let yy = y;
    doc.setTextColor(...NAVY);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(title, x, yy);
    yy += 8;
    doc.setDrawColor(...LINE);
    doc.line(x, yy, x + colW, yy);
    yy += 18;
    doc.setFontSize(9.5);
    for (const [label, value] of rows) {
      doc.setTextColor(...MUTED);
      doc.setFont("helvetica", "normal");
      doc.text(label, x, yy);
      doc.setTextColor(40, 48, 56);
      doc.setFont("helvetica", "bold");
      const lines = doc.splitTextToSize(value || "—", colW);
      doc.text(lines, x, yy + 13);
      yy += 13 + lines.length * 12 + 6;
    }
    return yy;
  };

  const deviceRows: [string, string][] = [
    ["Device", [data.device.brand, data.device.series, data.device.model].filter(Boolean).join(" ")],
    ["Category", data.device.category || "Laptop"],
    ["Preferred pickup", [data.preferredDate, data.slot].filter(Boolean).join(" · ") || "To be confirmed"],
  ];
  const customerRows: [string, string][] = [
    ["Name", data.customer.name],
    ["Phone", data.customer.phone],
    ["Email", data.customer.email || "—"],
    ["Pickup address", [data.customer.address, data.customer.pincode].filter(Boolean).join(", ") || "—"],
  ];

  const leftEnd = section(margin, "Device details", deviceRows);
  const rightEnd = section(margin + colW + colGap, "Customer details", customerRows);
  y = Math.max(leftEnd, rightEnd) + 14;

  if (data.notes) {
    doc.setTextColor(...MUTED);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    const noteLines = doc.splitTextToSize(`Notes: ${data.notes}`, contentW);
    doc.text(noteLines, margin, y);
    y += noteLines.length * 12 + 12;
  }

  // ---- Terms ----
  doc.setDrawColor(...LINE);
  doc.line(margin, y, pageW - margin, y);
  y += 22;
  doc.setTextColor(...NAVY);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("Doorstep evaluation terms & conditions", margin, y);
  y += 18;
  doc.setFontSize(8.6);
  EVALUATION_TERMS.forEach((term, idx) => {
    const lines = doc.splitTextToSize(`${idx + 1}.  ${term}`, contentW);
    if (y + lines.length * 11 > doc.internal.pageSize.getHeight() - 70) {
      doc.addPage();
      y = margin;
    }
    doc.setTextColor(70, 80, 90);
    doc.setFont("helvetica", "normal");
    doc.text(lines, margin, y);
    y += lines.length * 11 + 8;
  });

  // ---- Footer ----
  const footerY = doc.internal.pageSize.getHeight() - 40;
  doc.setDrawColor(...LINE);
  doc.line(margin, footerY - 14, pageW - margin, footerY - 14);
  doc.setTextColor(...MUTED);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text("HuluMart · Doorstep device buyback across Bangalore · hulumart.com@gmail.com", margin, footerY);
  doc.text("Thank you for choosing HuluMart", pageW - margin, footerY, { align: "right" });

  doc.save(`HuluMart-Invoice-${data.reference}.pdf`);
}

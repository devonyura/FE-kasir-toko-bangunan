// src/lib/pdf/generateLaporanPdf.ts
import { rupiahFormat } from "@/utils/formatting";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export type ColumnDef = {
  header: string;
  key: string;
};

type Summary = Record<string, number | string>;

type PdfOptions<T> = {
  title: string;
  subtitle: string;
  columns: ColumnDef[];
  data: T[];
  summary?: Summary;
};

export default function generateLaporanPdf<T>({
  title,
  subtitle,
  columns,
  data,
  summary,
}: PdfOptions<T>) {
  const doc = new jsPDF("p", "mm", "a4");

  // Title & Subtitle
  doc.setFontSize(16);
  doc.text(title, 105, 15, { align: "center" });
  doc.setFontSize(12);
  doc.text(subtitle, 105, 23, { align: "center" });

  // Table
  const tableColumns = columns.map((col) => ({ header: col.header, dataKey: col.key }));
const tableData = data.map((item) =>
  Object.fromEntries(columns.map((col) => [col.key, (item as any)[col.key]]))
);

  autoTable(doc, {
    head: [tableColumns.map((col) => col.header)],
    body: tableData.map((row) => columns.map((col) => row[col.key])),
    startY: 30,
    headStyles: {
      fillColor: [0, 100, 0], // Dark green
      textColor: 255,
    },
  });

  // Summary Table
  if (summary) {
  const finalY = (doc as any).lastAutoTable?.finalY || 30;
  const summaryRows = Object.entries(summary).map(([key, value]) => [
    key.replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase()),
    typeof value === "number" ? `${rupiahFormat(value.toLocaleString())}` : value,
  ]);

  autoTable(doc, {
    head: [["Ringkasan", "Nilai"]],
    body: summaryRows,
    startY: finalY + 10,
    theme: "grid",
    styles: { halign: "left" },
    headStyles: {
      fillColor: [0, 100, 0],
      textColor: 255,
    },
  });
}

  doc.save(subtitle);
}

// utils/generateExcelReport.ts
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { format, parseISO } from "date-fns";
import { id } from "date-fns/locale";

type GenerateExcelOptions = {
  data: any[];
  columns: { header: string; key: string; width?: number }[];
  title: string;
  startDate?: string;
  endDate?: string;
  multipleSheetColumn?: string;
};

// Helper untuk konversi angka kolom ke huruf Excel (misal 1 → A, 27 → AA)
function getExcelColLetter(colIndex: number): string {
  let letters = "";
  while (colIndex > 0) {
    const remainder = (colIndex - 1) % 26;
    letters = String.fromCharCode(65 + remainder) + letters;
    colIndex = Math.floor((colIndex - 1) / 26);
  }
  return letters;
}

// ... import tetap
export async function generateExcelReport({
  data,
  columns,
  title,
  startDate,
  endDate,
  multipleSheetColumn,
}: GenerateExcelOptions) {
  const workbook = new ExcelJS.Workbook();

  const formatTanggal = (tgl: string) => {
    try {
      const dateObj = parseISO(tgl.split(" ")[0]);
      return format(dateObj, "EEEE, dd MMMM yyyy", { locale: id });
    } catch {
      return tgl;
    }
  };

  const grouped = multipleSheetColumn
    ? data.reduce((acc, item) => {
        const key = item?.[multipleSheetColumn] ?? "Lainnya";
        if (!acc[key]) acc[key] = [];
        acc[key].push(item);
        return acc;
      }, {} as Record<string, any[]>)
    : { Data: data };

  for (const [sheetName, items] of Object.entries(grouped) as [string, Record<string, any>[]][]) {
    const sheet = workbook.addWorksheet(sheetName);
    const totalCol = columns.length + 1;
    const colEndLetter = getExcelColLetter(totalCol);

    // === Judul ===
    sheet.mergeCells(`A1:${colEndLetter}1`);
    sheet.getCell("A1").value = "TOKO BUANA SITUJU DAPURANG";
    sheet.getCell("A1").alignment = { horizontal: "center" };
    sheet.getCell("A1").font = { bold: true, size: 14 };

    // === Subjudul ===
    sheet.mergeCells(`A2:${colEndLetter}2`);
    sheet.getCell("A2").value =
      startDate && endDate
        ? `Laporan ${title} dari ${formatTanggal(startDate)} - ${formatTanggal(
            endDate
          )}`
        : `Laporan ${title} - ${format(new Date(), "EEEE, dd MMMM yyyy", {
            locale: id,
          })}`;
    sheet.getCell("A2").alignment = { horizontal: "center" };
    sheet.getCell("A2").font = { italic: true, size: 12 };

    // === Header di baris ke-4 ===
    const headerRow = sheet.getRow(4);
    const headers = ["NO", ...columns.map((col) => col.header)];
    headerRow.values = headers;
    headerRow.font = { bold: true };
    headerRow.alignment = { horizontal: "center", vertical: "middle" };
    headerRow.eachCell((cell) => {
      cell.border = {
        top: { style: "thin" },
        bottom: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" },
      };
    });

    // === Data ===
    items.forEach((item, index) => {
      const rowData = [
        index + 1,
        ...columns.map((col) =>
          typeof item?.[col.key] !== "undefined" ? item[col.key] : ""
        ),
      ];
      const row = sheet.addRow(rowData);
      row.eachCell((cell) => {
        cell.border = {
          top: { style: "thin" },
          bottom: { style: "thin" },
          left: { style: "thin" },
          right: { style: "thin" },
        };
      });
    });

    // === Lebar Kolom ===
    sheet.columns = [
      { width: 6 },
      ...columns.map((col) => ({ width: col.width ?? 20 })),
    ];
  }

  const buffer = await workbook.xlsx.writeBuffer();
  const filename = `Laporan ${title} ${formatTanggal(new Date().toISOString())}.xlsx`;
  saveAs(new Blob([buffer]), filename);
}


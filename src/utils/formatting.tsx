import { id } from "date-fns/locale";
import { format, parseISO } from "date-fns";

export function rupiahFormat(value: string | number, withRp: boolean = true) {
  // Menghapus titik desimal yang tidak diperlukan
  const cleanValue = value.toString().replace(/\.00$/, "").replace(/\./g, "");

  // Konversi ke angka
  const number = parseInt(cleanValue, 10);

  return withRp
    ? "Rp " + number.toLocaleString("id-ID")
    : "" + number.toLocaleString("id-ID");
}

export const getFormattedFilename = (startDate, endDate) => {
  const tanggalAwal = format(parseISO(startDate), "d MMMM", { locale: id });
  const tanggalAkhir = format(parseISO(endDate), "d MMMM yyyy", { locale: id });
  return `${tanggalAwal} - ${tanggalAkhir} Laporan Penjualan Toko Buana Situju Dapurang`;
};

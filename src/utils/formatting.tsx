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

export const getFormattedFilename = (startDate: string, endDate: string) => {
  const tanggalAwal = format(parseISO(startDate), "d MMMM", { locale: id });
  const tanggalAkhir = format(parseISO(endDate), "d MMMM yyyy", { locale: id });
  return `${tanggalAwal} - ${tanggalAkhir} Laporan Penjualan Toko Buana Situju Dapurang`;
};

export function singkatNamaBarang(
  nama: string | undefined
): string | undefined {
  const kataUmum = [
    "dan",
    "atau",
    "dari",
    "untuk",
    "yang",
    "ke",
    "dengan",
    "oleh",
    "pada",
    "di",
  ];

  // Pisah dan filter kata
  if (nama) {
    const kata = nama
      .split(" ")
      .filter(
        (word) => word.length > 0 && !kataUmum.includes(word.toLowerCase())
      );

    // Jika jumlah kata setelah filter <= 2, kembalikan tanpa potong
    if (kata.length <= 2) {
      return kata.join(" ");
    }

    // Jika lebih dari 2 kata, potong kata panjang
    return kata
      .map((word) => {
        if (word.length <= 4) return word; // tetap gunakan jika pendek
        return word.slice(0, 3); // potong jika panjang
      })
      .join(" ");
  }
}

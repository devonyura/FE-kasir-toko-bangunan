import { id } from "date-fns/locale";
import { format, parseISO } from "date-fns";

// Format rupiah
export function rupiahFormat(value: string | number, withRp: boolean = true) {
  const cleanValue = value.toString().replace(/\.00$/, "").replace(/\./g, "");
  const number = parseInt(cleanValue, 10);
  return withRp
    ? "Rp " + number.toLocaleString("id-ID")
    : "" + number.toLocaleString("id-ID");
}

// Format nama file laporan
export const getFormattedFilename = (startDate: string, endDate: string) => {
  const tanggalAwal = format(parseISO(startDate), "d MMMM", { locale: id });
  const tanggalAkhir = format(parseISO(endDate), "d MMMM yyyy", { locale: id });
  return `${tanggalAwal} - ${tanggalAkhir} Laporan Penjualan Toko Buana Situju Dapurang`;
};

// Singkat nama barang
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
  if (nama) {
    const kata = nama
      .split(" ")
      .filter(
        (word) => word.length > 0 && !kataUmum.includes(word.toLowerCase())
      );
    if (kata.length <= 2) return kata.join(" ");
    return kata
      .map((word) => {
        if (word.length <= 4) return word;
        return word.slice(0, 3);
      })
      .join(" ");
  }
}

// utils.ts
export function copas(teks: string): Promise<void> {
  if (!navigator.clipboard) {
    return new Promise((resolve, reject) => {
      const textarea = document.createElement("textarea");
      textarea.value = teks;
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand("copy");
        document.body.removeChild(textarea);
        alert("Kode sudah Disalin!");
        resolve();
      } catch (err) {
        document.body.removeChild(textarea);
        reject(err);
      }
    });
  } else {
    return navigator.clipboard.writeText(teks).then(() => {
      alert("Teks sudah Disalin!");
    });
  }
}


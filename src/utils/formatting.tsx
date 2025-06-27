export function rupiahFormat(value: string | number, withRp: boolean = true) {
  // Menghapus titik desimal yang tidak diperlukan
  const cleanValue = value.toString().replace(/\.00$/, "").replace(/\./g, "");

  // Konversi ke angka
  const number = parseInt(cleanValue, 10);

  return withRp
    ? "Rp " + number.toLocaleString("id-ID")
    : "" + number.toLocaleString("id-ID");
}

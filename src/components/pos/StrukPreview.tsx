// src/components/pos/StrukPreview.tsx
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { rupiahFormat } from "@/lib/formatter";
import { format } from "date-fns";

interface Props {
  transaksi: {
    id: number;
    tanggal: string;
    total: number;
    bayar: number;
    kembali: number;
    detail: {
      nama_barang: string;
      nama_satuan: string;
      qty: number;
      harga: number;
      subtotal: number;
    }[];
  };
  onClose: () => void;
}

export default function StrukPreview({ transaksi, onClose }: Props) {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const content = printRef.current;
    if (!content) return;

    const printWindow = window.open("", "", "width=400,height=600");
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Struk Transaksi</title>
          <style>
            body { font-family: monospace; font-size: 12px; padding: 10px; }
            .center { text-align: center; }
            table { width: 100%; border-collapse: collapse; margin-top: 8px; }
            td { padding: 2px 0; }
            .total td { font-weight: bold; border-top: 1px solid #000; }
          </style>
        </head>
        <body>${content.innerHTML}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  return (
    <div className="space-y-4">
      <div ref={printRef}>
        <div className="center">
          <h2>TOKO BANGUNAN</h2>
          <p>Jl. Contoh No. 123, Kota</p>
          <p>Telp: 0812-3456-7890</p>
        </div>
        <hr className="my-2" />

        <div>
          <p>
            Tanggal: {format(new Date(transaksi.tanggal), "dd/MM/yyyy HH:mm")}
          </p>
          <p>ID Transaksi: #{transaksi.id}</p>
        </div>

        <table>
          <tbody>
            {transaksi.detail.map((item, idx) => (
              <>
                <tr key={idx}>
                  <td colSpan={2}>
                    {item.nama_barang} ({item.nama_satuan})
                  </td>
                </tr>
                <tr>
                  <td>
                    {item.qty} x {rupiahFormat(item.harga)}
                  </td>
                  <td style={{ textAlign: "right" }}>
                    {rupiahFormat(item.subtotal)}
                  </td>
                </tr>
              </>
            ))}
          </tbody>
        </table>

        <table>
          <tbody>
            <tr className="total">
              <td>Total</td>
              <td style={{ textAlign: "right" }}>
                {rupiahFormat(transaksi.total)}
              </td>
            </tr>
            <tr>
              <td>Bayar</td>
              <td style={{ textAlign: "right" }}>
                {rupiahFormat(transaksi.bayar)}
              </td>
            </tr>
            <tr>
              <td>Kembali</td>
              <td style={{ textAlign: "right" }}>
                {rupiahFormat(transaksi.kembali)}
              </td>
            </tr>
          </tbody>
        </table>

        <div className="center mt-4">
          <p>Terima kasih telah berbelanja!</p>
        </div>
      </div>

      <div className="flex justify-end gap-2 print:hidden">
        <Button variant="outline" onClick={onClose}>
          Tutup
        </Button>
        <Button onClick={handlePrint}>Cetak</Button>
      </div>
    </div>
  );
}

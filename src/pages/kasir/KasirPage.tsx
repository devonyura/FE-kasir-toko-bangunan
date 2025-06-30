import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import CariBarangAutocomplete from "@/components/pos/CariBarangAutocomplete";
import TabelKeranjang from "@/components/pos/TabelKeranjang";
import PanelPembayaran from "@/components/pos/PanelPembayaran";
import { axiosInstance } from "@/utils/axios";
import type { KeranjangItem, Barang, Satuan } from "@/types/pos";
import StrukPreviewDialog from "@/components/struk/StrukPreviewDialog";

export default function KasirPage() {
  const [keranjang, setKeranjang] = useState<KeranjangItem[]>([]);
  const [openStruk, setOpenStruk] = useState(false);
  const [dataStruk, setDataStruk] = useState<null | undefined>(null);

  const isBarangInKeranjang = (barangId: string): boolean => {
    return keranjang.some((item) => item.barang_id === barangId);
  };

  const handleTambahQtyBarang = (barang: Barang) => {
    setKeranjang((prev) =>
      prev.map((item) =>
        item.barang_id === barang.id
          ? {
              ...item,
              qty: item.qty + 1,
              subtotal: (item.qty + 1) * item.harga_jual,
            }
          : item
      )
    );
  };

  const handleTambahBarang = async (barang: Barang) => {
    const sudahAda = keranjang.some((item) => item.barang_id === barang.id);
    if (sudahAda) return;

    try {
      const res = await axiosInstance.get(`/satuan-barang/barang/${barang.id}`);
      const semuaSatuan: Satuan[] = res.data.data || [];

      if (semuaSatuan.length === 0) {
        console.error("Barang tidak memiliki satuan.");
        return;
      }

      const satuanDefault = semuaSatuan[0];

      const itemBaru: KeranjangItem = {
        barang_id: barang.id,
        nama_barang: barang.nama_barang,
        satuan_id: satuanDefault.id,
        nama_satuan: satuanDefault.nama_satuan,
        qty: 1,
        harga_jual: satuanDefault.harga_jual,
        subtotal: satuanDefault.harga_jual * 1,
        semua_satuan: semuaSatuan,
      };

      setKeranjang((prev) => [...prev, itemBaru]);
    } catch (err) {
      console.error("Gagal mengambil satuan barang:", err);
    }
  };

  const handleUpdateItem = (index: number, updated: KeranjangItem) => {
    setKeranjang((prev) =>
      prev.map((item, i) => (i === index ? updated : item))
    );
  };

  const handleDeleteItem = (index: number) => {
    setKeranjang((prev) => prev.filter((_, i) => i !== index));
  };

  const resetKeranjang = () => {
    setKeranjang([]);
  };

  const handleCetak = async (notaId: string) => {
    if (notaId) {
      try {
        const res = await axiosInstance.get(`/transaksi-jual/${notaId}`);
        setDataStruk(res.data.data);
        setOpenStruk(true);
      } catch (error) {
        console.error("Gagal mengambil data struk", error);
      }
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="grid grid-cols-[2fr_1fr] gap-4 mt-4">
        <div>
          <h1 className="text-lg font-bold mb-3">Transaksi Penjualan (POS)</h1>

          <CariBarangAutocomplete
            onSelectBarang={handleTambahBarang}
            isBarangInKeranjang={isBarangInKeranjang}
            onTambahQtyBarang={handleTambahQtyBarang}
          />

          <Separator className="mt-3 mb-3" />
          <TabelKeranjang
            items={keranjang}
            onUpdate={handleUpdateItem}
            onDelete={handleDeleteItem}
          />
        </div>
        <PanelPembayaran
          keranjang={keranjang}
          onSuccess={resetKeranjang}
          onCetak={handleCetak}
        />
      </div>
      <StrukPreviewDialog
        open={openStruk}
        onOpenChange={setOpenStruk}
        data={dataStruk}
      />
    </div>
  );
}

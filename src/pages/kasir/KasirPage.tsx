// src/pages/kasir/KasirPage.tsx
import { useState } from "react";
// import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PlusIcon } from "lucide-react";

// ======================== Import for CariBarangAutoComplate ========
import CariBarangAutocomplete from "@/components/pos/CariBarangAutocomplete";
import FormTambahKeranjangDialog from "@/components/pos/FormTambahKeranjangDialog";
import type { Barang } from "@/types/pos";
import type { KeranjangItem } from "@/types/pos";
import CheckoutDialogForm from "@/components/pos/CheckoutDialogForm";

export default function KasirPage() {
  // ======================== STATE ========================
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [keranjang, setKeranjang] = useState<KeranjangItem[]>([]);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  // ======================== STATE CariBarangAutoComplate ========
  // const [formTambahOpen, setFormTambahOpen] = useState(false);
  const [selectedBarang, setSelectedBarang] = useState<Barang | null>(null);

  const [keranjangDialogOpen, setKeranjangDialogOpen] = useState(false);
  // const [selectedBarang, setSelectedBarang] = useState<unknown>(null);
  const [editData, setEditData] = useState<KeranjangItem | null>(null); // ini penting

  return (
    <>
      <div className="p-4 space-y-4">
        <CariBarangAutocomplete
          onSelectBarang={(barang) => {
            setSelectedBarang(barang);
            setKeranjangDialogOpen(true);
          }}
          ca
        />
        <Separator />

        {/* ===================== KERANJANG ===================== */}
        <div className="grid grid-cols-[2fr_1fr] gap-4">
          {/* ==================== List Keranjang ==================== */}
          <div className="space-y-2">
            <h2 className="font-semibold text-lg">Keranjang</h2>
            <table className="w-full text-sm border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-2 py-1">Barang</th>
                  <th className="border px-2 py-1">Satuan</th>
                  <th className="border px-2 py-1">Qty</th>
                  <th className="border px-2 py-1">Harga</th>
                  <th className="border px-2 py-1">Subtotal</th>
                  <th className="border px-2 py-1">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {keranjang.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="text-center text-gray-500 py-2 italic"
                    >
                      Belum ada barang dalam keranjang.
                    </td>
                  </tr>
                ) : (
                  keranjang.map((item, index) => (
                    <tr key={index}>
                      <td className="border px-2 py-1">{item.nama_barang}</td>
                      <td className="border px-2 py-1">{item.nama_satuan}</td>
                      <td className="border px-2 py-1">{item.qty}</td>
                      <td className="border px-2 py-1">{item.harga}</td>
                      <td className="border px-2 py-1">{item.subtotal}</td>
                      <td className="border px-2 py-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedBarang({
                              id: item.barang_id,
                              nama_barang: item.nama_barang,
                              nama_kategori: "-", // opsional
                            });
                            setEditIndex(index); // <== tambahkan baris ini
                            setEditData(item); // <== tetap simpan editData
                            setKeranjangDialogOpen(true);
                          }}
                        >
                          Edit
                        </Button>

                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => {
                            setKeranjang((prev) =>
                              prev.filter((_, i) => i !== index)
                            );
                          }}
                        >
                          Hapus
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* ==================== Panel Pembayaran ==================== */}
          <div className="border rounded p-4 space-y-4 shadow-sm">
            <div className="text-sm">
              <p className="font-medium">Total:</p>
              <h3 className="text-2xl font-bold">
                Rp{" "}
                {keranjang
                  .reduce((total, item) => total + item.subtotal, 0)
                  .toLocaleString()}
              </h3>
            </div>

            <Button
              disabled={keranjang.length === 0}
              onClick={() => setCheckoutOpen(true)}
            >
              <PlusIcon className="w-4 h-4 mr-1" /> Checkout & Cetak Struk
            </Button>
          </div>
        </div>
      </div>
      <FormTambahKeranjangDialog
        open={keranjangDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedBarang(null);
            setEditIndex(null);
          }
          setKeranjangDialogOpen(open);
        }}
        barang={selectedBarang}
        initialData={editData !== null ? keranjang[editIndex] : null}
        onAddToCart={(itemBaru) => {
          if (editIndex !== null) {
            // Edit mode
            // Mode edit: ganti item pada posisi index
            setKeranjang((prev) =>
              prev.map((item, idx) => (idx === editIndex ? itemBaru : item))
            );
          } else {
            setKeranjang((prev) => [...prev, itemBaru]);
          }
          setKeranjangDialogOpen(false);
        }}
      />
      <CheckoutDialogForm
        open={checkoutOpen}
        onOpenChange={(open) => {
          setCheckoutOpen(open);
        }}
        keranjang={keranjang}
        onSuccess={() => {
          setKeranjang([]);
          setSelectedBarang(null);
        }}
      />
    </>
  );
}

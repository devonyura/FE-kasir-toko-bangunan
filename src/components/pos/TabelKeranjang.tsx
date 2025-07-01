import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import type { KeranjangItem } from "@/types/pos";
import { rupiahFormat } from "@/utils/formatting";

interface Props {
  items: KeranjangItem[];
  onUpdate: (index: number, item: KeranjangItem) => void;
  onDelete: (index: number) => void;
}

export default function TabelKeranjang({ items, onUpdate, onDelete }: Props) {
  return (
    <div className="space-y-2">
      <div className="max-h-110 overflow-y-auto border">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              <th className="border px-2 py-1">Barang</th>
              <th className="border px-2 py-1">Tipe</th>
              <th className="border px-2 py-1 w-[110px]">Qty</th>
              <th className="border px-2 py-1">Harga</th>
              <th className="border px-2 py-1">Subtotal</th>
              <th className="border px-2 py-1">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="text-center py-2 text-muted-foreground italic"
                >
                  Belum ada barang.
                </td>
              </tr>
            ) : (
              items.map((item, index) => (
                <tr key={index}>
                  <td className="border px-2 py-1">{item.nama_barang}</td>
                  <td className="border px-2 py-1">
                    {/* Dropdown tipe */}
                    <Select
                      value={item.tipe_id}
                      onValueChange={(val) => {
                        const tipeBaru = item.semua_tipe.find(
                          (s) => s.id === val
                        );
                        if (tipeBaru) {
                          const harga = tipeBaru.harga_jual;
                          const subtotal = item.qty * harga;
                          onUpdate(index, {
                            ...item,
                            tipe_id: tipeBaru.id,
                            nama_tipe: tipeBaru.nama_tipe,
                            harga_jual: harga,
                            subtotal,
                          });
                        }
                      }}
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue placeholder="Tipe" />
                      </SelectTrigger>
                      <SelectContent>
                        {item.semua_tipe.map((s) => (
                          <SelectItem key={s.id} value={s.id}>
                            {s.nama_tipe}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="border px-2 py-1">
                    <Input
                      type="number"
                      min="1"
                      value={item.qty}
                      onChange={(e) => {
                        const newQty = parseInt(e.target.value);
                        if (!isNaN(newQty)) {
                          const subtotal = newQty * item.harga_jual;
                          onUpdate(index, { ...item, qty: newQty, subtotal });
                        }
                      }}
                      className="h-8"
                    />
                  </td>
                  <td className="border px-2 py-1">
                    {rupiahFormat(item.harga_jual)}
                  </td>
                  <td className="border px-2 py-1">
                    Rp{item.subtotal.toLocaleString()}
                  </td>
                  <td className="border px-2 py-1 text-center">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDelete(index)}
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
    </div>
  );
}

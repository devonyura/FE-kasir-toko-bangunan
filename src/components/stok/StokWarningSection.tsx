import { useEffect, useState, useCallback } from "react";
import { AlertTriangleIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { axiosInstance } from "@/utils/axios";

interface WarningItem {
  id: string;
  nama_barang: string;
  nama_kategori: string;
  nama_satuan: string;
  jumlah: number;
}

export default function StokWarningSection() {
  const [data, setData] = useState<WarningItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchWarningStok = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axiosInstance.get("/stok?warning=true");
      setData(res.data?.data || []);
    } catch (err: unknown) {
      setError(`Gagal memuat stok peringatan. ${err} + error`);
    } finally {
      setLoading(false);
    }
  }, [error]);

  useEffect(() => {
    fetchWarningStok();
  }, [fetchWarningStok]);

  if (loading || data.length === 0) return null;

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertTriangleIcon className="w-5 h-5" />
      <AlertTitle>Stok Rendah / Habis</AlertTitle>
      <AlertDescription>
        Berikut barang yang jumlahnya kritis:
        <ul className="mt-2 space-y-1 list-disc list-inside text-muted-foreground text-sm">
          {data.map((item, idx) => (
            <li key={idx}>
              <strong>{item.nama_barang}</strong> ({item.nama_kategori}) –{" "}
              {item.jumlah} {item.nama_satuan}
            </li>
          ))}
        </ul>
      </AlertDescription>
    </Alert>
  );
}

import { useEffect, useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { axiosInstance } from "@/utils/axios";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  barangId: string | null;
  barangNama: string;
}

interface LogStok {
  id: string;
  tanggal: string;
  jenis: "masuk" | "keluar";
  jumlah: number;
  tipe: string;
  keterangan: string;
}

export default function DetailStokDialog({
  open,
  onOpenChange,
  barangId,
  barangNama,
}: Props) {
  const [logs, setLogs] = useState<LogStok[]>([]);
  const [error, setError] = useState("");
  console.log(barangId);
  const fetchDetail = useCallback(async () => {
    try {
      const res = await axiosInstance.get(`/stok/detail/${Number(barangId)}`);
      setLogs(res.data.data || []);
    } catch (err: unknown) {
      setLogs([]);
      setError("Gagal memuat data histori stok :", err);
    }
  }, [barangId]);

  useEffect(() => {
    if (open && barangId) fetchDetail();
  }, [open, barangId, fetchDetail]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl" aria-describedby="">
        <DialogHeader>
          <DialogTitle>Riwayat Stok Barang</DialogTitle>
        </DialogHeader>

        <div>
          <p className="text-sm text-muted-foreground mb-1">
            Barang: <strong>{barangNama}</strong>
          </p>
          <Separator className="mb-3" />
        </div>

        {error && (
          <Alert variant="destructive" className="mb-2">
            <AlertCircleIcon className="w-4 h-4" />
            <AlertTitle>Gagal</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {logs.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Belum ada riwayat stok untuk barang ini.
          </p>
        ) : (
          <ScrollArea className="max-h-[300px] border rounded">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 sticky top-0">
                <tr>
                  <th className="px-2 py-1 border text-left">Tanggal</th>
                  <th className="px-2 py-1 border text-left">Jenis</th>
                  <th className="px-2 py-1 border text-right">Jumlah</th>
                  <th className="px-2 py-1 border text-left">Tipe</th>
                  <th className="px-2 py-1 border text-left">Keterangan</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log, idx) => (
                  <tr key={idx}>
                    <td className="px-2 py-1 border">{log.tanggal}</td>
                    <td className="px-2 py-1 border capitalize">{log.jenis}</td>
                    <td className="px-2 py-1 border text-right">
                      {log.jumlah}
                    </td>
                    <td className="px-2 py-1 border">{log.tipe}</td>
                    <td className="px-2 py-1 border">
                      {log.keterangan || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ScrollArea>
        )}

        <DialogClose asChild>
          <button className="mt-3 px-3 py-1 border rounded text-sm hover:bg-muted">
            Tutup
          </button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}

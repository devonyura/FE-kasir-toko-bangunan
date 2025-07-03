import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Barcode from "react-barcode"; // install dulu: npm install react-barcode
import { useRef } from "react";
import { toPng } from "html-to-image";
import download from "downloadjs";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  barang?: {
    id: string;
    nama_barang: string;
    kategori_id: string;
    kode_barang: string;
    keterangan: string;
  } | null;
}

export default function StrukPreviewDialog1({
  open,
  onOpenChange,
  barang,
}: Props) {
  const labelRef = useRef<HTMLDivElement>(null);
  const handleDownload = async () => {
    if (!labelRef.current) return;

    try {
      const dataUrl = await toPng(labelRef.current, {
        cacheBust: true,
        backgroundColor: "white", // pastikan ada background putih
        pixelRatio: 3, // kualitas tinggi
      });
      download(dataUrl, `barcode-${barang?.kode_barang || "label"}.png`);
    } catch (err) {
      console.error("Gagal generate gambar:", err);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          className="max-w-[500px] print:hidden flex flex-col items-center justify-center gap-4"
          aria-describedby=""
        >
          <DialogHeader className="text-center">
            <DialogTitle className="text-xl font-bold">
              Preview Label
            </DialogTitle>
          </DialogHeader>
          <div
            id="area-print-barcode"
            className="w-[99mm] h-[15mm] flex justify-center items-center"
          >
            <div
              className="flex flex-col items-center bg-white mb-[1mm]"
              ref={labelRef}
            >
              <span className="text-[10px]">{barang?.nama_barang}</span>
              <Barcode
                height={30}
                width={1.5}
                fontSize={12}
                displayValue={true}
                value={barang?.kode_barang || ""}
                marginLeft={10}
                format="EAN13"
                marginTop={1}
                marginBottom={1}
              />
            </div>
          </div>

          <DialogFooter className="w-full flex justify-between mt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Tutup
            </Button>
            <Button onClick={handleDownload}>Download Label barcode</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

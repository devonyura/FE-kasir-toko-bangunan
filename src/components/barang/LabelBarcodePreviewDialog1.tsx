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
import { rupiahFormat, singkatNamaBarang } from "@/utils/formatting";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  barang?: {
    nama_barang: string | undefined;
    kode_barang_tipe: string;
    nama_tipe: string | undefined;
    harga_jual: string | number;
  };
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
      download(dataUrl, `${barang?.nama_barang} ${barang?.nama_tipe}-barcode.png`);
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
              Preview Labels
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
              <span className="text-[9px]">
                {singkatNamaBarang(
                  `${barang?.nama_barang} ${barang?.nama_tipe}`
                )}
              </span>
              <Barcode
                height={22}
                width={1.5}
                fontSize={12}
                displayValue={true}
                value={barang?.kode_barang_tipe || ""}
                marginLeft={10}
                format="EAN13"
                marginTop={1}
                marginBottom={1}
              />
              <span className="text-[12px] mt-[1px] font-semibold">
                Harga: {barang?.harga_jual && rupiahFormat(barang?.harga_jual)}
              </span>
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

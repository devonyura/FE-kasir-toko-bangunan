import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Barcode from "react-barcode"; // install dulu: npm install react-barcode

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

export default function LabelBarcodePreviewDialog({
  open,
  onOpenChange,
  barang,
}: Props) {
  const [showPrintArea, setShowPrintArea] = useState(false);

  const handlePrint = () => {
    setShowPrintArea(true);
    setTimeout(() => {
      window.print();
      setTimeout(() => setShowPrintArea(false), 500);
    }, 300);
  };
  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-sm print:hidden">
          <DialogHeader>
            <DialogTitle>Preview Label</DialogTitle>
          </DialogHeader>

          <div className="text-center my-0 mx-auto">
            <p className="font-semibold">{barang.nama_barang}</p>
            <Barcode value={barang.kode_barang} height={50} fontSize={12} />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Tutup
            </Button>
            <Button onClick={handlePrint}>Print</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {showPrintArea && (
        <div className="print:block p-2 text-center w-[72mm]">
          <div className="text-sm font-bold">{barang.nama_barang}</div>
          <div className="mt-1">
            <Barcode value={barang.kode_barang} height={50} fontSize={12} />
          </div>
        </div>
      )}
    </>
  );
}

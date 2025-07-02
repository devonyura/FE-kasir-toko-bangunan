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
// import "@/components/barang/barcode.css";

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
  const [showPrintArea, setShowPrintArea] = useState(false);

  const handlePrint = () => {
    // document.body.classList.add("label-print-mode");
    setShowPrintArea(true);
    setTimeout(() => {
      window.print();
      // document.body.classList.remove("label-print-mode");
      setTimeout(() => setShowPrintArea(false), 500);
    }, 500);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl print:hidden flex flex-col items-center justify-center gap-4">
          <DialogHeader className="text-center">
            <DialogTitle className="text-xl font-bold">
              Preview Label
            </DialogTitle>
          </DialogHeader>
          <div
            id="area-print-barcode"
            className="flex flex-row justify-around gap-[20mm] w-[99mm] h-[15mm] p-0 m-0 pr-7 pt-[3px] mr-38"
          >
            <div className="w-[33mm] h-[15mm] p-0 m-0 text-[8px] font-mono flex flex-col justify-center items-center mt-2">
              <div className="mb-[1mm] flex flex-col items-center">
                <span className="text-[12px]">{barang?.nama_barang}</span>
                <Barcode
                  height={30}
                  width={1.5}
                  fontSize={12}
                  displayValue={true}
                  value={barang?.kode_barang || ""}
                  marginRight={0}
                  marginLeft={55}
                  format="EAN13"
                  marginTop={1}
                  marginBottom={1}
                />
              </div>
            </div>
            <div className="w-[33mm] h-[15mm] p-0 m-0 text-[8px] font-mono flex flex-col justify-center items-center mt-2">
              <div className="mb-[1mm] flex flex-col items-center">
                <span className="text-[12px]">{barang?.nama_barang}</span>
                <Barcode
                  height={30}
                  width={1.5}
                  fontSize={12}
                  displayValue={true}
                  value={barang?.kode_barang || ""}
                  marginLeft={20}
                  format="EAN13"
                  marginTop={1}
                  marginBottom={1}
                />
              </div>
            </div>
            <div className="w-[33mm] h-[15mm] p-0 m-0 text-[8px] font-mono flex flex-col justify-center items-center mt-2">
              <div className="mb-[1mm] flex flex-col items-center">
                <span className="text-[12px]">{barang?.nama_barang}</span>
                <Barcode
                  height={30}
                  width={1.5}
                  fontSize={12}
                  displayValue={true}
                  value={barang?.kode_barang || ""}
                  marginLeft={40}
                  format="EAN13"
                  marginTop={1}
                  marginBottom={1}
                />
              </div>
            </div>
          </div>

          <DialogFooter className="w-full flex justify-between mt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Tutup
            </Button>
            <Button onClick={handlePrint}>Print</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {showPrintArea && (
        <div
          id="area-print-barcode"
          className="flex flex-row justify-around gap-[20mm] w-[99mm] h-[15mm] p-0 m-0 pr-7 pt-[3px] mr-38"
        >
          <div className="w-[33mm] h-[15mm] p-0 m-0 text-[8px] font-mono flex flex-col justify-center items-center mt-2">
            <div className="mb-[1mm] flex flex-col items-center">
              <span className="text-[12px]">{barang?.nama_barang}</span>
              <Barcode
                height={35}
                width={1.5}
                fontSize={12}
                displayValue={true}
                value={barang?.kode_barang || ""}
                marginRight={0}
                marginLeft={70}
                format="EAN13"
                marginTop={1}
                marginBottom={1}
              />
            </div>
          </div>
          <div className="w-[33mm] h-[15mm] p-0 m-0 text-[8px] font-mono flex flex-col justify-center items-center mt-2">
            <div className="mb-[1mm] flex flex-col items-center">
              <span className="text-[12px]">{barang?.nama_barang}</span>
              <Barcode
                height={35}
                width={1.5}
                fontSize={12}
                displayValue={true}
                value={barang?.kode_barang || ""}
                marginLeft={20}
                format="EAN13"
                marginTop={1}
                marginBottom={1}
              />
            </div>
          </div>
          <div className="w-[33mm] h-[15mm] p-0 m-0 text-[8px] font-mono flex flex-col justify-center items-center mt-2">
            <div className="mb-[1mm] flex flex-col items-center">
              <span className="text-[12px]">{barang?.nama_barang}</span>
              <Barcode
                height={35}
                width={1.5}
                fontSize={12}
                displayValue={true}
                value={barang?.kode_barang || ""}
                marginLeft={40}
                format="EAN13"
                marginTop={1}
                marginBottom={1}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  message?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  open,
  title = "Konfirmasi",
  message = "Apakah Anda yakin?",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="text-sm text-gray-700">{message}</div>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Batal
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Ya, Lanjutkan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

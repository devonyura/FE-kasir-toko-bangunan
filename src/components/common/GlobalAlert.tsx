import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";
import { useAlertStore } from "@/store/alert";
import { useEffect } from "react";

export default function GlobalAlert() {
  const { open, message, type, closeAlert } = useAlertStore();

  useEffect(() => {
    if (open) {
      const timeout = setTimeout(() => closeAlert(), 3000);
      return () => clearTimeout(timeout);
    }
  }, [open, closeAlert]);

  if (!open) return null;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md">
      <Alert variant={type}>
        <AlertCircleIcon className="h-5 w-5" />
        <AlertTitle className="capitalize">{type}</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
      </Alert>
    </div>
  );
}

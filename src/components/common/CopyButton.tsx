import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { copas } from "@/utils/formatting"; // atau sesuaikan path utils-mu

export function CopyButton({ teks }: { teks: string }) {
  return (
    <Button
      style={{ padding: 1, margin: 5 }}
      variant="outline"
      size="sm"
      onClick={() => copas(teks)}
      title="Salin ke clipboard"
    >
      <Copy />
    </Button>
  );
}

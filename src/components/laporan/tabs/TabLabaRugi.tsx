import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { rupiahFormat } from "@/utils/formatting";

export default function TabLabaRugi({ summary }: undefined) {
  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Laba Rugi Bulanan</h2>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Ringkasan Laba Rugi</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Penjualan Bersih</p>
            <p className="font-bold">
              {rupiahFormat(summary.penjualan_bersih)}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Pembelian Bersih</p>
            <p className="font-bold">
              {rupiahFormat(summary.pembelian_bersih)}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Laba Kotor</p>
            <p
              className={`font-bold ${
                summary.laba_kotor >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {rupiahFormat(summary.laba_kotor)}
            </p>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

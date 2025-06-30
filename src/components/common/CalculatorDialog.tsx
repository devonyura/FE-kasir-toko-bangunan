import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface CalculatorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CalculatorDialog({
  open,
  onOpenChange,
}: CalculatorDialogProps) {
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState("");

  const handleInput = (value: string) => {
    setExpression((prev) => prev + value);
  };

  const handleClear = () => {
    setExpression("");
    setResult("");
  };

  const handleBackspace = () => {
    setExpression((prev) => prev.slice(0, -1));
  };

  const handleCalculate = () => {
    try {
      // Evaluasi ekspresi matematika
      const evalResult = eval(expression); // ⚠️ pastikan hanya kalkulasi dasar, aman karena scope tertutup
      setResult(evalResult.toString());
    } catch {
      setResult("ERROR");
    }
  };

  const buttons = [
    "7",
    "8",
    "9",
    "/",
    "4",
    "5",
    "6",
    "*",
    "1",
    "2",
    "3",
    "-",
    "0",
    ".",
    "=",
    "+",
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[300px] p-4">
        <DialogHeader>
          <DialogTitle>Simple Calculator</DialogTitle>
        </DialogHeader>

        <Input
          className="text-right text-lg font-mono"
          value={expression}
          readOnly
        />
        <div className="text-right text-muted-foreground text-sm h-5">
          {result && `= ${result}`}
        </div>

        <div className="grid grid-cols-4 gap-2 mt-2">
          {buttons.map((btn) =>
            btn === "=" ? (
              <Button key={btn} variant="default" onClick={handleCalculate}>
                =
              </Button>
            ) : (
              <Button
                key={btn}
                variant="secondary"
                onClick={() => handleInput(btn)}
              >
                {btn}
              </Button>
            )
          )}
        </div>

        <DialogFooter className="justify-between mt-2">
          <Button variant="destructive" onClick={handleClear}>
            Clear
          </Button>
          <Button variant="outline" onClick={handleBackspace}>
            ⌫
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

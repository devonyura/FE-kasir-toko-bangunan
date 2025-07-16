// src/components/ui/CurrencyInput.tsx
import React from "react";
import { Input } from "./input";

interface CurrencyInputProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  required?: boolean;
}

export default function CurrencyInput({
  value,
  onChange,
  placeholder,
  required,
}: CurrencyInputProps) {
  const formatCurrency = (val: string) => {
    const numberString = val.replace(/[^\d]/g, "");
    if (!numberString) return "";
    return parseInt(numberString).toLocaleString("id-ID");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^\d]/g, "");
    onChange(raw);
  };

  return (
    <div className="relative w-full">
      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-600 font-semibold">
        Rp
      </span>
      <Input
        type="text"
        inputMode="numeric"
        autoComplete="off"
        placeholder={placeholder}
        value={formatCurrency(value)}
        onChange={handleChange}
        required={required}
        className="pl-9 text-lg font-semibold"
      />
    </div>
  );
}

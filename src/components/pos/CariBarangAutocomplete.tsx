import { useEffect, useRef, useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { axiosInstance } from "@/utils/axios";
import { cn } from "@/lib/utils";

interface Barang {
  id: string;
  nama_barang: string;
  kode_barang: string;
  nama_kategori: string;
  satuan_default: {
    id: string;
    nama_satuan: string;
    harga_jual: number;
  };
}

interface Props {
  onSelectBarang: (barang: Barang) => void;
}

export default function CariBarangAutocomplete({ onSelectBarang }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Barang[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState<number>(-1);
  const timeoutRef = useRef<number>();

  const handleSelect = useCallback(
    (barang: Barang) => {
      if (typeof onSelectBarang === "function") {
        onSelectBarang(barang);
        setQuery("");
        setResults([]);
        setSelectedIdx(-1);
      } else {
        console.error("onSelectBarang tidak tersedia atau bukan fungsi");
      }
    },
    [onSelectBarang]
  );

  const fetchBarang = useCallback(
    async (cari: string) => {
      try {
        const res = await axiosInstance.get(`/barang?search=${cari}`);
        const data = res.data.data || [];
        setResults(data);
        console.log(`data: ${data.kode_barang} == ${cari}`);

        // ✅ Auto-select jika ada barang yang kode_barang === query
        const match = data.find((b: Barang) => b.kode_barang === cari);
        if (match) {
          handleSelect(match);
        }
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    },
    [handleSelect]
  );

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);
    clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => {
      fetchBarang(query.trim());
    }, 300);
  }, [query, fetchBarang]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      setSelectedIdx((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      setSelectedIdx((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter" && results[selectedIdx]) {
      handleSelect(results[selectedIdx]);
    }
  };
  return (
    <div className="relative w-full max-w-md">
      <Input
        placeholder="Cari barang atau scan barcode..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        autoFocus
      />
      {loading && (
        <div className="text-sm text-muted-foreground">Memuat...</div>
      )}
      {results.length > 0 && (
        <ul className="absolute z-50 w-full bg-white border shadow-sm mt-1 rounded-md max-h-60 overflow-y-auto text-sm">
          {results.map((barang, idx) => (
            <li
              key={barang.id}
              className={cn(
                "px-3 py-2 cursor-pointer hover:bg-muted",
                selectedIdx === idx && "bg-muted font-semibold"
              )}
              onMouseDown={() => handleSelect(barang)}
            >
              <div>{barang.nama_barang}</div>
              <div className="text-xs text-muted-foreground">
                {barang.nama_kategori} • {barang.satuan_default?.nama_satuan} •
                Rp{barang.satuan_default?.harga_jual?.toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

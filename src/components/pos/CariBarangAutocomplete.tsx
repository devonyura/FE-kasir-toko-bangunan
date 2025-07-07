import { useEffect, useRef, useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { axiosInstance } from "@/utils/axios";
import { cn } from "@/lib/utils";

export interface Barang {
  id: string;
  nama_barang: string;
  nama_kategori: string;
  semua_tipe: {
    id: string;
    nama_tipe: string;
    harga_jual: number;
    stok: number;
    kode_barang_tipe: string;
  }[];
  tipe_default?: { id: string; nama_tipe: string; harga_jual: number };
}

interface Props {
  onSelectBarang: (barang: Barang) => void;
}

export default function CariBarangAutocomplete({ onSelectBarang }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Barang[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState<number>(-1);
  const timeoutRef = useRef<number>(0);

  const handleSelect = useCallback(
    (barang: Barang) => {
      // Cek apakah ada tipe dengan stok > 0
      const tipeDenganStok = barang.semua_tipe.find((t) => t.stok > 0);

      if (!tipeDenganStok) {
        alert("Barang ini tidak tersedia karena semua tipenya habis.");
        return;
      }

      // Bungkus sebagai tipe_default jika belum ada
      const barangDenganTipe = {
        ...barang,
        tipe_default: {
          id: tipeDenganStok.id,
          nama_tipe: tipeDenganStok.nama_tipe,
          harga_jual: tipeDenganStok.harga_jual,
        },
      };

      onSelectBarang(barangDenganTipe as Barang);
      setQuery("");
      setResults([]);
      setSelectedIdx(-1);
    },
    [onSelectBarang]
  );


  const fetchBarang = useCallback(
    async (cari: string) => {
      try {
        const res = await axiosInstance.get(`/barang?search=${cari}`);
        const data: Barang[] = res.data.data || [];
        setResults(data);

        // ✅ Jika hanya 1 barang & 1 tipe & stok > 0, auto-tambah
        if (
          data.length === 1 &&
          data[0].semua_tipe.length === 1 &&
          data[0].semua_tipe[0].stok > 0
        ) {
          const barang = data[0];
          const tipe = barang.semua_tipe[0];

          // Bungkus tipe ke dalam bentuk `tipe_default`
          const barangDenganTipe = {
            ...barang,
            tipe_default: {
              id: tipe.id,
              nama_tipe: tipe.nama_tipe,
              harga_jual: tipe.harga_jual,
            },
          };

          handleSelect(barangDenganTipe as Barang);
          return;
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
              key={`${barang.id}-${idx}`}
              className={cn(
                "px-3 py-2 cursor-pointer hover:bg-muted",
                selectedIdx === idx && "bg-muted font-semibold"
              )}
              onMouseDown={() => handleSelect(barang)}
            >
              <div>
                {barang.nama_barang} ({barang.nama_kategori})
              </div>
              <div className="text-xs mt-1">
                {barang.semua_tipe?.length > 0 ? (
                  <ul className="space-y-0.5">
                    {barang.semua_tipe.map((tipe) => (
                      <li
                        key={tipe.id}
                        className={cn(
                          tipe.stok > 0 ? "text-green-600" : "text-red-600"
                        )}
                      >
                        {tipe.nama_tipe}: {tipe.stok}{" "}
                        {tipe.stok === 0 && "(habis)"}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-red-600">❌ Tidak ada tipe tersedia</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

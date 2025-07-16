// src/lib/queryClient.ts
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,           // Data dibuang kalau tidak dipakai
      refetchOnWindowFocus: true, // Refetch setiap tab aktif lagi
      refetchOnReconnect: true,   // Refetch kalau koneksi putus lalu nyambung
    },
  },
});

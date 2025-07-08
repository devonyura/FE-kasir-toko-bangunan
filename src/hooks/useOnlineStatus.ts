import { useEffect, useState } from "react";
import { useOnlineStore } from "@/store/useOnlineStore";

export function useOnlineStatus(): boolean {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
   const setOnline = useOnlineStore((state) => state.setOnline);

  useEffect(() => {
    const updateOnlineStatus = () => setIsOnline(navigator.onLine);
    // const updateOnlineStatus = () => setOnline(navigator.onLine);

    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);

      // Cek awal
    updateOnlineStatus();

    return () => {
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
    };
  }, [setOnline]);

  return isOnline;
}

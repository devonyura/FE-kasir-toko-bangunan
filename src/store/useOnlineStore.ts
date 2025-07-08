import { create } from "zustand";

type OnlineState = {
  isOnline: boolean;
  setOnline: (status: boolean) => void;
};

export const useOnlineStore = create<OnlineState>((set) => ({
  isOnline: navigator.onLine,
  setOnline: (status) => set({ isOnline: status }),
}));

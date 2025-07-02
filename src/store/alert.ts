// src/store/alert.ts
import { create } from "zustand";

type AlertType = "default" | "destructive";

type AlertState = {
  open: boolean;
  message: string;
  type: AlertType;
  showAlert: (message: string, type?: AlertType) => void;
  closeAlert: () => void;
};

export const useAlertStore = create<AlertState>((set) => ({
  open: false,
  message: "",
  type: "default",
  showAlert: (message, type = "default") =>
    set({ open: true, message, type }),
  closeAlert: () => set({ open: false, message: "" }),
}));

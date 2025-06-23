import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/auth";
import { useAlertStore } from "@/store/alert";
import { useRef } from "react";

export default function ProtectedRoute({
  children,
}: {
  children: JSX.Element;
}) {
  const token = useAuthStore((state) => state.token);
  const { showAlert } = useAlertStore();
  const location = useLocation();
  const alerted = useRef(false); // supaya showAlert hanya sekali

  if (!token) {
    if (!alerted.current) {
      showAlert("Silakan login kembali", "destructive");
      alerted.current = true;
    }

    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

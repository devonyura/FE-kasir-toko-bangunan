// src/components/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/Auth";
import React from "react";


export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const user = useAuthStore.getState().user;
  return user ? children : <Navigate to="/login" replace />;
}
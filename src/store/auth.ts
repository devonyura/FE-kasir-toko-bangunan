// src/store/auth.ts
import { create } from "zustand"; // create digunakan untuk membuat store Zustand.
import { persist } from "zustand/middleware"; // persist adalah middleware dari Zustand yang menyimpan data ke localStorage secara otomatis.
import { axiosInstance } from "../utils/axios"; // kita buat ini nanti

export type User = {
  id: string;
  username: string;
  role: string;
  cabang_id: string;
};

type AuthState = {
  user: User | null;
  token: string | null;
  login: (payload: { username: string; password: string }) => Promise<boolean>;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      login: async ({ username, password }) => {
        try {
          const res = await axiosInstance.post("/auth/login", {
            username,
            password,
          });
          console.log(res)
          const { token } = res.data;

          // Decode token manually jika ingin ambil data user dari JWT (opsional)
          const payload = JSON.parse(atob(token.split(".")[1]));
          const user = payload.data;

          set({ user, token });
          return true;
        } catch (err) {
          console.error("Login error:", err);
          return false;
        }
      },
      logout: () => set({ user: null, token: null })
    }),
    {
      name: "auth-storage",
    }
  )
);

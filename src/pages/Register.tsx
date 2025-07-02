// src/pages/Register.tsx
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../utils/axios";
import axios from "axios";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [cabangId, setCabangId] = useState("1");
  const [role, setRole] = useState("admin");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const mutation = useMutation({
    mutationFn: async () => {
      setError("");
      setSuccess("");
      const res = await axiosInstance.post("/auth/register", {
        username,
        password,
        cabang_id: cabangId,
        role,
      });
      return res.data;
    },
    onSuccess: (data) => {
      setSuccess(data.message);
    },
    onError: (err: Error) => {
      if (axios.isAxiosError(err)) {
        const msg = err?.response?.data?.messages?.username;
        setError(msg || "Registrasi gagal");
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h1 className="text-lg font-bold mb-4">Register Akun</h1>
        <Input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mb-3"
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-3"
        />
        <Input
          placeholder="Cabang ID"
          value={cabangId}
          onChange={(e) => setCabangId(e.target.value)}
          className="mb-3"
        />
        <Input
          placeholder="Role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="mb-4"
        />

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        {success && <p className="text-green-600 text-sm mb-2">{success}</p>}

        <Button
          className="w-full"
          onClick={() => mutation.mutate()}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Loading..." : "Register"}
        </Button>
      </div>
    </div>
  );
}

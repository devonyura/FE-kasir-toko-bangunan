// src/pages/Login.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "../store/auth";
import { useMutation } from "@tanstack/react-query";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: () => login({ username, password }),
    onSuccess: (success) => {
      if (success) navigate("/");
      else alert("Login gagal. Periksa kembali username/password.");
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h1 className="text-lg font-bold mb-4">Login Kasir</h1>
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
          className="mb-4"
        />
        <Button
          className="w-full"
          onClick={() => mutation.mutate()}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Loading..." : "Login"}
        </Button>
      </div>
    </div>
  );
}

// src/pages/Login.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "../store/auth";
import { useMutation } from "@tanstack/react-query";
import { EyeIcon, EyeOffIcon } from "lucide-react"; // Icon opsional
import { useAlertStore } from "@/store/alert";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { showAlert } = useAlertStore();
  const { user, login } = useAuthStore();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: () => login({ username, password }),
    onSuccess: (success) => {
      if (success) navigate("/");
      else alert("Login gagal. Periksa kembali username/password.");
    },
  });

  useEffect(() => {
    if (user) {
      showAlert("Kamu sudah login!!!", "default");
      navigate("/", { replace: true });
    }
  }, [user, navigate, showAlert]);

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
        <div className="mb-4 flex items-center space-x-2">
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="flex-1"
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? (
              <EyeOffIcon className="w-4 h-4" />
            ) : (
              <EyeIcon className="w-4 h-4" />
            )}
          </Button>
        </div>
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

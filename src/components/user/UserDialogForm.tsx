import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { axiosInstance } from "@/utils/axios";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircleIcon, EyeOffIcon, EyeIcon } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (message: string) => void;
  initialData?: {
    id: string;
    username: string;
    role: string;
  } | null;
}
import axios from "axios";

const ROLES = ["kasir", "owner", "manager"] as const;

export default function UserDialogForm({
  open,
  onOpenChange,
  onSuccess,
  initialData,
}: Props) {
  const isEdit = !!initialData;

  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState(""); // hanya untuk tambah
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [showOldPassword, setShowOldPassword] = useState(false);

  useEffect(() => {
    if (open) {
      if (isEdit && initialData) {
        setUsername(initialData.username);
        setRole(initialData.role);
        setPassword(""); // kosongkan untuk keamanan
      } else {
        setUsername("");
        setRole("");
        setPassword("");
      }
      setError("");
      setShowOldPassword(false);
    }
  }, [open, isEdit, initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const payload: Record<string, unknown> = { username, role };
      if (!isEdit) payload.password = password;

      const res = isEdit
        ? await axiosInstance.put(`/users/${initialData?.id}`, payload)
        : await axiosInstance.post("/users", payload);

      if (res.data?.status === "success") {
        onSuccess(res.data.message);
        const closeBtn = document.getElementById(
          "close-dialog-btn"
        ) as HTMLButtonElement;
        if (closeBtn) closeBtn.click();
      } else {
        setError("Gagal menyimpan data.");
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const msg =
          err?.response?.data?.message || "Gagal menyimpan data pengguna.";
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        onInteractOutside={(e) => e.preventDefault()}
        className="sm:max-w-[500px]"
      >
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{isEdit ? "Edit" : "Tambah"} Pengguna</DialogTitle>
            <DialogDescription>
              {isEdit
                ? "Ubah data pengguna sesuai kebutuhan."
                : "Masukkan data pengguna baru."}
            </DialogDescription>
          </DialogHeader>

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircleIcon className="h-5 w-5" />
              <AlertTitle>Gagal Menyimpan</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            {!isEdit && (
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <div className="mb-4 flex items-center space-x-2">
                  <Input
                    id="password"
                    type={showOldPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setShowOldPassword((prev) => !prev)}
                  >
                    {showOldPassword ? (
                      <EyeOffIcon className="w-4 h-4" />
                    ) : (
                      <EyeIcon className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={role}
                onValueChange={(value) => setRole(value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih role" />
                </SelectTrigger>
                <SelectContent>
                  {ROLES.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r.charAt(0).toUpperCase() + r.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" id="close-dialog-btn">
                Batal
              </Button>
            </DialogClose>
            <Button type="submit" disabled={loading}>
              {loading ? "Menyimpan..." : "Simpan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

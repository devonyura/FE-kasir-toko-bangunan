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
import axios from "axios";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string | null;
  onSuccess: (message: string) => void;
}

export default function ResetPasswordDialogForm({
  open,
  onOpenChange,
  userId,
  onSuccess,
}: Props) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  useEffect(() => {
    if (open) {
      setOldPassword("");
      setNewPassword("");
      setError("");
      setShowOldPassword(false);
      setShowNewPassword(false);
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    setError("");
    setLoading(true);
    try {
      const payload = {
        old_password: oldPassword,
        new_password: newPassword,
      };

      const res = await axiosInstance.put(
        `/users/reset-password/${userId}`,
        payload
      );

      if (res.data?.status === "success") {
        onSuccess(res.data.message);
        const closeBtn = document.getElementById("close-reset-dialog-btn");
        if (closeBtn instanceof HTMLButtonElement) closeBtn.click();
      } else {
        setError("Reset password gagal.");
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const msg = err.response?.data?.message || "Gagal menyimpan data.";
        setError(msg);
        setTimeout(() => {
          setError("");
        }, 2300);
      }
      // console.lo;
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
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              Masukkan password lama dan baru untuk pengguna ini.
            </DialogDescription>
          </DialogHeader>

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircleIcon className="h-5 w-5" />
              <AlertTitle>Gagal</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid gap-4 py-4">
            {/* Old Password Field */}
            <div className="grid gap-2 relative">
              <Label htmlFor="old_password">Password Lama</Label>
              <div className="mb-4 flex items-center space-x-2">
                <Input
                  id="old_password"
                  type={showOldPassword ? "text" : "password"}
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
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

            {/* New Password Field */}
            <div className="grid gap-2 relative">
              <Label htmlFor="new_password">Password Baru</Label>
              <div className="mb-4 flex items-center space-x-2">
                <Input
                  id="new_password"
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setShowNewPassword((prev) => !prev)}
                >
                  {showNewPassword ? (
                    <EyeOffIcon className="w-4 h-4" />
                  ) : (
                    <EyeIcon className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                id="close-reset-dialog-btn"
              >
                Batal
              </Button>
            </DialogClose>
            <Button type="submit" disabled={loading}>
              {loading ? "Menyimpan..." : "Reset"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

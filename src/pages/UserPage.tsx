// src/pages/User.tsx
import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon, Loader2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";

import { axiosInstance } from "@/utils/axios";
import { DataTable } from "@/components/barang/DataTable";
import { columns } from "@/components/user/columns";
import type { User } from "@/components/user/types";
import UserDialogForm from "@/components/user/UserDialogForm";
import DeleteConfirmDialog from "@/components/barang/DeleteConfirmDialog";
import ResetPasswordDialogForm from "@/components/user/ResetPasswordDialogForm";

export default function UserPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // form state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editData, setEditData] = useState<User | null>(null);
  const [successMessage, setSuccessMessage] = useState("");

  // confirm delete
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState<string | null>(null);

  // reset password state
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [resetUserId, setResetUserId] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/users");
      setUsers(res.data.data);
    } catch {
      setError("Gagal memuat data pengguna.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSuccess = (message: string) => {
    setDialogOpen(false);
    setSuccessMessage(message);
    fetchUsers();
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedDeleteId) return;
    try {
      const res = await axiosInstance.delete(`/users/${selectedDeleteId}`);
      if (res.data?.status === "success") {
        setSuccessMessage(res.data.message || "Pengguna berhasil dihapus");
        fetchUsers();
        setTimeout(() => setSuccessMessage(""), 3000);
      }
    } catch (err: unknown) {
      const msg = err?.response?.data?.message || "Gagal menghapus pengguna.";
      setError(msg);
    } finally {
      setDeleteDialogOpen(false);
      setSelectedDeleteId(null);
    }
  };

  const handleOpenResetPassword = (userId: string) => {
    setResetUserId(userId);
    setResetDialogOpen(true);
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold tracking-tight">Kelola Pengguna</h1>
      <p className="text-sm text-muted-foreground">
        Menampilkan daftar pengguna yang terdaftar di sistem.
      </p>

      {error && (
        <Alert variant="destructive">
          <AlertCircleIcon className="h-5 w-5" />
          <AlertTitle>Terjadi Kesalahan</AlertTitle>
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}
      <Button
        onClick={() => {
          setEditData(null);
          setDialogOpen(true);
        }}
      >
        Tambah Pengguna
      </Button>

      {loading ? (
        <Button size="lg" disabled className="w-full">
          <Loader2Icon className="animate-spin mr-2" />
          Memuat data...
        </Button>
      ) : (
        <DataTable
          data={users}
          columns={columns(handleOpenResetPassword, (id) => {
            setSelectedDeleteId(id);
            setDeleteDialogOpen(true);
          })}
          filterKey="username"
          totalCountText={`Total pengguna: ${users.length}`}
        />
      )}
      <UserDialogForm
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initialData={editData}
        onSuccess={handleSuccess}
      />
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onCancel={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
      />
      <ResetPasswordDialogForm
        open={resetDialogOpen}
        onOpenChange={(open) => {
          setResetDialogOpen(open);
          if (!open) setResetUserId(null);
        }}
        userId={resetUserId}
        onSuccess={(msg) => {
          setSuccessMessage(msg);
          setTimeout(() => setSuccessMessage(""), 3000);
        }}
      />
    </div>
  );
}

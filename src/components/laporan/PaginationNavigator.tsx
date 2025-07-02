import { Button } from "@/components/ui/button";

type PaginationProps = {
  page: number;
  setPage: (p: number) => void;
  totalPages: number;
};

export function PaginationNavigator({
  page,
  setPage,
  totalPages,
}: PaginationProps) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex justify-end items-center gap-2 mt-4">
      <Button size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>
        Sebelumnya
      </Button>
      <span className="text-sm">
        Halaman {page} dari {totalPages}
      </span>
      <Button
        size="sm"
        disabled={page >= totalPages}
        onClick={() => setPage(page + 1)}
      >
        Berikutnya
      </Button>
    </div>
  );
}

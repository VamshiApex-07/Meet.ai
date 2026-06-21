import { Button } from "@/components/ui/button";

interface Props {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const DataPagination = ({ page, totalPages, onPageChange }: Props) => {
  const clampedPage = Math.min(Math.max(1, page), totalPages || 1);
  return (
    <div className="flex items-center justify-between">
      <div className="text-muted-foreground flex-1 text-sm">
        Page {clampedPage} of {totalPages || 1}
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          disabled={clampedPage === 1}
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.max(1, clampedPage - 1))}
        >
          Previous
        </Button>
        <Button
          disabled={clampedPage === totalPages || totalPages === 0}
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.min(totalPages, clampedPage + 1))}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

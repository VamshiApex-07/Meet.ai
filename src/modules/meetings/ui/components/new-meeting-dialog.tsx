import { useState, useRef, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import { MeetingForm } from "./meeting-form";
import { useRouter } from "next/navigation";
interface NewMeetingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NewMeetingDialog = ({
  open,
  onOpenChange,
}: NewMeetingDialogProps) => {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const toastIdRef = useRef<string | number | null>(null);

  useEffect(() => {
    return () => {
      if (toastIdRef.current) {
        toast.dismiss(toastIdRef.current);
        toastIdRef.current = null;
      }
    };
  }, []);

  const handlePendingChange = useCallback((pending: boolean) => {
    setIsPending(pending);
    if (pending) {
      toastIdRef.current = toast.loading("Creating your meeting, please wait...");
    } else if (toastIdRef.current) {
      toast.dismiss(toastIdRef.current);
      toastIdRef.current = null;
    }
  }, []);

  return (
    <ResponsiveDialog
      title="New Meeting"
      description="Create a new Meeting"
      open={open}
      onOpenChange={onOpenChange}
      preventClose={isPending}
    >
      <MeetingForm
        onPendingChange={handlePendingChange}
        onSuccess={(id) => {
          if (toastIdRef.current) {
            toast.success("Meeting created!", { id: toastIdRef.current });
            toastIdRef.current = null;
          }
          router.push(`/meetings/${id}`);
        }}
        onCancel={() => onOpenChange(false)}
      />
    </ResponsiveDialog>
  );
};

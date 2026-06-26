import { useState, useRef, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { ResponsiveDialog } from "@/components/responsive-dialog";

import { MeetingForm } from "./meeting-form";
import { MeetingGetOne } from "../../types";

interface UpdateMeetingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues: MeetingGetOne;
};

export const UpdateMeetingDialog = ({
  open,
  onOpenChange,
  initialValues,
}: UpdateMeetingDialogProps) => {
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
      toastIdRef.current = toast.loading("Updating meeting, please wait...");
    } else if (toastIdRef.current) {
      toast.dismiss(toastIdRef.current);
      toastIdRef.current = null;
    }
  }, []);

  return (
    <ResponsiveDialog
      title="Edit Meeting"
      description="Edit the meeting details"
      open={open}
      onOpenChange={onOpenChange}
      preventClose={isPending}
    >
      <MeetingForm
        onPendingChange={handlePendingChange}
        onSuccess={() => {
          if (toastIdRef.current) {
            toast.success("Meeting updated!", { id: toastIdRef.current });
            toastIdRef.current = null;
          }
          onOpenChange(false);
        }}
        onCancel={() => onOpenChange(false)}
        initialValues={initialValues}
      />
    </ResponsiveDialog>
  );
};
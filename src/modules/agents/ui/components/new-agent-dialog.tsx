import { useState, useRef, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import { AgentForm } from "./agent-form";

interface NewAgentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NewAgentDialog = ({ open, onOpenChange }: NewAgentDialogProps) => {
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
      toastIdRef.current = toast.loading("Creating your agent, please wait...");
    } else if (toastIdRef.current) {
      toast.dismiss(toastIdRef.current);
      toastIdRef.current = null;
    }
  }, []);

  return (
    <ResponsiveDialog
      title="New Agent"
      description="Create a new agent"
      open={open}
      onOpenChange={onOpenChange}
      preventClose={isPending}
    >
      <AgentForm
        onPendingChange={handlePendingChange}
        onSuccess={() => {
          if (toastIdRef.current) {
            toast.success("Agent created!", { id: toastIdRef.current });
            toastIdRef.current = null;
          }
          onOpenChange(false);
        }}
        onCancel={() => onOpenChange(false)}
      />
    </ResponsiveDialog>
  );
};

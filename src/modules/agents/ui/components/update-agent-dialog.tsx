import { useState, useRef, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { ResponsiveDialog } from "@/components/responsive-dialog";

import { AgentForm } from "./agent-form";
import { AgentGetOne } from "../../types";

interface UpdateAgentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues: AgentGetOne;
}

export const UpdateAgentDialog = ({
  open,
  onOpenChange,
  initialValues,
}: UpdateAgentDialogProps) => {
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
      toastIdRef.current = toast.loading("Updating agent, please wait...");
    } else if (toastIdRef.current) {
      toast.dismiss(toastIdRef.current);
      toastIdRef.current = null;
    }
  }, []);

  return (
    <ResponsiveDialog
      title="Edit Agent"
      description="Edit the agent details"
      open={open}
      onOpenChange={onOpenChange}
      preventClose={isPending}
    >
      <AgentForm
        onPendingChange={handlePendingChange}
        onSuccess={() => {
          if (toastIdRef.current) {
            toast.success("Agent updated!", { id: toastIdRef.current });
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

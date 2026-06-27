"use client";

import { HydrationBoundary } from "@tanstack/react-query";
import type { DehydratedState } from "@tanstack/react-query";

import { ErrorBoundary } from "react-error-boundary";
import { DashboardView } from "../views/dashboard-view";
import { ErrorState } from "@/components/error-state";

interface Props {
  dehydratedState: DehydratedState;
}

export const DashboardClient = ({ dehydratedState }: Props) => {
  return (
    <HydrationBoundary state={dehydratedState}>
      <ErrorBoundary
        fallback={
          <ErrorState
            title="Error"
            description="Something went wrong loading the dashboard"
          />
        }
      >
        <DashboardView />
      </ErrorBoundary>
    </HydrationBoundary>
  );
};

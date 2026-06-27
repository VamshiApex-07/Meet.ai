import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { dehydrate } from "@tanstack/react-query";

import { auth } from "@/lib/auth";
import { getQueryClient, trpc } from "@/trpc/server";
import { DashboardClient } from "@/modules/dashboard/ui/components/dashboard-client";

const Page = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  const queryClient = getQueryClient();

  await Promise.all([
    queryClient.prefetchQuery(
      trpc.meetings.getDashboardStats.queryOptions(),
    ),
    queryClient.prefetchQuery(
      trpc.premium.getFreeUsage.queryOptions(),
    ),
  ]);

  return <DashboardClient dehydratedState={dehydrate(queryClient)} />;
};

export default Page;

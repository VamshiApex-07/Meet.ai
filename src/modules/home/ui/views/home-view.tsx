"use client";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
export const HomeView = () => {
  const t=useTRPC();
  const {data}=useQuery(t.hello.queryOptions({text:"Vamshi NIgga"}));
  return (
    <div className="flex flex-col p-4 gap-y-4">
      {data?.greeting}
    </div>
  );
};
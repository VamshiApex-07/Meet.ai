"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  VideoIcon,
  BotIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowRightIcon,
} from "lucide-react";

import { useTRPC } from "@/trpc/client";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { LoadingState } from "@/components/loading-state";
import { GeneratedAvatar } from "@/components/generated-avatar";
import {
  MAX_FREE_AGENTS,
  MAX_FREE_MEETINGS,
} from "@/modules/premium/constants";

const statusBadge: Record<string, { label: string; className: string }> = {
  upcoming: { label: "Upcoming", className: "bg-blue-100 text-blue-700 hover:bg-blue-100" },
  active: { label: "Active", className: "bg-green-100 text-green-700 hover:bg-green-100" },
  completed: { label: "Completed", className: "bg-neutral-100 text-neutral-700 hover:bg-neutral-100" },
  processing: { label: "Processing", className: "bg-amber-100 text-amber-700 hover:bg-amber-100" },
  cancelled: { label: "Cancelled", className: "bg-red-100 text-red-700 hover:bg-red-100" },
};

export const DashboardView = () => {
  const trpc = useTRPC();

  const { data, isPending } = useQuery(
    trpc.meetings.getDashboardStats.queryOptions(),
  );

  const { data: freeUsage } = useQuery(
    trpc.premium.getFreeUsage.queryOptions(),
  );

  if (isPending) {
    return (
      <LoadingState
        title="Loading Dashboard"
        description="This may take a few seconds"
      />
    );
  }

  if (!data) return null;

  const hoursLogged = Math.round((Number(data.totalDuration) / 3600) * 10) / 10;

  return (
    <div className="flex flex-1 flex-col gap-y-6 px-4 py-4 md:px-8">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-muted-foreground text-sm">
          Overview of your meetings and agents
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <Card className="py-4">
          <CardContent className="flex flex-col gap-y-1 px-4">
            <div className="flex items-center gap-x-2 text-muted-foreground">
              <VideoIcon className="size-4" />
              <span className="text-xs font-medium">Total Meetings</span>
            </div>
            <p className="text-2xl font-semibold">{data.totalMeetings}</p>
          </CardContent>
        </Card>
        <Card className="py-4">
          <CardContent className="flex flex-col gap-y-1 px-4">
            <div className="flex items-center gap-x-2 text-muted-foreground">
              <div className="size-2 rounded-full bg-green-500" />
              <span className="text-xs font-medium">Active Now</span>
            </div>
            <p className="text-2xl font-semibold">
              {data.meetingsByStatus.active}
            </p>
          </CardContent>
        </Card>
        <Card className="py-4">
          <CardContent className="flex flex-col gap-y-1 px-4">
            <div className="flex items-center gap-x-2 text-muted-foreground">
              <CheckCircleIcon className="size-4" />
              <span className="text-xs font-medium">Completed</span>
            </div>
            <p className="text-2xl font-semibold">
              {data.meetingsByStatus.completed}
            </p>
          </CardContent>
        </Card>
        <Card className="py-4">
          <CardContent className="flex flex-col gap-y-1 px-4">
            <div className="flex items-center gap-x-2 text-muted-foreground">
              <ClockIcon className="size-4" />
              <span className="text-xs font-medium">Hours Logged</span>
            </div>
            <p className="text-2xl font-semibold">{hoursLogged}</p>
          </CardContent>
        </Card>
        <Card className="py-4">
          <CardContent className="flex flex-col gap-y-1 px-4">
            <div className="flex items-center gap-x-2 text-muted-foreground">
              <BotIcon className="size-4" />
              <span className="text-xs font-medium">Agents</span>
            </div>
            <p className="text-2xl font-semibold">{data.totalAgents}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <div className="flex items-center justify-between px-4 pt-4">
            <h2 className="text-sm font-medium">Recent Meetings</h2>
            <Button variant="ghost" size="sm" className="gap-x-1 text-xs" asChild>
              <Link href="/meetings">
                View all <ArrowRightIcon className="size-3" />
              </Link>
            </Button>
          </div>
          <CardContent className="px-4 pb-4">
            {data.recentMeetings.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No meetings yet
              </p>
            ) : (
              <div className="mt-2 divide-y">
                {data.recentMeetings.map((meeting) => (
                  <Link
                    key={meeting.id}
                    href={`/meetings/${meeting.id}`}
                    className="flex items-center gap-x-3 py-3 transition-colors hover:text-primary"
                  >
                    <GeneratedAvatar
                      seed={meeting.agent.name}
                      variant="botttsNeutral"
                      className="size-8 border"
                    />
                    <div className="flex flex-1 flex-col">
                      <span className="text-sm font-medium">{meeting.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {meeting.createdAt
                          ? format(new Date(meeting.createdAt), "MMM d, yyyy")
                          : ""}
                      </span>
                    </div>
                    <Badge
                      variant="secondary"
                      className={cn(
                        "text-xs",
                        statusBadge[meeting.status]?.className,
                      )}
                    >
                      {statusBadge[meeting.status]?.label ?? meeting.status}
                    </Badge>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <div className="flex items-center justify-between px-4 pt-4">
            <h2 className="text-sm font-medium">Recent Agents</h2>
            <Button variant="ghost" size="sm" className="gap-x-1 text-xs" asChild>
              <Link href="/agents">
                View all <ArrowRightIcon className="size-3" />
              </Link>
            </Button>
          </div>
          <CardContent className="px-4 pb-4">
            {data.recentAgents.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No agents yet
              </p>
            ) : (
              <div className="mt-2 divide-y">
                {data.recentAgents.map((agent) => (
                  <Link
                    key={agent.id}
                    href={`/agents/${agent.id}`}
                    className="flex items-center gap-x-3 py-3 transition-colors hover:text-primary"
                  >
                    <GeneratedAvatar
                      seed={agent.name}
                      variant="botttsNeutral"
                      className="size-8 border"
                    />
                    <div className="flex flex-1 flex-col">
                      <span className="text-sm font-medium">{agent.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {agent.meetingCount}{" "}
                        {agent.meetingCount === 1 ? "meeting" : "meetings"}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {agent.voice}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {freeUsage && (
        <Card>
          <CardContent className="flex flex-col gap-y-4 px-4 py-4">
            <div className="flex items-center gap-x-2">
              <h2 className="text-sm font-medium">Free Trial</h2>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                {data.totalMeetings}/{MAX_FREE_MEETINGS} meetings used
              </span>
            </div>
            <div className="flex flex-col gap-y-3">
              <div className="flex flex-col gap-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Meetings</span>
                  <span className="text-muted-foreground">
                    {freeUsage.meetingCount}/{MAX_FREE_MEETINGS}
                  </span>
                </div>
                <Progress
                  value={(freeUsage.meetingCount / MAX_FREE_MEETINGS) * 100}
                />
              </div>
              <div className="flex flex-col gap-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Agents</span>
                  <span className="text-muted-foreground">
                    {freeUsage.agentCount}/{MAX_FREE_AGENTS}
                  </span>
                </div>
                <Progress
                  value={(freeUsage.agentCount / MAX_FREE_AGENTS) * 100}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

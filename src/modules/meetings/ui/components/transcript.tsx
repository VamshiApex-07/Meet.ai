import { useState } from "react";
import { format } from "date-fns";
import { SearchIcon, DownloadIcon } from "lucide-react";
import Highlighter from "react-highlight-words";
import { useQuery } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { generateAvatarUri } from "@/lib/avatar";
import { LoadingState } from "@/components/loading-state";

interface Props {
  meetingId: string;
}

export const Transcript = ({ meetingId }: Props) => {
  const trpc = useTRPC();
  const { data, isLoading } = useQuery(trpc.meetings.getTranscript.queryOptions({ id: meetingId }))

  const [searchQuery, setSearchQuery] = useState("");
  const filteredData = (data ?? []).filter((item) =>
    item.text.toString().toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <LoadingState
        title="Loading transcript"
        description="Fetching transcript data..."
      />
    );
  }

  const handleDownload = () => {
    const text = (data ?? [])
      .map((item) => `[${format(new Date(0, 0, 0, 0, 0, 0, item.start_ts), "mm:ss")}] ${item.user.name}: ${item.text}`)
      .join("\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transcript-${meetingId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-lg border px-4 py-5 flex flex-col gap-y-4 w-full">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">Transcript</p>
        <Button variant="outline" size="sm" onClick={handleDownload} className="gap-x-2">
          <DownloadIcon className="size-4" />
          Download TXT
        </Button>
      </div>
      <div className="relative">
        <Input
          placeholder="Search Transcript"
          className="pl-7 h-9 w-[240px]"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <SearchIcon className="absolute left-2 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
      </div>
      <ScrollArea>
        <div className="flex flex-col gap-y-4">
          {filteredData.map((item) => {
            return (
              <div
                key={item.start_ts}
                className="flex flex-col gap-y-2 hover:bg-muted p-4 rounded-md border"
              >
                <div className="flex gap-x-2 items-center">
                  <Avatar className="size-6">
                    <AvatarImage
                      src={item.user.image ?? generateAvatarUri({ seed: item.user.name, variant: "initials" })}
                      alt="User Avatar"
                    />
                  </Avatar>
                  <p className="text-sm font-medium">{item.user.name}</p>
                  <p className="text-sm text-blue-500 font-medium">
                    {format(
                      new Date(0, 0, 0, 0, 0, 0, item.start_ts),
                      "mm:ss"
                    )}
                  </p>
                </div>
                <Highlighter
                  className="text-sm text-neutral-700"
                  highlightClassName="bg-yellow-200"
                  searchWords={[searchQuery]}
                  autoEscape={true}
                  textToHighlight={item.text}
                />
              </div>
            )
          })}
        </div>
      </ScrollArea>
    </div>
  )
};
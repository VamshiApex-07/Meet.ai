import Link from "next/link";
import Image from "next/image";
import {
  CallControls,
  SpeakerLayout,
} from "@stream-io/video-react-sdk";

import { useIsMobile } from "@/hooks/use-mobile";

interface Props {
  onLeave: () => void;
  meetingName: string;
};

export const CallActive = ({ onLeave, meetingName }: Props) => {
  const isMobile = useIsMobile();

  return (
    <div className="flex flex-col justify-between p-2 md:p-4 h-full text-white">
      <div className={`bg-[#101213] ${isMobile ? "rounded-lg p-2" : "rounded-full p-4"} flex items-center gap-2 md:gap-4`}>
        <Link href="/" className={`flex items-center justify-center bg-white/10 rounded-full w-fit ${isMobile ? "p-0.5" : "p-1"}`}>
          <Image src="/logo.svg" width={isMobile ? 18 : 22} height={isMobile ? 18 : 22} alt="Logo" />
        </Link>
        <h4 className={`truncate ${isMobile ? "text-sm" : "text-base"}`}>
          {meetingName}
        </h4>
      </div>
      <SpeakerLayout />
      <div className="bg-[#101213] rounded-full px-2 md:px-4">
        <CallControls onLeave={onLeave} />
      </div>
    </div>
  );
};
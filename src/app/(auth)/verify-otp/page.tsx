import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

import { VerifyOTPView } from "@/modules/auth/ui/views/verify-otp-view";

const Page = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-up");
  }

  return <VerifyOTPView />;
};

export default Page;

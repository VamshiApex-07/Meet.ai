"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { OctagonAlertIcon } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertTitle } from "@/components/ui/alert";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

export const VerifyOTPView = () => {
  const router = useRouter();

  const [otp, setOtp] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const session = authClient.useSession();
  const email = session.data?.user.email ?? "";

  const onVerify = async () => {
    if (otp.length < 6) return;

    setError(null);
    setPending(true);

    const { error: verifyError } = await authClient.emailOtp.verifyEmail({
      email,
      otp,
    });

    if (verifyError) {
      setPending(false);
      setError(verifyError.message ?? "Something went wrong");
      return;
    }

    setSuccess(true);
    setPending(false);
    router.push("/");
  };

  const onResend = async () => {
    setError(null);
    setPending(true);

    const { error: sendError } = await authClient.emailOtp.sendVerificationOtp({
      email,
      type: "email-verification",
    });

    setPending(false);

    if (sendError) {
      setError(sendError.message ?? "Something went wrong");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <div className="flex flex-col items-center justify-center gap-6 p-6 md:p-8">
            <div className="flex flex-col items-center text-center">
              <h1 className="text-2xl font-bold">Verify your email</h1>
              <p className="text-muted-foreground text-balance mt-2">
                Enter the 6-digit code sent to{" "}
                <span className="font-medium text-foreground">{email}</span>
              </p>
            </div>

            <div className="flex flex-col items-center gap-4">
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={setOtp}
                disabled={pending || success}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>

              {!!error && (
                <Alert className="bg-destructive/10 border-none">
                  <OctagonAlertIcon className="!text-destructive h-4 w-4" />
                  <AlertTitle>{error}</AlertTitle>
                </Alert>
              )}

              <Button
                disabled={otp.length < 6 || pending || success}
                onClick={onVerify}
                className="w-full"
              >
                Verify email
              </Button>

              <p className="text-muted-foreground text-sm">
                Didn&apos;t receive the code?{" "}
                <button
                  type="button"
                  disabled={pending}
                  onClick={onResend}
                  className="text-foreground underline underline-offset-4 hover:no-underline"
                >
                  Resend code
                </button>
              </p>
            </div>
          </div>

          <div className="from-sidebar-accent to-sidebar relative hidden flex-col items-center justify-center gap-y-4 bg-radial md:flex">
            <Image src="/logo.svg" alt="Meet.AI" width={92} height={92} />
            <p className="text-2xl font-semibold text-white">Meet.AI</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

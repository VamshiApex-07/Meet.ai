import { createAuthClient } from "better-auth/react";
import { emailOTPClient } from "better-auth/client/plugins";
import { polarClient } from "@polar-sh/better-auth";

export const authClient = createAuthClient({
  plugins: [
    emailOTPClient(),
    polarClient(),
  ],
});
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { emailOTP } from "better-auth/plugins";
import { polar, checkout, portal } from "@polar-sh/better-auth"

import { db } from "@/db";
import * as schema from "@/db/schema";

import { polarClient } from "./polar";
import { sendOTPEmail } from "./email";

export const auth = betterAuth({
  plugins: [
    emailOTP({
      sendVerificationOTP: async ({ email, otp }) => {
        await sendOTPEmail(email, otp);
      },
      sendVerificationOnSignUp: true,
    }),
    polar({
      client: polarClient,
      createCustomerOnSignUp: true,
      use: [
        checkout({
          authenticatedUsersOnly: true,
          successUrl: "/upgrade"
        }),
        portal(),
      ]
    }),
  ],
  trustedOrigins: process.env.TRUSTED_ORIGINS
    ? process.env.TRUSTED_ORIGINS.split(",")
    : ["http://localhost:3000"],
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  emailAndPassword: {
    enabled: true,
  },
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      ...schema,
    },
  }),
});

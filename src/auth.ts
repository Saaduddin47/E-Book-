import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { sendMagicLinkEmail } from "@/lib/email";
import authConfig from "@/auth.config";

/**
 * Full Auth.js configuration (Node runtime). Adds the Prisma adapter and the
 * email magic-link provider on top of the edge-safe base config.
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  providers: [
    {
      id: "email",
      type: "email",
      name: "Email",
      from: process.env.EMAIL_FROM ?? "onboarding@resend.dev",
      maxAge: 30 * 60, // magic link valid for 30 minutes
      // Required no-op options for the email provider type
      server: {},
      options: {},
      async sendVerificationRequest({
        identifier,
        url,
      }: {
        identifier: string;
        url: string;
      }) {
        const host = new URL(url).host;
        await sendMagicLinkEmail({ to: identifier, url, host });
      },
    },
  ],
});

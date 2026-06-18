import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe Auth.js configuration shared between the middleware (edge runtime)
 * and the full server config in auth.ts. It MUST NOT import Prisma or any
 * Node-only modules so it can run in the edge middleware bundle.
 */
export const authConfig = {
  pages: {
    signIn: "/login",
    verifyRequest: "/login/verify",
    error: "/login",
  },
  session: { strategy: "jwt" },
  providers: [],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        // role is present on the adapter user at runtime
        token.role = (user as { role?: string }).role ?? "USER";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id as string) ?? token.sub ?? "";
        session.user.role = (token.role as "USER" | "ADMIN") ?? "USER";
      }
      return session;
    },
  },
} satisfies NextAuthConfig;

export default authConfig;

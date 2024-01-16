import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import GitHub from "next-auth/providers/github";

import authConfig from "./auth.config";
import { db } from "@/lib/db";
import { getUserById } from "./data/user";

declare module "next-auth" {
  interface User {
    role: string;
  }
}
/*
Events: Ermöglichen es Ihnen, auf bestimmte Momente im Authentifizierungsprozess zu reagieren, ohne diesen Prozess direkt zu beeinflussen.
Callbacks: Geben Ihnen die Kontrolle über den Authentifizierungsprozess, sodass Sie dessen Verhalten und Ergebnisse direkt beeinflussen können.
*/

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
  update,
} = NextAuth({
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
  },
  callbacks: {
    async signIn({ user }) {
      /* const existingUser = await getUserById(user.id);
      if (!existingUser || !existingUser.emailVerified) {
        return false;
      } */

      return true;
    },
    async session({ session, token }) {
      if (session.user && token.sub && token.role) {
        session.user.id = token.sub;
        session.user.role = token.role as string;
      }
      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;
      const existingUser = await getUserById(token.sub);
      if (existingUser) {
        token.role = existingUser.role;
      }
      return token;
    },
  },
  /*@ts-ignore*/
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
});

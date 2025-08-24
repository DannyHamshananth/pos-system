import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";

// Extend built-in types
declare module "next-auth" {
  interface User extends DefaultUser {
    role?: string;  // 👈 add your custom role here
  }

  interface Session {
    user?: {
      role?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
  }
}
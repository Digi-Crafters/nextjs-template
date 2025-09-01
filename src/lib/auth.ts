import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import { verifyPassword } from "@/lib/password";

export const authOptions: NextAuthOptions = {
  // Use JWT for session management (essential for API routes)
  session: { strategy: "jwt" },
  
  // Configure authentication providers
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          // Find the user by email
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });
          
          // If no user found or password doesn't match, return null
          if (!user) return null;
          
          const passwordMatch = await verifyPassword(credentials.password, user.password);
          if (!passwordMatch) return null;
          
          // Return only necessary user data (never include password)
          return { 
            id: user.id, 
            name: user.name ?? null, 
            email: user.email 
          };
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
        }
      },
    }),
  ],
  
  // JWT and session callbacks to handle user data
  callbacks: {
    async jwt({ token, user }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    
    async session({ session, token }) {
      // Add user ID to the session
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
      }
      return session;
    },
  },
  
  // Use a secure secret for signing tokens
  secret: process.env.AUTH_SECRET,
  
  // Custom pages for authentication flows
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error",
  },
  
  // Security settings
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
};

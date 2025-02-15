import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/prisma";
import { hashPassword } from "@/lib/auth/password";
import { signInSchema } from "./lib/zod";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  /* session: {
    strategy: "jwt",
  }, */
  /*  pages: {
    signIn: "/signin",
    newUser: "/signup",
  }, */
  providers: [
    CredentialsProvider({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        const { email, password } = await signInSchema.parseAsync(credentials);
        // Hash the provided password
        const hashedPassword = await hashPassword(password);

        // Find user with matching email and password hash
        const user = await prisma.user.findFirst({
          where: {
            email,
            password: hashedPassword,
            deletedAt: null,
          },
        });

        if (!user) {
          throw new Error("Invalid credentials");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
  callbacks: {
    /* authorized: async ({ auth }) => {
      // Logged in users are authenticated, otherwise redirect to login page
      return !!auth;
    }, */
    /* async session({ token, session }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
      }

      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }

      return token;
    }*/
  },
});

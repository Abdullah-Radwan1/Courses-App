import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { ZodError } from "zod";
import { signInSchema } from "./zod";
import bcrypt from "bcryptjs";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "../../../prisma/db";

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(db),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        name: { label: "Name", type: "text", optional: true },
        role: { label: "Role", type: "text", optional: true },
        isSignUp: { label: "Is Sign Up", type: "hidden" },
      },
      async authorize(credentials) {
        if (!credentials) throw new Error("Missing credentials");

        // ✅ Step 1: Validate input with Zod
        try {
          await signInSchema.parseAsync({
            email: credentials.email,
            password: credentials.password,
          });
        } catch (err) {
          if (err instanceof ZodError) {
            // Use flatten() to get structured field errors
            const flattened = err.flatten();
            // Combine all messages into one string
            const messages = Object.values(flattened.fieldErrors)
              .flat()
              .filter(Boolean)
              .join(", ");
            throw new Error(messages || "Invalid input");
          }
          throw err;
        }

        const isSignUp = credentials.isSignUp === "true";
        const existingUser = await db.user.findUnique({
          where: { email: credentials.email },
        });

        // ✅ Sign-up flow
        if (isSignUp) {
          if (existingUser) throw new Error("User already exists.");
          if (!credentials.name)
            throw new Error("Name is required for sign-up.");

          const hashedPassword = await bcrypt.hash(credentials.password, 10);
          const newUser = await db.user.create({
            data: {
              name: credentials.name,
              email: credentials.email,
              password: hashedPassword,
            },
          });

          return {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
          };
        }

        // ✅ Sign-in flow
        if (!existingUser) throw new Error("User not found. Please sign up.");

        const isValid = await bcrypt.compare(
          credentials.password,
          existingUser.password!
        );
        if (!isValid) throw new Error("Invalid credentials");

        return {
          id: existingUser.id,
          name: existingUser.name,
          email: existingUser.email,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as { id: string }).id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
      }
      return session;
    },
  },
};

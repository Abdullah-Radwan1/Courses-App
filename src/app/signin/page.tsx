"use client";

import { useState } from "react";
import { ZodError, treeifyError } from "zod";
import { signInSchema } from "@/lib/auth/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    try {
      // Validate input with Zod
      signInSchema.parse({ email, password });

      // Call NextAuth signIn
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
      if (res?.error) {
        setErrors({ general: res.error });
      }
    } catch (err) {
      if (err instanceof ZodError) {
        setErrors({
          email: err.name,
          password: err.message,
        });
        if (err instanceof ZodError) {
          const tree = treeifyError(err) as {
            errors: string[];
            properties?: Record<string, { errors: string[] }>;
          };
          /**
           * tree has this structure:
           * {
           *   errors: ["general error if any"],
           *   properties: {
           *     email: { errors: ["Invalid email address"] },
           *     password: { errors: ["Password must be at least 8 characters"] }
           *   }
           * }
           */

          setErrors({
            email: tree.properties?.email?.errors?.[0],
            password: tree.properties?.password?.errors?.[0],
            general: tree.errors?.[0], // optional general messages
          });
        }
      } else {
        setErrors({ general: "Unexpected error occurred" });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-xl border border-border bg-card shadow-lg p-8">
        <h1 className="text-3xl font-semibold text-center text-foreground mb-8">
          Welcome Back
        </h1>

        {errors.general && (
          <p className="text-destructive text-sm mb-4 text-center">
            {errors.general}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Email
            </label>
            <Input
              value={email}
              placeholder="you@example.com"
              onChange={(e) => setEmail(e.target.value)}
              className="bg-input border border-border text-foreground placeholder:text-muted-foreground focus:ring-ring focus:border-ring"
            />
            {errors.email && (
              <p className="text-destructive text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Password
            </label>
            <Input
              type="password"
              value={password}
              placeholder="********"
              onChange={(e) => setPassword(e.target.value)}
              className="bg-input border border-border text-foreground placeholder:text-muted-foreground focus:ring-ring focus:border-ring"
            />
            {errors.password && (
              <p className="text-destructive text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <p className="text-sm text-muted-foreground text-center mt-6">
          Don’t have an account?{" "}
          <a href="/signup" className="text-primary hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}

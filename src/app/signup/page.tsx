"use client";

import { useState } from "react";
import { ZodError, treeifyError } from "zod";
import { signUpSchema } from "@/lib/auth/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    general?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    try {
      // Validate input with Zod
      signUpSchema.parse(formData);

      // Call backend via NextAuth signIn with isSignUp flag
      const res = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
        name: formData.name,
        isSignUp: "true", // Important for backend to create user
      });

      if (res?.error) {
        setErrors({ general: res.error });
      } else if (res?.ok) {
        // Optionally auto-login after signup
        router.push("/");
      }
    } catch (err) {
      if (err instanceof ZodError) {
        const tree = treeifyError(err) as {
          errors: string[];
          properties?: Record<string, { errors: string[] }>;
        };
        setErrors({
          email: tree.properties?.email?.errors?.[0],
          password: tree.properties?.password?.errors?.[0],
          general: tree.errors?.[0], // optional general messages
        });
      } else {
        console.error(err);
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
          Create Account
        </h1>

        {errors.general && (
          <p className="text-destructive text-sm mb-4 text-center">
            {errors.general}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Name
            </label>
            <Input
              name="name"
              value={formData.name}
              placeholder="Your name"
              onChange={handleChange}
              className="bg-input border border-border text-foreground placeholder:text-muted-foreground focus:ring-ring focus:border-ring"
            />
            {errors.name && (
              <p className="text-destructive text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Email
            </label>
            <Input
              name="email"
              value={formData.email}
              placeholder="you@example.com"
              onChange={handleChange}
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
              name="password"
              type="password"
              value={formData.password}
              placeholder="********"
              onChange={handleChange}
              className="bg-input border border-border text-foreground placeholder:text-muted-foreground focus:ring-ring focus:border-ring"
            />
            {errors.password && (
              <p className="text-destructive text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Confirm Password
            </label>
            <Input
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              placeholder="********"
              onChange={handleChange}
              className="bg-input border border-border text-foreground placeholder:text-muted-foreground focus:ring-ring focus:border-ring"
            />
            {errors.confirmPassword && (
              <p className="text-destructive text-sm mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
          >
            {isLoading ? "Creating Account..." : "Sign Up"}
          </Button>
        </form>

        <p className="text-sm text-muted-foreground text-center mt-6">
          Already have an account?{" "}
          <a href="/login" className="text-primary hover:underline">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}

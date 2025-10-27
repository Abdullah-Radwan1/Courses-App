"use client";

import { useState } from "react";
import { ZodError, treeifyError } from "zod";
import { signUpSchema } from "@/lib/auth/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

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

      const res = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
        name: formData.name,
        isSignUp: "true",
      });

      if (res?.error) {
        setErrors({ general: res.error });
      } else if (res?.ok) {
        router.push("/");
      }
    } catch (err) {
      if (err instanceof ZodError) {
        const tree = treeifyError(err) as {
          errors: string[];
          properties?: Record<string, { errors: string[] }>;
        };

        setErrors({
          name: tree.properties?.name?.errors?.[0],
          email: tree.properties?.email?.errors?.[0],
          password: tree.properties?.password?.errors?.[0],
          confirmPassword: tree.properties?.confirmPassword?.errors?.[0],
          general: tree.errors?.[0],
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
    <div className="flex  items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center font-semibold">
            Create Account
          </CardTitle>
          {errors.general && (
            <p className="text-sm text-center text-destructive mt-2">
              {errors.general}
            </p>
          )}
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                placeholder="Your name"
                onChange={handleChange}
              />
              {errors.name && (
                <p className="text-sm text-destructive mt-1">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                value={formData.email}
                placeholder="you@example.com"
                onChange={handleChange}
              />
              {errors.email && (
                <p className="text-sm text-destructive mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                placeholder="********"
                onChange={handleChange}
              />
              {errors.password && (
                <p className="text-sm text-destructive mt-1">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                placeholder="********"
                onChange={handleChange}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-destructive mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Creating Account..." : "Sign Up"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

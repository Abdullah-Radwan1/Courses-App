import { z } from "zod";

export const signInSchema = z.object({
  email: z
    .email()
    .min(1, "Email is required")
    .and(z.email("Invalid email address")),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
});

export const signUpSchema = z
  .object({
    name: z.string().min(2, "Name is too short"),
    email: z
      .email()
      .min(1, "Email is required")
      .and(z.email("Invalid email address")),
    password: z
      .string()
      .min(8, "Password must be more than 8 characters")
      .max(32, "Password must be less than 32 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"], // Show error under confirmPassword
    message: "Passwords do not match",
  });

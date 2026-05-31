import { z } from "zod";

const emailSchema = z
  .string()
  .trim()
  .email("Enter a valid email address.")
  .transform((email) => email.toLowerCase());

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Name is required.")
      .max(80, "Name must be 80 characters or fewer."),
    email: emailSchema,
    verificationCode: z
      .string()
      .trim()
      .regex(/^\d{6}$/, "Enter the 6-digit verification code."),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .max(128, "Password must be 128 characters or fewer."),
    confirmPassword: z.string().min(1, "Confirm your password."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match.",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required."),
});

export const sendRegistrationCodeSchema = z.object({
  email: emailSchema,
});

export type AuthActionState = {
  formError?: string;
  fieldErrors?: Record<string, string[] | undefined>;
  values?: {
    name?: string;
    email?: string;
  };
};

export const initialAuthActionState: AuthActionState = {};

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

export const requestPasswordResetSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z
  .object({
    email: emailSchema,
    verificationCode: z
      .string()
      .trim()
      .regex(/^\d{6}$/, "Enter the 6-digit reset code."),
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

export const updateProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required.")
    .max(80, "Name must be 80 characters or fewer."),
  phone: z
    .string()
    .trim()
    .max(30, "Phone must be 30 characters or fewer.")
    .optional(),
  avatarUrl: z
    .string()
    .trim()
    .max(500, "Avatar URL must be 500 characters or fewer.")
    .optional()
    .refine((value) => !value || value.startsWith("https://"), {
      message: "Avatar URL must start with https://.",
    }),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required."),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .max(128, "Password must be 128 characters or fewer."),
    confirmPassword: z.string().min(1, "Confirm your password."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match.",
    path: ["confirmPassword"],
  })
  .refine((data) => data.password !== data.currentPassword, {
    message: "New password must be different from your current password.",
    path: ["password"],
  });

export type AuthActionState = {
  formError?: string;
  successMessage?: string;
  fieldErrors?: Record<string, string[] | undefined>;
  values?: {
    name?: string;
    email?: string;
    phone?: string;
    avatarUrl?: string;
  };
};

export const initialAuthActionState: AuthActionState = {};

"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { createSession, deleteCurrentSession } from "./session";
import {
  type AuthActionState,
  loginSchema,
  registerSchema,
} from "./validation";
import { verifyRegistrationCode } from "./verification";

const INVALID_LOGIN_MESSAGE = "Invalid email or password.";

function getStringValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

export async function registerAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const rawValues = {
    name: getStringValue(formData, "name"),
    email: getStringValue(formData, "email"),
    verificationCode: getStringValue(formData, "verificationCode"),
    password: getStringValue(formData, "password"),
    confirmPassword: getStringValue(formData, "confirmPassword"),
  };

  const parsed = registerSchema.safeParse(rawValues);

  if (!parsed.success) {
    return {
      fieldErrors: parsed.error.flatten().fieldErrors,
      values: {
        name: rawValues.name,
        email: rawValues.email,
      },
    };
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      email: parsed.data.email,
    },
    select: {
      id: true,
    },
  });

  if (existingUser) {
    return {
      formError: "An account with that email already exists.",
      values: {
        name: parsed.data.name,
        email: parsed.data.email,
      },
    };
  }

  const verification = await verifyRegistrationCode(
    parsed.data.email,
    parsed.data.verificationCode,
  );

  if (!verification.ok) {
    return {
      formError:
        verification.reason === "missing-config"
          ? "Account creation is temporarily unavailable. Missing email verification configuration."
          : verification.reason === "too-many-attempts"
            ? "Too many incorrect code attempts. Request a new verification code."
            : "Verification code is invalid or expired.",
      values: {
        name: parsed.data.name,
        email: parsed.data.email,
      },
    };
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);

  const user = await prisma.$transaction(async (tx) => {
    const createdUser = await tx.user.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        passwordHash,
        role: "CUSTOMER",
        status: "ACTIVE",
        emailVerified: new Date(),
      },
      select: {
        id: true,
      },
    });

    await tx.emailVerificationCode.updateMany({
      where: {
        id: verification.verificationCodeId,
        consumedAt: null,
      },
      data: {
        consumedAt: new Date(),
      },
    });

    return createdUser;
  });

  await createSession(user.id);
  redirect("/account");
}

export async function loginAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const rawValues = {
    email: getStringValue(formData, "email"),
    password: getStringValue(formData, "password"),
  };

  const parsed = loginSchema.safeParse(rawValues);

  if (!parsed.success) {
    return {
      fieldErrors: parsed.error.flatten().fieldErrors,
      values: {
        email: rawValues.email,
      },
    };
  }

  const user = await prisma.user.findUnique({
    where: {
      email: parsed.data.email,
    },
  });

  const passwordIsValid =
    user && user.status === "ACTIVE"
      ? await bcrypt.compare(parsed.data.password, user.passwordHash)
      : false;

  if (!user || !passwordIsValid) {
    return {
      formError: INVALID_LOGIN_MESSAGE,
      values: {
        email: parsed.data.email,
      },
    };
  }

  await createSession(user.id);
  redirect("/account");
}

export async function logoutAction() {
  await deleteCurrentSession();
  redirect("/login");
}

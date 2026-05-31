"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { sendPasswordResetCodeEmail } from "@/lib/email/smtp";
import {
  createSession,
  deleteCurrentSession,
  deleteOtherUserSessions,
} from "./session";
import {
  type AuthActionState,
  changePasswordSchema,
  loginSchema,
  requestPasswordResetSchema,
  registerSchema,
  resetPasswordSchema,
  updateProfileSchema,
} from "./validation";
import {
  createPasswordResetVerificationCode,
  verifyPasswordResetCode,
  verifyRegistrationCode,
} from "./verification";

const INVALID_LOGIN_MESSAGE = "Invalid email or password.";
const RESET_REQUEST_SUCCESS_MESSAGE =
  "If that email matches an active account, a reset code has been sent.";
const RESET_CODE_RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const MAX_RESET_CODES_PER_WINDOW = 3;

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

export async function requestPasswordResetAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const rawValues = {
    email: getStringValue(formData, "email"),
  };

  const parsed = requestPasswordResetSchema.safeParse(rawValues);

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
    select: {
      id: true,
      status: true,
      email: true,
    },
  });

  if (!user || user.status !== "ACTIVE") {
    return {
      successMessage: RESET_REQUEST_SUCCESS_MESSAGE,
      values: {
        email: parsed.data.email,
      },
    };
  }

  const recentCodeCount = await prisma.emailVerificationCode.count({
    where: {
      email: parsed.data.email,
      purpose: "RESET_PASSWORD",
      createdAt: {
        gte: new Date(Date.now() - RESET_CODE_RATE_LIMIT_WINDOW_MS),
      },
    },
  });

  if (recentCodeCount >= MAX_RESET_CODES_PER_WINDOW) {
    return {
      formError: "Too many reset codes requested. Try again in a few minutes.",
      values: {
        email: parsed.data.email,
      },
    };
  }

  const verification = await createPasswordResetVerificationCode(parsed.data.email);

  if (!verification.ok) {
    return {
      formError: "Password reset is temporarily unavailable. Missing email verification configuration.",
      values: {
        email: parsed.data.email,
      },
    };
  }

  const delivery = await sendPasswordResetCodeEmail({
    to: user.email,
    code: verification.code,
    expiresAt: verification.expiresAt,
  });

  if (!delivery.ok) {
    await prisma.emailVerificationCode
      .delete({
        where: {
          id: verification.verificationCodeId,
        },
      })
      .catch(() => null);

    return {
      formError:
        delivery.reason === "missing-config"
          ? "Password reset email delivery is not configured yet."
          : "Could not send the reset email right now.",
      values: {
        email: parsed.data.email,
      },
    };
  }

  return {
    successMessage: RESET_REQUEST_SUCCESS_MESSAGE,
    values: {
      email: parsed.data.email,
    },
  };
}

export async function resetPasswordAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const rawValues = {
    email: getStringValue(formData, "email"),
    verificationCode: getStringValue(formData, "verificationCode"),
    password: getStringValue(formData, "password"),
    confirmPassword: getStringValue(formData, "confirmPassword"),
  };

  const parsed = resetPasswordSchema.safeParse(rawValues);

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
    select: {
      id: true,
      status: true,
    },
  });

  if (!user || user.status !== "ACTIVE") {
    return {
      formError: "Reset code is invalid or expired.",
      values: {
        email: parsed.data.email,
      },
    };
  }

  const verification = await verifyPasswordResetCode(
    parsed.data.email,
    parsed.data.verificationCode,
  );

  if (!verification.ok) {
    return {
      formError:
        verification.reason === "missing-config"
          ? "Password reset is temporarily unavailable. Missing email verification configuration."
          : verification.reason === "too-many-attempts"
            ? "Too many incorrect code attempts. Request a new reset code."
            : "Reset code is invalid or expired.",
      values: {
        email: parsed.data.email,
      },
    };
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);

  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: {
        id: user.id,
      },
      data: {
        passwordHash,
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

    await tx.session.deleteMany({
      where: {
        userId: user.id,
      },
    });
  });

  redirect("/login?reset=success");
}

export async function updateProfileAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const rawValues = {
    name: getStringValue(formData, "name"),
    phone: getStringValue(formData, "phone"),
    avatarUrl: getStringValue(formData, "avatarUrl"),
  };

  const parsed = updateProfileSchema.safeParse(rawValues);

  if (!parsed.success) {
    return {
      fieldErrors: parsed.error.flatten().fieldErrors,
      values: rawValues,
    };
  }

  const { requireUser } = await import("./guards");
  const user = await requireUser();

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      name: parsed.data.name,
      phone: parsed.data.phone || null,
      avatarUrl: parsed.data.avatarUrl || null,
    },
  });

  revalidatePath("/account");

  return {
    successMessage: "Profile updated.",
    values: {
      name: parsed.data.name,
      phone: parsed.data.phone,
      avatarUrl: parsed.data.avatarUrl,
    },
  };
}

export async function changePasswordAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const rawValues = {
    currentPassword: getStringValue(formData, "currentPassword"),
    password: getStringValue(formData, "password"),
    confirmPassword: getStringValue(formData, "confirmPassword"),
  };

  const parsed = changePasswordSchema.safeParse(rawValues);

  if (!parsed.success) {
    return {
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { requireUser } = await import("./guards");
  const safeUser = await requireUser();
  const user = await prisma.user.findUnique({
    where: {
      id: safeUser.id,
    },
  });

  const passwordIsValid = user
    ? await bcrypt.compare(parsed.data.currentPassword, user.passwordHash)
    : false;

  if (!user || !passwordIsValid) {
    return {
      formError: "Current password is incorrect.",
    };
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      passwordHash,
    },
  });

  await deleteOtherUserSessions(user.id);
  revalidatePath("/account");

  return {
    successMessage: "Password updated. Other sessions were signed out.",
  };
}

export async function logoutAction() {
  await deleteCurrentSession();
  redirect("/login");
}

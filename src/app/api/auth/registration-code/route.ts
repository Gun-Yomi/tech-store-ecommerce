import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createRegistrationVerificationCode } from "@/lib/auth/verification";
import { sendRegistrationCodeSchema } from "@/lib/auth/validation";
import { sendRegistrationCodeEmail } from "@/lib/email/smtp";

export const runtime = "nodejs";

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const MAX_CODES_PER_WINDOW = 3;

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = sendRegistrationCodeSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        message:
          parsed.error.flatten().fieldErrors.email?.[0] ??
          "Enter a valid email address.",
      },
      { status: 400 },
    );
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
    return NextResponse.json(
      { message: "An account with that email already exists." },
      { status: 409 },
    );
  }

  const recentCodeCount = await prisma.emailVerificationCode.count({
    where: {
      email: parsed.data.email,
      purpose: "REGISTER",
      createdAt: {
        gte: new Date(Date.now() - RATE_LIMIT_WINDOW_MS),
      },
    },
  });

  if (recentCodeCount >= MAX_CODES_PER_WINDOW) {
    return NextResponse.json(
      { message: "Too many codes requested. Try again in a few minutes." },
      { status: 429 },
    );
  }

  const verification = await createRegistrationVerificationCode(parsed.data.email);

  if (!verification.ok) {
    return NextResponse.json(
      { message: "Email verification is not configured yet." },
      { status: 503 },
    );
  }

  const delivery = await sendRegistrationCodeEmail({
    to: parsed.data.email,
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

    return NextResponse.json(
      {
        message:
          delivery.reason === "missing-config"
            ? "Email delivery is not configured yet."
            : "Could not send the verification email right now.",
      },
      { status: 503 },
    );
  }

  return NextResponse.json({
    message: "Verification code sent. Check your email.",
  });
}

import "server-only";

import { createHash, randomInt, timingSafeEqual } from "crypto";
import { prisma } from "@/lib/db";

const VERIFICATION_CODE_PURPOSE = "REGISTER";
const DEFAULT_CODE_TTL_MINUTES = 10;
const MAX_CODE_ATTEMPTS = 5;

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function getCodePepper() {
  return process.env.AUTH_CODE_PEPPER?.trim();
}

function getCodeTtlMinutes() {
  const ttl = Number(process.env.VERIFICATION_CODE_TTL_MINUTES);
  return Number.isFinite(ttl) && ttl > 0 ? ttl : DEFAULT_CODE_TTL_MINUTES;
}

function hashVerificationCode(email: string, code: string, pepper: string) {
  return createHash("sha256")
    .update(`${normalizeEmail(email)}:${code.trim()}:${pepper}`)
    .digest("hex");
}

function compareHashes(storedHash: string, submittedHash: string) {
  const storedBuffer = Buffer.from(storedHash, "hex");
  const submittedBuffer = Buffer.from(submittedHash, "hex");

  return (
    storedBuffer.length === submittedBuffer.length &&
    timingSafeEqual(storedBuffer, submittedBuffer)
  );
}

export async function createRegistrationVerificationCode(email: string) {
  const pepper = getCodePepper();

  if (!pepper) {
    return {
      ok: false as const,
      reason: "missing-config" as const,
    };
  }

  const normalizedEmail = normalizeEmail(email);
  const code = randomInt(100000, 1000000).toString();
  const expiresAt = new Date(
    Date.now() + getCodeTtlMinutes() * 60 * 1000,
  );

  await prisma.emailVerificationCode.updateMany({
    where: {
      email: normalizedEmail,
      purpose: VERIFICATION_CODE_PURPOSE,
      consumedAt: null,
    },
    data: {
      consumedAt: new Date(),
    },
  });

  const record = await prisma.emailVerificationCode.create({
    data: {
      email: normalizedEmail,
      codeHash: hashVerificationCode(normalizedEmail, code, pepper),
      purpose: VERIFICATION_CODE_PURPOSE,
      expiresAt,
    },
    select: {
      id: true,
    },
  });

  return {
    ok: true as const,
    code,
    expiresAt,
    verificationCodeId: record.id,
  };
}

export async function verifyRegistrationCode(email: string, code: string) {
  const pepper = getCodePepper();

  if (!pepper) {
    return {
      ok: false as const,
      reason: "missing-config" as const,
    };
  }

  const normalizedEmail = normalizeEmail(email);
  const record = await prisma.emailVerificationCode.findFirst({
    where: {
      email: normalizedEmail,
      purpose: VERIFICATION_CODE_PURPOSE,
      consumedAt: null,
      expiresAt: {
        gt: new Date(),
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      codeHash: true,
      attempts: true,
    },
  });

  if (!record) {
    return {
      ok: false as const,
      reason: "invalid-code" as const,
    };
  }

  if (record.attempts >= MAX_CODE_ATTEMPTS) {
    return {
      ok: false as const,
      reason: "too-many-attempts" as const,
    };
  }

  const submittedHash = hashVerificationCode(normalizedEmail, code, pepper);

  if (!compareHashes(record.codeHash, submittedHash)) {
    await prisma.emailVerificationCode.update({
      where: {
        id: record.id,
      },
      data: {
        attempts: {
          increment: 1,
        },
      },
    });

    return {
      ok: false as const,
      reason: "invalid-code" as const,
    };
  }

  return {
    ok: true as const,
    verificationCodeId: record.id,
  };
}

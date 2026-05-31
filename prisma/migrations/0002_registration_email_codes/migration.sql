PRAGMA foreign_keys=ON;

CREATE TABLE IF NOT EXISTS "EmailVerificationCode" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "codeHash" TEXT NOT NULL,
    "purpose" TEXT NOT NULL DEFAULT 'REGISTER',
    "expiresAt" DATETIME NOT NULL,
    "consumedAt" DATETIME,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "EmailVerificationCode_email_purpose_expiresAt_idx"
    ON "EmailVerificationCode"("email", "purpose", "expiresAt");

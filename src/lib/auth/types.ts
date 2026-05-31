import type { UserRole, UserStatus } from "@prisma/client";

export type SafeUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string | null;
  avatarUrl: string | null;
  emailVerified: Date | null;
  status: UserStatus;
  createdAt: Date;
};

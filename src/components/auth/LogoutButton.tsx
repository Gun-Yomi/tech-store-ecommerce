import { LogOut } from "lucide-react";
import { logoutAction } from "@/lib/auth/actions";

type LogoutButtonProps = {
  compact?: boolean;
};

export function LogoutButton({ compact = false }: LogoutButtonProps) {
  return (
    <form action={logoutAction}>
      <button
        type="submit"
        className={
          compact
            ? "inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-[#d7dfbd] bg-white/70 px-3 text-sm font-black text-[#344554] transition hover:border-[#8ea95c] hover:bg-[#edf4de]"
            : "inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#5f7d33] px-5 text-sm font-black text-white transition hover:bg-[#4f6f2d]"
        }
      >
        <LogOut className="h-4 w-4" />
        Logout
      </button>
    </form>
  );
}

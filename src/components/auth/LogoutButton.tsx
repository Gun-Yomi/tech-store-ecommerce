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
            ? "inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-[#cfe0f2] bg-white/70 px-3 text-sm font-black text-[#334155] transition hover:border-[#76b7e5] hover:bg-[#e8f4ff]"
            : "inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#2f7fb3] px-5 text-sm font-black text-white transition hover:bg-[#236b9f]"
        }
      >
        <LogOut className="h-4 w-4" />
        Logout
      </button>
    </form>
  );
}

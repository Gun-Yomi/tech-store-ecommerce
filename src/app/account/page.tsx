import { Heart, Package, Settings, ShieldCheck, UserRound } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ChangePasswordForm } from "@/components/auth/ChangePasswordForm";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { ProfileForm } from "@/components/auth/ProfileForm";
import { requireUser } from "@/lib/auth/guards";

const accountCards = [
  {
    title: "Orders",
    detail: "Order history will appear after checkout is built in Phase 6.",
    icon: Package,
  },
  {
    title: "Wishlist",
    detail: "Wishlist storage is active. Manage favorites from the wishlist page.",
    icon: Heart,
  },
  {
    title: "Saved Items",
    detail: "Saved-for-later items are available below your cart.",
    icon: ShieldCheck,
  },
  {
    title: "Settings",
    detail: "Profile settings and preference controls will expand later.",
    icon: Settings,
  },
];

export default async function AccountPage() {
  const user = await requireUser();

  return (
    <>
      <Header />
      <main className="bg-[#f5f7ee] py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <section className="overflow-hidden rounded-lg bg-[#253326] p-6 text-white shadow-2xl shadow-[#435d2d]/18 sm:p-8">
            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
              <div className="flex items-start gap-4">
                <span className="grid h-14 w-14 place-items-center rounded-lg border border-[#d8e978]/35 bg-white/10 text-[#d8e978]">
                  <UserRound className="h-7 w-7" />
                </span>
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.18em] text-[#d8e978]">
                    Account
                  </p>
                  <h1 className="mt-2 text-3xl font-black tracking-normal sm:text-4xl">
                    {user.name}
                  </h1>
                  <p className="mt-2 text-sm text-[#dfe8d0]">{user.email}</p>
                </div>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <span className="inline-flex h-10 items-center justify-center rounded-lg border border-[#d8e978]/25 bg-white/10 px-4 text-sm font-black text-[#d8e978]">
                  {user.role}
                </span>
                <LogoutButton />
              </div>
            </div>
          </section>

          <section className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {accountCards.map((card) => {
              const Icon = card.icon;

              return (
                <article
                  key={card.title}
                  className="rounded-lg border border-[#d7dfbd] bg-white p-6 shadow-sm"
                >
                  <span className="grid h-12 w-12 place-items-center rounded-lg bg-[#eef4df] text-[#344554]">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h2 className="mt-5 text-xl font-black tracking-normal text-[#253326]">
                    {card.title}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-[#60705d]">
                    {card.detail}
                  </p>
                </article>
              );
            })}
          </section>

          <section className="mt-8 grid gap-6 lg:grid-cols-2">
            <ProfileForm user={user} />
            <ChangePasswordForm />
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}

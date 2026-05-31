import Link from "next/link";
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
    detail: "View submitted manual checkout orders and fulfillment progress.",
    icon: Package,
    href: "/account/orders",
  },
  {
    title: "Wishlist",
    detail: "Wishlist storage is active. Manage favorites from the wishlist page.",
    icon: Heart,
    href: "/wishlist",
  },
  {
    title: "Saved Items",
    detail: "Saved-for-later items are available below your cart.",
    icon: ShieldCheck,
    href: "/cart",
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
      <main className="bg-[#f5f9ff] py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <section className="overflow-hidden rounded-lg bg-[#1f2a44] p-6 text-white shadow-2xl shadow-[#2f5f8f]/18 sm:p-8">
            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
              <div className="flex items-start gap-4">
                <span className="grid h-14 w-14 place-items-center rounded-lg border border-[#c7e8ff]/35 bg-white/10 text-[#c7e8ff]">
                  <UserRound className="h-7 w-7" />
                </span>
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.18em] text-[#c7e8ff]">
                    Account
                  </p>
                  <h1 className="mt-2 text-3xl font-black tracking-normal sm:text-4xl">
                    {user.name}
                  </h1>
                  <p className="mt-2 text-sm text-[#e4f1ff]">{user.email}</p>
                </div>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <span className="inline-flex h-10 items-center justify-center rounded-lg border border-[#c7e8ff]/25 bg-white/10 px-4 text-sm font-black text-[#c7e8ff]">
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
                  className="rounded-lg border border-[#cfe0f2] bg-white p-6 shadow-sm"
                >
                  <span className="grid h-12 w-12 place-items-center rounded-lg bg-[#eaf6ff] text-[#334155]">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h2 className="mt-5 text-xl font-black tracking-normal text-[#1f2a44]">
                    {card.title}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-[#5f6f85]">
                    {card.detail}
                  </p>
                  {card.href ? (
                    <Link
                      href={card.href}
                      className="mt-5 inline-flex text-sm font-black text-[#2f7fb3] hover:text-[#2f5f8f]"
                    >
                      Open
                    </Link>
                  ) : null}
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

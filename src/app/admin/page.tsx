import { ShieldCheck } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { requireAdmin } from "@/lib/auth/guards";

export default async function AdminPlaceholderPage() {
  const user = await requireAdmin();

  return (
    <>
      <Header />
      <main className="bg-[#f5f7ee] py-14 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <section className="rounded-lg border border-[#d7dfbd] bg-white p-8 shadow-xl shadow-[#435d2d]/8">
            <span className="grid h-14 w-14 place-items-center rounded-lg bg-[#eef4df] text-[#344554]">
              <ShieldCheck className="h-7 w-7" />
            </span>
            <p className="mt-6 text-sm font-black uppercase tracking-[0.18em] text-[#5f7d33]">
              Admin guard active
            </p>
            <h1 className="mt-3 text-3xl font-black tracking-normal text-[#253326]">
              Phase 5 admin panel placeholder
            </h1>
            <p className="mt-3 text-sm leading-6 text-[#60705d]">
              {user.name} has admin access. Product CRUD, category management,
              image workflows, users, and site preferences are intentionally not built yet.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}

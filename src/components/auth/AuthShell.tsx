import Link from "next/link";
import type { ReactNode } from "react";

type AuthShellProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: ReactNode;
};

export function AuthShell({ eyebrow, title, subtitle, children }: AuthShellProps) {
  return (
    <section className="bg-[#f5f9ff] py-14 sm:py-20">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
        <div className="relative overflow-hidden rounded-lg bg-[#1f2a44] p-8 text-white shadow-2xl shadow-[#2f5f8f]/18 sm:p-10">
          <div
            className="absolute inset-0 opacity-45"
            style={{
              backgroundImage:
                "linear-gradient(135deg, rgba(199,232,255,0.34), transparent 38%), linear-gradient(45deg, rgba(42,166,214,0.28), transparent 48%)",
            }}
          />
          <div className="relative">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[#c7e8ff]">
              {eyebrow}
            </p>
            <h1 className="mt-4 text-4xl font-black tracking-normal sm:text-5xl">
              {title}
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-[#e8f4ff]">
              {subtitle}
            </p>
            <div className="mt-8 grid gap-3 text-sm font-semibold text-[#f7fbff]">
              <div className="rounded-lg border border-white/12 bg-white/10 p-4">
                Passwords are hashed before storage.
              </div>
              <div className="rounded-lg border border-white/12 bg-white/10 p-4">
                Sessions use secure, HTTP-only cookies.
              </div>
              <div className="rounded-lg border border-white/12 bg-white/10 p-4">
                Customer and admin roles are ready for later phases.
              </div>
            </div>
            <Link
              href="/"
              className="mt-8 inline-flex h-11 items-center justify-center rounded-lg border border-white/25 bg-white/12 px-5 text-sm font-black text-white transition hover:bg-white/18 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c7e8ff]"
            >
              Back to storefront
            </Link>
          </div>
        </div>

        <div className="rounded-lg border border-[#cfe0f2] bg-white p-6 shadow-xl shadow-[#2f5f8f]/8 sm:p-8">
          {children}
        </div>
      </div>
    </section>
  );
}

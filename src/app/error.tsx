"use client";

import Link from "next/link";
import { AlertTriangle, RotateCw } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  console.error(error);

  return (
    <main className="min-h-screen bg-[#f5f9ff] px-4 py-16 text-[#1f2a44] sm:px-6 sm:py-24">
      <div className="mx-auto max-w-2xl rounded-lg border border-[#cfe0f2] bg-white p-8 text-center shadow-sm">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-lg bg-[#fff4f1] text-[#9f2f28]">
          <AlertTriangle className="h-7 w-7" />
        </span>
        <p className="mt-6 text-sm font-black uppercase tracking-[0.18em] text-[#2f7fb3]">
          Something went wrong
        </p>
        <h1 className="mt-3 text-3xl font-black tracking-normal sm:text-4xl">
          This page could not finish loading
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-[#5f6f85]">
          Try again, or return to the product catalog while the issue is
          reviewed.
        </p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={reset}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#334155] px-5 text-sm font-black text-white transition hover:bg-[#2f7fb3] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#76b7e5]"
          >
            <RotateCw className="h-4 w-4" />
            Try again
          </button>
          <Link
            href="/products"
            className="inline-flex h-11 items-center justify-center rounded-lg border border-[#9fc5e8] bg-white px-5 text-sm font-black text-[#334155] transition hover:border-[#4f9ed8] hover:bg-[#eaf6ff] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#76b7e5]"
          >
            Browse products
          </Link>
        </div>
      </div>
    </main>
  );
}

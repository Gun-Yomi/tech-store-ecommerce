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
    <main className="min-h-screen bg-[#f5f7ee] px-4 py-16 text-[#253326] sm:px-6 sm:py-24">
      <div className="mx-auto max-w-2xl rounded-lg border border-[#d7dfbd] bg-white p-8 text-center shadow-sm">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-lg bg-[#fff4f1] text-[#9f2f28]">
          <AlertTriangle className="h-7 w-7" />
        </span>
        <p className="mt-6 text-sm font-black uppercase tracking-[0.18em] text-[#5f7d33]">
          Something went wrong
        </p>
        <h1 className="mt-3 text-3xl font-black tracking-normal sm:text-4xl">
          This page could not finish loading
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-[#60705d]">
          Try again, or return to the product catalog while the issue is
          reviewed.
        </p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={reset}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#344554] px-5 text-sm font-black text-white transition hover:bg-[#5f7d33] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8ea95c]"
          >
            <RotateCw className="h-4 w-4" />
            Try again
          </button>
          <Link
            href="/products"
            className="inline-flex h-11 items-center justify-center rounded-lg border border-[#b7c891] bg-white px-5 text-sm font-black text-[#344554] transition hover:border-[#6e8f3d] hover:bg-[#eef4df] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8ea95c]"
          >
            Browse products
          </Link>
        </div>
      </div>
    </main>
  );
}

import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

export default function NotFoundPage() {
  return (
    <>
      <Header />
      <main className="bg-[#f5f9ff] py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-[#2f7fb3]">
            Not found
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-normal text-[#1f2a44] sm:text-5xl">
            This catalog page is not available
          </h1>
          <p className="mt-4 text-sm leading-6 text-[#5f6f85]">
            The product, category, or brand may be inactive, archived, drafted,
            or no longer in the catalog.
          </p>
          <Link
            href="/products"
            className="mt-8 inline-flex h-12 items-center justify-center rounded-lg bg-[#4f9ed8] px-6 text-sm font-black text-white transition hover:bg-[#2f7fb3]"
          >
            Browse products
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}

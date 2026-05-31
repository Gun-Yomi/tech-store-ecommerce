import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/AuthShell";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getCurrentUser } from "@/lib/auth/session";

export default async function RegisterPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/account");
  }

  return (
    <>
      <Header />
      <main>
        <AuthShell
          eyebrow="Create account"
          title="Build your CircuitHaus profile"
          subtitle="Create a protected customer profile today. Cart, wishlist, saved items, and order workflows are reserved for later phases."
        >
          <RegisterForm />
        </AuthShell>
      </main>
      <Footer />
    </>
  );
}

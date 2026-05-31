import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/AuthShell";
import { LoginForm } from "@/components/auth/LoginForm";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getCurrentUser } from "@/lib/auth/session";

export default async function LoginPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/account");
  }

  return (
    <>
      <Header />
      <main>
        <AuthShell
          eyebrow="Secure sign in"
          title="Premium access for your tech account"
          subtitle="Sign in to manage your profile now, with orders, saved items, and shopping history planned for the next phases."
        >
          <LoginForm />
        </AuthShell>
      </main>
      <Footer />
    </>
  );
}

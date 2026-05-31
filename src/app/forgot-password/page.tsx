import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/AuthShell";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getCurrentUser } from "@/lib/auth/session";

export default async function ForgotPasswordPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/account");
  }

  return (
    <>
      <Header />
      <main>
        <AuthShell
          eyebrow="Account recovery"
          title="Recover access securely"
          subtitle="Request a short-lived reset code by email, then use it to choose a new password."
        >
          <ForgotPasswordForm />
        </AuthShell>
      </main>
      <Footer />
    </>
  );
}

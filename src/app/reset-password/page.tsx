import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/AuthShell";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getCurrentUser } from "@/lib/auth/session";

type ResetPasswordPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const [user, params] = await Promise.all([getCurrentUser(), searchParams]);

  if (user) {
    redirect("/account");
  }

  const email = Array.isArray(params.email) ? params.email[0] : params.email;

  return (
    <>
      <Header />
      <main>
        <AuthShell
          eyebrow="Account recovery"
          title="Choose a new password"
          subtitle="Use the reset code from your email. Codes expire quickly and are consumed after use."
        >
          <ResetPasswordForm initialEmail={email} />
        </AuthShell>
      </main>
      <Footer />
    </>
  );
}

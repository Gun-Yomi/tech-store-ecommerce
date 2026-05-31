import { PreferenceForm } from "@/components/admin/PreferenceForm";
import { getSitePreferences } from "@/lib/admin/data";

export default async function AdminPreferencesPage() {
  const preferences = await getSitePreferences();

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-[#cfe0f2] bg-white p-6 shadow-sm">
        <p className="text-sm font-black uppercase tracking-[0.18em] text-[#2f7fb3]">
          Site preferences
        </p>
        <h1 className="mt-3 text-4xl font-black tracking-normal text-[#1f2a44]">
          Homepage and store settings
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#5f6f85]">
          Control practical homepage copy, announcement text, contact details,
          and simple store branding without turning this phase into a full CMS.
        </p>
      </section>
      <PreferenceForm preferences={preferences} />
    </div>
  );
}

"use client";

import type { SitePreference } from "@prisma/client";
import { useActionState } from "react";
import { updatePreferencesAction } from "@/lib/admin/actions";
import { initialAdminActionState } from "@/lib/admin/validation";
import { AdminActionMessage } from "./AdminActionMessage";
import {
  AdminCheckbox,
  AdminTextarea,
  AdminTextInput,
  fieldError,
  stateValue,
} from "./AdminFields";
import { AdminSubmitButton } from "./AdminSubmitButton";

type PreferenceFormProps = {
  preferences: SitePreference;
};

function parseFeaturedSlugs(value: string) {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed)
      ? parsed.filter((item) => typeof item === "string").join("\n")
      : "";
  } catch {
    return "";
  }
}

export function PreferenceForm({ preferences }: PreferenceFormProps) {
  const [state, formAction] = useActionState(
    updatePreferencesAction,
    initialAdminActionState,
  );

  return (
    <form action={formAction} className="space-y-6">
      <AdminActionMessage
        formError={state.formError}
        success={state.successMessage}
      />
      <section className="rounded-lg border border-[#cfe0f2] bg-white p-5 shadow-sm">
        <div className="grid gap-5 lg:grid-cols-2">
          <AdminTextInput
            label="Site name"
            name="siteName"
            required
            defaultValue={stateValue(state, "siteName", preferences.siteName)}
            error={fieldError(state, "siteName")}
          />
          <AdminTextInput
            label="Store tagline"
            name="storeTagline"
            required
            defaultValue={stateValue(
              state,
              "storeTagline",
              preferences.storeTagline,
            )}
            error={fieldError(state, "storeTagline")}
          />
          <AdminTextInput
            label="Logo URL"
            name="logoUrl"
            defaultValue={stateValue(state, "logoUrl", preferences.logoUrl)}
            error={fieldError(state, "logoUrl")}
          />
          <AdminTextInput
            label="Theme accent color"
            name="themeAccentColor"
            defaultValue={stateValue(
              state,
              "themeAccentColor",
              preferences.themeAccentColor,
            )}
            error={fieldError(state, "themeAccentColor")}
          />
        </div>
      </section>

      <section className="rounded-lg border border-[#cfe0f2] bg-white p-5 shadow-sm">
        <div className="grid gap-5">
          <AdminCheckbox
            label="Announcement enabled"
            name="announcementEnabled"
            defaultChecked={
              state.values
                ? state.values.announcementEnabled === "on"
                : preferences.announcementEnabled
            }
          />
          <AdminTextInput
            label="Announcement bar text"
            name="announcementText"
            defaultValue={stateValue(
              state,
              "announcementText",
              preferences.announcementText,
            )}
            error={fieldError(state, "announcementText")}
          />
          <AdminTextInput
            label="Homepage banner text"
            name="homepageBannerText"
            defaultValue={stateValue(
              state,
              "homepageBannerText",
              preferences.homepageBannerText,
            )}
            error={fieldError(state, "homepageBannerText")}
          />
        </div>
      </section>

      <section className="rounded-lg border border-[#cfe0f2] bg-white p-5 shadow-sm">
        <div className="grid gap-5">
          <AdminTextInput
            label="Hero title"
            name="heroTitle"
            required
            defaultValue={stateValue(state, "heroTitle", preferences.heroTitle)}
            error={fieldError(state, "heroTitle")}
          />
          <AdminTextarea
            label="Hero subtitle"
            name="heroSubtitle"
            rows={4}
            required
            defaultValue={stateValue(
              state,
              "heroSubtitle",
              preferences.heroSubtitle,
            )}
            error={fieldError(state, "heroSubtitle")}
          />
          <AdminTextInput
            label="Hero background image URL"
            name="heroImageUrl"
            defaultValue={stateValue(
              state,
              "heroImageUrl",
              preferences.heroImageUrl,
            )}
            error={fieldError(state, "heroImageUrl")}
          />
          <div className="grid gap-5 lg:grid-cols-2">
            <AdminTextInput
              label="Hero CTA text"
              name="heroCtaText"
              required
              defaultValue={stateValue(
                state,
                "heroCtaText",
                preferences.heroCtaText,
              )}
              error={fieldError(state, "heroCtaText")}
            />
            <AdminTextInput
              label="Hero CTA link"
              name="heroCtaLink"
              required
              defaultValue={stateValue(
                state,
                "heroCtaLink",
                preferences.heroCtaLink,
              )}
              error={fieldError(state, "heroCtaLink")}
            />
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-[#cfe0f2] bg-white p-5 shadow-sm">
        <div className="grid gap-5">
          <div className="grid gap-5 lg:grid-cols-2">
            <AdminTextInput
              label="Featured products title"
              name="featuredProductsTitle"
              required
              defaultValue={stateValue(
                state,
                "featuredProductsTitle",
                preferences.featuredProductsTitle,
              )}
              error={fieldError(state, "featuredProductsTitle")}
            />
            <AdminTextarea
              label="Featured products description"
              name="featuredProductsDescription"
              rows={3}
              required
              defaultValue={stateValue(
                state,
                "featuredProductsDescription",
                preferences.featuredProductsDescription,
              )}
              error={fieldError(state, "featuredProductsDescription")}
            />
          </div>
          <div className="grid gap-5 lg:grid-cols-2">
            <AdminTextInput
              label="New arrivals title"
              name="newArrivalsTitle"
              required
              defaultValue={stateValue(
                state,
                "newArrivalsTitle",
                preferences.newArrivalsTitle,
              )}
              error={fieldError(state, "newArrivalsTitle")}
            />
            <AdminTextarea
              label="New arrivals description"
              name="newArrivalsDescription"
              rows={3}
              required
              defaultValue={stateValue(
                state,
                "newArrivalsDescription",
                preferences.newArrivalsDescription,
              )}
              error={fieldError(state, "newArrivalsDescription")}
            />
          </div>
          <div className="grid gap-5 lg:grid-cols-2">
            <AdminTextInput
              label="Best sellers title"
              name="bestSellersTitle"
              required
              defaultValue={stateValue(
                state,
                "bestSellersTitle",
                preferences.bestSellersTitle,
              )}
              error={fieldError(state, "bestSellersTitle")}
            />
            <AdminTextarea
              label="Best sellers description"
              name="bestSellersDescription"
              rows={3}
              required
              defaultValue={stateValue(
                state,
                "bestSellersDescription",
                preferences.bestSellersDescription,
              )}
              error={fieldError(state, "bestSellersDescription")}
            />
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-[#cfe0f2] bg-white p-5 shadow-sm">
        <div className="grid gap-5 lg:grid-cols-2">
          <AdminTextInput
            label="Contact email"
            name="contactEmail"
            defaultValue={stateValue(state, "contactEmail", preferences.contactEmail)}
            error={fieldError(state, "contactEmail")}
          />
          <AdminTextInput
            label="Contact phone"
            name="contactPhone"
            defaultValue={stateValue(state, "contactPhone", preferences.contactPhone)}
            error={fieldError(state, "contactPhone")}
          />
          <AdminTextInput
            label="WhatsApp number"
            name="whatsappNumber"
            defaultValue={stateValue(
              state,
              "whatsappNumber",
              preferences.whatsappNumber,
            )}
            error={fieldError(state, "whatsappNumber")}
          />
          <AdminTextarea
            label="Footer description"
            name="footerDescription"
            rows={4}
            required
            defaultValue={stateValue(
              state,
              "footerDescription",
              preferences.footerDescription,
            )}
            error={fieldError(state, "footerDescription")}
          />
          <AdminTextarea
            label="Featured category slugs"
            name="featuredCategorySlugs"
            rows={4}
            defaultValue={stateValue(
              state,
              "featuredCategorySlugs",
              parseFeaturedSlugs(preferences.featuredCategorySlugs),
            )}
            error={fieldError(state, "featuredCategorySlugs")}
          />
        </div>
        <div className="mt-5">
          <AdminTextarea
            label="Store address"
            name="storeAddress"
            rows={3}
            defaultValue={stateValue(state, "storeAddress", preferences.storeAddress)}
            error={fieldError(state, "storeAddress")}
          />
        </div>
      </section>

      <AdminSubmitButton pendingLabel="Saving preferences...">
        Save preferences
      </AdminSubmitButton>
    </form>
  );
}

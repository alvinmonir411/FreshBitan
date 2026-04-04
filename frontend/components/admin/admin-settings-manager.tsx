"use client";

import { FormEvent, useEffect, useMemo, useState, useTransition } from "react";
import { AdminFeedback } from "@/components/admin/admin-feedback";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Button } from "@/components/ui/button";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { adminRequest, isValidUrl } from "@/lib/admin-client";
import { AdminSetting } from "@/types/admin";

const settingFields = [
  { key: "brand_name", label: "Site name", description: "Brand name used across the storefront.", type: "text" },
  { key: "contact_phone", label: "Support phone", description: "Primary phone shown in public contact areas.", type: "text" },
  { key: "whatsapp_number", label: "WhatsApp number", description: "Used for quick ordering and floating contact actions.", type: "text" },
  { key: "facebook_url", label: "Facebook URL", description: "Public Facebook page link.", type: "url" },
  { key: "logo_url", label: "Logo URL", description: "Optional logo image URL for header and footer.", type: "url" },
  { key: "hero_title", label: "Hero title", description: "Main homepage headline.", type: "text" },
  { key: "hero_subtitle", label: "Hero subtitle", description: "Supporting hero copy below the title.", type: "textarea" },
] as const;

type SettingsFormState = Record<(typeof settingFields)[number]["key"], string>;

const emptySettings: SettingsFormState = {
  brand_name: "",
  contact_phone: "",
  whatsapp_number: "",
  facebook_url: "",
  logo_url: "",
  hero_title: "",
  hero_subtitle: "",
};

export function AdminSettingsManager() {
  const [settings, setSettings] = useState<AdminSetting[]>([]);
  const [form, setForm] = useState<SettingsFormState>(emptySettings);
  const [feedback, setFeedback] = useState<{
    tone: "success" | "error";
    message: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  const settingsMap = useMemo(
    () => new Map(settings.map((setting) => [setting.key, setting])),
    [settings],
  );

  const loadSettings = async () => {
    setIsLoading(true);

    try {
      const data = await adminRequest<AdminSetting[]>("/api/admin/backend/settings");
      setSettings(data);
      setForm({
        brand_name: data.find((item) => item.key === "brand_name")?.value ?? "",
        contact_phone: data.find((item) => item.key === "contact_phone")?.value ?? "",
        whatsapp_number: data.find((item) => item.key === "whatsapp_number")?.value ?? "",
        facebook_url: data.find((item) => item.key === "facebook_url")?.value ?? "",
        logo_url: data.find((item) => item.key === "logo_url")?.value ?? "",
        hero_title: data.find((item) => item.key === "hero_title")?.value ?? "",
        hero_subtitle:
          data.find((item) => item.key === "hero_subtitle")?.value ??
          data.find((item) => item.key === "hero_description")?.value ??
          "",
      });
    } catch (error) {
      setFeedback({
        tone: "error",
        message: error instanceof Error ? error.message : "Failed to load settings.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadSettings();
  }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback(null);

    for (const key of ["facebook_url", "logo_url"] as const) {
      if (form[key].trim() && !isValidUrl(form[key].trim())) {
        setFeedback({
          tone: "error",
          message: `${key === "facebook_url" ? "Facebook URL" : "Logo URL"} must be valid.`,
        });
        return;
      }
    }

    startTransition(async () => {
      try {
        await adminRequest("/api/admin/backend/settings", {
          method: "PATCH",
          body: {
            settings: settingFields.map((field) => ({
              key: field.key,
              value: form[field.key].trim(),
              type: field.type === "textarea" ? "text" : field.type,
              label: field.label,
              description: field.description,
              isPublic: true,
            })),
          },
        });

        setFeedback({ tone: "success", message: "Settings updated successfully." });
        await loadSettings();
      } catch (error) {
        setFeedback({
          tone: "error",
          message: error instanceof Error ? error.message : "Could not update settings.",
        });
      }
    });
  };

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Settings"
        title="Site content settings"
        description="Update the key storefront settings already stored in the backend settings module."
      />

      {feedback ? <AdminFeedback tone={feedback.tone} message={feedback.message} /> : null}

      <section className="rounded-[2rem] border border-white/60 bg-white/75 p-6 shadow-[0_18px_50px_rgba(142,79,18,0.08)]">
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <LoadingSkeleton key={index} className="h-20 rounded-3xl" />
            ))}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {settingFields.map((field) => {
              const description = settingsMap.get(field.key)?.description ?? field.description;

              return (
                <label key={field.key} className="block space-y-2">
                  <span className="text-sm font-semibold text-brand-deep">{field.label}</span>
                  <span className="block text-xs leading-6 text-muted">{description}</span>
                  {field.type === "textarea" ? (
                    <textarea
                      rows={4}
                      value={form[field.key]}
                      onChange={(event) =>
                        setForm((current) => ({ ...current, [field.key]: event.target.value }))
                      }
                      className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-brand"
                    />
                  ) : (
                    <input
                      type={field.type}
                      value={form[field.key]}
                      onChange={(event) =>
                        setForm((current) => ({ ...current, [field.key]: event.target.value }))
                      }
                      className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-brand"
                    />
                  )}
                </label>
              );
            })}

            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save settings"}
            </Button>
          </form>
        )}
      </section>
    </div>
  );
}

import type { AppSettings } from "@/models/AppSettings";

const key = "geocad-converter-settings";

export function loadSettings(): Partial<AppSettings> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(key) ?? "{}") as Partial<AppSettings>;
  } catch {
    return {};
  }
}

export function saveSettings(settings: Partial<AppSettings>) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(settings));
}

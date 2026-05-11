export type AnalyticsEvent =
  | "conversion_started"
  | "conversion_success"
  | "conversion_failed"
  | "format_pair_selected"
  | "batch_size"
  | "landing_page_viewed";

export function trackEvent(event: AnalyticsEvent, payload?: Record<string, unknown>) {
  if (process.env.NEXT_PUBLIC_ANALYTICS_DEBUG === "true") {
    console.info(`[analytics:${event}]`, payload ?? {});
  }
}

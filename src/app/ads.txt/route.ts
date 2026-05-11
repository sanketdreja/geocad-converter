import { adsConfig } from "@/config/ads";

export function GET() {
  const body = adsConfig.publisherId
    ? `google.com, ${adsConfig.publisherId}, DIRECT, f08c47fec0942fa0\n`
    : "# ADSENSE_PUBLISHER_ID is not configured.\n";

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8"
    }
  });
}

// Business details are read from environment variables so that no contact
// information is hard-coded. Every value is optional; the UI hides or degrades
// gracefully when one is missing. See docs/SETUP.md.
const digitsOnly = value => String(value || "").replace(/[^0-9]/g, "");

export const STORE_NAME = "Aseni";

// International format without "+", e.g. 2547XXXXXXXX
export const WHATSAPP_NUMBER = digitsOnly(
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER,
);

export const STORE_PHONE = String(
  process.env.NEXT_PUBLIC_STORE_PHONE || "",
).trim();

// Address lines separated by "|", e.g. "Shop 4, Example Plaza|Nairobi"
export const STORE_ADDRESS_LINES = String(
  process.env.NEXT_PUBLIC_STORE_ADDRESS || "",
)
  .split("|")
  .map(line => line.trim())
  .filter(Boolean);

export const STORE_EMAIL = String(
  process.env.NEXT_PUBLIC_STORE_EMAIL || "",
).trim();

export const STORE_MAP_EMBED_URL = String(
  process.env.NEXT_PUBLIC_STORE_MAP_EMBED_URL || "",
).trim();

export function telHref(phone) {
  return `tel:${String(phone).replace(/[^0-9+]/g, "")}`;
}

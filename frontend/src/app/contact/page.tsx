import { Mail, MapPin, Phone } from "lucide-react";
import {
  STORE_ADDRESS_LINES,
  STORE_EMAIL,
  STORE_MAP_EMBED_URL,
  STORE_PHONE,
  telHref,
} from "../../lib/store-info";

export const metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      <div className="mb-8 max-w-2xl sm:mb-10">
        <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-500">
          Contact
        </p>
        <h1 className="mt-3 text-4xl font-medium tracking-[-0.055em] text-neutral-950 sm:text-5xl">
          Here when you need us.
        </h1>
        <p className="mt-4 text-base leading-7 text-neutral-600">
          Questions about a piece, sizing or an order? Reach out before you buy.
        </p>
      </div>

      <section className="grid overflow-hidden border border-neutral-200 bg-white lg:grid-cols-[0.85fr_1.15fr]">
        <div className="bg-[#f1e9db] p-7 sm:p-10 lg:p-12">
          <h2 className="text-2xl font-medium tracking-[-0.04em] text-neutral-950">
            Find us
          </h2>
          <div className="mt-8 space-y-6">
            {STORE_ADDRESS_LINES.length > 0 && (
              <div className="flex gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center border border-[#cdbf9f] bg-white text-[#1c1917]">
                  <MapPin size={20} strokeWidth={1.5} />
                </span>
                <div>
                  <p className="font-medium text-[#1c1917]">Visit us</p>
                  <p className="mt-1 text-sm leading-6 text-[#6b6258]">
                    {STORE_ADDRESS_LINES.map((line, index) => (
                      <span key={line}>
                        {index > 0 && <br />}
                        {line}
                      </span>
                    ))}
                  </p>
                </div>
              </div>
            )}
            {STORE_PHONE && (
              <div className="flex gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center border border-[#cdbf9f] bg-white text-[#1c1917]">
                  <Phone size={20} strokeWidth={1.5} />
                </span>
                <div>
                  <p className="font-medium text-[#1c1917]">Call us</p>
                  <a
                    href={telHref(STORE_PHONE)}
                    className="mt-1 block text-sm text-[#6b6258] transition hover:opacity-55"
                  >
                    {STORE_PHONE}
                  </a>
                </div>
              </div>
            )}
            {STORE_EMAIL && (
              <div className="flex gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center border border-[#cdbf9f] bg-white text-[#1c1917]">
                  <Mail size={20} strokeWidth={1.5} />
                </span>
                <div>
                  <p className="font-medium text-[#1c1917]">Email us</p>
                  <a
                    href={`mailto:${STORE_EMAIL}`}
                    className="mt-1 block text-sm text-[#6b6258] transition hover:opacity-55"
                  >
                    {STORE_EMAIL}
                  </a>
                </div>
              </div>
            )}
            {!STORE_ADDRESS_LINES.length && !STORE_PHONE && !STORE_EMAIL && (
              <p className="text-sm leading-6 text-[#6b6258]">
                Contact details will appear here once the store owner adds them.
              </p>
            )}
          </div>
        </div>
        {STORE_MAP_EMBED_URL && (
          <iframe
            title="Aseni location map"
            src={STORE_MAP_EMBED_URL}
            className="min-h-[340px] w-full border-0 lg:min-h-full"
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        )}
      </section>
    </main>
  );
}

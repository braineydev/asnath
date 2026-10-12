import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import {
  STORE_ADDRESS_LINES,
  STORE_EMAIL,
  STORE_PHONE,
  telHref,
} from "../lib/store-info";

export default function Footer() {
  return (
    <footer className="mt-auto bg-[#14110f]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_0.7fr_1fr] lg:gap-16">
          <div>
            <Link
              href="/"
              className="font-display inline-flex text-2xl font-semibold tracking-[0.28em] text-white"
            >
              ASNATH
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-6 text-[#d8cfbf]">
              Accessories and jewellery, chosen with care.
            </p>
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#b8975a]">
              Explore
            </p>
            <nav className="mt-4 flex flex-col items-start gap-3 text-sm text-[#efe8da]">
              <Link href="/" className="transition hover:text-white">
                Shop
              </Link>
              <Link href="/about" className="transition hover:text-white">
                About us
              </Link>
              <Link href="/contact" className="transition hover:text-white">
                Contact
              </Link>
              <Link href="/terms" className="transition hover:text-white">
                Terms
              </Link>
              <Link href="/privacy" className="transition hover:text-white">
                Privacy
              </Link>
            </nav>
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#b8975a]">
              Visit &amp; contact
            </p>
            <div className="mt-4 space-y-3 text-sm text-[#efe8da]">
              {STORE_PHONE && (
                <a
                  href={telHref(STORE_PHONE)}
                  className="flex items-center gap-3 transition hover:text-white"
                >
                  <span className="flex h-9 w-9 items-center justify-center border border-white/15 text-white">
                    <Phone size={16} />
                  </span>
                  {STORE_PHONE}
                </a>
              )}
              {STORE_EMAIL && (
                <a
                  href={`mailto:${STORE_EMAIL}`}
                  className="flex items-center gap-3 transition hover:text-white"
                >
                  <span className="flex h-9 w-9 items-center justify-center border border-white/15 text-white">
                    <Mail size={16} />
                  </span>
                  {STORE_EMAIL}
                </a>
              )}
              <Link
                href="/contact"
                className="flex items-center gap-3 leading-5 transition hover:text-white"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center border border-white/15 text-white">
                  <MapPin size={16} />
                </span>
                <span>
                  {STORE_ADDRESS_LINES.length > 0
                    ? STORE_ADDRESS_LINES.map((line, index) => (
                        <span key={line}>
                          {index > 0 && <br />}
                          {line}
                        </span>
                      ))
                    : "Contact details"}
                </span>
                <ArrowUpRight size={15} className="ml-auto" />
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-10 border-t border-white/10 pt-5 text-xs text-[#d8cfbf]">
          © {new Date().getFullYear()} Asnath. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

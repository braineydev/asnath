import Link from "next/link";
import { STORE_EMAIL, STORE_PHONE, telHref } from "../lib/store-info";

export default function Footer() {
	return (
		<footer className="mt-auto bg-[#111111] text-white">
			<div className="mx-auto flex max-w-[1500px] flex-col gap-5 px-4 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
				<Link href="/" className="font-display text-base font-semibold tracking-[0.2em] text-white">ASNATH</Link>
				<nav aria-label="Footer navigation" className="flex flex-wrap gap-x-5 gap-y-2 text-[9px] uppercase tracking-[0.12em] text-white/65">
					<Link href="/" className="hover:text-white">Shop</Link>
					<Link href="/about" className="hover:text-white">About</Link>
					<Link href="/contact" className="hover:text-white">Contact</Link>
					<Link href="/terms" className="hover:text-white">Terms</Link>
					<Link href="/privacy" className="hover:text-white">Privacy</Link>
				</nav>
				<div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[9px] tracking-[0.08em] text-white/50">
					{STORE_PHONE && <a href={telHref(STORE_PHONE)} className="hover:text-white/80">{STORE_PHONE}</a>}
					{STORE_EMAIL && <a href={`mailto:${STORE_EMAIL}`} className="hover:text-white/80">{STORE_EMAIL}</a>}
					<span>&copy; {new Date().getFullYear()} ASNATH / EST. 2026</span>
				</div>
			</div>
		</footer>
	);
}

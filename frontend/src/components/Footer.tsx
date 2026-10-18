import { ArrowUpRight, Mail, Phone } from "lucide-react";
import Link from "next/link";

const footerLinkClass = "text-sm text-white/60 transition-colors hover:text-white";

export default function Footer() {
	return (
		<footer className="site-footer mt-auto bg-[#171717] text-white">
			<div className="mx-auto max-w-[1500px] px-6 pb-6 pt-14 sm:px-10 sm:pt-16 lg:px-16 lg:pt-20">
				<div className="grid gap-12 border-b border-white/15 pb-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_0.8fr_1fr] lg:gap-10 lg:pb-16">
					<div className="max-w-sm">
						<Link href="/" aria-label="Aseni home" className="inline-flex items-center gap-3">
							<span className="font-aseni text-2xl tracking-[-0.06em]">ASENI</span>
						</Link>
						<p className="mt-5 max-w-xs text-sm leading-6 text-white/55">Thoughtful pieces for the moments that make you feel like yourself.</p>
					</div>

					<nav aria-label="Shop collections">
						<h2 className="mb-5 text-[9px] font-semibold uppercase tracking-[0.22em] text-white/90">Collections</h2>
						<ul className="space-y-3">
							<li><Link href="/?category=earrings#shop" className={footerLinkClass}>Earrings</Link></li>
							<li><Link href="/?category=necklaces#shop" className={footerLinkClass}>Necklaces</Link></li>
							<li><Link href="/?category=bracelets-bangles#shop" className={footerLinkClass}>Bracelets &amp; Bangles</Link></li>
							<li><Link href="/?category=brooches#shop" className={footerLinkClass}>Brooches</Link></li>
						</ul>
					</nav>

					<nav aria-label="About and support">
						<h2 className="mb-5 text-[9px] font-semibold uppercase tracking-[0.22em] text-white/90">Information</h2>
						<ul className="space-y-3">
							<li><Link href="/about" className={footerLinkClass}>Our story</Link></li>
							<li><Link href="/contact" className={footerLinkClass}>Contact</Link></li>
							<li><Link href="/terms" className={footerLinkClass}>Terms &amp; privacy</Link></li>
						</ul>
					</nav>

					<div>
						<h2 className="mb-5 text-[9px] font-semibold uppercase tracking-[0.22em] text-white/90">Get in touch</h2>
						<ul className="space-y-4">
							<li><a href="tel:254710298091" className={`${footerLinkClass} inline-flex items-center gap-3`}><Phone size={14} strokeWidth={1.5} />+254 710 298 091</a></li>
							<li><a href="mailto:info@asnath.com" className={`${footerLinkClass} inline-flex items-center gap-3`}><Mail size={14} strokeWidth={1.5} />info@asnath.com</a></li>
							<li><Link href="/contact" className={`${footerLinkClass} inline-flex items-center gap-3`}>Visit our contact page <ArrowUpRight size={14} strokeWidth={1.5} /></Link></li>
						</ul>
					</div>
				</div>

				<div className="flex flex-col gap-3 pt-5 text-[9px] uppercase tracking-[0.14em] text-white/40 sm:flex-row sm:items-center sm:justify-between">
					<p>&copy; {new Date().getFullYear()} Aseni. All rights reserved.</p>
					<p>Made for your moments</p>
				</div>
			</div>
		</footer>
	);
}

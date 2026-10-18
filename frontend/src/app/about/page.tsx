import { ArrowRight, Gem } from "lucide-react";
import Link from "next/link";

export const metadata = { title: "About us" };

export default function AboutPage() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      <section className="bg-[#f1e9db] px-6 py-10 sm:px-10 sm:py-14 lg:px-14">
        <div className="max-w-2xl">
          <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#6b6258]">About Aseni</p>
          <h1 className="font-display mt-5 text-4xl font-medium tracking-[-0.02em] text-[#1c1917] sm:text-5xl lg:text-6xl lg:leading-[1.02]">Accessories and jewellery, chosen with care.</h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-[#6b6258] sm:text-lg">Aseni is a Kenyan store for earrings, necklaces, rings, bracelets and everyday accessories. Prices are in Kenyan shillings, and you can message us on WhatsApp before you order.</p>
        </div>
      </section>

      <section className="grid gap-5 py-10 sm:grid-cols-2 lg:gap-8 lg:py-14">
        <div className="border-t border-[#e4dccd] bg-white p-7 sm:p-8">
          <Gem className="text-[#8a6a2b]" size={21} strokeWidth={1.5} />
          <h2 className="font-display mt-5 text-2xl font-medium text-[#1c1917]">Pieces for every day</h2>
          <p className="mt-3 leading-7 text-[#6b6258]">Clear prices, honest stock levels and help when you need it.</p>
        </div>
        <div className="bg-[#1c1917] p-7 text-white sm:p-8">
          <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#cdbf9f]">Get in touch</p>
          <h2 className="font-display mt-4 text-2xl font-medium">Questions before you order?</h2>
          <Link href="/contact" className="mt-6 inline-flex items-center gap-2 border-b border-white pb-1.5 text-[11px] font-medium uppercase tracking-[0.12em] transition-opacity hover:opacity-60">Contact <ArrowRight size={15} /></Link>
        </div>
      </section>
    </main>
  );
}

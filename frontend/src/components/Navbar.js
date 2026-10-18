"use client";

import { LogOut, Menu, Search, ShieldCheck, ShoppingBag, User, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useSearch } from "../context/SearchContext";

const categoryLinks = [
	{ label: "Bracelets & Bangles", href: "/?category=bracelets-bangles#shop", category: "bracelets-bangles" },
	{ label: "Brooches", href: "/?category=brooches#shop", category: "brooches" },
	{ label: "Earrings", href: "/?category=earrings#shop", category: "earrings" },
	{ label: "Hair Accessories", href: "/?category=hair-accessories#shop", category: "hair-accessories" },
	{ label: "Handbags", href: "/?category=handbags#shop", category: "handbags" },
	{ label: "Necklaces", href: "/?category=necklaces#shop", category: "necklaces" },
	{ label: "Rings", href: "/?category=rings#shop", category: "rings" },
	{ label: "Sunglasses", href: "/?category=sunglasses#shop", category: "sunglasses" },
	{ label: "Watches", href: "/?category=watches#shop", category: "watches" },
];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { getCartCount } = useCart();
  const { user, logout } = useAuth();
  const { searchTerm, setSearchTerm, suggestions } = useSearch();
  const [menuOpen, setMenuOpen] = useState(false);
  const [collectionsOpen, setCollectionsOpen] = useState(false);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const collectionsRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const searchRef = useRef(null);
  const isAdmin = Boolean(user?.role === "admin" || user?.user_metadata?.role === "admin" || user?.isAdmin);

  useEffect(() => {
    const closeOutside = event => {
      if (!collectionsRef.current?.contains(event.target) && !mobileMenuRef.current?.contains(event.target)) setCollectionsOpen(false);
      if (!searchRef.current?.contains(event.target)) setSuggestionsOpen(false);
    };
    const closeOnEscape = event => {
      if (event.key === "Escape") {
        setCollectionsOpen(false);
        setSuggestionsOpen(false);
        setMenuOpen(false);
      }
    };
    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  const submitSearch = event => {
    event.preventDefault();
    const query = searchTerm.trim();
    router.push(query ? `/?search=${encodeURIComponent(query)}#shop` : "/#shop");
    setSuggestionsOpen(false);
    setMenuOpen(false);
  };

  const renderCollections = (mobile = false) => (
		<div className={mobile ? "border-t border-[#e5e5e2] pt-3" : "mx-auto w-[min(880px,calc(100vw-32px))] border border-[#e5e5e2] bg-white p-6 shadow-[0_18px_50px_rgba(0,0,0,0.14)]"}>
			{!mobile && <div className="mb-4 flex items-end justify-between border-b border-[#eee] pb-3"><div><p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[#9a7652]">Explore Aseni</p><p className="mt-1 font-display text-xl text-[#171717]">Shop by collection</p></div><Link href="/#shop" onClick={() => setCollectionsOpen(false)} className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[#666] hover:text-[#111]">View all <span aria-hidden="true">→</span></Link></div>}
			<div className={mobile ? "grid grid-cols-2 gap-x-4 gap-y-1" : "grid grid-cols-3 gap-2"}>
			{categoryLinks.map(link => <Link key={link.category} href={link.href} onClick={() => { setCollectionsOpen(false); setMenuOpen(false); }} className={mobile ? "py-2 text-[10px] font-medium uppercase tracking-[0.1em] text-[#666] hover:text-[#111]" : "group flex min-h-[68px] items-center justify-between border border-[#e9e7e3] px-4 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#444] transition-colors hover:border-[#171717] hover:bg-[#f8f7f4] hover:text-[#111]"}>{link.label}{!mobile && <span aria-hidden="true" className="text-sm text-[#a49a8d] transition-transform group-hover:translate-x-1">→</span>}</Link>)}
			</div>
		</div>
  );

  return (
    <header ref={collectionsRef} className="sticky top-0 z-50 bg-white">
      <div className="mx-auto flex min-h-[4.75rem] max-w-5xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3 sm:px-6 md:grid md:grid-cols-[150px_minmax(260px,1fr)_150px] md:gap-6 md:py-4">
        <Link href="/" aria-label="Aseni home" className="order-1 flex shrink-0 flex-col items-center text-[#111]">
          <span className="font-aseni text-[2.15rem] font-normal uppercase leading-none tracking-[-0.085em] sm:text-[2.55rem]">ASENI</span>
          <Image src="/signature.png" alt="Asnath handwritten signature" width={250} height={96} priority unoptimized className="-mt-1 h-6 w-[88px] object-contain brightness-0 opacity-100 sm:h-7 sm:w-[104px]" />
        </Link>

        <div ref={searchRef} className="order-3 relative w-full md:order-2 md:w-auto">
          <form onSubmit={submitSearch} role="search" className="flex h-10 w-full border border-[#d8d8d5] bg-white">
            <input value={searchTerm} onChange={event => { setSearchTerm(event.target.value); setSuggestionsOpen(true); }} onFocus={() => setSuggestionsOpen(Boolean(suggestions.length))} placeholder="Enter key to search" aria-label="Search products" className="min-w-0 flex-1 border-0 bg-transparent px-3 text-xs text-[#1c1917] shadow-none outline-none focus:outline-none" />
            <button type="submit" aria-label="Submit search" className="flex w-10 shrink-0 items-center justify-center text-[#555] hover:text-[#111]"><Search size={15} strokeWidth={1.6} /></button>
          </form>
          {pathname === "/" && suggestionsOpen && searchTerm.trim() && suggestions.length > 0 && <div className="absolute left-0 right-0 top-full z-[60] border border-t-0 border-[#d8d8d5] bg-white shadow-sm">
            {suggestions.slice(0, 5).map(product => <Link key={product.id} href={`/products/${product.slug || product.id}`} onClick={() => { setSuggestionsOpen(false); setMenuOpen(false); }} className="block border-t border-[#eee] px-3 py-2.5 text-sm text-[#333] hover:bg-[#f5f5f3]">{product.name}</Link>)}
          </div>}
        </div>

        <div className="order-2 ml-auto flex items-center gap-1 sm:gap-2 md:order-3 md:ml-0 md:justify-end">
          {isAdmin && <Link href="/admin" aria-label="Admin dashboard" title="Admin dashboard" className="inline-flex h-9 items-center justify-center gap-1.5 border border-[#d8d8d5] px-2.5 text-[11px] font-bold uppercase tracking-[0.1em] text-[#1c1917] transition-colors hover:border-[#171717] hover:bg-[#171717] hover:text-white"><ShieldCheck size={16} /><span>Admin</span></Link>}
          <Link href="/cart" aria-label={`Shopping bag${getCartCount() ? `, ${getCartCount()} items` : ""}`} className="relative inline-flex h-9 w-9 items-center justify-center text-[#1c1917]"><ShoppingBag size={17} strokeWidth={1.6} />{getCartCount() > 0 && <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center bg-[#171717] px-1 text-[9px] text-white">{getCartCount()}</span>}</Link>
          {user ? <button onClick={logout} aria-label="Log out" title="Log out" className="inline-flex h-9 w-8 items-center justify-center text-[#1c1917]"><LogOut size={16} /></button> : <Link href="/login" aria-label="Sign in" className="hidden h-9 w-8 items-center justify-center text-[#1c1917] sm:inline-flex"><User size={16} /></Link>}
          <button type="button" onClick={() => setMenuOpen(open => !open)} aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} className="inline-flex h-9 w-8 items-center justify-center text-[#1c1917] md:hidden">{menuOpen ? <X size={18} /> : <Menu size={18} />}</button>
        </div>
      </div>

      <nav className="hidden h-10 items-center justify-center gap-9 border-b border-[#e5e5e2] md:flex" aria-label="Main navigation">
        <Link href="/" className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#1c1917] decoration-1 underline-offset-4 hover:underline">Home</Link>
		<div className="relative flex h-full items-center">
			<button type="button" onClick={() => setCollectionsOpen(open => !open)} aria-expanded={collectionsOpen} aria-haspopup="true" className={`inline-flex h-9 items-center gap-2 border px-4 text-[10px] font-bold uppercase tracking-[0.14em] transition-colors ${collectionsOpen ? "border-[#171717] bg-[#171717] text-white" : "border-transparent text-[#1c1917] hover:border-[#d7d3cd]"}`}>Collections <span aria-hidden="true" className="text-base font-normal leading-none">{collectionsOpen ? "-" : "+"}</span></button>
        </div>
        <Link href="/contact" className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#1c1917] decoration-1 underline-offset-4 hover:underline">Contact us</Link>
      </nav>
	  <div className={`hidden overflow-hidden transition-[max-height,opacity,padding] duration-300 ease-in-out md:block ${collectionsOpen ? "max-h-[420px] py-4 opacity-100" : "max-h-0 py-0 opacity-0"}`} aria-hidden={!collectionsOpen}>
		{renderCollections()}
	  </div>

      {menuOpen && <div ref={mobileMenuRef} className="border-b border-[#e5e5e2] bg-white px-5 py-4 md:hidden">
        <div className="grid grid-cols-2 gap-x-5 gap-y-4 text-[12px] font-semibold uppercase tracking-[0.1em]">
          <Link href="/" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link href="/about" onClick={() => setMenuOpen(false)}>About</Link>
          <Link href="/contact" onClick={() => setMenuOpen(false)}>Contact us</Link>
          {isAdmin && <Link href="/admin" onClick={() => setMenuOpen(false)}>Admin</Link>}
          {!user && <Link href="/login" onClick={() => setMenuOpen(false)}>Sign in</Link>}
          <button type="button" onClick={() => setCollectionsOpen(open => !open)} aria-expanded={collectionsOpen} className="inline-flex items-center gap-2 text-left">Collections <span aria-hidden="true" className="text-base font-normal leading-none">{collectionsOpen ? "−" : "+"}</span></button>
          {collectionsOpen && <div className="col-span-2">{renderCollections(true)}</div>}
        </div>
      </div>}
    </header>
  );
}

"use client";

import { ChevronDown, LogOut, Menu, Search, ShieldCheck, ShoppingBag, User, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useSearch } from "../context/SearchContext";

const categoryLinks = [
  { label: "Earrings", href: "/?category=earrings#shop", category: "earrings" },
  { label: "Necklaces", href: "/?category=necklaces#shop", category: "necklaces" },
  { label: "Rings", href: "/?category=rings#shop", category: "rings" },
  { label: "Bracelets & Bangles", href: "/?category=bracelets-bangles#shop", category: "bracelets-bangles" },
  { label: "Watches", href: "/?category=watches#shop", category: "watches" },
  { label: "Handbags", href: "/?category=handbags#shop", category: "handbags" },
  { label: "Sunglasses", href: "/?category=sunglasses#shop", category: "sunglasses" },
  { label: "Hair Accessories", href: "/?category=hair-accessories#shop", category: "hair-accessories" },
];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { getCartCount } = useCart();
  const { user, logout } = useAuth();
  const { searchTerm, setSearchTerm, suggestions, categories } = useSearch();
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
    <div className={mobile ? "grid grid-cols-2 gap-x-4 gap-y-3 border-t border-[#e5e5e2] pt-3" : "absolute left-0 top-full z-50 grid min-w-56 border border-[#e5e5e2] bg-white py-2 shadow-[0_8px_24px_rgba(0,0,0,0.1)]"}>
      {(categories.length ? categories.map(category => ({ label: category.name, href: `/?category=${encodeURIComponent(category.slug)}#shop`, key: category.id })) : categoryLinks.map(link => ({ label: link.label, href: link.href, key: link.category }))).map(link => <Link key={link.key} href={link.href} onClick={() => { setCollectionsOpen(false); setMenuOpen(false); }} className={mobile ? "py-1 text-sm text-[#666] hover:text-[#111]" : "px-5 py-2.5 text-sm text-[#666] hover:bg-[#f2f2f0] hover:text-[#111]"}>{link.label}</Link>)}
    </div>
  );

  return (
    <header className="sticky top-0 z-50 bg-white">
      <div className="mx-auto flex min-h-[4.75rem] max-w-5xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3 sm:px-6 md:grid md:grid-cols-[150px_minmax(260px,1fr)_150px] md:gap-6 md:py-4">
        <Link href="/" className="font-display order-1 shrink-0 text-xl font-semibold tracking-[0.22em] text-[#1c1917] sm:text-2xl">ASNATH</Link>

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
          {isAdmin && <Link href="/admin" aria-label="Admin dashboard" title="Admin dashboard" className="inline-flex h-9 items-center justify-center gap-1.5 px-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#1c1917]"><ShieldCheck size={16} /><span>Admin</span></Link>}
          <Link href="/cart" aria-label={`Shopping bag${getCartCount() ? `, ${getCartCount()} items` : ""}`} className="relative inline-flex h-9 w-9 items-center justify-center text-[#1c1917]"><ShoppingBag size={17} strokeWidth={1.6} />{getCartCount() > 0 && <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center bg-[#171717] px-1 text-[9px] text-white">{getCartCount()}</span>}</Link>
          {user ? <button onClick={logout} aria-label="Log out" title="Log out" className="inline-flex h-9 w-8 items-center justify-center text-[#1c1917]"><LogOut size={16} /></button> : <Link href="/login" aria-label="Sign in" className="hidden h-9 w-8 items-center justify-center text-[#1c1917] sm:inline-flex"><User size={16} /></Link>}
          <button type="button" onClick={() => setMenuOpen(open => !open)} aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} className="inline-flex h-9 w-8 items-center justify-center text-[#1c1917] md:hidden">{menuOpen ? <X size={18} /> : <Menu size={18} />}</button>
        </div>
      </div>

      <nav className="hidden h-10 items-center justify-center gap-9 border-b border-[#e5e5e2] md:flex" aria-label="Main navigation">
        <Link href="/" className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#1c1917] hover:underline">Home</Link>
        <div ref={collectionsRef} className="relative flex h-full items-center" onMouseEnter={() => setCollectionsOpen(true)} onMouseLeave={() => setCollectionsOpen(false)}>
          <button type="button" onClick={() => setCollectionsOpen(true)} aria-expanded={collectionsOpen} className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#1c1917]">Collections <ChevronDown size={12} className={`transition-transform ${collectionsOpen ? "rotate-180" : ""}`} /></button>
          {collectionsOpen && renderCollections()}
        </div>
        <Link href="/contact" className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#1c1917] hover:underline">Contact us</Link>
      </nav>

      {menuOpen && <div ref={mobileMenuRef} className="border-b border-[#e5e5e2] bg-white px-5 py-4 md:hidden">
        <div className="grid grid-cols-2 gap-x-5 gap-y-4 text-[11px] font-medium uppercase tracking-[0.1em]">
          <Link href="/" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link href="/about" onClick={() => setMenuOpen(false)}>About</Link>
          <Link href="/contact" onClick={() => setMenuOpen(false)}>Contact us</Link>
          {isAdmin && <Link href="/admin" onClick={() => setMenuOpen(false)}>Admin</Link>}
          {!user && <Link href="/login" onClick={() => setMenuOpen(false)}>Sign in</Link>}
          <button type="button" onClick={() => setCollectionsOpen(open => !open)} aria-expanded={collectionsOpen} className="inline-flex items-center gap-1 text-left">Collections <ChevronDown size={12} /></button>
          {collectionsOpen && <div className="col-span-2">{renderCollections(true)}</div>}
        </div>
      </div>}
    </header>
  );
}

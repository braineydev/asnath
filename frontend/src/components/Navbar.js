"use client";
import {
  LogOut,
  Menu,
  Search,
  ShieldCheck,
  ShoppingBag,
  User,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

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
  const pathname = usePathname();
  const [categoryParam, setCategoryParam] = useState("");
  const { getCartCount } = useCart();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    setCategoryParam(params.get("category") || "");

    const handlePopState = () => {
      const nextParams = new URLSearchParams(window.location.search);
      setCategoryParam(nextParams.get("category") || "");
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [pathname]);
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const isAdmin = Boolean(
    user?.role === "admin" ||
    user?.user_metadata?.role === "admin" ||
    user?.isAdmin,
  );

  const activeLink = (href, category) => {
    if (href === "/#shop" && pathname === "/" && !categoryParam) return true;
    if (category && pathname === "/" && categoryParam === category) return true;
    if (href === "/admin" && pathname === "/admin") return true;
    if (href === "/cart" && pathname === "/cart") return true;
    if (href === "/login" && pathname === "/login") return true;
    return false;
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-[#e4dccd] bg-[#faf6ef]/95 shadow-[0_4px_20px_rgba(28,25,23,0.06)] backdrop-blur-md">
      <div className="mx-auto max-w-full w-full px-5 sm:px-6 lg:px-8 overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-2 h-16">
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/"
              className="font-display shrink-0 text-xl font-semibold tracking-[0.28em] text-[#1c1917] transition-colors hover:text-[#8a6a2b] sm:text-2xl"
            >
              ASNATH
            </Link>

            <div className="flex items-center gap-2 sm:gap-3 lg:hidden">
              <Link
                href="/#shop"
                className="whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.16em] text-[#1c1917] transition-colors hover:text-[#8a6a2b]"
              >
                Shop
              </Link>
            </div>
          </div>

          <div className="hidden items-center gap-5 xl:gap-6 lg:flex">
            <Link
              href="/#shop"
              className={`pb-1 text-[11px] font-bold uppercase tracking-[0.12em] transition-colors hover:text-[#8a6a2b] ${
                activeLink("/#shop")
                  ? "border-b-2 border-[#b8975a] text-[#1c1917]"
                  : "text-[#6b6258]"
              }`}
            >
              Shop
            </Link>
            {categoryLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`pb-1 text-[11px] font-semibold uppercase tracking-[0.12em] transition-colors hover:text-[#1c1917] ${
                  activeLink(link.href, link.category)
                    ? "border-b-2 border-[#b8975a] text-[#1c1917]"
                    : "text-[#6b6258]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-1 sm:gap-2">
            <a
              href="/#shop"
              className="hidden h-10 w-10 items-center justify-center text-[#1c1917] transition-colors hover:text-[#8a6a2b] sm:inline-flex"
              aria-label="Search products"
            >
              <Search size={18} strokeWidth={1.7} />
            </a>

            {isAdmin && (
              <Link
                href="/admin"
                className={`inline-flex h-9 items-center gap-1.5 border-l border-black/[0.09] px-3 text-xs font-medium uppercase tracking-[0.1em] transition-colors hover:text-neutral-950 ${
                  activeLink("/admin")
                    ? "border-b-2 border-[#b8975a] text-[#1c1917]"
                    : "text-neutral-600"
                }`}
                title="Admin dashboard"
              >
                <ShieldCheck size={16} />
                <span className="hidden sm:inline">Admin</span>
              </Link>
            )}

            <Link
              href="/cart"
              id="nav-cart-icon"
              className={`relative inline-flex h-10 w-10 items-center justify-center ${
                activeLink("/cart")
                  ? "border-b-2 border-[#b8975a] text-[#1c1917]"
                  : "text-[#1c1917]"
              }`}
              aria-label={`Shopping bag${getCartCount() ? `, ${getCartCount()} items` : ""}`}
            >
              <ShoppingBag size={20} strokeWidth={1.7} />
              {getCartCount() > 0 && (
                <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#8a6a2b] px-1 text-[9px] font-bold leading-none text-white shadow-[0_2px_6px_rgba(28,25,23,0.25)]">
                  {getCartCount()}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center">
                <button
                  onClick={logout}
                  className="inline-flex h-10 w-10 items-center justify-center text-neutral-500 transition-colors hover:text-neutral-950"
                  title="Log out"
                  aria-label="Log out"
                >
                  <LogOut size={18} strokeWidth={1.7} />
                  <span className="sr-only">Log out</span>
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className={`inline-flex h-10 w-10 items-center justify-center transition-colors hover:text-neutral-500 ${
                  activeLink("/login")
                    ? "border-b-2 border-[#b8975a] text-[#1c1917]"
                    : "text-neutral-900"
                }`}
                aria-label="Sign in"
              >
                <User size={19} strokeWidth={1.7} />
              </Link>
            )}
            <button
              type="button"
              onClick={() => setMenuOpen(open => !open)}
              className="inline-flex h-10 w-9 items-center justify-center text-neutral-900 lg:hidden"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
            >
              {menuOpen ? (
                <X size={20} strokeWidth={1.7} />
              ) : (
                <Menu size={20} strokeWidth={1.7} />
              )}
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="border-t border-neutral-200 py-4 lg:hidden">
            <div className="grid grid-cols-2 gap-y-4 text-[11px] font-medium uppercase tracking-[0.12em] text-neutral-700">
              <Link
                href="/"
                onClick={() => setMenuOpen(false)}
                className={`transition-colors ${
                  activeLink("/", "") ? "text-[#1c1917]" : "text-[#6b6258]"
                }`}
              >
                Home
              </Link>
              <Link
                href="/#shop"
                onClick={() => setMenuOpen(false)}
                className={`transition-colors ${
                  activeLink("/#shop") ? "text-[#1c1917]" : "text-[#6b6258]"
                }`}
              >
                Shop
              </Link>
              {categoryLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`transition-colors ${
                    activeLink(link.href, link.category)
                      ? "text-[#1c1917]"
                      : "text-[#6b6258]"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

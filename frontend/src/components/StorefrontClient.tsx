"use client";

import {
  ArrowRight,
  CheckCircle2,
  Heart,
  MapPin,
  MessageCircle,
  Package,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { API_BACKEND_PATH, API_PROXY_PATH, readApiJson } from "../lib/api";
import { getProductImageSrc } from "../lib/product-image";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function normalizeCategorySlug(value: string) {
  const slug = slugify(value);
  if (slug === "phone") return "phones";
  if (slug === "home-appliances" || slug === "home-appliance") {
    return "appliances";
  }
  return slug;
}

function getProductPrimaryImage(product: Product) {
  const normalizedImages = Array.isArray(product.images)
    ? product.images.filter(
        (image): image is string =>
          typeof image === "string" && image.trim() !== "",
      )
    : [];
  const fallbackImage =
    typeof product.image_name === "string" && product.image_name.trim()
      ? product.image_name.trim()
      : null;

  return (
    normalizedImages[0] ||
    fallbackImage ||
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80"
  );
}

type Product = {
  id: string | number;
  slug?: string;
  name: string;
  description?: string;
  price: number | string;
  initial_price?: number | string;
  discounted_price?: number | string;
  stock?: number;
  images?: string[];
  image_name?: string | null;
  category?: { name?: string; slug?: string } | string | null;
  categories?: { name?: string; slug?: string } | string | null;
  category_name?: string;
};

type Category = {
  id: string | number;
  name: string;
  slug: string;
};

type StorefrontClientProps = {
  initialProducts: Product[];
  initialCategories: Category[];
};

export default function StorefrontClient({
  initialProducts,
  initialCategories,
}: StorefrontClientProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [isLoading, setIsLoading] = useState(initialProducts.length === 0);
  const [wishlist, setWishlist] = useState<Array<string | number>>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const fetchProducts = async (keyword = "") => {
    try {
      setIsLoading(true);
      const apiBase = API_BACKEND_PATH;
      const query = new URLSearchParams();
      const trimmedKeyword = keyword.trim();
      if (trimmedKeyword) query.set("search", trimmedKeyword);

      const res = await fetch(
        `${apiBase}/products${query.toString() ? `?${query.toString()}` : ""}`,
        {
          cache: "no-store",
        },
      );
      const data = await readApiJson<
        { data?: Product[]; products?: Product[] } | Product[]
      >(res);

      const fetchedProducts = Array.isArray(data)
        ? data
        : data.data || data.products || [];
      const normalizedProducts = Array.isArray(fetchedProducts)
        ? fetchedProducts
        : [];
      setProducts(normalizedProducts);
      return normalizedProducts;
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_BACKEND_PATH}/products/categories`, {
        cache: "no-store",
      });
      const data = await readApiJson<{ data?: Category[] }>(res);
      setCategories(Array.isArray(data.data) ? data.data : []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    if (initialProducts.length > 0) return;
    void fetchProducts();
    void fetchCategories();
  }, [initialProducts.length]);

  useEffect(() => {
    if (typeof window === "undefined" || window.location.pathname !== "/") {
      return;
    }

    if (window.location.hash) {
      return;
    }

    const timer = window.setTimeout(() => {
      const shopSection = document.getElementById("shop");
      if (!shopSection) return;

      const targetTop = Math.max(
        0,
        shopSection.getBoundingClientRect().top + window.scrollY - 96,
      );

      window.scrollTo({ top: targetTop, behavior: "smooth" });
    }, 1200);

    return () => window.clearTimeout(timer);
  }, [products.length]);

  useEffect(() => {
    if (!user) {
      setWishlist([]);
      return;
    }

    let isActive = true;
    const loadWishlist = async () => {
      try {
        const response = await fetch(`${API_PROXY_PATH}/wishlists`, {
          credentials: "include",
          cache: "no-store",
        });
        if (!response.ok) return;
        const data = await readApiJson<{
          wishlist?: Array<{ product_id?: string | number }>;
        }>(response);
        if (!isActive) return;
        setWishlist(
          (data.wishlist || [])
            .map(item => item.product_id)
            .filter(Boolean) as Array<string | number>,
        );
      } catch {
        if (isActive) setWishlist([]);
      }
    };

    void loadWishlist();
    return () => {
      isActive = false;
    };
  }, [user]);

  const searchParams = useSearchParams();

  useEffect(() => {
    const selectedCategory =
      searchParams.get("category")?.trim().toLowerCase() || null;
    setActiveCategory(selectedCategory);
  }, [searchParams]);

  const productMatchesCategory = (product: Product, categorySlug: string) => {
    const productCategorySlugs = [
      product.category_name,
      typeof product.category === "string"
        ? product.category
        : product.category?.name,
      typeof product.categories === "string"
        ? product.categories
        : product.categories?.name,
      typeof product.category === "object" && product.category?.slug
        ? product.category.slug
        : null,
      typeof product.categories === "object" && product.categories?.slug
        ? product.categories.slug
        : null,
    ]
      .filter(Boolean)
      .map(value => normalizeCategorySlug(String(value)));

    return productCategorySlugs.includes(normalizeCategorySlug(categorySlug));
  };

  const visibleProducts = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return products.filter(product => {
      const matchesCategory =
        !activeCategory || productMatchesCategory(product, activeCategory);
      const haystack = [
        product.name,
        product.slug,
        product.description,
        typeof product.category === "string"
          ? product.category
          : product.category?.name,
        typeof product.categories === "string"
          ? product.categories
          : product.categories?.name,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      const matchesSearch = !query || haystack.includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, products, searchTerm]);

  useEffect(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) {
      setSuggestions(visibleProducts.slice(0, 8));
      setShowSuggestions(visibleProducts.length > 0);
      return;
    }

    const matches = visibleProducts.filter(product => {
      const haystack = [product.name, product.slug, product.description]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(query);
    });

    setSuggestions(matches.slice(0, 8));
    setShowSuggestions(matches.length > 0);
  }, [searchTerm, visibleProducts]);

  const handleSearch = async (event?: FormEvent) => {
    event?.preventDefault();
    setShowSuggestions(false);
  };

  const acceptSuggestion = () => {
    const suggestion = suggestions[0];
    if (!suggestion) return;

    const nextValue = suggestion.name;
    setSearchTerm(nextValue);
    setShowSuggestions(false);
  };

  const resetToShop = () => {
    setSearchTerm("");
    setShowSuggestions(false);
    setActiveCategory(null);
    router.replace("/#shop");
  };

  const changeCategory = (category: string | null) => {
    const nextCategory = category?.trim().toLowerCase() || null;
    setActiveCategory(nextCategory);

    const nextParams = new URLSearchParams(window.location.search);

    if (nextCategory) {
      nextParams.set("category", nextCategory);
    } else {
      nextParams.delete("category");
    }

    const queryString = nextParams.toString();
    router.push(queryString ? `/?${queryString}#shop` : "/#shop");
  };

  const toggleWishlist = async (productId: string | number) => {
    const isCurrentlySaved = wishlist.includes(productId);

    if (isCurrentlySaved) {
      setWishlist(prev => prev.filter(id => id !== productId));
      if (user) {
        try {
          await fetch(`${API_PROXY_PATH}/wishlists/${productId}`, {
            method: "DELETE",
            credentials: "include",
          });
        } catch {
          // Keep the UI in sync even if the request fails.
        }
      }
      return;
    }

    setWishlist(prev => [...prev, productId]);
    if (user) {
      try {
        await fetch(`${API_PROXY_PATH}/wishlists`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ product_id: productId }),
        });
      } catch {
        // Preserve the optimistic UI state even if the request fails.
      }
    }
  };

  const getCategoryLabel = (name: string) => name;

  const categoryOptions = [
    { label: "All", value: null },
    ...categories.map(category => ({
      label: getCategoryLabel(category.name),
      value: category.slug,
    })),
  ];

  return (
    <div className="min-h-screen bg-[#faf6ef] font-sans">
      <section className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 sm:pt-6 lg:px-8">
        <div className="grid overflow-hidden border border-[#e4dccd] bg-[#f1e9db] lg:grid-cols-[1.02fr_0.98fr]">
          <div className="flex min-h-[320px] flex-col justify-between px-6 py-8 sm:min-h-[360px] sm:px-10 sm:py-10 lg:min-h-[420px] lg:px-14 lg:py-12">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8a6a2b]">
                Accessories &amp; jewellery
              </p>
              <h1 className="mt-5 max-w-md text-[2.9rem] font-medium leading-[0.98] text-[#1c1917] sm:text-6xl lg:text-[4.6rem]">
                Pieces worth
                <br />
                keeping.
              </h1>
              <p className="mt-5 max-w-md text-base leading-7 text-[#6b6258]">
                Earrings, necklaces, rings and everyday accessories, priced in
                Kenyan shillings.
              </p>
              <div className="mt-6 grid max-w-xl gap-x-5 gap-y-3 text-[12px] font-medium text-[#4a423a] sm:grid-cols-3">
                <span className="flex items-center gap-2">
                  <MessageCircle
                    size={15}
                    strokeWidth={1.8}
                    className="shrink-0 text-[#8a6a2b]"
                  />
                  Ask us on WhatsApp
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2
                    size={15}
                    strokeWidth={1.8}
                    className="shrink-0 text-[#8a6a2b]"
                  />
                  Live stock levels
                </span>
                <span className="flex items-center gap-2">
                  <MapPin
                    size={15}
                    strokeWidth={1.8}
                    className="shrink-0 text-[#8a6a2b]"
                  />
                  Delivery options at checkout
                </span>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-8">
              <a
                href="#shop"
                className="inline-flex items-center gap-3 bg-[#1c1917] px-7 py-3.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:bg-[#3a332d]"
              >
                Shop the collection <ArrowRight size={15} strokeWidth={1.5} />
              </a>
            </div>
          </div>
          <div
            className="relative min-h-[240px] overflow-hidden bg-[#1c1917] sm:min-h-[300px] lg:min-h-0"
            aria-hidden="true"
          >
            <svg
              viewBox="0 0 600 600"
              className="absolute inset-0 h-full w-full"
              preserveAspectRatio="xMidYMid slice"
            >
              <g fill="none" stroke="#b8975a" strokeWidth="1.5">
                <circle cx="300" cy="300" r="236" opacity="0.35" />
                <circle cx="300" cy="300" r="196" opacity="0.55" />
                <circle cx="300" cy="300" r="156" />
                <circle cx="300" cy="300" r="116" opacity="0.7" />
                <circle cx="300" cy="144" r="10" fill="#b8975a" />
              </g>
              <text
                x="300"
                y="352"
                textAnchor="middle"
                fontFamily="Georgia, 'Times New Roman', serif"
                fontSize="150"
                fill="#faf6ef"
              >
                A
              </text>
            </svg>
            <div className="absolute bottom-5 left-5 border-l border-white/60 pl-3 text-white sm:bottom-7 sm:left-7">
              <p className="text-[10px] font-medium uppercase tracking-[0.2em]">
                Asnath
              </p>
            </div>
          </div>
        </div>
      </section>

      <main
        id="shop"
        className="mx-auto max-w-7xl px-4 pb-16 pt-12 sm:px-6 sm:pt-14 lg:px-8"
      >
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-medium tracking-[-0.04em] text-neutral-950">
              Shop the collection
            </h2>
          </div>

          <div className="w-full max-w-md">
            <form onSubmit={handleSearch} className="flex w-full gap-2">
              <div className="relative flex-1">
                <input
                  value={searchTerm}
                  onChange={event => {
                    setSearchTerm(event.target.value);
                    setShowSuggestions(Boolean(event.target.value.trim()));
                  }}
                  onFocus={() =>
                    setShowSuggestions(Boolean(suggestions.length))
                  }
                  onKeyDown={async event => {
                    if (event.key !== "Enter") return;
                    const query = searchTerm.trim();
                    if (!query) return;

                    const suggestion = suggestions[0];
                    if (
                      suggestion &&
                      suggestion.name
                        .toLowerCase()
                        .startsWith(query.toLowerCase())
                    ) {
                      event.preventDefault();
                      acceptSuggestion();
                      return;
                    }

                    event.preventDefault();
                    await handleSearch();
                  }}
                  placeholder="Search jewellery and accessories"
                  className="w-full border border-neutral-300 bg-white px-4 py-3 pr-24 text-sm text-neutral-900 outline-none focus:border-neutral-950"
                />
                {showSuggestions && suggestions.length > 0 && (
                  <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center overflow-hidden pr-24">
                    <span className="truncate text-sm text-gray-300">
                      {suggestions[0].name
                        .toLowerCase()
                        .startsWith(searchTerm.trim().toLowerCase())
                        ? suggestions[0].name.slice(searchTerm.trim().length)
                        : ""}
                    </span>
                  </div>
                )}
              </div>
              <button
                type="submit"
                className="bg-[#1c1917] px-5 py-3 text-[11px] font-bold uppercase tracking-[0.12em] text-white shadow-[0_8px_18px_rgba(28,25,23,0.16)] hover:bg-[#3a332d]"
              >
                Search
              </button>
            </form>
          </div>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {categoryOptions.map(option => {
            const isActive = activeCategory === option.value;
            return (
              <button
                key={option.label}
                type="button"
                onClick={() => changeCategory(option.value)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? "border-[#1c1917] bg-[#1c1917] text-white shadow-[0_5px_14px_rgba(28,25,23,0.18)]"
                    : "border-[#e4dccd] bg-white text-[#1c1917] hover:border-[#8a6a2b] hover:bg-[#f1e9db]"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>

        {(searchTerm || activeCategory) &&
          visibleProducts.length > 0 &&
          !isLoading && (
            <div className="mb-6 flex justify-start">
              <button
                type="button"
                onClick={() => resetToShop()}
                className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
              >
                Back to shop
              </button>
            </div>
          )}

        {isLoading ? (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map(n => (
              <div key={n} className="animate-pulse">
                <div className="mb-4 aspect-4/5 rounded-3xl bg-gray-200"></div>
                <div className="mb-2 h-4 w-3/4 rounded bg-gray-200"></div>
                <div className="h-4 w-1/4 rounded bg-gray-200"></div>
              </div>
            ))}
          </div>
        ) : visibleProducts.length === 0 ? (
          <div className="py-20 text-center">
            <Package size={48} className="mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-bold text-gray-900">
              New pieces are on the way.
            </h3>
            <p className="text-gray-500">
              Nothing matches here yet.
            </p>
            {(searchTerm || activeCategory) && (
              <p className="mt-2 text-sm text-gray-400">
                Try a broader keyword or reset the filters.
              </p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {visibleProducts.map(product => {
              const discountedPrice = Number(
                product.discounted_price ?? product.price ?? 0,
              );
              const initialPrice = Number(
                product.initial_price ?? discountedPrice,
              );
              const hasDiscount = initialPrice > discountedPrice;
              const discount = hasDiscount
                ? Math.ceil(
                    ((initialPrice - discountedPrice) / initialPrice) * 100,
                  )
                : 0;

              return (
                <Link
                  key={product.id}
                  href={`/products/${product.slug || product.id}`}
                  className="group cursor-pointer"
                >
                  <div className="flex h-full flex-col overflow-hidden border border-[#e4dccd] bg-white shadow-[0_8px_24px_rgba(28,25,23,0.055)] transition-all duration-300 hover:-translate-y-1 hover:border-[#8a6a2b] hover:shadow-[0_18px_36px_rgba(28,25,23,0.13)]">
                    <div className="relative flex aspect-square items-center justify-center overflow-hidden bg-[#f1e9db]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={getProductImageSrc(
                          getProductPrimaryImage(product),
                        )}
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent to-black/10" />

                      <button
                        onClick={e => {
                          e.preventDefault();
                          toggleWishlist(product.id);
                        }}
                        className="absolute right-4 top-4 z-10 border border-[#e4dccd] bg-white p-2.5 shadow-sm transition-all duration-200 hover:scale-105 hover:bg-[#f1e9db]"
                      >
                        <Heart
                          size={20}
                          className={`transition-colors ${
                            wishlist.includes(product.id)
                              ? "fill-rose-500 text-rose-500"
                              : "text-gray-400 hover:text-rose-400"
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex flex-1 flex-col space-y-3 p-4 sm:p-5">
                      <div className="space-y-2">
                        <h3 className="line-clamp-2 text-sm font-semibold text-[#1c1917] transition-colors sm:text-base group-hover:text-[#8a6a2b]">
                          {product.name}
                        </h3>

                      </div>

                      <div className="mt-auto space-y-2">
                        <div className="flex items-baseline gap-2">
                          <span className="text-lg font-medium tracking-[-0.03em] text-neutral-950 sm:text-xl">
                            Ksh. {discountedPrice.toLocaleString()}
                          </span>
                          {hasDiscount && (
                            <span className="text-xs font-medium text-gray-500 line-through sm:text-sm">
                              Ksh. {initialPrice.toLocaleString()}
                            </span>
                          )}
                          {discount > 0 && (
                            <span className="text-xs font-medium text-gray-500 sm:text-sm">
                              Save {discount}%
                            </span>
                          )}
                        </div>

                        {product.stock && product.stock < 15 ? (
                          <p className="text-xs text-gray-600">
                            Only {product.stock} left
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

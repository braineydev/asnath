"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getProductImageSrc } from "../lib/product-image";

type StorefrontClientProps = {
	initialProducts: Array<{
		id: string | number;
		slug?: string;
		name: string;
		price: number | string;
		stock?: number;
		images?: string[];
		category?: { name?: string; slug?: string } | string | null;
		category_name?: string;
	}>;
	initialCategories: Array<{ id: string | number; name: string; slug: string }>;
};

const heroSlides = [
	{
		image: "/carousel3.png",
		alt: "Gold earrings arranged with natural shells",
		eyebrow: "MADE FOR YOUR MOMENTS",
		title: <>Find your<br />own kind of shine.</>,
		copy: "From small everyday favourites to pieces that turn a moment into a memory.",
	},
	{
		image: "/carousel2.png",
		alt: "A pair of gold earrings styled on a light background",
		eyebrow: "THE EVERYDAY EDIT",
		title: <>Wear what<br />feels like you.</>,
		copy: "Easy to wear, lovely to keep. Find your next favourite in the Aseni collection.",
	},
	{
		image: "/carousel1.png",
		alt: "A close-up fashion portrait featuring gold earrings",
		eyebrow: "ASENI / EST. 2026",
		title: <>More than<br />just an accessory.</>,
		copy: "A little detail can say a lot. Discover the pieces that make every day feel like yours.",
	},
];

export default function StorefrontClient({ initialProducts, initialCategories }: StorefrontClientProps) {
	const searchParams = useSearchParams();
	const selectedCategorySlug = searchParams.get("category") || "";
	const selectedSearch = searchParams.get("search") || "";
	const [filteredProducts, setFilteredProducts] = useState(initialProducts);
	const [filterLoading, setFilterLoading] = useState(false);
	const selectedCategory = initialCategories.find(category => category.slug === selectedCategorySlug);
	const hasFilter = Boolean(selectedCategorySlug || selectedSearch);

	useEffect(() => {
		if (!hasFilter) {
			setFilteredProducts(initialProducts);
			setFilterLoading(false);
			return;
		}

		const controller = new AbortController();
		const params = new URLSearchParams({ limit: "100" });
		if (selectedCategorySlug) {
			if (!selectedCategory) {
				setFilteredProducts([]);
				setFilterLoading(false);
				return () => controller.abort();
			}
			params.set("category", String(selectedCategory.id));
		}
		if (selectedSearch.trim()) params.set("search", selectedSearch.trim());

		setFilterLoading(true);
		fetch(`/api/products?${params.toString()}`, { signal: controller.signal })
			.then(response => {
				if (!response.ok) throw new Error("Unable to load products");
				return response.json();
			})
			.then(result => setFilteredProducts(Array.isArray(result.data) ? result.data : []))
			.catch(error => {
				if (error.name !== "AbortError") setFilteredProducts([]);
			})
			.finally(() => { if (!controller.signal.aborted) setFilterLoading(false); });
		return () => controller.abort();
	}, [hasFilter, initialProducts, selectedCategory, selectedCategorySlug, selectedSearch]);

	const [activeSlide, setActiveSlide] = useState(0);
	const [hoverPaused, setHoverPaused] = useState(false);
	const [manualPaused, setManualPaused] = useState(false);
	const featured = heroSlides[activeSlide];

	useEffect(() => {
		if (hoverPaused || manualPaused) return;
		const timer = window.setInterval(() => setActiveSlide(current => (current + 1) % heroSlides.length), 6500);
		return () => window.clearInterval(timer);
	}, [hoverPaused, manualPaused, activeSlide]);

	const showSlide = (index: number) => setActiveSlide((index + heroSlides.length) % heroSlides.length);

	return (
		<main className="bg-[#f7f7f5] text-[#171717]">
			<section className="mx-auto max-w-[1600px] px-0 pb-5 pt-0 sm:px-5 sm:pt-5 lg:px-8">
				<div
					className="group relative isolate flex min-h-[560px] items-end overflow-hidden bg-[#26211e] text-white sm:min-h-[620px] lg:min-h-[680px]"
					onMouseEnter={() => setHoverPaused(true)}
					onMouseLeave={() => setHoverPaused(false)}
					onFocus={() => setHoverPaused(true)}
					onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setHoverPaused(false); }}
					role="region"
					aria-roledescription="carousel"
					aria-label="Aseni featured collection"
				>
					{heroSlides.map((slide, index) => (
						<div key={slide.image} aria-hidden={index !== activeSlide} className={`absolute inset-0 z-0 transition-opacity duration-1000 ease-in-out ${index === activeSlide ? "opacity-100" : "opacity-0"}`}>
							{/* eslint-disable-next-line @next/next/no-img-element */}
							<img src={slide.image} alt={slide.alt} className={`h-full w-full object-cover transition-transform duration-[7000ms] ease-out ${index === activeSlide ? "scale-105" : "scale-100"}`} />
						</div>
					))}
					<div className="absolute inset-0 z-10 bg-gradient-to-r from-black/20 via-transparent to-transparent" />
					<div className="relative z-20 w-full px-6 pb-12 pt-24 sm:px-12 sm:pb-14 lg:px-20">
						{/* Carousel wording is intentionally hidden; keep this data for future copy updates.
						<p className="mb-6 animate-[fadeIn_700ms_ease-out] text-[9px] font-semibold uppercase tracking-[0.3em] text-white/80 sm:text-[10px]">{featured.eyebrow}</p>
						<h1 className="max-w-4xl animate-[fadeIn_900ms_ease-out] font-sans text-5xl font-black uppercase leading-[0.92] tracking-[-0.055em] sm:text-7xl lg:text-[96px]">{featured.title}</h1>
						<p className="mt-6 max-w-md text-sm leading-6 text-white/80 sm:text-base sm:leading-7">{featured.copy}</p>
						*/}
						<Link href="#shop" className="mt-8 inline-flex min-h-12 items-center bg-white px-7 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#171717] transition-colors hover:bg-[#dedede]">
							Shop Aseni <span aria-hidden="true" className="ml-6 text-base">&rarr;</span>
						</Link>
					</div>
					<button type="button" onClick={() => showSlide(activeSlide - 1)} aria-label="Previous slide" className="absolute left-3 top-1/2 z-30 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/50 bg-black/15 text-xl text-white opacity-0 transition hover:bg-white hover:text-black group-hover:opacity-100 focus:opacity-100 sm:left-6">&lsaquo;</button>
					<button type="button" onClick={() => showSlide(activeSlide + 1)} aria-label="Next slide" className="absolute right-3 top-1/2 z-30 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/50 bg-black/15 text-xl text-white opacity-0 transition hover:bg-white hover:text-black group-hover:opacity-100 focus:opacity-100 sm:right-6">&rsaquo;</button>
					<div className="absolute bottom-6 right-6 z-30 flex items-center gap-2 sm:bottom-8 sm:right-10" role="group" aria-label="Carousel slides">
						{heroSlides.map((slide, index) => <button key={slide.image} type="button" aria-label={`Go to slide ${index + 1}`} aria-current={index === activeSlide} onClick={() => showSlide(index)} className={`h-1 transition-all duration-500 ${index === activeSlide ? "w-10 bg-white" : "w-5 bg-white/45 hover:bg-white/80"}`} />)}
					</div>
				</div>
			</section>

			<section id="shop" className="mx-auto max-w-[1500px] scroll-mt-32 px-4 pb-16 pt-10 sm:px-8 sm:pb-24 lg:px-12">
				<div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-[#dededb] pb-5 sm:mb-10">
					<div><p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#777]">{selectedCategory ? "Shop collection" : selectedSearch ? "Search results" : "The Aseni edit"}</p><h2 className="font-sans text-3xl font-bold uppercase leading-none tracking-[-0.035em] text-[#171717] sm:text-4xl">{selectedCategory?.name || (selectedSearch ? `Results for “${selectedSearch}”` : "Popular products")}</h2></div>
					<div className="flex items-center gap-4"><p className="max-w-xs text-xs leading-5 text-[#686868]">{selectedCategory ? `Explore our ${selectedCategory.name.toLowerCase()} collection.` : "Everyday pieces, chosen to make getting dressed feel like you."}</p>{hasFilter && <Link href="/#shop" className="shrink-0 text-[9px] font-semibold uppercase tracking-[0.14em] text-[#777] underline underline-offset-4 hover:text-[#171717]">Clear filter</Link>}</div>
				</div>
				{filterLoading ? <p className="border-y border-[#dededb] py-16 text-center text-sm text-[#686868]">Loading {selectedCategory?.name.toLowerCase() || "products"}…</p> : filteredProducts.length === 0 ? <p className="border-y border-[#dededb] py-16 text-center text-sm text-[#686868]">{hasFilter ? `No products found${selectedCategory ? ` in ${selectedCategory.name}` : ""}.` : "Our collection is being prepared. Please check back soon."}</p> : (
					<div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-2 sm:gap-x-5 sm:gap-y-10 lg:grid-cols-3 xl:grid-cols-4">
						{filteredProducts.map((product, index) => <article key={product.id} className="group">
							<Link href={`/products/${product.slug || product.id}`} className="relative block aspect-[4/5] overflow-hidden bg-[#e9e8e5]">
								{product.images?.[0] ? <>
									{/* eslint-disable-next-line @next/next/no-img-element */}<img src={getProductImageSrc(product.images[0])} alt={product.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
								</> : <div className="flex h-full items-center justify-center px-5 text-center font-display text-2xl text-[#777]">{product.name}</div>}
								<span className="absolute left-3 top-3 bg-white px-2.5 py-1.5 text-[8px] font-semibold uppercase tracking-[0.16em] text-[#252525]">{index < 3 ? "Popular" : "Aseni edit"}</span>
								{Number(product.stock || 0) < 1 && <span className="absolute bottom-3 left-3 bg-white/90 px-2.5 py-1.5 text-[8px] font-semibold uppercase tracking-[0.12em] text-[#555]">Sold out</span>}
							</Link>
							<div className="flex items-start justify-between gap-2 pt-3.5"><div><Link href={`/products/${product.slug || product.id}`} className="text-xs font-medium text-[#171717] hover:underline sm:text-sm">{product.name}</Link><p className="mt-1.5 text-xs text-[#686868]">KSh {Number(product.price).toLocaleString()}</p></div><Link href={`/products/${product.slug || product.id}`} aria-label={`View ${product.name}`} className="flex h-8 w-8 shrink-0 items-center justify-center border border-[#d9d9d6] text-sm text-[#252525] transition-colors hover:border-[#171717] hover:bg-[#171717] hover:text-white">&rarr;</Link></div>
						</article>)}
					</div>
				)}
			</section>
		</main>
	);
}

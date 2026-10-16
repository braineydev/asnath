"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type StorefrontClientProps = {
	initialProducts: Array<{
		id: string | number;
		slug?: string;
		name: string;
		price: number | string;
		stock?: number;
		images?: string[];
	}>;
	initialCategories: Array<{ id: string | number; name: string; slug: string }>;
};

const heroSlides = [
	{
		image: "https://images.unsplash.com/photo-1572251299197-bcbc241bf4fa?auto=format&fit=crop&w=2200&q=85",
		alt: "A close-up fashion portrait featuring gold earrings",
		eyebrow: "ASNATH / EST. 2026",
		title: <>More than<br />just an accessory.</>,
		copy: "A little detail can say a lot. Discover the pieces that make every day feel like yours.",
	},
	{
		image: "https://images.unsplash.com/photo-1632525230528-ec17c49bc168?auto=format&fit=crop&w=2200&q=85",
		alt: "A pair of gold earrings styled on a light background",
		eyebrow: "THE EVERYDAY EDIT",
		title: <>Wear what<br />feels like you.</>,
		copy: "Easy to wear, lovely to keep. Find your next favourite in the Asnath collection.",
	},
	{
		image: "https://images.unsplash.com/photo-1764181106586-1ca290a3a395?auto=format&fit=crop&w=2200&q=85",
		alt: "Gold earrings arranged with natural shells",
		eyebrow: "MADE FOR YOUR MOMENTS",
		title: <>Find your<br />own kind of shine.</>,
		copy: "From small everyday favourites to pieces that turn a moment into a memory.",
	},
];

export default function StorefrontClient({ initialProducts, initialCategories }: StorefrontClientProps) {
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
					aria-label="Asnath featured collection"
				>
					{heroSlides.map((slide, index) => (
						<div key={slide.image} aria-hidden={index !== activeSlide} className={`absolute inset-0 z-0 transition-opacity duration-1000 ease-in-out ${index === activeSlide ? "opacity-100" : "opacity-0"}`}>
							{/* eslint-disable-next-line @next/next/no-img-element */}
							<img src={slide.image} alt={slide.alt} className={`h-full w-full object-cover transition-transform duration-[7000ms] ease-out ${index === activeSlide ? "scale-105" : "scale-100"}`} />
						</div>
					))}
					<div className="absolute inset-0 z-10 bg-gradient-to-r from-black/75 via-black/45 to-black/5" />
					<div key={activeSlide} className="relative z-20 w-full px-6 pb-20 pt-24 sm:px-12 sm:pb-24 lg:px-20">
						<p className="mb-6 animate-[fadeIn_700ms_ease-out] text-[9px] font-semibold uppercase tracking-[0.3em] text-white/80 sm:text-[10px]">{featured.eyebrow}</p>
						<h1 className="max-w-4xl animate-[fadeIn_900ms_ease-out] font-sans text-5xl font-black uppercase leading-[0.92] tracking-[-0.055em] sm:text-7xl lg:text-[96px]">{featured.title}</h1>
						<p className="mt-6 max-w-md animate-[fadeIn_1100ms_ease-out] text-sm leading-6 text-white/80 sm:text-base sm:leading-7">{featured.copy}</p>
						<Link href="#shop" className="mt-8 inline-flex min-h-12 items-center bg-white px-7 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#171717] transition-colors hover:bg-[#dedede]">
							Shop Asnath <span aria-hidden="true" className="ml-6 text-base">&rarr;</span>
						</Link>
					</div>
					<button type="button" onClick={() => showSlide(activeSlide - 1)} aria-label="Previous slide" className="absolute left-3 top-1/2 z-30 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/50 bg-black/15 text-xl text-white opacity-0 transition hover:bg-white hover:text-black group-hover:opacity-100 focus:opacity-100 sm:left-6">&lsaquo;</button>
					<button type="button" onClick={() => showSlide(activeSlide + 1)} aria-label="Next slide" className="absolute right-3 top-1/2 z-30 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/50 bg-black/15 text-xl text-white opacity-0 transition hover:bg-white hover:text-black group-hover:opacity-100 focus:opacity-100 sm:right-6">&rsaquo;</button>
					<div className="absolute bottom-6 right-6 z-30 flex items-center gap-2 sm:bottom-8 sm:right-10" role="group" aria-label="Carousel controls">
						<button type="button" onClick={() => setManualPaused(value => !value)} aria-label={manualPaused ? "Play slideshow" : "Pause slideshow"} className="mr-2 text-[10px] tracking-[0.12em] text-white/80 hover:text-white">{manualPaused ? "PLAY" : "PAUSE"}</button>
						{heroSlides.map((slide, index) => <button key={slide.image} type="button" aria-label={`Go to slide ${index + 1}`} aria-current={index === activeSlide} onClick={() => showSlide(index)} className={`h-1 transition-all duration-500 ${index === activeSlide ? "w-10 bg-white" : "w-5 bg-white/45 hover:bg-white/80"}`} />)}
						<span className="ml-2 font-mono text-[9px] tracking-[0.15em] text-white/80">0{activeSlide + 1} / 0{heroSlides.length}</span>
					</div>
				</div>
			</section>

			<section aria-label="Shop categories" className="mx-auto flex max-w-[1500px] flex-wrap items-center justify-center gap-x-3 gap-y-3 border-b border-[#e6e6e3] px-4 py-7 sm:px-8 lg:gap-x-4">
				<span className="mr-2 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#777]">Trending now</span>
				{initialCategories.slice(0, 6).map(category => <Link key={category.id} href={`/?category=${encodeURIComponent(category.slug)}#shop`} className="border border-[#d9d9d6] px-5 py-2.5 text-[9px] font-medium uppercase tracking-[0.14em] text-[#252525] transition-colors hover:border-[#171717] hover:bg-[#171717] hover:text-white">{category.name}</Link>)}
			</section>

			<section id="shop" className="mx-auto max-w-[1500px] scroll-mt-32 px-4 pb-16 pt-10 sm:px-8 sm:pb-24 lg:px-12">
				<div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-[#dededb] pb-5 sm:mb-10">
					<div><p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#777]">The Asnath edit</p><h2 className="font-sans text-3xl font-bold uppercase leading-none tracking-[-0.035em] text-[#171717] sm:text-4xl">Popular products</h2></div>
					<p className="max-w-xs text-xs leading-5 text-[#686868]">Everyday pieces, chosen to make getting dressed feel like you.</p>
				</div>
				{initialProducts.length === 0 ? <p className="border-y border-[#dededb] py-16 text-center text-sm text-[#686868]">Our collection is being prepared. Please check back soon.</p> : (
					<div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-2 sm:gap-x-5 sm:gap-y-10 lg:grid-cols-3 xl:grid-cols-4">
						{initialProducts.map((product, index) => <article key={product.id} className="group">
							<Link href={`/products/${product.slug || product.id}`} className="relative block aspect-[4/5] overflow-hidden bg-[#e9e8e5]">
								{product.images?.[0] ? <>
									{/* eslint-disable-next-line @next/next/no-img-element */}<img src={product.images[0]} alt={product.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
								</> : <div className="flex h-full items-center justify-center px-5 text-center font-display text-2xl text-[#777]">{product.name}</div>}
								<span className="absolute left-3 top-3 bg-white px-2.5 py-1.5 text-[8px] font-semibold uppercase tracking-[0.16em] text-[#252525]">{index < 3 ? "Popular" : "Asnath edit"}</span>
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

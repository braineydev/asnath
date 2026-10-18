"use client";

import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

const RING_RADIUS = 24;
const RING_LENGTH = 2 * Math.PI * RING_RADIUS;

export default function ScrollProgressButton() {
	const [progress, setProgress] = useState(0);

	useEffect(() => {
		let frame = 0;
		const updateProgress = () => {
			if (frame) return;
			frame = window.requestAnimationFrame(() => {
				const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
				const nextProgress = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
				setProgress(Math.min(1, Math.max(0, nextProgress)));
				frame = 0;
			});
		};

		updateProgress();
		window.addEventListener("scroll", updateProgress, { passive: true });
		window.addEventListener("resize", updateProgress);
		const resizeObserver = new ResizeObserver(updateProgress);
		resizeObserver.observe(document.body);
		return () => {
			window.removeEventListener("scroll", updateProgress);
			window.removeEventListener("resize", updateProgress);
			resizeObserver.disconnect();
			if (frame) window.cancelAnimationFrame(frame);
		};
	}, []);

	if (progress < 0.01) return null;

	return (
		<button
			type="button"
			onClick={() => window.scrollTo({
				top: 0,
				behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
			})}
			aria-label="Scroll to top"
			title="Back to top"
			className="fixed bottom-5 right-5 z-[60] flex h-14 w-14 items-center justify-center rounded-full bg-white text-[#171717] shadow-[0_5px_20px_rgba(0,0,0,0.12)] transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ed174c]"
		>
			<svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 56 56" aria-hidden="true">
				<circle cx="28" cy="28" r={RING_RADIUS} fill="none" stroke="#e5e5e2" strokeWidth="1.5" />
				<circle
					cx="28"
					cy="28"
					r={RING_RADIUS}
					fill="none"
					stroke="#ed174c"
					strokeWidth="2"
					strokeLinecap="round"
					strokeDasharray={RING_LENGTH}
					strokeDashoffset={RING_LENGTH * (1 - progress)}
					className="transition-[stroke-dashoffset] duration-100 ease-linear"
				/>
			</svg>
			<ArrowUp size={19} strokeWidth={1.7} aria-hidden="true" />
		</button>
	);
}

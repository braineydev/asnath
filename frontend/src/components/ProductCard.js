import { Plus } from "lucide-react";
import Link from "next/link";
import { getProductImageSrc } from "../lib/product-image";

export default function ProductCard({ product }) {
  const productHref = `/products/${product.id}`;
  const image =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images[0]
      : null;
  const isInStock = Number(product.stock || 0) > 0;
  const price = Number(product.discounted_price ?? product.price ?? 0);
  const initialPrice = Number(product.initial_price ?? price);
  const hasDiscount = initialPrice > price;
  const discount = hasDiscount
    ? Math.ceil(((initialPrice - price) / initialPrice) * 100)
    : 0;

  return (
    <div className="group flex flex-col overflow-hidden border border-[#e4dccd] bg-white transition-all duration-300 ease-in-out hover:-translate-y-1 hover:border-[#b8975a]">
      <Link
        href={productHref}
        className="relative aspect-square w-full overflow-hidden bg-[#f1e9db]"
      >
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={getProductImageSrc(image)}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <span className="flex h-full items-center justify-center text-sm text-[#6b6258]">
            Image unavailable
          </span>
        )}
        {isInStock && product.stock < 15 && (
          <div className="absolute left-3 bottom-3 bg-white px-3 py-1 text-xs font-semibold text-[#8a6a2b]">
            Only {product.stock} left
          </div>
        )}
        {!isInStock && (
          <div className="absolute left-3 bottom-3 bg-white px-3 py-1 text-xs font-semibold text-[#6b6258]">
            Out of stock
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="space-y-2">
          <Link href={productHref}>
            <h3 className="text-base font-semibold text-[#1c1917] transition-colors hover:text-[#8a6a2b]">
              {product.name}
            </h3>
          </Link>
          <p className="text-sm text-[#6b6258]">
            {product.category?.name || product.categories?.name || "Accessories"}
          </p>
        </div>

        <div className="mt-auto flex items-end justify-between gap-4">
          <div className="flex items-baseline gap-3">
            <span className="text-xl font-medium tracking-[-0.03em] text-[#1c1917]">
              Ksh. {price.toLocaleString()}
            </span>
            {hasDiscount && (
              <span className="text-sm text-[#6b6258] line-through">
                Ksh. {Math.round(initialPrice).toLocaleString()}
              </span>
            )}
            {discount > 0 && (
              <span className="inline-block border border-[#e4dccd] px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.08em] text-[#6b6258]">
                {discount}% off
              </span>
            )}
          </div>
          <button
            disabled={!isInStock}
            aria-label={`Add ${product.name} to bag`}
            className="min-h-12 min-w-12 bg-[#1c1917] p-3 text-white transition duration-200 ease-in-out hover:bg-[#3a332d] disabled:bg-slate-300"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

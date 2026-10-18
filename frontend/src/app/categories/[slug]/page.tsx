import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import {
  getCategoriesFromSupabase,
  getProductsFromSupabase,
} from "../../../lib/catalog";
import { getProductImageSrc } from "../../../lib/product-image";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80";

function getSafeImageUrl(image?: string) {
  if (!image) return FALLBACK_IMAGE;

  try {
    const url = new URL(image);
    const configuredSupabaseHost =
      process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
    const allowedHosts = ["images.unsplash.com"];

    if (configuredSupabaseHost) {
      try {
        allowedHosts.push(new URL(configuredSupabaseHost).hostname);
      } catch {
        // Ignore invalid Supabase URL configuration.
      }
    }

    return allowedHosts.includes(url.hostname) ? image : FALLBACK_IMAGE;
  } catch {
    return FALLBACK_IMAGE;
  }
}

type Category = {
  id?: string | number;
  name: string;
  slug?: string;
  description?: string;
};

type Product = {
  id: string | number;
  name: string;
  slug?: string;
  price: number | string;
  initial_price?: number | string;
  discounted_price?: number | string;
  stock?: number;
  images?: string[];
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const getCategory = cache(async (slug: string): Promise<Category | null> => {
  try {
    const categories = await getCategoriesFromSupabase();
    return (
      categories.find(
        (entry: Category) =>
          entry.slug === slug || slugify(entry.name) === slug,
      ) || null
    );
  } catch {
    return null;
  }
});

const getCategoryProducts = cache(async (
  categoryId: string | number,
): Promise<Product[]> => {
  try {
    const result = await getProductsFromSupabase({ category: categoryId });
    return result.data;
  } catch {
    return [];
  }
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const category = await getCategory(resolvedParams.slug);

  if (!category) {
    return {
      title: "Category not found | Aseni",
      description: "The requested category could not be found.",
      alternates: { canonical: `/categories/${resolvedParams.slug}` },
    };
  }

  const title = `${category.name} | Aseni`;
  const description =
    category.description || `Browse ${category.name} products at Aseni.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/categories/${category.slug || resolvedParams.slug}`,
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: `${siteUrl}/categories/${category.slug || resolvedParams.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: { index: true, follow: true },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const category = await getCategory(resolvedParams.slug);

  if (!category) {
    notFound();
  }

  const products = await getCategoryProducts(category.id || "");
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` },
      {
        "@type": "ListItem",
        position: 2,
        name: category.name,
        item: `${siteUrl}/categories/${category.slug || resolvedParams.slug}`,
      },
    ],
  };

  return (
    <main className="min-h-screen bg-[#faf6ef] px-4 py-7 sm:px-6 sm:py-9 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div className="mx-auto max-w-[1440px]">
        <nav
          className="mb-7 text-[10px] uppercase tracking-[0.12em] text-neutral-500"
          aria-label="Breadcrumb"
        >
          <Link href="/" className="hover:text-black">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-700">{category.name}</span>
        </nav>

        <div className="mb-7 flex flex-col justify-between gap-3 border-b border-neutral-200 pb-5 sm:flex-row sm:items-end">
          <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#8a6a2b]">
            Shop category
          </p>
          <h1 className="font-display mt-2 text-3xl font-medium tracking-[-0.04em] text-neutral-950 sm:text-4xl">
            {category.name}
          </h1>
          </div>
          <p className="mt-4 max-w-2xl text-base leading-7 text-neutral-600">
            {category.description ||
              `Discover ${category.name.toLowerCase()} from Aseni.`}
          </p>
        </div>

        {products.length === 0 ? (
          <div className="border border-dashed border-neutral-300 bg-white p-12 text-center text-neutral-600">
            No products are available in this category right now.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-x-5 sm:gap-y-8 lg:grid-cols-3 xl:grid-cols-4">
            {products.map(product => (
              <Link
                key={product.id}
                href={`/products/${product.slug || product.id}`}
                className="group overflow-hidden border border-[#e4dccd] bg-[#fffdf9] transition-colors hover:border-[#b8975a]"
              >
                <div className="relative aspect-square bg-[#f1e9db]">
                  <img
                    src={getProductImageSrc(
                      getSafeImageUrl(product.images?.[0]),
                    )}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    loading="lazy"
                  />
                </div>
                <div className="p-3 sm:p-4">
                  <h2 className="line-clamp-2 text-sm font-medium text-neutral-950 sm:text-base">
                    {product.name}
                  </h2>
                  {(() => {
                    const price = Number(product.discounted_price ?? product.price ?? 0);
                    const originalPrice = Number(product.initial_price ?? price);
                    const onSale = originalPrice > price;
                    return <p className="mt-1 flex flex-wrap items-baseline gap-x-2 text-sm text-neutral-600">
                      <span className="font-medium text-neutral-950">Ksh. {price.toLocaleString()}</span>
                      {onSale && <span className="text-xs text-neutral-500 line-through">Ksh. {originalPrice.toLocaleString()}</span>}
                    </p>;
                  })()}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

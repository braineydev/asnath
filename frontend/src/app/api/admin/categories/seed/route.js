import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
	getAuthenticatedUser,
	getUserRole,
} from "../../../../../lib/auth-route-utils";
import { createSupabaseAdminClient } from "../../../../../lib/supabase-server";

const DEFAULT_CATEGORIES = [
	{ name: "Earrings", slug: "earrings" },
	{ name: "Necklaces", slug: "necklaces" },
	{ name: "Rings", slug: "rings" },
	{ name: "Brooches", slug: "brooches" },
	{ name: "Bracelets & Bangles", slug: "bracelets-bangles" },
	{ name: "Watches", slug: "watches" },
	{ name: "Handbags", slug: "handbags" },
	{ name: "Sunglasses", slug: "sunglasses" },
	{ name: "Hair Accessories", slug: "hair-accessories" },
];

export async function POST() {
	try {
		const cookieStore = await cookies();
		const supabase = createSupabaseAdminClient();
		const { user } = await getAuthenticatedUser(supabase, cookieStore);

		if (!user || getUserRole(user) !== "admin") {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 });
		}

		const { data, error } = await supabase
			.from("categories")
			.upsert(DEFAULT_CATEGORIES, { onConflict: "slug" })
			.select("id, name, slug")
			.order("name");

		if (error) throw error;
		return NextResponse.json({ categories: data || [] });
	} catch (error) {
		return NextResponse.json(
			{ error: error instanceof Error ? error.message : "Unable to set up categories" },
			{ status: 500 },
		);
	}
}

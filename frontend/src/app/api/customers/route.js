import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  getAuthenticatedUser,
  getUserRole,
} from "../../../lib/auth-route-utils";
import { createSupabaseAdminClient } from "../../../lib/supabase-server";

export async function GET() {
  const cookieStore = await cookies();
  const supabase = createSupabaseAdminClient();
  const { user } = await getAuthenticatedUser(supabase, cookieStore);

  if (!user || getUserRole(user) !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, role, phone, created_at")
    .order("full_name");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const authUsers = new Map();
  let page = 1;

  while (true) {
    const { data: usersPage, error: usersError } =
      await supabase.auth.admin.listUsers({ page, perPage: 1000 });

    if (usersError) {
      return NextResponse.json({ error: usersError.message }, { status: 500 });
    }

    for (const authUser of usersPage.users || []) {
      authUsers.set(authUser.id, authUser.email || "-");
    }

    if (!usersPage.nextPage) break;
    page = usersPage.nextPage;
  }

  return NextResponse.json({
    customers: (data || []).map(profile => ({
      ...profile,
      email: authUsers.get(profile.id) || "-",
    })),
  });
}

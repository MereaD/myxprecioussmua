import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Admins are users whose Clerk *public* metadata is { "role": "admin" }.
// Public metadata can only be changed from the Clerk dashboard or with the secret key,
// so signing up or editing your own profile can never grant this role.
export const ADMIN_ROLE = "admin";

type AdminCheck =
  | { status: "signed-out" }
  | { status: "forbidden"; email: string | null }
  | { status: "ok"; email: string | null };

export async function checkAdmin(): Promise<AdminCheck> {
  const user = await currentUser();
  if (!user) return { status: "signed-out" };

  const email = user.primaryEmailAddress?.emailAddress ?? null;
  if (user.publicMetadata?.role !== ADMIN_ROLE) return { status: "forbidden", email };
  return { status: "ok", email };
}

/** For admin API routes: returns an error response, or null when the caller is an admin. */
export async function requireAdmin() {
  const result = await checkAdmin();
  if (result.status === "signed-out") {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }
  if (result.status === "forbidden") {
    return NextResponse.json({ error: "Not allowed" }, { status: 403 });
  }
  return null;
}

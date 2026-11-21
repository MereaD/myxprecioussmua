import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isSignInPage = createRouteMatcher(["/admin/sign-in(.*)"]);

// Clerk only runs on the admin area; the public site never touches it.
export default clerkMiddleware(
  async (auth, req) => {
    if (!isSignInPage(req)) await auth.protect();
  },
  { signInUrl: "/admin/sign-in" }
);

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};

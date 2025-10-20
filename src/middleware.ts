import { NextResponse, NextRequest } from "next/server";

import { getToken } from "next-auth/jwt";

const publicPaths = ["/signin", "/signup"];

function isPathPublic(path: string) {
  return publicPaths.some((p) => path.startsWith(p));
  // 🔹 `.some()` checks if *at least one* element in `publicPaths` makes this condition true.
  // 🔹 Here it checks whether the current `path` starts with any of the public paths.
  //    Example: if path="/signin/extra" → true, because it starts with "/signin".
  // 🔹 Returns true if the route is public, false otherwise.
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // ✅ Extracts the requested path (like "/dashboard" or "/signin") from the URL.

  const session = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isAuthenticated = !!session;

  const isPublic = isPathPublic(pathname);

  // 🟢 Case 1: Public page (signin/signup)
  if (isPublic) {
    // If already logged in → redirect to home
    if (isAuthenticated) {
      const url = request.nextUrl.clone();
      // 🔹 `.clone()` creates a *new copy* of the original `URL` object.
      // 🔹 This ensures we don’t mutate the original `request.nextUrl` reference directly.
      // 🔹 Think of it like making a safe duplicate to modify before redirecting.

      url.pathname = "/";
      // ✅ Changes the path of the cloned URL to "/" (the homepage).

      return NextResponse.redirect(url);
      // ✅ Redirects the logged-in user away from signin/signup to home.
    }
    return NextResponse.next();
    // ✅ Allows unauthenticated users to access the signin/signup page normally.
  }

  // 🔒 Case 2: Protected page
  if (!isAuthenticated) {
    const url = request.nextUrl.clone();
    // 🔹 Again, `.clone()` makes a new copy of the current URL object to edit safely.

    url.pathname = "/signin";
    // ✅ Sets the new path to "/signin" for redirecting unauthenticated users.

    return NextResponse.redirect(url);
    // ✅ Redirects unauthenticated users to the signin page.
  }

  // ✅ Case 3: Authenticated & accessing protected page
  return NextResponse.next();
  // ✅ If user is authenticated and path is protected, allow access.
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:jpg|jpeg|png|svg|webp|gif|ico|json$)).*)",
  ],
  // ✅ This matcher ensures the middleware runs only on relevant routes (not on static files or API routes).
};

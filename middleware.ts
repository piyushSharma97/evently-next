import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  '/',
  '/events/:id',
  '/creator-onboarding',
  '/unauthorized',
  '/api/webhooks/clerk',
  '/api/webhooks/stripe',
  '/api/uploadthing'
]);

const isAdminRoute = createRouteMatcher(['/admin(.*)']);
const isCreatorRoute = createRouteMatcher(['/events/create', '/events/(.*)/update']);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();

    const { sessionClaims } = await auth();
    const claims = sessionClaims as Record<string, any> | undefined;
    const role = (claims?.metadata?.role || claims?.role || 'user') as string;

    // Enforce Admin-only routes
    if (isAdminRoute(req) && role !== 'admin') {
      const url = new URL('/unauthorized', req.url);
      return NextResponse.redirect(url);
    }

    // Enforce Creator/Admin routes
    if (isCreatorRoute(req) && role !== 'creator' && role !== 'admin') {
      const url = new URL('/creator-onboarding', req.url);
      return NextResponse.redirect(url);
    }
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};

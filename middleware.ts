import { authMiddleware } from "@clerk/nextjs";
 
export default authMiddleware({
  publicRoutes: [
    '/',
    '/events/:id',
    '/app/api/webhooks/clerk',
    '/app/api/webhooks/stripe',
    '/app/api/uploadthing'
  ],
  ignoredRoutes: [
    '/app/api/webhooks/clerk',
    '/app/api/webhooks/stripe',
    '/app/api/uploadthing'
  ]
});
 
export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
 
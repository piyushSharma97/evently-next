import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="mx-auto max-w-md rounded-2xl border border-red-100 bg-red-50/50 p-8 shadow-sm">
        <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-2xl text-red-600">
          🔒
        </div>
        <h1 className="h3-bold mb-2 text-grey-900">Access Restricted</h1>
        <p className="p-regular-16 mb-6 text-grey-600">
          You do not have the required role or permissions to access this page. If you believe this is an error, please contact a platform administrator.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild className="rounded-full bg-primary-500 hover:bg-primary-600">
            <Link href="/">Back to Home</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/creator-onboarding">Creator Access</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}


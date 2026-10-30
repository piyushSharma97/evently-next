import Link from "next/link";
import Image from "next/image";
import { UserButton } from "@clerk/nextjs";
import { requireRole } from "@/lib/auth/guard";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    await requireRole(["admin"]);
  } catch (err) {
    redirect("/unauthorized");
  }

  return (
    <div className="flex min-h-screen flex-col bg-grey-50">
      <header className="border-b bg-white">
        <div className="wrapper flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/assets/images/logo.svg" width={110} height={32} alt="Evently" />
            </Link>
            <span className="rounded-md bg-purple-100 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-purple-700">
              Admin Portal
            </span>
          </div>

          <nav className="flex items-center gap-4">
            <Link href="/admin" className="p-medium-14 text-grey-700 hover:text-primary-500">
              Dashboard
            </Link>
            <Link href="/" className="p-medium-14 text-grey-500 hover:text-primary-500">
              Back to Main App
            </Link>
            <UserButton afterSignOutUrl="/" />
          </nav>
        </div>
      </header>

      <main className="flex-1 wrapper py-8">{children}</main>
    </div>
  );
}

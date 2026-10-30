import Image from "next/image"
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import Link from "next/link"
import { Button } from "../ui/button"
import NavItems from "./NavItems"
import MobileNav from "./MobileNav"
import RoleIndicator from "./RoleIndicator"
import { getCurrentUserContext } from "@/lib/auth/guard"

export default async function Header() {
  const ctx = await getCurrentUserContext();
  const userRole = ctx.userRole || 'user';

  return (
    <header className="w-full border-b">
      <div className="wrapper flex items-center justify-between">
        <Link href="/" className="w-36">
          <Image
            src="/assets/images/logo.svg"
            width={128}
            height={38}
            alt="Evently logo"
          />
        </Link>

        <SignedIn>
          <nav className="md:flex-between hidden w-full max-w-md">
            <NavItems userRole={userRole} />
          </nav>
        </SignedIn>

        <div className="flex items-center justify-end gap-3">
          <SignedIn>
            {ctx.clerkId && (
              <RoleIndicator clerkId={ctx.clerkId} initialRole={userRole} />
            )}
            <UserButton afterSignOutUrl="/" />
            <MobileNav userRole={userRole} />
          </SignedIn>
          <SignedOut>
            <Button asChild className="rounded-full" size="lg">
              <Link href="/sign-in">Login</Link>
            </Button>
          </SignedOut>
        </div>
      </div>
    </header>
  );
}

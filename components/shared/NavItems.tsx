"use client";

import Link from "next/link";
import { headerLinks } from "@/constants";
import { usePathname } from "next/navigation";
import { UserRole } from "@/lib/auth/roles";

type NavItemsProps = {
  userRole?: UserRole;
};

function NavItems({ userRole = "user" }: NavItemsProps) {
  const pathname = usePathname();

  const visibleLinks = headerLinks.filter((link) => {
    if (!link.roles) return true;
    return link.roles.includes(userRole);
  });

  return (
    <ul className="md:flex-between flex w-full flex-col items-start gap-5 md:flex-row">
      {visibleLinks.map((link) => {
        const isActive = pathname === link.route;
        return (
          <li
            key={link.route}
            className={`${
              isActive && "text-primary-500 font-semibold"
            } flex-center p-medium-16 whitespace-nowrap transition hover:text-primary-500`}
          >
            <Link href={link.route}>{link.label}</Link>
          </li>
        );
      })}
    </ul>
  );
}

export default NavItems;

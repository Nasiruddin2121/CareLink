"use client";

import { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { PROTECTED_ROUTES, PUBLIC_ROUTES } from "@/config/routes";
import UserDropdown from "@/components/header/UserDropdown";

type NavLink = {
  label: string;
  href: string;
  roles?: string[];
};

const NAV_LINKS: NavLink[] = [
  { label: "Home", href: PUBLIC_ROUTES.HOME },
  { label: "Conversations", href: PROTECTED_ROUTES.CONVERSATIONS },
  { label: "Broadcasts", href: PROTECTED_ROUTES.BROADCASTS_INBOX, roles: ["doctor"] },
  { label: "Prescriptions", href: PROTECTED_ROUTES.PRESCRIPTIONS_INBOX, roles: ["shop_keeper", "shop_owner"] },
];

const ChatHeader = () => {
  const { user, isAuthenticated } = useAuth();
  const pathname = usePathname();

  const accessibleLinks = useMemo(() => {
    return NAV_LINKS.filter((link) => {
      if (!link.roles) return true;
      if (!user?.type) return false;
      const userType = user.type === "shop_keeper" || (user.type as string) === "shop_owner" ? "shop_owner" : user.type;
      return link.roles.includes(userType) || link.roles.includes(user.type);
    });
  }, [user?.type]);

  const isLinkActive = (href: string) => {
    if (!pathname) return false;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/90 backdrop-blur dark:border-gray-800 dark:bg-gray-900/80 transition-colors">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        
        {/* Left: Logo + Nav Links */}
        <div className="flex min-w-0 flex-1 items-center gap-4 sm:gap-6 lg:gap-8">
          {/* Logo */}
          <Link href="/" className="font-bold text-lg sm:text-xl text-gray-900 dark:text-white">CareLink</Link>

          {/* Nav Links */}
          <nav className="flex flex-nowrap items-center gap-2 overflow-x-auto text-sm no-scrollbar sm:gap-3">
            {accessibleLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 font-medium transition sm:px-4 sm:py-2
                  ${isLinkActive(link.href)
                    ? "bg-orange-500 text-white shadow-lg"
                    : "text-gray-600 hover:bg-gray-100 hover:text-orange-500 dark:text-gray-300 dark:hover:bg-white/5"
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right: Auth/User Dropdown */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {isAuthenticated && user ? (
            <UserDropdown />
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href={PUBLIC_ROUTES.LOGIN}
                className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:border-orange-500 hover:text-orange-500 dark:border-gray-700 dark:text-gray-300 dark:hover:border-orange-400 dark:hover:text-orange-400 sm:px-4 sm:py-2"
              >
                Sign In
              </Link>
              <Link
                href={PUBLIC_ROUTES.REGISTER}
                className="rounded-lg bg-orange-500 px-3 py-1.5 text-sm font-medium text-white shadow-lg transition hover:bg-orange-600 sm:px-4 sm:py-2"
              >
                Join Now
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default ChatHeader;

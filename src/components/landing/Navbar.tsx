'use client';

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { PROTECTED_ROUTES, PUBLIC_ROUTES } from "@/config/routes";
import { Dropdown } from "@/components/ui/dropdown/Dropdown";
import { DropdownItem } from "@/components/ui/dropdown/DropdownItem";
import { getUserTypeLabel } from "@/utils/user.utils";
import { USER_TYPES } from "@/config/constants";
import { useState, useEffect, useRef } from "react";

export default function LandingNavbar() {
  const { user, isAuthenticated, isLoading, error, logout } = useAuth();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isShopOwner = user?.type === "medicine_supplier" || (user?.type as string) === "shop_owner";
  const isAdmin = user?.type === USER_TYPES.ADMIN;
  const userTypeLabel = user ? getUserTypeLabel(user.type) : "";

  useEffect(() => {
    if (isLoading) {
      if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current);
      loadingTimeoutRef.current = setTimeout(() => setShowSignIn(true), 3000);
    } else {
      if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current);
      setShowSignIn(false);
    }

    return () => {
      if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current);
    };
  }, [isLoading]);

  useEffect(() => {
    if (error) setShowSignIn(true);
  }, [error]);

  const closeDropdown = () => setIsDropdownOpen(false);
  const handleNavigation = (href: string) => { router.push(href); closeDropdown(); };
  const handleLogout = async () => {
    try { setIsLoggingOut(true); await logout(); }
    catch (err) { console.error(err); }
    finally { setIsLoggingOut(false); }
  };

  const avatarSrc = user?.avatar_url || user?.avatar || "/images/user/owner.jpg";

  return (
    <header className="fixed inset-x-0 top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-gray-900/80 border-b border-gray-200/50 dark:border-gray-800/50">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="font-bold text-lg sm:text-xl text-gray-900 dark:text-white">CareLink</Link>

        {/* Desktop */}
        <div className="hidden lg:flex items-center gap-4">
          {isLoading && !showSignIn ? (
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
          ) : isAuthenticated && user && !showSignIn ? (
            <div className="relative">
              <button
                onClick={(e) => { e.stopPropagation(); setIsDropdownOpen(!isDropdownOpen); }}
                className="flex items-center gap-3 rounded-lg px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                <Image
                  src={avatarSrc}
                  alt={user.name || "User"}
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div className="hidden flex-col items-start sm:flex">
                  <span className="font-medium text-gray-800 dark:text-gray-200">{user.name || "User"}</span>
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">{userTypeLabel}</span>
                </div>
                <svg className={`w-4 h-4 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isDropdownOpen && (
                <Dropdown
                  isOpen={isDropdownOpen}
                  onClose={closeDropdown}
                  className="absolute right-0 mt-2 w-52 flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-lg dark:border-gray-800 dark:bg-gray-900"
                >
                  <div className="mb-3 border-b border-gray-200 pb-3 dark:border-gray-800">
                    <span className="block font-medium text-sm text-gray-800 dark:text-gray-200">{user.name || "User"}</span>
                    {user.email && <span className="block text-xs text-gray-500 dark:text-gray-400">{user.email}</span>}
                    <span className="block text-xs font-bold text-gray-600 dark:text-gray-400">{userTypeLabel}</span>
                  </div>
                  <ul className="flex flex-col gap-1">
                    <DropdownItem onClick={() => handleNavigation("/profile")}>Profile</DropdownItem>
                    {isAdmin ? (
                      <DropdownItem onClick={() => handleNavigation(PROTECTED_ROUTES.ADMIN_DASHBOARD)}>Dashboard</DropdownItem>
                    ) : (
                      <DropdownItem onClick={() => handleNavigation(PROTECTED_ROUTES.CONVERSATIONS)}>Inbox</DropdownItem>
                    )}
                    {isShopOwner && <DropdownItem onClick={() => handleNavigation(PROTECTED_ROUTES.PRESCRIPTIONS_INBOX)}>Prescriptions</DropdownItem>}
                  </ul>
                  <DropdownItem onClick={handleLogout} className="mt-2">{isLoggingOut ? "Logging out..." : "Sign out"}</DropdownItem>
                </Dropdown>
              )}
            </div>
          ) : (
            <div className="flex gap-2">
              <Link href={PUBLIC_ROUTES.LOGIN} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:border-blue-400 hover:text-blue-500 transition">Sign In</Link>
              <Link href={PUBLIC_ROUTES.REGISTER} className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold hover:from-blue-600 hover:to-purple-600 transition">Join Now</Link>
            </div>
          )}
        </div>

        {/* Mobile */}
        <div className="flex lg:hidden items-center gap-2">
          {isLoading && !showSignIn ? (
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
          ) : isAuthenticated && user && !showSignIn ? (
            <div className="relative">
              <button onClick={(e) => { e.stopPropagation(); setIsDropdownOpen(!isDropdownOpen); }}>
                <Image src={avatarSrc} alt={user.name || "User"} width={40} height={40} className="h-10 w-10 rounded-full object-cover" />
              </button>

              {isDropdownOpen && (
                <Dropdown
                  isOpen={isDropdownOpen}
                  onClose={closeDropdown}
                  className="absolute right-0 mt-2 w-48 flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-lg dark:border-gray-800 dark:bg-gray-900"
                >
                  <div className="mb-3 border-b border-gray-200 pb-3 dark:border-gray-800">
                    <span className="block font-medium text-sm text-gray-800 dark:text-gray-200">{user.name || "User"}</span>
                    {user.email && <span className="block text-xs text-gray-500 dark:text-gray-400">{user.email}</span>}
                    <span className="block text-xs font-bold text-gray-600 dark:text-gray-400">{userTypeLabel}</span>
                  </div>
                  <ul className="flex flex-col gap-1">
                    <DropdownItem onClick={() => handleNavigation("/profile")}>Profile</DropdownItem>
                    {isAdmin ? (
                      <DropdownItem onClick={() => handleNavigation(PROTECTED_ROUTES.ADMIN_DASHBOARD)}>Dashboard</DropdownItem>
                    ) : (
                      <DropdownItem onClick={() => handleNavigation(PROTECTED_ROUTES.CONVERSATIONS)}>Inbox</DropdownItem>
                    )}
                    {isShopOwner && <DropdownItem onClick={() => handleNavigation(PROTECTED_ROUTES.PRESCRIPTIONS_INBOX)}>Prescriptions</DropdownItem>}
                  </ul>
                  <DropdownItem onClick={handleLogout} className="mt-2">{isLoggingOut ? "Logging out..." : "Sign out"}</DropdownItem>
                </Dropdown>
              )}
            </div>
          ) : (
            <div className="flex gap-2">
              <Link href={PUBLIC_ROUTES.LOGIN} className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:border-blue-400 hover:text-blue-500 transition">Sign In</Link>
              <Link href={PUBLIC_ROUTES.REGISTER} className="px-3 py-2 rounded-lg transition">Join Now</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

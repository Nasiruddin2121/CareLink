"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { useSidebar } from "@/context/SidebarContext";
import { PUBLIC_ROUTES } from "@/config/routes";
import UserDropdown from "@/components/header/UserDropdown";

const AdminHeader = () => {
  const { user, isAuthenticated } = useAuth();
  const { isMobileOpen, toggleMobileSidebar } = useSidebar();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/90 backdrop-blur dark:border-gray-800 dark:bg-gray-900/80 transition-colors">
      <div className="mx-auto flex h-16 w-full max-w-[1400px] items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Left: Mobile menu + Logo */}
        <div className="flex items-center gap-3">
          {/* Mobile Sidebar Toggle */}
          <button
            onClick={toggleMobileSidebar}
            aria-label="Toggle Sidebar"
            className="flex items-center justify-center h-10 w-10 rounded-lg border lg:hidden border-gray-300 text-gray-600 transition hover:bg-orange-50 hover:text-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-orange-900/20 dark:hover:text-orange-300"
          >
            {isMobileOpen ? (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M6.21967 7.28131C5.92678 6.98841 5.92678 6.51354 6.21967 6.22065C6.51256 5.92775 6.98744 5.92775 7.28033 6.22065L11.999 10.9393L16.7176 6.22078C17.0105 5.92789 17.4854 5.92788 17.7782 6.22078C18.0711 6.51367 18.0711 6.98855 17.7782 7.28144L13.0597 12L17.7782 16.7186C18.0711 17.0115 18.0711 17.4863 17.7782 17.7792C17.4854 18.0721 17.0105 18.0721 16.7176 17.7792L11.999 13.0607L7.28033 17.7794C6.98744 18.0722 6.51256 18.0722 6.21967 17.7794C5.92678 17.4865 5.92678 17.0116 6.21967 16.7187L10.9384 12L6.21967 7.28131Z"
                  fill="currentColor"
                />
              </svg>
            ) : (
              <svg
                width="20"
                height="14"
                viewBox="0 0 20 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0 0H20V2H0V0ZM0 6H20V8H0V6ZM0 12H20V14H0V12Z"
                  fill="currentColor"
                />
              </svg>
            )}
          </button>

          {/* Logo */}
         <Link href="/" className="font-bold text-lg sm:text-xl text-gray-900 dark:text-white">CareLink</Link>
        </div>

        {/* Right: Auth / User */}
        <div className="flex items-center gap-3">
          {isAuthenticated && user ? (
            <UserDropdown />
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href={PUBLIC_ROUTES.LOGIN}
                className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:border-orange-500 hover:text-orange-500 dark:border-gray-700 dark:text-gray-300 dark:hover:border-orange-400 dark:hover:text-orange-400"
              >
                Sign In
              </Link>
              <Link
                href={PUBLIC_ROUTES.REGISTER}
                className="rounded-lg bg-orange-500 px-3 py-1.5 text-sm font-medium text-white shadow-lg transition hover:bg-orange-600"
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

export default AdminHeader;

"use client";

import { useMemo } from "react";
import Link from "next/link";

import { useAuth } from "@/hooks/useAuth";

import { PUBLIC_ROUTES, PROTECTED_ROUTES, RouteHelpers } from "@/config/routes";
import { USER_TYPES } from "@/config/constants";

export default function HeroSection() {
  const { user, isAuthenticated } = useAuth();

  const inboxRoute = useMemo(() => {
    if (!user) return PROTECTED_ROUTES.CONVERSATIONS;
    return RouteHelpers.getRedirectRoute(user.type);
  }, [user]);

  return (
    <section className="relative overflow-hidden from-white via-blue-50/30 to-purple-50/40 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Decorative shapes */}
      <div className="absolute -top-20 -left-20 h-72 w-72 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 h-72 w-72 bg-purple-500/10 rounded-full blur-3xl"></div>

      <div className="relative max-w-(--breakpoint-2xl) mx-auto px-4 sm:px-6 lg:px-8 py-28 flex flex-col lg:flex-row gap-20 lg:items-center">
        
        {/* LEFT SIDE */}
        <div className="flex flex-col flex-1 gap-8">
          <span className="inline-flex px-5 py-1.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-300 font-semibold text-xs uppercase tracking-wider w-max">
            Next-Gen Telehealth Platform
          </span>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-[1.1]">
            Healthcare conversations re-imagined for the digital age.
          </h1>

          <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 max-w-xl leading-relaxed">
            CareLink Connect centralizes your medical interactions—messages, diagnoses,
            prescription updates, and doctor responses—into one seamless, secure
            communication hub built for speed and clarity.
          </p>

          {/* Inbox Button */}
          {isAuthenticated && user?.type !== USER_TYPES.ADMIN && (
            <Link
              href={inboxRoute}
              className="inline-flex w-max items-center justify-center px-7 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md transition"
            >
              Open My Inbox
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}

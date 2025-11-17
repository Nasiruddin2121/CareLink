"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import { useAuth } from "@/hooks/useAuth";
import { useBroadcasts } from "@/hooks/useBroadcasts";
import BroadcastForm from "@/components/broadcast/BroadcastForm";

import { PROTECTED_ROUTES, RouteHelpers } from "@/config/routes";
import { USER_TYPES } from "@/config/constants";
import type { CreateBroadcastRequest } from "@/types/broadcast.types";

export default function HeroSection() {
  const { user, isAuthenticated } = useAuth();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const inboxRoute = useMemo(() => {
    if (!user) return PROTECTED_ROUTES.CONVERSATIONS;
    return RouteHelpers.getRedirectRoute(user.type);
  }, [user]);

  // Use broadcasts hook for creating broadcasts (patients only)
  const { create, isLoading, error } = useBroadcasts(
    user?.type,
    user?.id,
    'patient'
  );

  // Handle broadcast creation
  const handleCreateBroadcast = async (data: CreateBroadcastRequest) => {
    await create(data);
    setSuccessMessage('Your broadcast has been sent to all verified doctors! They will respond soon.');
    // Clear success message after 5 seconds
    setTimeout(() => {
      setSuccessMessage(null);
    }, 5000);
  };

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

          {/* Broadcast Form for Patients */}
          {isAuthenticated && user?.type === USER_TYPES.PATIENT ? (
            <div className="w-full max-w-2xl space-y-4">
              {/* Success Message */}
              {successMessage && (
                <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400">
                  {successMessage}
                </div>
              )}

              {/* Broadcast Form */}
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-md dark:border-gray-800 dark:bg-gray-900">
                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                  Send a Broadcast to Doctors
                </h2>
                <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                  Describe your medical concerns and verified doctors will respond to help you.
                </p>
                <BroadcastForm
                  onSubmit={handleCreateBroadcast}
                  isLoading={isLoading}
                  error={error}
                  onSuccess={() => {
                    // Success is handled by handleCreateBroadcast
                  }}
                />
              </div>
            </div>
          ) : (
            /* Inbox Button for other authenticated users */
            isAuthenticated && user?.type !== USER_TYPES.ADMIN && (
              <Link
                href={inboxRoute}
                className="inline-flex w-max items-center justify-center px-7 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md transition"
              >
                Open My Inbox
              </Link>
            )
          )}
        </div>
      </div>
    </section>
  );
}

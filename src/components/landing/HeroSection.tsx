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

  // Use broadcasts hook for creating consultation requests (patients only)
  const { create, isLoading, error } = useBroadcasts(
    user?.type,
    user?.id,
    'patient'
  );

  // Handle consultation request creation
  const handleCreateBroadcast = async (data: CreateBroadcastRequest) => {
    await create(data);
    setSuccessMessage('Your consultation request has been sent to all verified doctors! They will respond soon.');
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

          {/* Consultation Request Form for Patients */}
          {isAuthenticated && user?.type === USER_TYPES.PATIENT ? (
            <div className="w-full max-w-2xl space-y-4">
              {/* Success Message */}
              {successMessage && (
                <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-700 shadow-sm dark:bg-green-900/20 dark:border-green-800 dark:text-green-400">
                  <div className="flex items-start gap-3">
                    <svg className="mt-0.5 h-5 w-5 shrink-0 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p>{successMessage}</p>
                  </div>
                </div>
              )}

              {/* Consultation Request Form */}
              <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg dark:border-gray-800 dark:bg-gray-900">
                {/* Header Section with Icon */}
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-5 dark:from-orange-600 dark:to-orange-700">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                      <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">
                        Ask a Doctor
                      </h2>
                      <p className="mt-1 text-sm text-orange-50">
                        Get professional medical advice from verified doctors
                      </p>
                    </div>
                  </div>
                </div>

                {/* Form Content */}
                <div className="px-6 py-6">
                  <BroadcastForm
                    onSubmit={handleCreateBroadcast}
                    isLoading={isLoading}
                    error={error}
                    onSuccess={() => {
                      // Success is handled by handleCreateBroadcast
                    }}
                  />
                </div>

                {/* Trust Indicators */}
                <div className="border-t border-gray-200 bg-gray-50 px-6 py-4 dark:border-gray-800 dark:bg-gray-800/50">
                  <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1.5">
                      <svg className="h-4 w-4 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Verified Doctors</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <svg className="h-4 w-4 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <span>Quick Response</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <svg className="h-4 w-4 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <span>Secure & Private</span>
                    </div>
                  </div>
                </div>
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

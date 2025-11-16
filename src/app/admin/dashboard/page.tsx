"use client";

import React from "react";
import { useAdminStatistics } from "@/hooks/useAdminStatistics";
import StatisticsCards from "@/components/admin/StatisticsCards";

export default function AdminDashboardPage() {
  const { statistics, isLoading, error, refetch }: any = useAdminStatistics();

  if (error) {
    return (
      <div className="flex h-full flex-col gap-6 p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
            Admin Dashboard
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            System monitoring and user verification
          </p>
        </div>

        <div className="flex flex-1 items-center justify-center rounded-xl border border-red-300 bg-red-50 p-6 dark:border-red-700 dark:bg-red-900/20">
          <div className="text-center">
            <p className="text-sm font-medium text-red-600 dark:text-red-400">
              Error loading statistics: {error.message}
            </p>
            <button
              onClick={() => refetch()}
              className="mt-4 rounded-lg bg-red-600 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-red-700 transition"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col gap-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
          Admin Dashboard
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          System monitoring and user verification
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="flex flex-col gap-6">
        <StatisticsCards statistics={statistics} isLoading={isLoading} />

        {statistics && (
          <div className="">

            {/* Pending Verifications */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-md dark:border-gray-800 dark:bg-gray-900 transition hover:shadow-lg">
              <h3 className="mb-5 text-lg font-semibold text-gray-900 dark:text-white">
                Pending Verifications
              </h3>
              <div className="space-y-4">
                {["doctor", "shop_owner"].map((type) => (
                  <div key={type} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {type === "doctor" ? "Doctors" : "Shop Owners"}
                    </span>
                    <span className="text-lg font-bold text-orange-500 dark:text-orange-400">
                      {statistics.pending_verifications?.by_type?.[type] || 0}
                    </span>
                  </div>
                ))}

                <div className="mt-4 border-t border-gray-200 pt-3 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      Total
                    </span>
                    <span className="text-xl font-bold text-orange-500 dark:text-orange-400">
                      {statistics.pending_verifications?.total || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

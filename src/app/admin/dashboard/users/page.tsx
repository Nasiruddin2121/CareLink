"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAdminUsers } from "@/hooks/useAdminUsers";
import UserList from "@/components/admin/UserList";
import UserFilters from "@/components/admin/UserFilters";
import type { UserType } from "@/config/constants";

export default function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [userType, setUserType] = useState<UserType | undefined>(undefined);
  const [approvedStatus, setApprovedStatus] =
    useState<"approved" | "pending" | undefined>(undefined);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const {
    users,
    pendingVerifications,
    isLoading,
    isLoadingPending,
    error,
    count,
    refetch,
    approve,
    reject,
  } = useAdminUsers({
    q: debouncedSearchQuery || undefined,
    type: userType,
    approved: approvedStatus,
    limit: 20,
  });

  const handleApprove = useCallback(
    async (id: string) => {
      try {
        await approve(id);
        await refetch();
      } catch (err) {
        console.error("Failed to approve user:", err);
      }
    },
    [approve, refetch]
  );

  const handleReject = useCallback(
    async (id: string) => {
      try {
        await reject(id);
        await refetch();
      } catch (err) {
        console.error("Failed to reject user:", err);
      }
    },
    [reject, refetch]
  );

  // Error State UI
  if (error) {
    return (
      <div className="flex h-full flex-col gap-6 p-6 lg:p-8">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            User Management
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Manage users and verification requests
          </p>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="rounded-xl border border-red-300 bg-red-50 p-6 text-center dark:border-red-700 dark:bg-red-900/30">
            <p className="text-sm font-medium text-red-700 dark:text-red-400">
              Unable to load users — {error.message}
            </p>
            <button
              onClick={() => refetch()}
              className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // MAIN UI
  return (
    <div className="flex h-full flex-col gap-6 p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          User Management
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Manage users and verification requests ({count} total)
        </p>
      </div>

      {/* Filters */}
      <div className="rounded-xl bg-white p-4 shadow-sm border border-gray-100 dark:bg-gray-900 dark:border-gray-800">
        <UserFilters
          searchQuery={searchQuery}
          userType={userType}
          approvedStatus={approvedStatus}
          onSearchChange={setSearchQuery}
          onTypeChange={setUserType}
          onApprovedStatusChange={setApprovedStatus}
        />
      </div>

      {/* Pending Verifications */}
      {pendingVerifications.length > 0 && (
        <div className="rounded-xl border border-orange-200 bg-orange-50/60 p-5 shadow-sm dark:border-orange-900 dark:bg-orange-900/20">
          <h3 className="mb-3 text-sm font-semibold text-orange-800 dark:text-orange-300">
            Pending Verifications ({pendingVerifications.length})
          </h3>

          <UserList
            users={pendingVerifications}
            isLoading={isLoadingPending}
            onApprove={handleApprove}
            onReject={handleReject}
            showActions={true}
          />
        </div>
      )}

      {/* User List */}
      <div className="flex-1 overflow-y-auto">
        <UserList
          users={users}
          isLoading={isLoading}
          onApprove={handleApprove}
          onReject={handleReject}
          showActions={approvedStatus === "pending"}
        />
      </div>
    </div>
  );
}

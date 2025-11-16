"use client";

import React from "react";
import Image from "next/image";
import { getUserTypeLabel } from "@/utils/user.utils";
import type { AdminUser } from "@/types/admin.types";
import { CheckLineIcon, CloseLineIcon } from "@/icons";

interface UserListProps {
  users: AdminUser[];
  isLoading?: boolean;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  showActions?: boolean;
}

const UserList: React.FC<UserListProps> = ({
  users,
  isLoading = false,
  onApprove,
  onReject,
  showActions = false,
}) => {
  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  // ⏳ Skeleton Loader
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="animate-pulse rounded-xl bg-white p-5 shadow-sm dark:bg-gray-900"
          >
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-40 rounded bg-gray-200 dark:bg-gray-700" />
                <div className="h-3 w-32 rounded bg-gray-200 dark:bg-gray-700" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // ❌ No Users
  if (users.length === 0) {
    return (
      <div className="rounded-xl bg-white p-10 text-center shadow-sm dark:bg-gray-900">
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
          No users found
        </p>
      </div>
    );
  }

return (
  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
    {users.map((user) => (
      <div
        key={user.id}
        className="rounded-xl bg-white p-5 shadow-sm transition-all hover:shadow-md dark:bg-gray-900"
      >
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full ring-1 ring-gray-200 dark:ring-gray-700">
            <Image
              src={user.avatar_url || user.avatar || "/images/user/owner.jpg"}
              alt={user.name}
              width={48}
              height={48}
              className="h-full w-full object-cover"
            />
          </div>

          {/* Main User Info */}
          <div className="flex flex-1 flex-col gap-1">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="text-base font-semibold text-gray-900 dark:text-white">
                {user.name}
              </h4>

              {user.approved_at ? (
                <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                  Approved
                </span>
              ) : (
                <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
                  Pending
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
              <span className="truncate">{user.email}</span>
              <span className="opacity-50">•</span>
              <span>{getUserTypeLabel(user.type)}</span>
              <span className="opacity-50">•</span>
              <span>Joined {formatDate(user.created_at)}</span>
            </div>
          </div>

          {/* Action Buttons */}
          {showActions && !user.approved_at && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onApprove?.(user.id)}
                className="flex items-center gap-1 rounded-lg bg-orange-500/10 px-3 py-1.5 text-xs font-medium text-orange-700 transition hover:bg-orange-500/20 dark:bg-orange-600/20 dark:text-orange-300 dark:hover:bg-orange-600/30"
              >
                <CheckLineIcon className="h-4 w-4" />
                Approve
              </button>

              <button
                onClick={() => onReject?.(user.id)}
                className="flex items-center gap-1 rounded-lg bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-700 transition hover:bg-red-500/20 dark:bg-red-600/20 dark:text-red-300 dark:hover:bg-red-600/30"
              >
                <CloseLineIcon className="h-4 w-4" />
                Reject
              </button>
            </div>
          )}
        </div>
      </div>
    ))}
  </div>
);

};

export default UserList;

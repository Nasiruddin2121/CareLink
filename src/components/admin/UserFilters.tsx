"use client";

import React from "react";
import { UserType } from "@/config/constants";
import { getUserTypeLabel } from "@/utils/user.utils";

interface UserFiltersProps {
  searchQuery: string;
  userType: UserType | undefined;
  approvedStatus: "approved" | "pending" | undefined;
  onSearchChange: (query: string) => void;
  onTypeChange: (type: UserType | undefined) => void;
  onApprovedStatusChange: (status: "approved" | "pending" | undefined) => void;
}

const UserFilters: React.FC<UserFiltersProps> = ({
  searchQuery,
  userType,
  approvedStatus,
  onSearchChange,
  onTypeChange,
  onApprovedStatusChange,
}) => {
  const userTypes: UserType[] = ["patient", "doctor", "shop_keeper", "admin"];

  return (
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        {/* Search */}
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white/80 px-4 py-2 text-sm text-gray-900 placeholder-gray-500 shadow-sm transition-all focus:border-orange-500 focus:ring-2 focus:ring-orange-400/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
          />
        </div>

        {/* Type Filter */}
        <select
          value={userType || ""}
          onChange={(e) =>
            onTypeChange(e.target.value ? (e.target.value as UserType) : undefined)
          }
          className="rounded-lg border border-gray-300 bg-white/80 px-3 py-2 text-sm text-gray-900 shadow-sm transition-all focus:border-orange-500 focus:ring-2 focus:ring-orange-400/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        >
          <option value="">All Types</option>
          {userTypes.map((type) => (
            <option key={type} value={type}>
              {getUserTypeLabel(type)}
            </option>
          ))}
        </select>

        {/* Status Filter */}
        <select
          value={approvedStatus || ""}
          onChange={(e) =>
            onApprovedStatusChange(
              e.target.value ? (e.target.value as "approved" | "pending") : undefined
            )
          }
          className="rounded-lg border border-gray-300 bg-white/80 px-3 py-2 text-sm text-gray-900 shadow-sm transition-all focus:border-orange-500 focus:ring-2 focus:ring-orange-400/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        >
          <option value="">All Status</option>
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
        </select>
      </div>
  );
};

export default UserFilters;

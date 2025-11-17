"use client";

import React from "react";
import { PieChartIcon, UserIcon, DocsIcon } from "@/icons/index";
import type { Statistics } from "@/types/admin.types";

interface StatisticsCardsProps {
  statistics: Statistics | null;
  isLoading?: boolean;
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  isLoading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, isLoading }) => {
  if (isLoading) {
    return (
      <div className="rounded-xl bg-white dark:bg-gray-900 p-6 shadow-sm border border-gray-100 dark:border-gray-800 animate-pulse">
        <div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-700" />
        <div className="mt-3 h-8 w-16 rounded bg-gray-200 dark:bg-gray-700" />
        <div className="mt-4 h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700" />
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-white dark:bg-gray-900 p-6 shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-all">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-orange-600 dark:text-orange-400">
            {value}
          </p>
        </div>

        <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400">
          {icon}
        </div>
      </div>
    </div>
  );
};

const StatisticsCards: React.FC<StatisticsCardsProps> = ({ statistics, isLoading }) => {
  const stats = [
    {
      title: "Total Users",
      value: statistics?.users?.total ?? 0,
      icon: <UserIcon />,
    },
    {
      title: "Total Prescriptions",
      value: statistics?.prescriptions?.total ?? 0,
      icon: <DocsIcon />,
    },
    {
      title: "Pending Verifications",
      value: statistics?.pending_verifications?.total ?? 0,
      icon: <PieChartIcon />,
    },
    {
      title: "Approved Users",
      value: statistics?.approved_users?.total ?? 0,
      icon: <UserIcon />,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {stats.map((item, index) => (
        <StatCard
          key={index}
          title={item.title}
          value={item.value}
          icon={item.icon}
          isLoading={isLoading}
        />
      ))}
    </div>
  );
};

export default StatisticsCards;

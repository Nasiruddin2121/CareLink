"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/context/SidebarContext";
import {
  PieChartIcon,
  UserIcon,
  ChatIcon,
  DocsIcon,
  MailIcon,
} from "@/icons/index";
import { PROTECTED_ROUTES } from "@/config/routes";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path: string;
};

type NavSection = {
  items: NavItem[];
};

const AdminSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();

  const navSections = useMemo<NavSection[]>(() => [
    {
      items: [
        { name: "Overview", icon: <PieChartIcon />, path: PROTECTED_ROUTES.ADMIN_DASHBOARD },
        { name: "Users", icon: <UserIcon />, path: PROTECTED_ROUTES.ADMIN_USERS },
        { name: "Conversations", icon: <ChatIcon />, path: PROTECTED_ROUTES.ADMIN_CONVERSATIONS },
        { name: "Prescriptions", icon: <DocsIcon />, path: PROTECTED_ROUTES.ADMIN_PRESCRIPTIONS },
        { name: "Broadcasts", icon: <MailIcon />, path: PROTECTED_ROUTES.ADMIN_BROADCASTS },
      ],
    },
  ], []);

  const isActive = (path: string) => pathname === path;

  return (
    <aside
      className={`
        fixed top-16 left-0 h-[calc(100vh-4rem)] z-50 flex flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800
        transition-all duration-300 ease-in-out overflow-hidden
        ${isExpanded || isHovered || isMobileOpen ? "w-[280px] px-5" : "w-[90px] px-3"}
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
      `}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col flex-1 overflow-y-auto no-scrollbar pt-6">
        <nav className="flex flex-col gap-6">
          {navSections.map((section) => (
            <div key="main-section" className="flex flex-col gap-4">
              <ul className="flex flex-col gap-2">
                {section.items.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.path}
                      className={`
                        flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200
                        ${isActive(item.path)
                          ? "bg-orange-50 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400"
                          : "text-gray-700 hover:bg-gray-100 hover:text-orange-500 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-orange-400"}
                      `}
                    >
                      <span className={`text-lg shrink-0 ${isActive(item.path) ? "text-orange-500" : "text-gray-400 dark:text-gray-500"}`}>
                        {item.icon}
                      </span>
                      {(isExpanded || isHovered || isMobileOpen) && <span>{item.name}</span>}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default AdminSidebar;

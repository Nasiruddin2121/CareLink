"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useSidebar } from "@/context/SidebarContext";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminBackdrop from "@/components/admin/AdminBackdrop";
import { PROTECTED_ROUTES, PUBLIC_ROUTES } from "@/config/routes";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { isExpanded, isHovered } = useSidebar();
  const router = useRouter();
  const pathname = usePathname();
  const [isDesktop, setIsDesktop] = useState(false);

  const sidebarWidth = isExpanded || isHovered ? 290 : 90;

  // Check if desktop (lg breakpoint)
  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 1024);
    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  // Role guard & redirect
  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        const loginUrl = `${PUBLIC_ROUTES.LOGIN}?redirect=${encodeURIComponent(
          pathname || PROTECTED_ROUTES.ADMIN_DASHBOARD
        )}`;
        router.push(loginUrl);
        return;
      }

      if (user && user.type !== "admin") {
        switch (user.type) {
          case "doctor":
            router.push(PROTECTED_ROUTES.BROADCASTS_INBOX);
            break;
          case "medicine_supplier":
          case "patient":
            router.push(PROTECTED_ROUTES.PRESCRIPTIONS_INBOX);
            break;
          default:
            router.push(PROTECTED_ROUTES.CONVERSATIONS);
        }
        return;
      }
    }
  }, [user, isAuthenticated, isLoading, router, pathname]);

  // Loading spinner
  const LoadingSpinner = () => (
    <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
    </div>
  );

  if (isLoading || !isAuthenticated || !user || user.type !== "admin") {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-gray-50 dark:bg-gray-900">
      <AdminHeader />
      <div className="relative flex flex-1 overflow-hidden">
        <AdminBackdrop />
        <AdminSidebar />

        <main
          className="flex-1 overflow-y-auto transition-all duration-300 bg-gray-50 dark:bg-gray-900 p-4"
          style={{ marginLeft: isDesktop ? `${sidebarWidth}px` : "0px" }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}

"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";

interface LayoutWrapperProps {
  children: ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();
  
  // Determine if this is a dashboard page
  const isDashboardPage = pathname?.startsWith('/projects');
  
  return (
    <div className={isDashboardPage ? "" : "pt-16"}>
      {children}
    </div>
  );
}
"use client";

import { SessionProvider as Provider } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

type Props = {
  children: React.ReactNode;
  session: any;
};

function AuthCheck({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  // Simplified check for protected routes
  useEffect(() => {
    if (pathname === "/" || pathname.startsWith("/documentation") || status === "loading") return;
    
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, pathname, router]);

  // Simple loading indicator
  if (status === "loading" && pathname !== "/") {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return <>{children}</>;
}

export default function SessionProvider({ children, session }: Props) {
  return (
    <Provider session={session}>
      <AuthCheck>{children}</AuthCheck>
    </Provider>
  );
}

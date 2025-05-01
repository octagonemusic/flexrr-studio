"use client";

import { SessionProvider as Provider } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

type Props = {
  children: React.ReactNode;
  session: any;
};

function AuthCheck({ children }: { children: React.ReactNode }) {
  const { status, data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      // Skip auth check for public routes
      if (pathname === "/") {
        setIsChecking(false);
        return;
      }

      if (status === "loading") {
        return; // Still loading, wait
      }

      if (status === "unauthenticated") {
        console.log("User not authenticated, redirecting to home");
        toast.error("Please sign in to access this page", {
          id: "auth-redirect",
        });
        router.push("/");
        return;
      }

      setIsChecking(false);
    };

    checkAuth();
  }, [status, pathname, router]);

  if (isChecking && pathname !== "/") {
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

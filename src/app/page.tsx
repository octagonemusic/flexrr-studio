"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Hero from "@/components/Hero";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return <Hero session={session} />;
}

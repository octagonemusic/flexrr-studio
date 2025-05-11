"use client";

import { useSession, signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import AppLayout from "@/components/AppLayout";
import ProjectsOverview from "@/components/Dashboard/ProjectsOverview";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ProjectList from "@/components/ProjectList";
import { FiGrid, FiList } from "react-icons/fi";
import AuthError from "@/components/AuthError";

export default function Dashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [view, setView] = useState<"grid" | "list">("grid");
  const [isInitializing, setIsInitializing] = useState(true);

  // Handle auth checking and initialization
  useEffect(() => {
    // Set a slight delay to prevent flickering during quick auth checks
    const timer = setTimeout(() => {
      setIsInitializing(false);
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  // Show loading state while authentication is in progress
  if (status === "loading" || isInitializing) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </AppLayout>
    );
  }

  // Show auth error if not authenticated
  if (status === "unauthenticated") {
    return (
      <AppLayout>
        <AuthError 
          message="You need to be signed in to view your projects."
          onRetry={() => signIn("github")}
        />
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-8"
      >
        <div className="flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setView("grid")}
              className={`p-2 rounded-md cursor-pointer ${
                view === "grid"
                  ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              <FiGrid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setView("list")}
              className={`p-2 rounded-md cursor-pointer ${
                view === "list"
                  ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              <FiList className="w-5 h-5" />
            </button>
          </div>
        </div>

        <Tabs defaultValue="overview">
          <TabsList className="mb-8">
            <TabsTrigger value="overview" className="cursor-pointer">Overview</TabsTrigger>
            <TabsTrigger value="all-projects" className="cursor-pointer">All Projects</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <ProjectsOverview />
          </TabsContent>

          <TabsContent value="all-projects">
            <ProjectList view={view} />
          </TabsContent>
        </Tabs>
      </motion.div>
    </AppLayout>
  );
}

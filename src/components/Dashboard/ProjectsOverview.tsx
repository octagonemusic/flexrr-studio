"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  FiPlus,
  FiArrowRight,
  FiClock,
  FiCheck,
  FiAlertTriangle,
  FiRefreshCw,
  FiExternalLink,
  FiGithub,
} from "react-icons/fi";
import { fetchWithAuth } from "@/lib/apiHelpers";
import AuthError from "@/components/AuthError";

interface Repository {
  _id: string;
  name: string;
  description: string;
  createdAt: string;
  version: string;
  githubUrl: string;
}

interface LatestVersionInfo {
  version: string;
  needsUpdate: boolean;
}

export default function ProjectsOverview() {
  const router = useRouter();
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [recentRepositories, setRecentRepositories] = useState<Repository[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<{message: string, isAuthError?: boolean} | null>(null);
  const [latestVersionInfo, setLatestVersionInfo] = useState<
    Record<string, LatestVersionInfo>
  >({});
  const [latestVersion, setLatestVersion] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch both resources in parallel
        const [reposResponse, versionResponse] = await Promise.all([
          fetchWithAuth("/api/repositories", undefined, 5000),
          fetchWithAuth("/api/repositories/latest-version", undefined, 5000)
        ]);
        
        if (!reposResponse.ok) {
          if (reposResponse.status === 401) {
            // No auto-retry - require manual re-authentication
            throw new Error("Authentication error: Your session has expired");
          }
          throw new Error("Failed to fetch projects");
        }
        
        const reposData = await reposResponse.json();

        // Sort by creation date
        const sortedRepos = Array.isArray(reposData)
          ? [...reposData].sort(
              (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
            )
          : [];

        setRepositories(sortedRepos);
        setRecentRepositories(sortedRepos.slice(0, 3));

        // Process version data if available
        if (versionResponse.ok) {
          const { version } = await versionResponse.json();
          setLatestVersion(version);

          // Create version info object in one pass
          const versionInfo = sortedRepos.reduce((acc, repo) => {
            acc[repo._id] = {
              version: repo.version || "1.0.0",
              needsUpdate: repo.version !== version,
            };
            return acc;
          }, {} as Record<string, LatestVersionInfo>);

          setLatestVersionInfo(versionInfo);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Something went wrong";
        const isAuthError = errorMessage.includes("Authentication") || 
                            errorMessage.includes("auth") || 
                            errorMessage.includes("session");
        
        setError({ 
          message: errorMessage, 
          isAuthError 
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []); // No dependencies needed

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-t-2 border-indigo-500 border-solid rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    if (error.isAuthError) {
      return (
        <AuthError 
          message="Your session has expired or is invalid. Please sign in again to view your projects."
          onRetry={() => signIn("github")}
        />
      );
    }
    
    return (
      <div className="text-center p-8 bg-red-50 dark:bg-red-900/20 rounded-lg">
        <FiAlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-red-800 dark:text-red-200 mb-2">
          Failed to load projects
        </h3>
        <p className="text-red-600 dark:text-red-300">{error.message}</p>
        <button
          onClick={() => signIn("github")}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
        >
          <FiGithub className="w-4 h-4" />
          Sign In Again
        </button>
      </div>
    );
  }

  if (repositories.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 text-center">
        <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <FiPlus className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
          No Projects Yet
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
          You haven't created any Flexrr projects yet. Start by creating your
          first project.
        </p>
        <button
          onClick={() => router.push("/projects/new")}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors inline-flex items-center"
        >
          <FiPlus className="w-5 h-5 mr-2" />
          Create Your First Project
        </button>
      </div>
    );
  }
  return (
    <div className="space-y-8">
      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl shadow-lg p-6 text-white"
        >
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 rounded-lg p-3">
              <FiCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Total Projects</h3>
              <p className="text-3xl font-bold mt-2">{repositories.length}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg p-6 text-white"
        >
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 rounded-lg p-3">
              <FiClock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Latest Version</h3>
              <p className="text-3xl font-bold mt-2 font-mono">
                {latestVersion || "—"}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl shadow-lg p-6 text-white"
        >
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 rounded-lg p-3">
              <FiRefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Projects to Update</h3>
              <p className="text-3xl font-bold mt-2">
                {Object.values(latestVersionInfo).reduce((count, info) => count + (info.needsUpdate ? 1 : 0), 0)}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Projects */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Recent Projects
          </h2>
          <button
            onClick={() => router.push("/projects")}
            className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 text-sm font-medium flex items-center"
          >
            View All
            <FiArrowRight className="ml-1 w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          {recentRepositories.map((repo, index) => (
              <motion.div
                key={repo._id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                onClick={() => router.push(`/projects/${repo._id}`)}
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-indigo-100 dark:bg-indigo-900/30 w-10 h-10 rounded-md flex items-center justify-center">
                    <span className="text-indigo-600 dark:text-indigo-400 font-medium">
                      {repo.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {repo.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Created {new Date(repo.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {latestVersionInfo[repo._id]?.needsUpdate ? (
                    <span className="px-2 py-1 text-xs bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 rounded-full">
                      Update Available
                    </span>
                  ) : (
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 rounded-full">
                      Up to Date
                    </span>
                  )}
                  <FiArrowRight className="w-4 h-4 text-gray-400" />
                </div>
              </motion.div>
            ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          <button
            onClick={() => router.push("/projects/new")}
            className="flex flex-col items-center justify-center p-4 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/20 dark:hover:bg-indigo-900/30 rounded-lg transition-colors text-indigo-700 dark:text-indigo-300"
          >
            <FiPlus className="w-6 h-6 mb-2" />
            <span className="text-sm font-medium">New Project</span>
          </button>

          <Link
            href="/documentation"
            className="flex flex-col items-center justify-center p-4 bg-gray-50 hover:bg-gray-100 dark:bg-gray-700/30 dark:hover:bg-gray-700/50 rounded-lg transition-colors text-gray-700 dark:text-gray-300"
          >
            <FiExternalLink className="w-6 h-6 mb-2" />
            <span className="text-sm font-medium">Documentation</span>
          </Link>

          {repositories.length > 0 && (
            <button
              onClick={() => router.push(`/projects/${repositories[0]._id}`)}
              className="flex flex-col items-center justify-center p-4 bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/30 rounded-lg transition-colors text-green-700 dark:text-green-300"
            >
              <FiCheck className="w-6 h-6 mb-2" />
              <span className="text-sm font-medium">Latest Project</span>
            </button>
          )}

          {Object.keys(latestVersionInfo).length > 0 && 
           Object.values(latestVersionInfo).some(info => info.needsUpdate) && (
            <button
              onClick={() => {
                // Find first project needing update
                for (const repo of repositories) {
                  if (latestVersionInfo[repo._id]?.needsUpdate) {
                    router.push(`/projects/${repo._id}`);
                    break;
                  }
                }
              }}
              className="flex flex-col items-center justify-center p-4 bg-amber-50 hover:bg-amber-100 dark:bg-amber-900/20 dark:hover:bg-amber-900/30 rounded-lg transition-colors text-amber-700 dark:text-amber-300"
            >
              <FiRefreshCw className="w-6 h-6 mb-2" />
              <span className="text-sm font-medium">Update Projects</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

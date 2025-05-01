"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  FiArrowRight,
  FiEdit,
  FiGithub,
  FiExternalLink,
  FiAlertTriangle,
  FiSearch,
  FiRefreshCw,
} from "react-icons/fi";
import toast from "react-hot-toast";

interface Repository {
  _id: string;
  name: string;
  description: string;
  createdAt: string;
  githubUrl: string;
  version: string;
}

interface ProjectListProps {
  view: "grid" | "list";
}

export default function ProjectList({ view }: ProjectListProps) {
  const router = useRouter();
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [latestVersion, setLatestVersion] = useState<string | null>(null);

  useEffect(() => {
    const fetchRepositories = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [reposResponse, versionResponse] = await Promise.all([
          fetch("/api/repositories"),
          fetch("/api/repositories/latest-version"),
        ]);

        if (!reposResponse.ok) {
          throw new Error("Failed to fetch repositories");
        }

        const reposData = await reposResponse.json();
        setRepositories(Array.isArray(reposData) ? reposData : []);

        if (versionResponse.ok) {
          const { version } = await versionResponse.json();
          setLatestVersion(version);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
        toast.error("Failed to load your projects");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRepositories();
  }, [router]);

  const filteredRepositories = repositories.filter(
    (repo) =>
      repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (repo.description?.toLowerCase() || "").includes(
        searchQuery.toLowerCase(),
      ),
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-t-2 border-indigo-500 border-solid rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 bg-red-50 dark:bg-red-900/20 rounded-lg">
        <FiAlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-red-800 dark:text-red-200 mb-2">
          Failed to load projects
        </h3>
        <p className="text-red-600 dark:text-red-300">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (repositories.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 text-center">
        <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <FiArrowRight className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
          No Projects Found
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
          You haven't created any Flexrr projects yet. Start by creating your
          first project.
        </p>
        <button
          onClick={() => router.push("/projects/new")}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
        >
          Create Your First Project
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {repositories.length}{" "}
            {repositories.length === 1 ? "Project" : "Projects"}
          </h2>

          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full md:w-64 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <button
              onClick={() => router.push("/projects/new")}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              New Project
            </button>
          </div>
        </div>

        {filteredRepositories.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">
              No projects found matching your search.
            </p>
          </div>
        ) : view === "grid" ? (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredRepositories.map((repo, index) => (
              <motion.div
                key={repo._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group relative bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-md transition-all duration-200 cursor-pointer"
                onClick={() => router.push(`/projects/${repo._id}`)}
              >
                <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <a
                    href={repo.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 bg-gray-200 dark:bg-gray-600 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <FiGithub className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                  </a>
                  <button className="p-1 bg-gray-200 dark:bg-gray-600 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500">
                    <FiEdit className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                  </button>
                </div>

                <div className="mb-4">
                  {latestVersion && latestVersion !== repo.version ? (
                    <span className="inline-block bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 text-xs px-2.5 py-1 rounded-full">
                      Update available
                    </span>
                  ) : (
                    <span className="inline-block bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 text-xs px-2.5 py-1 rounded-full">
                      v{repo.version || "1.0.0"}
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {repo.name}
                </h3>

                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                  {repo.description || "A Flexrr project"}
                </p>

                <div className="flex items-center justify-between mt-4">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Created {new Date(repo.createdAt).toLocaleDateString()}
                  </span>
                  <div className="text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform">
                    <FiArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredRepositories.map((repo, index) => (
              <motion.div
                key={repo._id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex flex-col sm:flex-row sm:items-center justify-between py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 -mx-6 px-6 cursor-pointer"
                onClick={() => router.push(`/projects/${repo._id}`)}
              >
                <div className="flex items-center space-x-4 mb-3 sm:mb-0">
                  <div className="bg-indigo-100 dark:bg-indigo-900/30 w-10 h-10 rounded-md flex items-center justify-center flex-shrink-0">
                    <span className="text-indigo-600 dark:text-indigo-400 font-medium">
                      {repo.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {repo.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                      {repo.description || "A Flexrr project"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end space-x-4">
                  {latestVersion && latestVersion !== repo.version ? (
                    <span className="bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 text-xs px-2.5 py-1 rounded-full flex items-center">
                      <FiRefreshCw className="w-3 h-3 mr-1" />
                      Update
                    </span>
                  ) : (
                    <span className="inline-block bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 text-xs px-2.5 py-1 rounded-full">
                      v{repo.version || "1.0.0"}
                    </span>
                  )}

                  <div className="flex space-x-2">
                    <a
                      href={repo.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <FiGithub className="w-4 h-4" />
                    </a>
                    <a
                      href="#"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <FiExternalLink className="w-4 h-4" />
                    </a>
                  </div>

                  <div className="text-indigo-600 dark:text-indigo-400">
                    <FiArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

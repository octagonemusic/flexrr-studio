"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import AppLayout from "@/components/AppLayout";
import {
  FiGithub,
  FiDownload,
  FiCopy,
  FiCode,
  FiClock,
  FiRefreshCw,
  FiEdit,
  FiExternalLink,
  FiChevronDown,
  FiCheck,
  FiX,
  FiAlertCircle,
  FiTrash2,
} from "react-icons/fi";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface Repository {
  _id: string;
  name: string;
  description: string;
  createdAt: string;
  githubUrl: string;
  envVars: Record<string, string>;
  version: string;
}

interface UpdateNameSchema {
  name: string;
}

const updateNameSchema = z.object({
  name: z
    .string()
    .min(3, "Project name must be at least 3 characters")
    .max(50, "Project name must be less than 50 characters")
    .regex(
      /^[a-z0-9-]+$/,
      "Only lowercase letters, numbers, and hyphens are allowed",
    ),
});

export default function ProjectDetails() {
  const params = useParams();
  const router = useRouter();
  const [project, setProject] = useState<Repository | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [isRenamingLoading, setIsRenamingLoading] = useState(false); // New state for rename loading
  const [copied, setCopied] = useState(false);
  const [latestVersion, setLatestVersion] = useState<string | null>(null);
  const [showEnvVars, setShowEnvVars] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateNameSchema>({
    resolver: zodResolver(updateNameSchema),
  });

  const fetchProject = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`/api/repositories/${params.id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch project details");
      }
      const data = await response.json();
      setProject(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      toast.error("Failed to load project details");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLatestVersion = async () => {
    try {
      const response = await fetch("/api/repositories/latest-version");
      if (!response.ok) {
        throw new Error("Failed to fetch latest version");
      }
      const { version } = await response.json();
      setLatestVersion(version);
    } catch (err) {
      console.error("Error fetching latest version:", err);
      toast.error("Couldn't check for updates");
    }
  };

  useEffect(() => {
    if (params.id) {
      fetchProject();
      fetchLatestVersion();
    }
  }, [params.id]);

  const handleCopy = async () => {
    if (!project?.envVars) return;

    try {
      await navigator.clipboard.writeText(
        Object.entries(project.envVars)
          .map(([key, value]) => `${key}=${value}`)
          .join("\n"),
      );
      setCopied(true);
      toast.success("Environment variables copied");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
      toast.error("Failed to copy");
    }
  };

  const handleUpdateVersion = async () => {
    if (!project) return;

    try {
      setIsUpdating(true);
      toast.loading("Updating project...", { id: "update-toast" });

      const response = await fetch(`/api/repositories/${project._id}/update`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to update repository");
      }

      await fetchProject();
      toast.success("Project updated successfully", { id: "update-toast" });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update repository",
      );
      toast.error("Update failed", { id: "update-toast" });
    } finally {
      setIsUpdating(false);
    }
  };

  const onSubmitRename = async (data: UpdateNameSchema) => {
    if (!project) return;

    try {
      setIsRenamingLoading(true); // Use the new loading state
      toast.loading("Renaming project...", { id: "rename-toast" });

      const response = await fetch(`/api/repositories/${project._id}/rename`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to rename repository");
      }

      await fetchProject();
      setIsRenaming(false); // This closes the form
      reset();
      toast.success("Project renamed successfully", { id: "rename-toast" });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to rename repository",
      );
      toast.error("Rename failed", { id: "rename-toast" });
    } finally {
      setIsRenamingLoading(false); // Reset loading state
    }
  };

  const handleDelete = async () => {
    if (!project) {
      toast.error("Project not found");
      return;
    }

    try {
      setIsDeleting(true);
      setDeleteError(null);

      const response = await fetch(`/api/repositories/${project._id}/delete`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete project");
      }

      toast.success("Project deleted successfully");

      // Show reminder toast about Vercel deployment
      toast("Remember to delete your Vercel deployment if applicable.", {
        icon: "⚠️",
        duration: 6000,
      });

      // Redirect to projects page after deletion
      router.push("/projects");
    } catch (err) {
      console.error("Error deleting project:", err);
      setDeleteError(
        err instanceof Error ? err.message : "Failed to delete project",
      );
      toast.error("Failed to delete project");
    } finally {
      setIsDeleting(false);
    }
  };

  const checkRepositoryStatus = async () => {
    if (!project?._id) return;

    try {
      const response = await fetch(`/api/repositories/${project._id}/check`);
      if (response.ok) {
        const data = await response.json();
        if (!data.exists) {
          toast("This project appears to have been deleted on GitHub", {
            icon: "⚠️",
            duration: 5000,
            style: {
              backgroundColor: "#FEF3C7", // Amber 100
              color: "#92400E", // Amber 800
              border: "1px solid #FDE68A", // Amber 200
            },
          });
        }
      }
    } catch (error) {
      console.error("Error checking repository status:", error);
    }
  };
  // Call the check in useEffect
  useEffect(() => {
    if (project?._id) {
      checkRepositoryStatus();
    }
  }, [project?._id]);

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-96">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">
              Loading project details...
            </p>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (error || !project) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center h-96">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">
            Project Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6 text-center max-w-md">
            {error || "We couldn't find the project you're looking for."}
          </p>
          <button
            onClick={() => router.push("/projects")}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Back to Dashboard
          </button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Project Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                  {project.name}
                </h1>
                <button
                  onClick={() => setIsRenaming(!isRenaming)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  <FiEdit className="w-5 h-5" />
                </button>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {project.description || "A Flexrr project"}
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <span className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                  <FiCode className="w-4 h-4" />
                  <span>
                    Version: <b className="font-mono">{project.version}</b>
                  </span>
                </span>
                <span className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                  <FiClock className="w-4 h-4" />
                  <span>
                    Created {new Date(project.createdAt).toLocaleDateString()}
                  </span>
                </span>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg text-gray-700 dark:text-gray-200 transition-colors"
              >
                <FiGithub className="w-5 h-5" />
                <span>View on GitHub</span>
              </a>
              <a
                href="https://vercel.com/new"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-4 py-2 bg-black hover:bg-gray-900 text-white rounded-lg transition-colors"
              >
                <FiExternalLink className="w-5 h-5" />
                <span>Deploy</span>
              </a>
            </div>
          </div>

          {/* Rename Form */}
          {isRenaming && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-gray-200 dark:border-gray-700"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Rename Project
              </h3>
              <form
                onSubmit={handleSubmit(onSubmitRename)}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    New Project Name
                  </label>
                  <input
                    {...register("name")}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white"
                    placeholder={project.name}
                  />
                  {errors.name && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                      {errors.name.message}
                    </p>
                  )}
                </div>
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    disabled={isRenamingLoading}
                    className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-md transition-colors"
                  >
                    <FiCheck className="w-4 h-4" />
                    <span>
                      {isRenamingLoading ? "Renaming..." : "Save New Name"}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsRenaming(false)}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md transition-colors"
                  >
                    <FiX className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </div>

        {/* Version Information */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Version Information
              </h2>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <p className="text-gray-600 dark:text-gray-300">
                    Current Version:{" "}
                    <span className="font-mono font-medium">
                      {project.version}
                    </span>
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <p className="text-gray-600 dark:text-gray-300">
                    Latest Version:{" "}
                    {latestVersion ? (
                      <span className="font-mono font-medium">
                        {latestVersion}
                      </span>
                    ) : (
                      <span className="text-gray-400 dark:text-gray-500">
                        Checking...
                      </span>
                    )}
                  </p>
                </div>

                {latestVersion && (
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-3 h-3 rounded-full ${latestVersion === project.version ? "bg-green-500" : "bg-amber-500"}`}
                    ></div>
                    <p
                      className={`text-sm ${latestVersion === project.version ? "text-green-600 dark:text-green-400" : "text-amber-600 dark:text-amber-400"}`}
                    >
                      {latestVersion === project.version
                        ? "Your project is up to date"
                        : "Update available"}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={handleUpdateVersion}
              disabled={
                !latestVersion ||
                latestVersion === project.version ||
                isUpdating
              }
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-white transition-colors ${
                !latestVersion || latestVersion === project.version
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {isUpdating ? (
                <>
                  <FiRefreshCw className="w-5 h-5 animate-spin" />
                  <span>Updating...</span>
                </>
              ) : latestVersion === project.version ? (
                <>
                  <FiCheck className="w-5 h-5" />
                  <span>Up to date</span>
                </>
              ) : (
                <>
                  <FiDownload className="w-5 h-5" />
                  <span>Update to v{latestVersion}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Environment Variables */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div
            className="flex justify-between items-center cursor-pointer"
            onClick={() => setShowEnvVars(!showEnvVars)}
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Environment Variables
            </h2>
            <FiChevronDown
              className={`w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform ${showEnvVars ? "transform rotate-180" : ""}`}
            />
          </div>

          {showEnvVars && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4"
            >
              <div className="relative mt-4 bg-gray-900 dark:bg-gray-950 rounded-lg p-4">
                <div className="absolute top-2 right-2">
                  <button
                    onClick={handleCopy}
                    disabled={copied}
                    className="flex items-center space-x-2 px-3 py-1 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 text-white text-sm rounded-md transition-colors"
                  >
                    {copied ? (
                      <>
                        <FiCheck className="w-4 h-4" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <FiCopy className="w-4 h-4" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="text-gray-100 dark:text-gray-300 whitespace-pre-wrap font-mono text-sm mt-6 overflow-x-auto">
                  {Object.entries(project.envVars).map(([key, value]) => (
                    <div key={key} className="py-1">
                      <span className="text-green-400">{key}</span>
                      <span className="text-gray-400">=</span>
                      <span className="text-amber-300">{value}</span>
                    </div>
                  ))}
                </pre>
              </div>

              <div className="mt-6 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4 border border-indigo-100 dark:border-indigo-800/30">
                <h3 className="text-lg font-medium text-indigo-800 dark:text-indigo-300 mb-2">
                  Deployment Instructions
                </h3>
                <p className="text-indigo-700 dark:text-indigo-400 mb-4">
                  To deploy your Flexrr project, copy these environment
                  variables to your hosting platform.
                </p>
                <div className="flex flex-wrap gap-3">
                  <a
                    href="https://vercel.com/new"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 px-4 py-2 bg-black hover:bg-gray-900 text-white rounded-lg transition-colors"
                  >
                    <FiExternalLink className="w-5 h-5" />
                    <span>Deploy on Vercel</span>
                  </a>
                  <a
                    href="https://www.netlify.com/new"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 px-4 py-2 bg-[#00AD9F] hover:bg-[#00968B] text-white rounded-lg transition-colors"
                  >
                    <FiExternalLink className="w-5 h-5" />
                    <span>Deploy on Netlify</span>
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Project Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Project Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <button className="flex flex-col items-center justify-center p-4 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg transition-colors">
              <FiGithub className="w-8 h-8 text-gray-700 dark:text-gray-300 mb-2" />
              <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                View Code
              </span>
            </button>

            <button className="flex flex-col items-center justify-center p-4 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg transition-colors">
              <FiExternalLink className="w-8 h-8 text-gray-700 dark:text-gray-300 mb-2" />
              <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                Open Site
              </span>
            </button>

            <button
              onClick={() => setDeleteDialogOpen(true)}
              className="flex flex-col items-center justify-center p-4 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 rounded-lg transition-colors"
            >
              <FiTrash2 className="w-8 h-8 text-red-600 dark:text-red-400 mb-2" />
              <span className="text-sm font-medium text-red-700 dark:text-red-300">
                Delete Project
              </span>
            </button>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <FiAlertCircle className="h-5 w-5 text-red-500" />
                    Delete Project
                  </DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete "{project.name}"? This
                    action cannot be undone.
                  </DialogDescription>
                </DialogHeader>

                <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-md mb-4">
                  <p className="text-amber-800 dark:text-amber-300 text-sm">
                    <span className="font-bold">Important:</span> This will
                    delete the GitHub repository. If you've deployed this
                    project on Vercel or another platform, you'll need to delete
                    those deployments separately.
                  </p>
                </div>

                {deleteError && (
                  <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-md">
                    <p className="text-red-600 dark:text-red-400 text-sm">
                      {deleteError}
                    </p>
                  </div>
                )}

                <DialogFooter className="flex space-x-2 sm:justify-end">
                  <button
                    type="button"
                    disabled={isDeleting}
                    onClick={() => setDeleteDialogOpen(false)}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md text-gray-800 dark:text-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={isDeleting}
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-md flex items-center space-x-2"
                  >
                    {isDeleting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Deleting...</span>
                      </>
                    ) : (
                      <>
                        <FiTrash2 className="w-4 h-4" />
                        <span>Delete Project</span>
                      </>
                    )}
                  </button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

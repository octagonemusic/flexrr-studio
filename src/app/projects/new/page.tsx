"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { fetchWithAuth } from "@/lib/apiHelpers";
import { useSession, signIn } from "next-auth/react";
import AuthError from "@/components/AuthError";

const formSchema = z.object({
  name: z
    .string()
    .min(3, "Project name must be at least 3 characters")
    .max(50, "Project name must be less than 50 characters")
    .regex(
      /^[a-z0-9-]+$/,
      "Only lowercase letters, numbers, and hyphens are allowed",
    ),
  siteUrl: z.string().url("Please enter a valid URL"),
  databaseUri: z.string().url("Please enter a valid MongoDB connection string"),
  s3Bucket: z.string().min(1, "S3 bucket name is required"),
  s3AccessKeyId: z.string().min(1, "S3 access key is required"),
  s3SecretAccessKey: z.string().min(1, "S3 secret key is required"),
  s3Region: z.string().min(1, "S3 region is required"),
  s3Endpoint: z.string().url("Please enter a valid S3 endpoint URL"),
});

type FormData = z.infer<typeof formSchema>;

interface EnvVars {
  [key: string]: string;
}

interface ApiError {
  code: string;
  message: string;
  details?: string;
}

interface ErrorState {
  type: "api" | "validation" | "system" | "auth";
  message: string;
  details?: string;
}

export default function NewProject() {
  const router = useRouter();
  const { status } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorState | null>(null);
  const [envVars, setEnvVars] = useState<EnvVars | null>(null);
  const [copied, setCopied] = useState(false);
  const [progressStatus, setProgressStatus] = useState<string>("");
  const [creationProgress, setCreationProgress] = useState<number>(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError: setFormError,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError(null);

    // Creation progress simulator
    let progressInterval: NodeJS.Timeout | undefined = undefined;

    try {
      // Show initial progress
      setProgressStatus("Starting project creation...");
      setCreationProgress(10);

      // Start progress simulator
      progressInterval = setInterval(() => {
        setCreationProgress((prev) => {
          if (prev < 90) return prev + 10;
          return prev;
        });
      }, 3000);

      // Increase timeout for project creation which involves multiple GitHub API calls
      const response = await fetchWithAuth(
        "/api/repositories/create",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        },
        60000,
        (status) => {
          setProgressStatus(status);
        },
      );

      clearInterval(progressInterval);

      const responseData = await response.json();

      if (!response.ok) {
        const apiError = responseData as ApiError;

        // Handle authentication errors specifically
        if (response.status === 401) {
          setError({
            type: "auth",
            message: "Your session has expired",
            details: "Please sign in again to continue creating your project."
          });
          return;
        }

        switch (apiError.code) {
          case "github_error":
            if (response.status === 422) {
              setFormError("name", {
                type: "manual",
                message:
                  "This repository name already exists in your GitHub account",
              });
              throw new Error("Repository name already exists");
            } else {
              setError({
                type: "api",
                message: "Failed to create GitHub repository",
                details:
                  apiError.details ||
                  "Please try a different name or try again later.",
              });
            }
            break;

          case "name_exists":
            setFormError("name", {
              type: "manual",
              message: "This project name already exists",
            });
            throw new Error("Project name already exists");

          case "invalid_credentials":
            setError({
              type: "api",
              message: "Invalid S3 credentials",
              details: apiError.details,
            });
            break;

          default:
            throw new Error(apiError.message || "Something went wrong");
        }
        return;
      }

      setProgressStatus("Project created successfully!");
      setCreationProgress(100);
      setEnvVars(responseData.envVars);
      // No auto-redirect - will show success state with button
    } catch (err) {
      if (!error) {
        // Only set error if not already set by switch cases
        setError({
          type: "system",
          message: err instanceof Error ? err.message : "Something went wrong",
          details: err instanceof Error ? err.stack : undefined,
        });
      }
    } finally {
      if (progressInterval) {
        clearInterval(progressInterval);
      }
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(
        Object.entries(envVars || {})
          .map(([key, value]) => `${key}=${value}`)
          .join("\n"),
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const inputClasses =
    "mt-1 block w-full px-4 py-3 rounded-md border-2 border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 disabled:opacity-50 dark:bg-gray-800 dark:text-white transition-colors";
  const formClasses = "space-y-8";
  const sectionClasses =
    "space-y-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm";

  const ErrorDisplay = ({ error }: { error: ErrorState }) => {
    // For authentication errors, show the AuthError component
    if (error.type === "auth") {
      return (
        <AuthError 
          message={error.message}
          code={error.type}
          onRetry={() => signIn("github")}
        />
      );
    }
    
    // For other error types
    return (
      <div className="mb-8 rounded-lg border border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800">
        <div className="p-4">
          <div className="flex items-center">
            <svg
              className="h-5 w-5 text-red-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <h3 className="ml-2 text-sm font-medium text-red-800 dark:text-red-200">
              {error.type === "api"
                ? "API Error"
                : error.type === "validation"
                  ? "Validation Error"
                  : "System Error"}
            </h3>
          </div>
          <div className="mt-2 text-sm text-red-700 dark:text-red-200">
            <p>{error.message}</p>
            {error.details && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-300">
                {error.details}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  };

  // If not authenticated, show auth error
  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Create New Flexrr Project
          </h1>
          
          <AuthError
            message="You need to be signed in to create a new project"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Create New Flexrr Project
        </h1>

        {error && <ErrorDisplay error={error} />}

        {loading ? (
          <div className="text-center py-12">
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 max-w-md mx-auto mb-6">
              <div
                className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${creationProgress}%` }}
              ></div>
            </div>
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Creating Your Project
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              {"Setting up your repository..."}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              This may take up to a minute as we're setting up your GitHub
              repository
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className={formClasses}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Project Details */}
              <div className={sectionClasses}>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Project Details
                </h3>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Project Name
                    </label>
                    <input
                      {...register("name")}
                      type="text"
                      className={inputClasses}
                      disabled={loading}
                      aria-invalid={errors.name ? "true" : "false"}
                      placeholder="my-project-name"
                    />
                    {errors.name && (
                      <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                        {errors.name.message}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Use lowercase letters, numbers, and hyphens only. This
                      will be your GitHub repository name.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Site URL
                    </label>
                    <input
                      {...register("siteUrl")}
                      type="url"
                      className={inputClasses}
                      disabled={loading}
                      placeholder="https://your-site-url.com"
                      aria-invalid={errors.siteUrl ? "true" : "false"}
                    />
                    {errors.siteUrl && (
                      <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                        {errors.siteUrl.message}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      The URL where your site will be deployed (you can change
                      this later).
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      MongoDB URI
                    </label>
                    <input
                      {...register("databaseUri")}
                      type="text"
                      className={inputClasses}
                      disabled={loading}
                      placeholder="mongodb+srv://username:password@cluster.mongodb.net/database"
                      aria-invalid={errors.databaseUri ? "true" : "false"}
                    />
                    {errors.databaseUri && (
                      <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                        {errors.databaseUri.message}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Your MongoDB connection string.
                    </p>
                  </div>
                </div>
              </div>

              {/* S3 Configuration */}
              <div className={sectionClasses}>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  S3 Configuration
                </h3>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      S3 Bucket
                    </label>
                    <input
                      {...register("s3Bucket")}
                      type="text"
                      className={inputClasses}
                      disabled={loading}
                      placeholder="your-bucket-name"
                      aria-invalid={errors.s3Bucket ? "true" : "false"}
                    />
                    {errors.s3Bucket && (
                      <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                        {errors.s3Bucket.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      S3 Access Key ID
                    </label>
                    <input
                      {...register("s3AccessKeyId")}
                      type="text"
                      className={inputClasses}
                      disabled={loading}
                      placeholder="AKIAIOSFODNN7EXAMPLE"
                      aria-invalid={errors.s3AccessKeyId ? "true" : "false"}
                    />
                    {errors.s3AccessKeyId && (
                      <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                        {errors.s3AccessKeyId.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      S3 Secret Access Key
                    </label>
                    <input
                      {...register("s3SecretAccessKey")}
                      type="password"
                      className={inputClasses}
                      disabled={loading}
                      placeholder="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
                      aria-invalid={errors.s3SecretAccessKey ? "true" : "false"}
                    />
                    {errors.s3SecretAccessKey && (
                      <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                        {errors.s3SecretAccessKey.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      S3 Region
                    </label>
                    <input
                      {...register("s3Region")}
                      type="text"
                      className={inputClasses}
                      disabled={loading}
                      placeholder="us-east-1"
                      aria-invalid={errors.s3Region ? "true" : "false"}
                    />
                    {errors.s3Region && (
                      <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                        {errors.s3Region.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      S3 Endpoint
                    </label>
                    <input
                      {...register("s3Endpoint")}
                      type="url"
                      className={inputClasses}
                      disabled={loading}
                      placeholder="https://s3.amazonaws.com"
                      aria-invalid={errors.s3Endpoint ? "true" : "false"}
                    />
                    {errors.s3Endpoint && (
                      <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                        {errors.s3Endpoint.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold py-3 px-6 rounded-lg transition-colors mt-8 flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Creating Project...
                </>
              ) : (
                "Create Project"
              )}
            </button>
          </form>
        )}

        {envVars && (
        <div className="mt-8 animate-fade-in">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Environment Variables
          </h2>
            <div className="bg-gray-800 p-4 rounded-lg">
              <pre className="text-gray-100 whitespace-pre-wrap">
                {Object.entries(envVars).map(
                  ([key, value]) => `${key}=${value}\n`,
                )}
              </pre>
              <button
                onClick={handleCopy}
                disabled={copied}
                className="mt-4 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-500 text-white px-4 py-2 rounded transition-colors"
              >
                {copied ? "Copied!" : "Copy to Clipboard"}
              </button>
            </div>
            <div className="mt-6 text-center space-y-3">
              <a
                href="https://vercel.com/new"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-black hover:bg-gray-900 text-white font-bold py-2 px-6 rounded-lg transition-colors"
              >
                Deploy on Vercel →
              </a>
              <div>
                <button
                  onClick={() => router.push("/projects")}
                  className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg transition-colors mt-4"
                >
                  Go to Dashboard
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

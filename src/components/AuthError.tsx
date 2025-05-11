"use client";

import { signIn } from "next-auth/react";
import { FiLock, FiRefreshCw } from "react-icons/fi";

interface AuthErrorProps {
  message?: string;
  code?: string;
  onRetry?: () => void;
}

export default function AuthError({
  message = "Your session has expired or you are not logged in.",
  code,
  onRetry,
}: AuthErrorProps) {
  const handleSignIn = () => {
    signIn("github");
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg text-center">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <FiLock className="w-8 h-8 text-red-600 dark:text-red-400" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
          Authentication Required
        </h2>
        
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          {message}
        </p>
        
        {code && (
          <div className="mb-6 p-3 bg-gray-100 dark:bg-gray-700 rounded-md">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Error code: <span className="font-mono">{code}</span>
            </p>
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={handleSignIn}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium flex items-center justify-center cursor-pointer"
          >
            Sign In Again
          </button>
          
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-5 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg font-medium flex items-center justify-center cursor-pointer"
            >
              <FiRefreshCw className="mr-2 w-4 h-4" />
              Retry
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
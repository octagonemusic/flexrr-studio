"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { useState } from "react";
import { FiGithub } from "react-icons/fi";

export default function LoginButton() {
  const { data: session, status } = useSession();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const baseButtonClasses =
    "rounded-full px-6 py-3 font-semibold text-sm sm:text-base transition-all duration-300 flex items-center justify-center cursor-pointer";

  const handleSignIn = async () => {
    try {
      setIsLoggingIn(true);
      await signIn("github", { callbackUrl: "/projects" });
    } catch (error) {
      console.error("Sign in error:", error);
      setIsLoggingIn(false);
    }
  };

  if (status === "loading" || isLoggingIn) {
    return (
      <button
        disabled
        className={`${baseButtonClasses} bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed`}
      >
        <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-2"></div>
        Loading...
      </button>
    );
  }

  if (session) {
    return (
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-gray-600 dark:text-gray-400 text-sm sm:text-base"
        >
          Signed in as{" "}
          <span className="font-semibold">
            {session.user?.name || session.user?.email}
          </span>
        </motion.div>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className={`${baseButtonClasses} border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800`}
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleSignIn}
      className={`${baseButtonClasses} bg-gradient-to-r from-blue-600 to-violet-600 text-white hover:opacity-90 shadow-md`}
    >
      <FiGithub className="mr-2 w-5 h-5" />
      Sign in with GitHub
    </button>
  );
}

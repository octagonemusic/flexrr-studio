"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession, signIn } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { FiGithub, FiGrid, FiMenu, FiX } from "react-icons/fi";
import { motion } from "framer-motion";

export default function PublicHeader() {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Don't render on dashboard pages
  if (pathname?.startsWith('/projects')) {
    return null;
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image
                src="/logo.png"
                alt="Flexrr Studio Logo"
                width={30}
                height={30}
              />
              <span className="ml-2 text-xl font-semibold text-gray-900 dark:text-white">
                Flexrr Studio
              </span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/documentation"
              className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white text-sm font-medium"
            >
              Documentation
            </Link>
            <a
              href="https://github.com/octagonemusic/flexrr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white text-sm font-medium"
            >
              GitHub
            </a>
            {session ? (
              <button
                onClick={() => router.push("/projects")}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm text-sm font-medium flex items-center space-x-2"
              >
                <FiGrid className="w-4 h-4" />
                <span>Go to Dashboard</span>
              </button>
            ) : (
              <button
                onClick={() => signIn("github", { callbackUrl: "/projects" })}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm text-sm font-medium flex items-center space-x-2"
              >
                <FiGithub className="w-4 h-4" />
                <span>Sign in with GitHub</span>
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
            >
              {mobileMenuOpen ? (
                <FiX className="h-6 w-6" />
              ) : (
                <FiMenu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden"
        >
          <div className="container mx-auto px-4 py-3 space-y-3 bg-white dark:bg-gray-900 shadow-lg">
            <Link
              href="/documentation"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              onClick={() => setMobileMenuOpen(false)}
            >
              Documentation
            </Link>
            <a
              href="https://github.com/octagonemusic/flexrr"
              target="_blank"
              rel="noopener noreferrer"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              onClick={() => setMobileMenuOpen(false)}
            >
              GitHub
            </a>
            <div className="pt-2 mt-2 border-t border-gray-200 dark:border-gray-700">
              {session ? (
                <button
                  onClick={() => {
                    router.push("/projects");
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left block px-3 py-2 rounded-md text-base font-medium bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  Go to Dashboard
                </button>
              ) : (
                <button
                  onClick={() => signIn("github", { callbackUrl: "/projects" })}
                  className="w-full text-left block px-3 py-2 rounded-md text-base font-medium bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  Sign in with GitHub
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </header>
  );
}
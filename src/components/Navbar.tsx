"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  FiMenu,
  FiX,
  FiGithub,
  FiUsers,
  FiPackage,
  FiExternalLink,
  FiHelpCircle,
  FiSun,
  FiMoon,
} from "react-icons/fi";
import Image from "next/image";

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check for dark mode preference in localStorage or system preferences
    const darkModePreference =
      localStorage.getItem("darkMode") ||
      (window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);

    setIsDarkMode(!!darkModePreference);
  }, []);

  const toggleDarkMode = () => {
    const newValue = !isDarkMode;
    setIsDarkMode(newValue);
    localStorage.setItem("darkMode", newValue ? "true" : "");

    if (newValue) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  if (!session) return null;

  // Only show on authenticated pages
  if (pathname === "/") return null;

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/projects" className="flex-shrink-0 flex items-center">
              <Image
                src="/logo.png"
                alt="Flexrr Studio Logo"
                width={40}
                height={40}
              />
              <span className="ml-2 text-xl font-semibold text-gray-900 dark:text-white">
                Flexrr Studio
              </span>
            </Link>

            <div className="hidden sm:ml-8 sm:flex sm:space-x-4">
              <Link
                href="/projects"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  pathname.startsWith("/projects")
                    ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-200"
                    : "text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
                }`}
              >
                Projects
              </Link>
              <Link
                href="https://github.com/octagonemusic/flexrr"
                target="_blank"
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
              >
                Documentation
              </Link>
              <Link
                href="/templates"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  pathname.startsWith("/templates")
                    ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-200"
                    : "text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
                }`}
              >
                Templates
              </Link>
            </div>
          </div>

          <div className="hidden sm:flex items-center">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
            >
              {isDarkMode ? (
                <FiSun className="h-5 w-5" />
              ) : (
                <FiMoon className="h-5 w-5" />
              )}
            </button>

            <Link
              href="https://github.com/octagonemusic/flexrr"
              target="_blank"
              className="ml-3 p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
            >
              <FiGithub className="h-5 w-5" />
            </Link>

            <button className="ml-4 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <img
                className="h-8 w-8 rounded-full"
                src={
                  session.user?.image || "https://ui-avatars.com/api/?name=User"
                }
                alt="User"
              />
            </button>
          </div>

          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
            >
              {isOpen ? (
                <FiX className="h-6 w-6" />
              ) : (
                <FiMenu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="sm:hidden"
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              href="/projects"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                pathname.startsWith("/projects")
                  ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-200"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
              }`}
              onClick={() => setIsOpen(false)}
            >
              Projects
            </Link>
            <Link
              href="https://github.com/octagonemusic/flexrr"
              target="_blank"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
              onClick={() => setIsOpen(false)}
            >
              Documentation
            </Link>
            <Link
              href="/templates"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                pathname.startsWith("/templates")
                  ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-200"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
              }`}
              onClick={() => setIsOpen(false)}
            >
              Templates
            </Link>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 pb-3">
              <div className="flex items-center px-3">
                <div className="flex-shrink-0">
                  <img
                    className="h-10 w-10 rounded-full"
                    src={
                      session.user?.image ||
                      "https://ui-avatars.com/api/?name=User"
                    }
                    alt="User"
                  />
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800 dark:text-white">
                    {session.user?.name}
                  </div>
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {session.user?.email}
                  </div>
                </div>
                <button
                  onClick={toggleDarkMode}
                  className="ml-auto p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
                >
                  {isDarkMode ? (
                    <FiSun className="h-5 w-5" />
                  ) : (
                    <FiMoon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </nav>
  );
}

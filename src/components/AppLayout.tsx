"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState, useRef, useEffect, useCallback } from "react";
import { useSession, signOut, signIn } from "next-auth/react";
import {
  FiHome,
  FiGitBranch,
  FiPlus,
  FiSettings,
  FiExternalLink,
  FiUserCheck,
  FiLogOut,
  FiUser,
  FiMoon,
  FiSun,
  FiHelpCircle,
  FiInfo,
  FiGithub,
  FiMenu,
  FiX,
} from "react-icons/fi";
import toast from "react-hot-toast";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [showSettings, setShowSettings] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLElement>(null);

  // Handle dark mode - only runs once
  useEffect(() => {
    const isDarkMode =
      localStorage.getItem("darkMode") === "true" ||
      window.matchMedia("(prefers-color-scheme: dark)").matches;

    setDarkMode(isDarkMode);

    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);
  
  // Handle window resize for sidebar and set initial state
  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth >= 768);
    };
    
    // Set initial state based on screen size
    handleResize();
    
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Handle click outside to close settings dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        settingsRef.current &&
        !settingsRef.current.contains(event.target as Node)
      ) {
        setShowSettings(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  // Handle window resize for sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(true);
      }
    };
    
    // Set initial state based on screen size
    handleResize();
    
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      toast.loading("Signing out...", { id: "logout" });
      await signOut({ redirect: true, callbackUrl: "/" });
      toast.success("Signed out successfully", { id: "logout" });
    } catch (error) {
      toast.error("Failed to sign out", { id: "logout" });
    }
  }, []);

  if (!session) {
    // For any protected route, if there's no session, show auth error
    if (pathname !== "/") {
      return (
        <div className="flex-1 p-6">
          <div className="min-h-[60vh] flex items-center justify-center p-4">
            <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg text-center">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiUser className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Authentication Required
              </h2>
              
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                You need to be signed in to view this page.
              </p>
              
              <button
                onClick={() => signIn("github")}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium flex items-center justify-center mx-auto"
              >
                <FiGithub className="w-4 h-4 mr-2" />
                Sign In with GitHub
              </button>
            </div>
          </div>
        </div>
      );
    }
    return <>{children}</>;
  }

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(`${path}/`);
  };

  const navItems = [
    { name: "Dashboard", path: "/projects", icon: FiHome },
    { name: "Create New", path: "/projects/new", icon: FiPlus },
  ];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="md:hidden fixed inset-0 z-20 bg-black bg-opacity-50 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        ref={sidebarRef}
        initial={{ x: -280 }}
        animate={{ 
          x: sidebarOpen ? 0 : -280
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed inset-y-0 z-30 flex flex-col p-4 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 shadow-md w-64"
      >
        {/* ... existing sidebar code ... */}
        <div className="py-4 px-2">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/logo.png"
              alt="Flexrr Studio Logo"
              width={30}
              height={30}
            />
            <span className="text-xl font-bold dark:text-white">
              Flexrr Studio
            </span>
          </Link>
        </div>

        <nav className="flex-1 space-y-1 mt-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => {
                  if (window.innerWidth < 768) {
                    setSidebarOpen(false);
                  }
                }}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm transition-colors cursor-pointer ${
                  isActive(item.path)
                    ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300"
                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/30"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="pt-6 mt-6 border-t border-gray-200 dark:border-gray-700">
          {session.user?.image && (
            <div className="flex items-center p-3 mb-2 space-x-3 rounded-lg bg-gray-50 dark:bg-gray-700/30">
              <Image
                src={session.user.image}
                alt={session.user.name || "User"}
                width={36}
                height={36}
                className="rounded-full"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate dark:text-gray-200">
                  {session.user.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {session.user.email}
                </p>
              </div>
            </div>
          )}

          <Link
            href="/documentation"
            onClick={() => {
              if (window.innerWidth < 768) {
                setSidebarOpen(false);
              }
            }}
            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/30 transition-colors cursor-pointer"
          >
            <FiExternalLink className="w-5 h-5" />
            <span>Flexrr Docs</span>
          </Link>

          {/* Logout button */}
          <button
            onClick={() => {
              if (window.innerWidth < 768) {
                setSidebarOpen(false);
              }
              handleLogout();
            }}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors mt-2 cursor-pointer"
          >
            <FiLogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </motion.aside>

      {/* Main content */}
      <div className="flex flex-col flex-1 transition-all duration-300 md:ml-64 w-full">
        {/* Header */}
        <header className="sticky top-0 z-10 flex items-center justify-between h-16 px-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            {/* Mobile menu button */}
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="mr-3 md:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded cursor-pointer"
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? (
                <FiX className="w-6 h-6" />
              ) : (
                <FiMenu className="w-6 h-6" />
              )}
            </button>
            
            <div className="text-xl font-semibold text-gray-800 dark:text-white">
              {pathname === "/projects" && "Dashboard"}
              {pathname === "/projects/new" && "Create New Project"}
              {pathname.match(/^\/projects\/[^/]+$/) && "Project Details"}
            </div>
          </div>

          {/* Settings dropdown */}
          <div className="relative" ref={settingsRef}>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
            >
              <FiSettings className="w-5 h-5" />
            </button>

            {showSettings && (
              <div className="absolute right-0 w-56 mt-2 origin-top-right bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-20">
                <div className="py-1">
                  <button
                    onClick={() => {
                      toast.success(
                        "Profile settings will be implemented soon",
                      );
                      setShowSettings(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center cursor-pointer"
                  >
                    <FiUser className="w-4 h-4 mr-2" />
                    <span>Profile Settings</span>
                  </button>

                  <a
                    href="https://github.com/octagonemusic/flexrr/issues"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center cursor-pointer"
                    onClick={() => setShowSettings(false)}
                  >
                    <FiHelpCircle className="w-4 h-4 mr-2" />
                    <span>Help & Support</span>
                  </a>

                  <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center cursor-pointer"
                  >
                    <FiLogOut className="w-4 h-4 mr-2" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import {
  FiArrowRight,
  FiGithub,
  FiCpu,
  FiDatabase,
  FiZap,
  FiLayout,
  FiEye,
  FiCloud,
  FiGrid,
} from "react-icons/fi";
import Image from "next/image";
import { Session } from "next-auth";

interface HeroProps {
  session: Session | null;
}

export default function Hero({ session }: HeroProps) {
  const router = useRouter();

  return (
    <div className="bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-950 min-h-screen">
      {/* Navbar for Home */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Image
                src="/logo.png"
                alt="Flexrr Studio Logo"
                width={30}
                height={30}
              />
              <span className="ml-2 text-xl font-semibold text-gray-900 dark:text-white">
                Flexrr Studio
              </span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a
                href="https://github.com/octagonemusic/flexrr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white text-sm font-medium"
              >
                Documentation
              </a>
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
          </div>
        </div>
      </header>

      {/* Hero section */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-8">
                Build Beautiful Websites with{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
                  Flexrr
                </span>
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mb-10"
            >
              Flexrr is a flexible light-weight website starter that empowers
              developers & business owners to build blazing-fast, SEO-friendly
              static websites with ease.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-wrap justify-center gap-4 mb-16"
            >
              {session ? (
                <button
                  onClick={() => router.push("/projects")}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-4 rounded-full font-medium flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all"
                >
                  <span>Go to Dashboard</span>
                  <FiArrowRight className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={() => signIn("github", { callbackUrl: "/projects" })}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-4 rounded-full font-medium flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all"
                >
                  <span>Get Started for Free</span>
                  <FiArrowRight className="w-5 h-5" />
                </button>
              )}

              <a
                href="https://github.com/octagonemusic/flexrr"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-white px-8 py-4 rounded-full font-medium flex items-center space-x-2 shadow-md transition-colors border border-gray-200 dark:border-gray-700"
              >
                <FiGithub className="w-5 h-5" />
                <span>View on GitHub</span>
              </a>
            </motion.div>

            {/* Browser window mockup - Fixed with removed gray block */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="relative w-full max-w-5xl mx-auto"
            >
              <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 dark:from-indigo-500/10 dark:to-purple-500/10 rounded-xl p-1 shadow-2xl">
                <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
                  {/* Browser chrome */}
                  <div className="bg-gray-100 dark:bg-gray-700 py-2 px-4 flex items-center">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="mx-auto bg-white dark:bg-gray-600 rounded-full py-1 px-4 text-xs text-center text-gray-600 dark:text-gray-200">
                      https://yourdomain.com
                    </div>
                  </div>

                  {/* Browser content - fixed image implementation */}
                  <div className="p-4 sm:p-8">
                    <div className="overflow-hidden rounded-lg">
                      <Image
                        src="/dashboard-preview.png"
                        alt="Flexrr CMS Dashboard"
                        width={1200}
                        height={675}
                        className="w-full h-auto object-cover"
                        priority
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -right-8 -top-8 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg">
                <div className="flex items-center space-x-2">
                  <FiZap className="text-yellow-500 w-6 h-6" />
                  <span className="font-medium">Blazing Fast</span>
                </div>
              </div>

              <div className="absolute -left-8 top-1/3 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg">
                <div className="flex items-center space-x-2">
                  <FiCpu className="text-indigo-500 w-6 h-6" />
                  <span className="font-medium">API-First</span>
                </div>
              </div>

              <div className="absolute -bottom-8 left-1/4 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg">
                <div className="flex items-center space-x-2">
                  <FiLayout className="text-green-500 w-6 h-6" />
                  <span className="font-medium">Flexible UI</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose Flexrr?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Flexrr combines the best of modern technologies to provide a
              seamless development experience.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700"
            >
              <div className="bg-indigo-50 dark:bg-indigo-900/30 w-12 h-12 flex items-center justify-center rounded-lg mb-4">
                <FiZap className="text-indigo-600 dark:text-indigo-400 w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                High Performance
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Built on Next.js with static site generation for lightning-fast
                page loads and optimal SEO performance.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700"
            >
              <div className="bg-purple-50 dark:bg-purple-900/30 w-12 h-12 flex items-center justify-center rounded-lg mb-4">
                <FiDatabase className="text-purple-600 dark:text-purple-400 w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Powerful CMS
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Flexible content modeling with a user-friendly admin interface
                to manage all your content needs.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700"
            >
              <div className="bg-green-50 dark:bg-green-900/30 w-12 h-12 flex items-center justify-center rounded-lg mb-4">
                <FiCloud className="text-green-600 dark:text-green-400 w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Cloud-Ready
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Easily deploy to Vercel, Netlify, or any other hosting platform
                with just a few clicks.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700"
            >
              <div className="bg-amber-50 dark:bg-amber-900/30 w-12 h-12 flex items-center justify-center rounded-lg mb-4">
                <FiEye className="text-amber-600 dark:text-amber-400 w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Visual Editing
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Edit content directly on your site with our visual editor for a
                seamless content management experience.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700"
            >
              <div className="bg-blue-50 dark:bg-blue-900/30 w-12 h-12 flex items-center justify-center rounded-lg mb-4">
                <FiCpu className="text-blue-600 dark:text-blue-400 w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                API-First Design
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                RESTful and GraphQL APIs give you full flexibility to build
                custom frontends or integrate with other platforms.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700"
            >
              <div className="bg-pink-50 dark:bg-pink-900/30 w-12 h-12 flex items-center justify-center rounded-lg mb-4">
                <FiGithub className="text-pink-600 dark:text-pink-400 w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Open Source
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Fully open-source with an active community of developers
                contributing to make Flexrr even better.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-8 md:mb-0 md:w-2/3">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Build Your Next Project with Flexrr?
              </h2>
              <p className="text-lg text-white/80 max-w-2xl">
                Join thousands of developers who are already using Flexrr to
                build amazing websites. Get started for free today.
              </p>
            </div>
            <div>
              {session ? (
                <button
                  onClick={() => router.push("/projects")}
                  className="bg-white text-indigo-600 hover:bg-gray-100 px-8 py-4 rounded-full font-medium flex items-center space-x-2 shadow-lg transition-colors"
                >
                  <FiGrid className="w-5 h-5" />
                  <span>Go to Dashboard</span>
                </button>
              ) : (
                <button
                  onClick={() => signIn("github", { callbackUrl: "/projects" })}
                  className="bg-white text-indigo-600 hover:bg-gray-100 px-8 py-4 rounded-full font-medium flex items-center space-x-2 shadow-lg transition-colors"
                >
                  <FiGithub className="w-5 h-5" />
                  <span>Sign in with GitHub</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-8 md:mb-0">
              <div className="flex items-center">
                <div className="h-9 w-9 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-md flex items-center justify-center">
                  <span className="text-white font-bold">F</span>
                </div>
                <span className="ml-2 text-xl font-semibold text-white">
                  Flexrr Studio
                </span>
              </div>
              <p className="mt-4 max-w-md">
                Modern headless CMS and framework for building high-performance
                websites and applications.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
              <div>
                <h3 className="text-white font-medium mb-4">Product</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Features
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Pricing
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Roadmap
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Changelog
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-white font-medium mb-4">Resources</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Documentation
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Tutorials
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Blog
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Community
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-white font-medium mb-4">Company</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      About
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Careers
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Contact
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Privacy
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row md:items-center md:justify-between">
            <p>
              &copy; {new Date().getFullYear()} Flexrr. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition-colors">
                <FiGithub className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <span className="sr-only">Twitter</span>
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <span className="sr-only">Discord</span>
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

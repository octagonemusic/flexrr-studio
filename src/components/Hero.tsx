"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative min-h-[calc(100vh-80px)] flex items-center justify-center overflow-hidden bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900">
      <div className="container mx-auto px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left column - Text content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="relative z-10"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight mb-8">
              Build Stunning Sites{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-600">
                with Flexrr
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl">
              Flexrr brings the simplicity of a CMS and the speed of static sites together. Launch SEO-optimized, blazing-fast websites without writing a single line of code.
            </p>
            <div className="flex flex-wrap gap-4 mb-12">
              <button className="px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold hover:opacity-90 transition-opacity shadow-lg">
                Launch Your Site
              </button>
              <button className="px-8 py-4 rounded-full border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-semibold">
                Explore Flexrr
              </button>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Trusted by developers, startups, and creators to build fast, beautiful, reliable sites.
            </p>
          </motion.div>

          {/* Right column - Decorative element */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <div className="relative w-full aspect-square rounded-3xl bg-gradient-to-br from-blue-100 to-violet-100 dark:from-blue-900/20 dark:to-violet-900/20 p-1 shadow-2xl">
              <div className="absolute inset-0 bg-grid-pattern opacity-[0.05]" />
              <div className="absolute inset-0 backdrop-blur-2xl rounded-3xl" />
              <div className="relative h-full w-full rounded-2xl bg-white/80 dark:bg-gray-900/80 p-8 flex items-center justify-center">
                {/* Add your CMS mockup here */}
                <span className="text-gray-400 dark:text-gray-500 text-xl">
                  Flexrr CMS Preview
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Background grid pattern */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:16px_16px] opacity-30" />
      </div>
    </section>
  );
}

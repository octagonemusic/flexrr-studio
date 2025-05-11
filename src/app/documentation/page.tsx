import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  FiGithub,
  FiExternalLink,
  FiDatabase,
  FiServer,
  FiLayers,
  FiLayout,
  FiChevronRight,
  FiCode,
  FiFeather,
  FiMonitor,
  FiGrid,
  FiColumns,
  FiDollarSign,
  FiClock,
  FiRefreshCw,
  FiAward,
  FiArrowRight
} from 'react-icons/fi';

export default function DocumentationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
      {/* Hero section */}
      <div className="relative overflow-hidden bg-indigo-600 dark:bg-indigo-900">
        <div className="absolute inset-0 opacity-10 dark:opacity-20">
          <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] bg-center"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
              Flexrr Studio Documentation
            </h1>
            <p className="max-w-3xl mx-auto text-xl text-indigo-100 mb-8">
              Learn how to use Flexrr Studio to create, manage and deploy beautiful websites effortlessly
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="#what-is-flexrr"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-indigo-700 bg-white hover:bg-indigo-50 transition duration-150">
                Get Started <FiChevronRight className="ml-2" />
              </a>
              <a href="https://github.com/octagonemusic/flexrr"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 border border-indigo-300 text-base font-medium rounded-md text-white hover:bg-indigo-700 transition duration-150">
                View on GitHub <FiGithub className="ml-2" />
              </a>
            </div>
          </div>
        </div>
        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0 h-8 sm:h-16">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path
              className="fill-white dark:fill-gray-900"
              d="M0,288L48,272C96,256,192,224,288,197.3C384,171,480,149,576,165.3C672,181,768,235,864,250.7C960,267,1056,245,1152,224C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z">
            </path>
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Fixed on desktop, shown/hidden with button on mobile */}
          <div className="lg:w-72 flex-shrink-0">
            <div className="lg:sticky lg:top-8 rounded-xl shadow-sm bg-white dark:bg-gray-800 overflow-hidden border border-gray-100 dark:border-gray-700">
              <div className="p-5 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Table of Contents</h2>
              </div>
              <div className="p-1">
                <nav className="space-y-1 font-medium">
                  <a href="#what-is-flexrr" className="flex items-center p-3 text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-md">
                    <FiFeather className="mr-3 text-indigo-500" />
                    What is Flexrr?
                  </a>
                  <a href="#what-is-flexrr-studio" className="flex items-center p-3 text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-md">
                    <FiMonitor className="mr-3 text-indigo-500" />
                    What is Flexrr Studio?
                  </a>
                  <a href="#prerequisites" className="flex items-center p-3 text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-md">
                    <FiClock className="mr-3 text-indigo-500" />
                    Prerequisites
                  </a>
                  <a href="#deployment" className="flex items-center p-3 text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-md">
                    <FiRefreshCw className="mr-3 text-indigo-500" />
                    Deployment Guide
                  </a>
                  <a href="#admin-panel" className="flex items-center p-3 text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-md">
                    <FiServer className="mr-3 text-indigo-500" />
                    Admin Panel Setup
                  </a>

                  <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Flexrr Blocks
                  </div>

                  <a href="#cover-block" className="flex items-center py-2 pl-9 pr-3 text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-md">
                    Cover Block
                  </a>
                  <a href="#image-block" className="flex items-center py-2 pl-9 pr-3 text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-md">
                    Image Block
                  </a>
                  <a href="#hero-block" className="flex items-center py-2 pl-9 pr-3 text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-md">
                    Hero Block
                  </a>
                  <a href="#rich-text-block" className="flex items-center py-2 pl-9 pr-3 text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-md">
                    Rich Text Block
                  </a>
                  <a href="#hero-carousel-block" className="flex items-center py-2 pl-9 pr-3 text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-md">
                    Hero Carousel Block
                  </a>
                  <a href="#additional-blocks" className="flex items-center py-2 pl-9 pr-3 text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-md">
                    More Blocks...
                  </a>
                </nav>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700">
              <div className="p-6 lg:p-8 space-y-16">
                {/* What is Flexrr */}
                <section id="what-is-flexrr" className="scroll-mt-16">
                  <div className="flex items-center space-x-2 mb-6">
                    <div className="h-8 w-1 bg-indigo-500 rounded-full"></div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                      What is Flexrr?
                    </h2>
                  </div>

                  <div className="prose prose-indigo dark:prose-invert max-w-none">
                    <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                      Flexrr is a modern web application framework built on Next.js and Payload CMS. It provides a powerful foundation for creating SEO-friendly static websites using a modular block-based approach. With Flexrr, you can build professional, high-performance websites without writing extensive code.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
                      <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 p-6 rounded-xl shadow-sm border border-indigo-100 dark:border-indigo-800/30">
                        <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-800/60 rounded-lg flex items-center justify-center mb-4">
                          <FiCode className="text-indigo-600 dark:text-indigo-300 w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Next.js Frontend</h3>
                        <p className="text-gray-600 dark:text-gray-300">
                          Built on React with server-side rendering for optimal performance and SEO.
                        </p>
                      </div>

                      <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 p-6 rounded-xl shadow-sm border border-indigo-100 dark:border-indigo-800/30">
                        <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-800/60 rounded-lg flex items-center justify-center mb-4">
                          <FiServer className="text-indigo-600 dark:text-indigo-300 w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Payload CMS</h3>
                        <p className="text-gray-600 dark:text-gray-300">
                          Powerful headless CMS for managing content with a user-friendly interface.
                        </p>
                      </div>

                      <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 p-6 rounded-xl shadow-sm border border-indigo-100 dark:border-indigo-800/30">
                        <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-800/60 rounded-lg flex items-center justify-center mb-4">
                          <FiLayers className="text-indigo-600 dark:text-indigo-300 w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Block System</h3>
                        <p className="text-gray-600 dark:text-gray-300">
                          Modular blocks for flexible page building without writing code.
                        </p>
                      </div>
                    </div>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Key features of Flexrr</h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 h-5 w-5 rounded-full bg-indigo-500 flex items-center justify-center text-white mt-0.5">
                          <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                          </svg>
                        </div>
                        <p className="ml-3 text-gray-600 dark:text-gray-300">Next.js-based frontend for performance</p>
                      </div>
                      <div className="flex items-start">
                        <div className="flex-shrink-0 h-5 w-5 rounded-full bg-indigo-500 flex items-center justify-center text-white mt-0.5">
                          <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                          </svg>
                        </div>
                        <p className="ml-3 text-gray-600 dark:text-gray-300">Payload CMS integration</p>
                      </div>
                      <div className="flex items-start">
                        <div className="flex-shrink-0 h-5 w-5 rounded-full bg-indigo-500 flex items-center justify-center text-white mt-0.5">
                          <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                          </svg>
                        </div>
                        <p className="ml-3 text-gray-600 dark:text-gray-300">Modular block system</p>
                      </div>
                      <div className="flex items-start">
                        <div className="flex-shrink-0 h-5 w-5 rounded-full bg-indigo-500 flex items-center justify-center text-white mt-0.5">
                          <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                          </svg>
                        </div>
                        <p className="ml-3 text-gray-600 dark:text-gray-300">Built-in media management</p>
                      </div>
                      <div className="flex items-start">
                        <div className="flex-shrink-0 h-5 w-5 rounded-full bg-indigo-500 flex items-center justify-center text-white mt-0.5">
                          <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                          </svg>
                        </div>
                        <p className="ml-3 text-gray-600 dark:text-gray-300">SEO tools and optimization</p>
                      </div>
                      <div className="flex items-start">
                        <div className="flex-shrink-0 h-5 w-5 rounded-full bg-indigo-500 flex items-center justify-center text-white mt-0.5">
                          <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                          </svg>
                        </div>
                        <p className="ml-3 text-gray-600 dark:text-gray-300">TypeScript support</p>
                      </div>
                    </div>
                  </div>

                  <a
                    href="https://github.com/octagonemusic/flexrr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150"
                  >
                    <FiGithub className="mr-2 h-4 w-4" />
                    View Flexrr on GitHub
                  </a>
                </section>

                {/* What is Flexrr Studio */}
                <section id="what-is-flexrr-studio" className="scroll-mt-16">
                  <div className="flex items-center space-x-2 mb-6">
                    <div className="h-8 w-1 bg-indigo-500 rounded-full"></div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                      What is Flexrr Studio?
                    </h2>
                  </div>

                  <div className="prose prose-indigo dark:prose-invert max-w-none">
                    <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
                      Flexrr Studio is a comprehensive management platform for Flexrr projects. It streamlines the process of creating, managing, and deploying websites built with the Flexrr framework. Flexrr Studio provides a user-friendly interface that handles the technical aspects of project setup and deployment.
                    </p>

                    <div className="relative rounded-2xl overflow-hidden mb-12">
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-blue-500 opacity-10 dark:opacity-20"></div>
                      <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 p-6 lg:p-8">
                        <div className="space-y-6">
                          <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-indigo-100 dark:bg-indigo-900/40 text-indigo-800 dark:text-indigo-200">
                            Key Features
                          </div>
                          <ul className="space-y-4">
                            <li className="flex">
                              <div className="flex-shrink-0">
                                <div className="flex items-center justify-center h-8 w-8 rounded-md bg-indigo-500 text-white">
                                  <FiGithub className="h-5 w-5" />
                                </div>
                              </div>
                              <div className="ml-4">
                                <h4 className="text-lg font-medium text-gray-900 dark:text-white">GitHub Integration</h4>
                                <p className="mt-1 text-gray-600 dark:text-gray-300">Seamlessly manage repositories and deployments</p>
                              </div>
                            </li>
                            <li className="flex">
                              <div className="flex-shrink-0">
                                <div className="flex items-center justify-center h-8 w-8 rounded-md bg-indigo-500 text-white">
                                  <FiRefreshCw className="h-5 w-5" />
                                </div>
                              </div>
                              <div className="ml-4">
                                <h4 className="text-lg font-medium text-gray-900 dark:text-white">Version Tracking</h4>
                                <p className="mt-1 text-gray-600 dark:text-gray-300">Monitor and update project versions easily</p>
                              </div>
                            </li>
                            <li className="flex">
                              <div className="flex-shrink-0">
                                <div className="flex items-center justify-center h-8 w-8 rounded-md bg-indigo-500 text-white">
                                  <FiCode className="h-5 w-5" />
                                </div>
                              </div>
                              <div className="ml-4">
                                <h4 className="text-lg font-medium text-gray-900 dark:text-white">Environment Management</h4>
                                <p className="mt-1 text-gray-600 dark:text-gray-300">Securely manage project variables</p>
                              </div>
                            </li>
                          </ul>
                        </div>

                        <div className="space-y-6">
                          <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-indigo-100 dark:bg-indigo-900/40 text-indigo-800 dark:text-indigo-200">
                            Benefits
                          </div>
                          <ul className="space-y-4">
                            <li className="flex">
                              <div className="flex-shrink-0">
                                <div className="flex items-center justify-center h-8 w-8 rounded-md bg-indigo-500 text-white">
                                  <FiAward className="h-5 w-5" />
                                </div>
                              </div>
                              <div className="ml-4">
                                <h4 className="text-lg font-medium text-gray-900 dark:text-white">Simplified Setup</h4>
                                <p className="mt-1 text-gray-600 dark:text-gray-300">Get projects running in minutes, not hours</p>
                              </div>
                            </li>
                            <li className="flex">
                              <div className="flex-shrink-0">
                                <div className="flex items-center justify-center h-8 w-8 rounded-md bg-indigo-500 text-white">
                                  <FiGrid className="h-5 w-5" />
                                </div>
                              </div>
                              <div className="ml-4">
                                <h4 className="text-lg font-medium text-gray-900 dark:text-white">Centralized Management</h4>
                                <p className="mt-1 text-gray-600 dark:text-gray-300">Manage all your projects from one dashboard</p>
                              </div>
                            </li>
                            <li className="flex">
                              <div className="flex-shrink-0">
                                <div className="flex items-center justify-center h-8 w-8 rounded-md bg-indigo-500 text-white">
                                  <FiClock className="h-5 w-5" />
                                </div>
                              </div>
                              <div className="ml-4">
                                <h4 className="text-lg font-medium text-gray-900 dark:text-white">Time-Saving</h4>
                                <p className="mt-1 text-gray-600 dark:text-gray-300">Automation for common development tasks</p>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      Flexrr Studio is designed to streamline the development workflow, allowing you to focus on content creation and design rather than infrastructure management. Whether you're a developer, designer, or content creator, Flexrr Studio provides the tools you need to build and manage modern websites efficiently.
                    </p>
                  </div>
                </section>

                {/* Prerequisites */}
                <section id="prerequisites" className="scroll-mt-16">
                  <div className="flex items-center space-x-2 mb-6">
                    <div className="h-8 w-1 bg-indigo-500 rounded-full"></div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                      Prerequisites
                    </h2>
                  </div>

                  <div className="prose prose-indigo dark:prose-invert max-w-none">
                    <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
                      Before you can use Flexrr Studio to create and deploy Flexrr projects, you'll need to set up a few external services and accounts. This section covers the essential prerequisites.
                    </p>

                    <div className="space-y-8">
                      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                        <div className="px-6 py-5 bg-gradient-to-r from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 border-b border-gray-200 dark:border-gray-700">
                          <div className="flex items-center">
                            <FiDatabase className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                            <h3 className="ml-3 text-xl font-semibold text-gray-900 dark:text-white">MongoDB Database</h3>
                          </div>
                        </div>
                        <div className="p-6">
                          <p className="text-gray-600 dark:text-gray-300 mb-4">
                            Flexrr uses MongoDB to store content and configuration data. You'll need a MongoDB database before creating your first project.
                          </p>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                            <div className="space-y-4">
                              <h4 className="font-medium text-gray-900 dark:text-white">Setup Steps</h4>
                              <ol className="list-decimal pl-6 text-gray-600 dark:text-gray-300 space-y-2">
                                <li>Create a free account at <a href="https://mongodb.com" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline">MongoDB Atlas</a></li>
                                <li>Set up a new cluster (the free tier works fine for development)</li>
                                <li>Create a database user with read/write permissions</li>
                                <li>Whitelist your IP address or use 0.0.0.0/0 for development</li>
                                <li>Get your MongoDB connection string from the Atlas dashboard</li>
                              </ol>
                            </div>

                            <div className="bg-gray-50 dark:bg-gray-900/40 p-4 rounded-lg">
                              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Connection String Format</h4>
                              <div className="bg-white dark:bg-gray-800 font-mono text-sm p-3 rounded border border-gray-200 dark:border-gray-700 overflow-x-auto">
                                mongodb+srv://username:password@cluster.mongodb.net/your-database-name
                              </div>
                            </div>
                          </div>

                          <a
                            href="https://mongodb.com/docs/atlas"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-3 inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium"
                          >
                            Learn more about MongoDB Atlas
                            <FiArrowRight className="ml-1 h-4 w-4" />
                          </a>
                        </div>
                      </div>

                      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                        <div className="px-6 py-5 bg-gradient-to-r from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 border-b border-gray-200 dark:border-gray-700">
                          <div className="flex items-center">
                            <FiServer className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                            <h3 className="ml-3 text-xl font-semibold text-gray-900 dark:text-white">Media Storage</h3>
                          </div>
                        </div>
                        <div className="p-6">
                          <p className="text-gray-600 dark:text-gray-300 mb-6">
                            Flexrr requires object storage for media files. You can use either Supabase Storage or AWS S3.
                          </p>

                          <div className="space-y-6">
                            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                              <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                                <h4 className="font-medium text-gray-900 dark:text-white mb-3">Option 1: Supabase Storage</h4>
                              </div>
                              <div className="p-4">
                                <ol className="list-decimal pl-6 text-gray-600 dark:text-gray-300 space-y-2">
                                  <li>Create an account at <a href="https://supabase.com" className="text-indigo-600 dark:text-indigo-400 hover:underline">Supabase</a></li>
                                  <li>Create a new project and set up storage</li>
                                  <li>Create a public bucket for your media files</li>
                                  <li>Get your Supabase URL and anon key</li>
                                </ol>
                              </div>
                            </div>

                            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                              <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                                <h4 className="font-medium text-gray-900 dark:text-white mb-3">Option 2: AWS S3</h4>
                              </div>
                              <div className="p-4">
                                <ol className="list-decimal pl-6 text-gray-600 dark:text-gray-300 space-y-2">
                                  <li>Create an <a href="https://aws.amazon.com" className="text-indigo-600 dark:text-indigo-400 hover:underline">AWS account</a></li>
                                  <li>Set up an S3 bucket with public read access</li>
                                  <li>Create an IAM user with access to the S3 bucket</li>
                                  <li>Get the Access Key ID and Secret Access Key</li>
                                </ol>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                        <div className="px-6 py-5 bg-gradient-to-r from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 border-b border-gray-200 dark:border-gray-700">
                          <div className="flex items-center">
                            <FiGithub className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                            <h3 className="ml-3 text-xl font-semibold text-gray-900 dark:text-white">GitHub Account</h3>
                          </div>
                        </div>
                        <div className="p-6">
                          <p className="text-gray-600 dark:text-gray-300 mb-4">
                            Flexrr Studio uses GitHub to manage your project repositories.
                          </p>
                          <ol className="list-decimal pl-6 text-gray-600 dark:text-gray-300 space-y-2">
                            <li>Create or use an existing <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline">GitHub account</a></li>
                            <li>Ensure you have permission to create repositories</li>
                            <li>You'll authorize Flexrr Studio with your GitHub account during setup</li>
                          </ol>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Deployment section */}
                <section id="deployment" className="scroll-mt-16">
                  <div className="flex items-center space-x-2 mb-6">
                    <div className="h-8 w-1 bg-indigo-500 rounded-full"></div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                      Deploying to Vercel
                    </h2>
                  </div>

                  <div className="prose prose-indigo dark:prose-invert max-w-none">
                    <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
                      Vercel is the recommended hosting platform for Flexrr projects due to its excellent Next.js support. This section guides you through deploying your Flexrr project to Vercel.
                    </p>

                    <div className="relative">
                      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-500 to-blue-500 dark:from-indigo-400 dark:to-blue-400"></div>

                      <div className="relative pl-16 space-y-12">
                        <div>
                          <div className="absolute left-6 -translate-x-1/2 flex items-center justify-center w-6 h-6 bg-indigo-500 rounded-full text-white font-bold text-sm ring-4 ring-white dark:ring-gray-800">
                            1
                          </div>
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Prepare Your Project</h3>
                          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5">
                            <p className="text-gray-600 dark:text-gray-300 mb-4">
                              Ensure your Flexrr project is properly configured and committed to your GitHub repository.
                            </p>
                            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                              <li className="flex items-start">
                                <svg className="h-5 w-5 text-indigo-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>Navigate to your project details page</span>
                              </li>
                              <li className="flex items-start">
                                <svg className="h-5 w-5 text-indigo-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>Verify that all environment variables are set correctly</span>
                              </li>
                              <li className="flex items-start">
                                <svg className="h-5 w-5 text-indigo-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>Check that your repository is up to date</span>
                              </li>
                            </ul>
                          </div>
                        </div>

                        <div>
                          <div className="absolute left-6 -translate-x-1/2 flex items-center justify-center w-6 h-6 bg-indigo-500 rounded-full text-white font-bold text-sm ring-4 ring-white dark:ring-gray-800">
                            2
                          </div>
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Link to Vercel</h3>
                          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5">
                            <p className="text-gray-600 dark:text-gray-300 mb-4">
                              Import your GitHub repository to Vercel.
                            </p>
                            <ol className="list-decimal pl-6 text-gray-600 dark:text-gray-300 space-y-2">
                              <li>Go to <a href="https://vercel.com/new" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline">Vercel's new project page</a></li>
                              <li>Authorize Vercel to access your GitHub repositories (if not already done)</li>
                              <li>Select your Flexrr project repository from the list</li>
                            </ol>
                          </div>
                        </div>

                        <div>
                          <div className="absolute left-6 -translate-x-1/2 flex items-center justify-center w-6 h-6 bg-indigo-500 rounded-full text-white font-bold text-sm ring-4 ring-white dark:ring-gray-800">
                            3
                          </div>
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Configure Environment Variables</h3>
                          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5">
                            <p className="text-gray-600 dark:text-gray-300 mb-4">
                              Set up the required environment variables on Vercel.
                            </p>
                            <ol className="list-decimal pl-6 text-gray-600 dark:text-gray-300 space-y-2 mb-5">
                              <li>In the Vercel project configuration, navigate to the "Environment Variables" tab</li>
                              <li>From your Flexrr Studio dashboard, copy all the environment variables from your project's details page</li>
                              <li>Paste these variables into Vercel, ensuring they're set for all environments</li>
                            </ol>
                            <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-900/30">
                              <div className="flex">
                                <svg className="h-5 w-5 text-amber-600 dark:text-amber-500 mr-3 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                <div>
                                  <p className="text-amber-800 dark:text-amber-400 text-sm font-medium">
                                    Critical variables include <code className="bg-amber-100 dark:bg-amber-900/40 px-1 py-0.5 rounded">MONGODB_URI</code>, storage configuration, and <code className="bg-amber-100 dark:bg-amber-900/40 px-1 py-0.5 rounded">PAYLOAD_SECRET</code>.
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <div className="absolute left-6 -translate-x-1/2 flex items-center justify-center w-6 h-6 bg-indigo-500 rounded-full text-white font-bold text-sm ring-4 ring-white dark:ring-gray-800">
                            4
                          </div>
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Deploy Your Project</h3>
                          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5">
                            <p className="text-gray-600 dark:text-gray-300 mb-4">
                              Complete the deployment process.
                            </p>
                            <ol className="list-decimal pl-6 text-gray-600 dark:text-gray-300 space-y-2">
                              <li>Review your project settings in Vercel</li>
                              <li>Click "Deploy" to start the build process</li>
                              <li>Vercel will clone your repository, build the project, and deploy it</li>
                              <li>Once complete, you'll get a unique URL for your deployed site</li>
                            </ol>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-12 mb-8 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-xl p-6 border border-indigo-100 dark:border-indigo-800/20">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                        <FiRefreshCw className="inline-block mr-2 text-indigo-500" /> Continuous Deployment
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        After the initial deployment, Vercel automatically deploys updates whenever you push changes to your GitHub repository. Every change you make through the Flexrr admin panel will also be reflected in your live site.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Admin Panel section */}
                <section id="admin-panel" className="scroll-mt-16">
                  <div className="flex items-center space-x-2 mb-6">
                    <div className="h-8 w-1 bg-indigo-500 rounded-full"></div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                      Admin Panel
                    </h2>
                  </div>

                  <div className="prose prose-indigo dark:prose-invert max-w-none">
                    <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
                      The Flexrr admin panel, powered by Payload CMS, provides an intuitive interface for managing your website content. Here's how to set it up after deploying your project.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80">
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                            <svg className="h-5 w-5 text-indigo-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                            </svg>
                            Accessing the Admin Panel
                          </h3>
                        </div>
                        <div className="p-6">
                          <p className="text-gray-600 dark:text-gray-300 mb-4">
                            After deploying your Flexrr project, you can access the admin panel by navigating to:
                          </p>
                          <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-md font-mono text-sm mb-5 overflow-x-auto">
                            https://your-domain.com/admin
                          </div>
                          <p className="text-gray-600 dark:text-gray-300 mb-2">
                            If you're using Vercel's default domain, the admin panel would be at:
                          </p>
                          <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-md font-mono text-sm overflow-x-auto">
                            https://your-project-name.vercel.app/admin
                          </div>
                        </div>
                      </div>

                      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80">
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                            <svg className="h-5 w-5 text-indigo-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            Creating Your Admin Account
                          </h3>
                        </div>
                        <div className="p-6">
                          <p className="text-gray-600 dark:text-gray-300 mb-4">
                            When you first access the admin panel, you'll need to create an administrator account:
                          </p>
                          <ol className="space-y-4 mb-4">
                            <li className="flex">
                              <div className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 font-medium text-sm mr-3">
                                1
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900 dark:text-white">Visit the admin panel URL</h4>
                                <p className="mt-1 text-gray-600 dark:text-gray-300">Navigate to your admin panel URL in your browser.</p>
                              </div>
                            </li>
                            <li className="flex">
                              <div className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 font-medium text-sm mr-3">
                                2
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900 dark:text-white">Create your first user account</h4>
                                <p className="mt-1 text-gray-600 dark:text-gray-300">You'll be prompted to create an administrator account with your email and password.</p>
                              </div>
                            </li>
                            <li className="flex">
                              <div className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 font-medium text-sm mr-3">
                                3
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900 dark:text-white">Complete setup</h4>
                                <p className="mt-1 text-gray-600 dark:text-gray-300">Click "Create Account" to finalize your admin account and gain access to the dashboard.</p>
                              </div>
                            </li>
                          </ol>
                          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded text-blue-800 dark:text-blue-300 text-sm">
                            <span className="font-medium">Security Tip:</span> Use a strong password and keep your credentials secure. This account will have full access to your site's content.
                          </div>
                        </div>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Admin Panel Features</h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md transition duration-150">
                        <div className="text-indigo-500 mb-4">
                          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                          </svg>
                        </div>
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Page Builder</h4>
                        <p className="text-gray-600 dark:text-gray-300">
                          Create and edit pages using modular blocks for flexible layouts.
                        </p>
                      </div>

                      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md transition duration-150">
                        <div className="text-indigo-500 mb-4">
                          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Media Library</h4>
                        <p className="text-gray-600 dark:text-gray-300">
                          Upload and manage images, videos, and other files easily.
                        </p>
                      </div>

                      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md transition duration-150">
                        <div className="text-indigo-500 mb-4">
                          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Global Settings</h4>
                        <p className="text-gray-600 dark:text-gray-300">
                          Configure site-wide settings like metadata and navigation.
                        </p>
                      </div>

                      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md transition duration-150">
                        <div className="text-indigo-500 mb-4">
                          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                        </div>
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">User Management</h4>
                        <p className="text-gray-600 dark:text-gray-300">
                          Add and manage admin users with different permissions.
                        </p>
                      </div>

                      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md transition duration-150">
                        <div className="text-indigo-500 mb-4">
                          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                          </svg>
                        </div>
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Preview Mode</h4>
                        <p className="text-gray-600 dark:text-gray-300">
                          Preview changes before publishing them to your live site.
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Understanding Flexrr Blocks */}
                <section id="flexrr-blocks" className="scroll-mt-16">
                  <div className="flex items-center space-x-2 mb-6">
                    <div className="h-8 w-1 bg-indigo-500 rounded-full"></div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                      Flexrr Blocks
                    </h2>
                  </div>

                  <div className="prose prose-indigo dark:prose-invert max-w-none">
                    <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
                      Flexrr's modular block system is the core of its content creation capabilities. Blocks are pre-designed components that you can arrange in any order to build beautiful, responsive pages without writing code. Each block serves a specific purpose and can be customized to match your design needs.
                    </p>

                    {/* Cover Block */}
                    <div id="cover-block" className="scroll-mt-16 mb-12">
                      <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 rounded-t-xl p-5 border border-b-0 border-indigo-200 dark:border-indigo-800/30">
                        <div className="flex items-center">
                          <div className="bg-white dark:bg-gray-800 h-10 w-10 rounded-lg shadow-sm flex items-center justify-center">
                            <FiLayout className="text-indigo-600 dark:text-indigo-400 h-5 w-5" />
                          </div>
                          <h3 className="ml-4 text-xl font-bold text-gray-900 dark:text-white">Cover Block</h3>
                        </div>
                      </div>

                      <div className="bg-white dark:bg-gray-800 rounded-b-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700 mb-4">
                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                          A full-width section with a background image and overlay text, ideal for creating hero sections or page introductions.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-6">
                            <div>
                              <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                                <span className="flex items-center justify-center h-6 w-6 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 mr-2">
                                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                  </svg>
                                </span>
                                Features
                              </h4>
                              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                                <li className="flex items-start">
                                  <svg className="h-5 w-5 text-indigo-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                  <span>Full-width background image</span>
                                </li>
                                <li className="flex items-start">
                                  <svg className="h-5 w-5 text-indigo-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                  <span>Customizable overlay color and opacity</span>
                                </li>
                                <li className="flex items-start">
                                  <svg className="h-5 w-5 text-indigo-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                  <span>Heading with customizable size</span>
                                </li>
                                <li className="flex items-start">
                                  <svg className="h-5 w-5 text-indigo-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                  <span>Subheading text</span>
                                </li>
                                <li className="flex items-start">
                                  <svg className="h-5 w-5 text-indigo-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                  <span>Optional call-to-action button</span>
                                </li>
                              </ul>
                            </div>
                          </div>

                          <div className="space-y-6">
                            <div>
                              <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                                <span className="flex items-center justify-center h-6 w-6 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 mr-2">
                                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                </span>
                                Customization Options
                              </h4>
                              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                                <li className="flex items-start">
                                  <svg className="h-5 w-5 text-indigo-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                  <span>Image selection and focal point</span>
                                </li>
                                <li className="flex items-start">
                                  <svg className="h-5 w-5 text-indigo-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                  <span>Text alignment (left, center, right)</span>
                                </li>
                                <li className="flex items-start">
                                  <svg className="h-5 w-5 text-indigo-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                  <span>Content width and positioning</span>
                                </li>
                                <li className="flex items-start">
                                  <svg className="h-5 w-5 text-indigo-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                  <span>Height settings (fixed or responsive)</span>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Image Block */}
                    <div id="image-block" className="scroll-mt-16 mb-12">
                      <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 rounded-t-xl p-5 border border-b-0 border-indigo-200 dark:border-indigo-800/30">
                        <div className="flex items-center">
                          <div className="bg-white dark:bg-gray-800 h-10 w-10 rounded-lg shadow-sm flex items-center justify-center">
                            <FiLayout className="text-indigo-600 dark:text-indigo-400 h-5 w-5" />
                          </div>
                          <h3 className="ml-4 text-xl font-bold text-gray-900 dark:text-white">Image Block</h3>
                        </div>
                      </div>

                      <div className="bg-white dark:bg-gray-800 rounded-b-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700 mb-4">
                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                          A versatile block for displaying images with optional captions and formatting options.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-6">
                            <div>
                              <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                                <span className="flex items-center justify-center h-6 w-6 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 mr-2">
                                  <FiFeather className="h-4 w-4" />
                                </span>
                                Features
                              </h4>
                              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                                <li className="flex items-start">
                                  <svg className="h-5 w-5 text-indigo-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                  <span>High-quality image display</span>
                                </li>
                                <li className="flex items-start">
                                  <svg className="h-5 w-5 text-indigo-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                  <span>Optional image caption</span>
                                </li>
                                <li className="flex items-start">
                                  <svg className="h-5 w-5 text-indigo-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                  <span>Alt text for accessibility</span>
                                </li>
                                <li className="flex items-start">
                                  <svg className="h-5 w-5 text-indigo-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                  <span>Responsive sizing behavior</span>
                                </li>
                              </ul>
                            </div>
                          </div>

                          <div className="space-y-6">
                            <div>
                              <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                                <span className="flex items-center justify-center h-6 w-6 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 mr-2">
                                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                </span>
                                Customization Options
                              </h4>
                              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                                <li className="flex items-start">
                                  <svg className="h-5 w-5 text-indigo-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                  <span>Image width settings (full, contained)</span>
                                </li>
                                <li className="flex items-start">
                                  <svg className="h-5 w-5 text-indigo-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                  <span>Border and shadow options</span>
                                </li>
                                <li className="flex items-start">
                                  <svg className="h-5 w-5 text-indigo-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                  <span>Spacing controls</span>
                                </li>
                                <li className="flex items-start">
                                  <svg className="h-5 w-5 text-indigo-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                  <span>Caption styling</span>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Rich Text Block */}
                    <div id="rich-text-block" className="scroll-mt-16 mb-12">
                      <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 rounded-t-xl p-5 border border-b-0 border-indigo-200 dark:border-indigo-800/30">
                        <div className="flex items-center">
                          <div className="bg-white dark:bg-gray-800 h-10 w-10 rounded-lg shadow-sm flex items-center justify-center">
                            <FiFeather className="text-indigo-600 dark:text-indigo-400 h-5 w-5" />
                          </div>
                          <h3 className="ml-4 text-xl font-bold text-gray-900 dark:text-white">Rich Text Block</h3>
                        </div>
                      </div>

                      <div className="bg-white dark:bg-gray-800 rounded-b-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700 mb-4">
                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                          A flexible rich text editor for creating formatted content with headings, paragraphs, lists, and more using LexicalDocument.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-6">
                            <div>
                              <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                                <span className="flex items-center justify-center h-6 w-6 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 mr-2">
                                  <FiFeather className="h-4 w-4" />
                                </span>
                                Features
                              </h4>
                              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                                <li className="flex items-start">
                                  <svg className="h-5 w-5 text-indigo-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                  <span>Rich text formatting options</span>
                                </li>
                                <li className="flex items-start">
                                  <svg className="h-5 w-5 text-indigo-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                  <span>Multiple heading levels</span>
                                </li>
                                <li className="flex items-start">
                                  <svg className="h-5 w-5 text-indigo-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                  <span>Bulleted and numbered lists</span>
                                </li>
                                <li className="flex items-start">
                                  <svg className="h-5 w-5 text-indigo-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                  <span>Links and inline formatting</span>
                                </li>
                              </ul>
                            </div>
                          </div>

                          <div className="space-y-6">
                            <div>
                              <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                                <span className="flex items-center justify-center h-6 w-6 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 mr-2">
                                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                </span>
                                Customization Options
                              </h4>
                              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                                <li className="flex items-start">
                                  <svg className="h-5 w-5 text-indigo-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                  <span>Text alignment options</span>
                                </li>
                                <li className="flex items-start">
                                  <svg className="h-5 w-5 text-indigo-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                  <span>Custom styling per element</span>
                                </li>
                                <li className="flex items-start">
                                  <svg className="h-5 w-5 text-indigo-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                  <span>Typography controls</span>
                                </li>
                                <li className="flex items-start">
                                  <svg className="h-5 w-5 text-indigo-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                  <span>Spacing configuration</span>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Hero Block */}
                    <div id="hero-block" className="scroll-mt-16 mb-12">
                      <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 rounded-t-xl p-5 border border-b-0 border-indigo-200 dark:border-indigo-800/30">
                        <div className="flex items-center">
                          <div className="bg-white dark:bg-gray-800 h-10 w-10 rounded-lg shadow-sm flex items-center justify-center">
                            <FiMonitor className="text-indigo-600 dark:text-indigo-400 h-5 w-5" />
                          </div>
                          <h3 className="ml-4 text-xl font-bold text-gray-900 dark:text-white">Hero Block</h3>
                        </div>
                      </div>

                      <div className="bg-white dark:bg-gray-800 rounded-b-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700 mb-4">
                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                          A prominent section for showcasing key content, with options for background images, overlay effects, and call-to-action buttons.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-6">
                            <div>
                              <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                                <span className="flex items-center justify-center h-6 w-6 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 mr-2">
                                  <FiFeather className="h-4 w-4" />
                                </span>
                                Features
                              </h4>
                              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                                <li className="flex items-start">
                                  <svg className="h-5 w-5 text-indigo-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                  <span>Full-width or boxed layout</span>
                                </li>
                                <li className="flex items-start">
                                  <svg className="h-5 w-5 text-indigo-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                  <span>Customizable background image and color</span>
                                </li>
                                <li className="flex items-start">
                                  <svg className="h-5 w-5 text-indigo-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                  <span>Overlay color and opacity settings</span>
                                </li>
                                <li className="flex items-start">
                                  <svg className="h-5 w-5 text-indigo-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                  <span>Heading, subheading, and button customization</span>
                                </li>
                              </ul>
                            </div>
                          </div>

                          <div className="space-y-6">
                            <div>
                              <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                                <span className="flex items-center justify-center h-6 w-6 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 mr-2">
                                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                </span>
                                Customization Options
                              </h4>
                              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                                <li className="flex items-start">
                                  <svg className="h-5 w-5 text-indigo-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                  <span>Image and color settings for the background</span>
                                </li>
                                <li className="flex items-start">
                                  <svg className="h-5 w-5 text-indigo-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                  <span>Overlay configuration for text readability</span>
                                </li>
                                <li className="flex items-start">
                                  <svg className="h-5 w-5 text-indigo-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                  <span>Flexible content positioning</span>
                                </li>
                                <li className="flex items-start">
                                  <svg className="h-5 w-5 text-indigo-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                  <span>Height and width adjustments</span>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Additional Blocks */}
                    <div id="additional-blocks" className="scroll-mt-16 mb-12">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Additional Content Blocks</h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-8">
                        Flexrr includes many more block types for building comprehensive websites. Here's a summary of other available blocks:
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        <div id="hero-block" className="bg-white dark:bg-gray-800 shadow-sm rounded-xl border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md transition duration-150">
                          <div className="h-12 w-12 bg-indigo-100 dark:bg-indigo-900/40 rounded-lg flex items-center justify-center mb-4">
                            <FiMonitor className="text-indigo-600 dark:text-indigo-400 h-5 w-5" />
                          </div>
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Hero Block</h4>
                          <p className="text-gray-600 dark:text-gray-300">
                            Attention-grabbing section with headline, subtext, and call-to-action buttons.
                          </p>
                        </div>

                        <div id="rich-text-block" className="bg-white dark:bg-gray-800 shadow-sm rounded-xl border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md transition duration-150">
                          <div className="h-12 w-12 bg-indigo-100 dark:bg-indigo-900/40 rounded-lg flex items-center justify-center mb-4">
                            <FiFeather className="text-indigo-600 dark:text-indigo-400 h-5 w-5" />
                          </div>
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Rich Text Block</h4>
                          <p className="text-gray-600 dark:text-gray-300">
                            Formatted text content with headings, paragraphs, lists, and styling options.
                          </p>
                        </div>

                        <div id="hero-carousel-block" className="bg-white dark:bg-gray-800 shadow-sm rounded-xl border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md transition duration-150">
                          <div className="h-12 w-12 bg-indigo-100 dark:bg-indigo-900/40 rounded-lg flex items-center justify-center mb-4">
                            <FiRefreshCw className="text-indigo-600 dark:text-indigo-400 h-5 w-5" />
                          </div>
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Hero Carousel Block</h4>
                          <p className="text-gray-600 dark:text-gray-300">
                            Slideshow that cycles through multiple hero sections with navigation controls.
                          </p>
                        </div>

                        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md transition duration-150">
                          <div className="h-12 w-12 bg-indigo-100 dark:bg-indigo-900/40 rounded-lg flex items-center justify-center mb-4">
                            <FiGrid className="text-indigo-600 dark:text-indigo-400 h-5 w-5" />
                          </div>
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Card Grid Block</h4>
                          <p className="text-gray-600 dark:text-gray-300">
                            Responsive grid of cards for features, team members, or services.
                          </p>
                        </div>

                        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md transition duration-150">
                          <div className="h-12 w-12 bg-indigo-100 dark:bg-indigo-900/40 rounded-lg flex items-center justify-center mb-4">
                            <FiColumns className="text-indigo-600 dark:text-indigo-400 h-5 w-5" />
                          </div>
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Two Column Block</h4>
                          <p className="text-gray-600 dark:text-gray-300">
                            Balanced layout with text and media in adjacent columns.
                          </p>
                        </div>

                        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md transition duration-150">
                          <div className="h-12 w-12 bg-indigo-100 dark:bg-indigo-900/40 rounded-lg flex items-center justify-center mb-4">
                            <FiDollarSign className="text-indigo-600 dark:text-indigo-400 h-5 w-5" />
                          </div>
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Pricing Table Block</h4>
                          <p className="text-gray-600 dark:text-gray-300">
                            Comparative display of pricing plans and subscription tiers.
                          </p>
                        </div>
                      </div>

                      <div className="bg-indigo-50 dark:bg-indigo-900/20 p-5 rounded-xl border border-indigo-100 dark:border-indigo-800/30">
                        <p className="text-indigo-700 dark:text-indigo-300 flex items-center">
                          <FiLayers className="mr-2" />
                          Each block is designed to be responsive, accessible, and customizable to match your branding.
                        </p>
                      </div>
                    </div>

                    {/* Conclusion */}
                    <div id="conclusion" className="scroll-mt-16 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800/30 p-8 mb-8">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                        Getting Started with Flexrr
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300 text-lg mb-6">
                        Flexrr Studio provides everything you need to create beautiful, SEO-friendly websites without writing extensive code. With its modular block system and intuitive admin panel, you can focus on content and design rather than technical implementation.
                      </p>

                      <div className="mb-8">
                        <h4 className="font-semibold text-gray-900 dark:text-white text-lg mb-4">Quick Start Steps:</h4>
                        <ol className="ml-6 space-y-3 text-gray-600 dark:text-gray-300">
                          <li className="flex items-start">
                            <div className="flex-shrink-0 flex items-center justify-center h-7 w-7 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 font-medium text-sm mr-3">
                              1
                            </div>
                            <span>Set up your MongoDB database and storage solution</span>
                          </li>
                          <li className="flex items-start">
                            <div className="flex-shrink-0 flex items-center justify-center h-7 w-7 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 font-medium text-sm mr-3">
                              2
                            </div>
                            <span>Create a new project in Flexrr Studio</span>
                          </li>
                          <li className="flex items-start">
                            <div className="flex-shrink-0 flex items-center justify-center h-7 w-7 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 font-medium text-sm mr-3">
                              3
                            </div>
                            <span>Deploy your project to Vercel</span>
                          </li>
                          <li className="flex items-start">
                            <div className="flex-shrink-0 flex items-center justify-center h-7 w-7 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 font-medium text-sm mr-3">
                              4
                            </div>
                            <span>Access your admin panel and start building pages</span>
                          </li>
                          <li className="flex items-start">
                            <div className="flex-shrink-0 flex items-center justify-center h-7 w-7 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 font-medium text-sm mr-3">
                              5
                            </div>
                            <span>Customize your site with the blocks described above</span>
                          </li>
                        </ol>

                        <div className="flex flex-wrap gap-4 mt-8">
                          <a
                            href="/projects/new"
                            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150"
                          >
                            Create Your First Project
                            <FiArrowRight className="ml-2 h-4 w-4" />
                          </a>
                          <a
                            href="https://github.com/octagonemusic/flexrr"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-6 py-3 border border-indigo-200 dark:border-indigo-800 text-base font-medium rounded-md shadow-sm text-indigo-700 dark:text-indigo-300 bg-white dark:bg-gray-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150"
                          >
                            <FiGithub className="mr-2 h-4 w-4" />
                            View on GitHub
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

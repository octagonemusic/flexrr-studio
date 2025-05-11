import { montserrat, geistMono, geistSans } from "./fonts";
import { getServerSession } from "next-auth";
import SessionProvider from "@/components/SessionProvider";
import ErrorBoundary from "@/components/ErrorBoundary";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Flexrr Studio",
  description: "Create, manage, and deploy web applications with Flexrr Studio",
  icons: {
    icon: "/icon-flexrr.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();

  return (
    <html lang="en">
      <body
        className={`${montserrat.variable} ${geistSans.variable} ${geistMono.variable}`}
      >
        <ErrorBoundary>
          <SessionProvider session={session}>
            <Toaster position="top-right" />
            {children}
          </SessionProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}

import { Geist, Geist_Mono } from "next/font/google";
import { montserrat } from "./fonts";
import { getServerSession } from "next-auth";
import SessionProvider from "@/components/SessionProvider";
import "./globals.css";
import LoginButton from "@/components/LoginButton";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();

  return (
    <html lang="en">
      <body className={`${montserrat.variable}`}>
        <SessionProvider session={session}>
          <div className="absolute top-4 right-4 z-50">
            <LoginButton />
          </div>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}

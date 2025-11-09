import type { Metadata } from "next"
import { Inter, Nunito_Sans } from "next/font/google"
import "./globals.css"
import { Suspense } from "react"
import Loading from "./loading"
import TanStackProvider from "@/components/TanStackProvider/TanStackProvider"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { Toaster } from "react-hot-toast"
import AuthProvider from "@/components/AuthProvider/AuthProvider"
import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header"

const interSans = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const nunitoSans = Nunito_Sans({
  variable: "--font-nunito-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Clothica - best clothers",
  description: "Find your own style today",
  openGraph: {
    title: `Clothica - best clothers`,
    description: "Find your own style today",
    url: `https://movieDB.com`,
    siteName: "Clothica",
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/movie DB-og-meta.jpg",
        width: 1200,
        height: 630,
        alt: "Clothica",
      },
    ],
    type: "website",
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${interSans.variable} ${nunitoSans.variable} antialiased`}
      >
        <TanStackProvider>
          <div className="layout">
            <AuthProvider>
              <Suspense fallback={<Loading />}><Header /></Suspense>
              <Suspense fallback={<Loading />}>
                <main className="main">{children}</main>
              </Suspense>
              <Footer />
            </AuthProvider>
          </div>
          <Toaster />
          <ReactQueryDevtools initialIsOpen={false} />
        </TanStackProvider>
      </body>
    </html>
  );
}

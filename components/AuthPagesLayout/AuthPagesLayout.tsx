"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";

export default function AuthPagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isAuthPage = pathname === "/sign-in" || pathname === "/sign-up";

  return (
    <>
      {isAuthPage ? "" : <Header />}

      <main className="container">{children}</main>

      {isAuthPage ? "" : <Footer />}
    </>
  );
}

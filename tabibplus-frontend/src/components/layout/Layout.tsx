import type { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "../layout/Footer";

interface LayoutProps {
  children: ReactNode;
  wide?: boolean;
}

export function Layout({ children, wide = false }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className={wide ? "w-full px-4 py-8 sm:px-6" : "mx-auto max-w-6xl px-4 py-8"}>
        {children}
      </main>
      <Footer />
    </div>
  );
}

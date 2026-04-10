"use client";

import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { useAuth } from "@/lib/auth-context";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { role, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !role && pathname !== "/login") {
      router.push("/login");
    }
  }, [role, isLoading, router, pathname]);

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-sand-bg">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 border-4 border-amber-primary/20 border-t-amber-primary rounded-full animate-spin" />
          <p className="font-mono text-[10px] font-bold tracking-widest text-amber-primary uppercase">Initializing Intelligence Systems...</p>
        </div>
      </div>
    );
  }

  // Login page doesn't use this layout
  if (pathname === "/login") return <>{children}</>;

  return (
    <div className="min-h-screen bg-sand-bg selection:bg-amber-primary/10 selection:text-amber-primary">
      <Header />
      <div className="flex pt-[56px]">
        <Sidebar />
        <main className="flex-1 transition-all duration-300 ml-[240px] pl-6 pr-6 py-6 overflow-y-auto h-[calc(100vh-56px)] no-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
}

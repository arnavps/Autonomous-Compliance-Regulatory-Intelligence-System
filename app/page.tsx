"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export default function RootPage() {
  const router = useRouter();
  const { role } = useAuth();

  useEffect(() => {
    if (!role) {
      router.push("/login");
    } else {
      router.push("/qa");
    }
  }, [role, router]);

  return (
    <div className="min-h-screen bg-sand-bg flex items-center justify-center">
       <div className="h-8 w-8 border-2 border-amber-primary border-t-transparent animate-spin rounded-full" />
    </div>
  );
}

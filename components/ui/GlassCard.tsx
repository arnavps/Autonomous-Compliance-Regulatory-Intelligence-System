import React from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  variant?: "standard" | "elevated" | "sidebar" | "topbar" | "amber" | "conflict";
  className?: string;
  padding?: boolean;
}

export function GlassCard({ 
  children, 
  variant = "standard", 
  className,
  padding = true 
}: GlassCardProps) {
  const variantClasses = {
    standard: "glass-standard",
    elevated: "glass-elevated",
    sidebar: "glass-sidebar",
    topbar: "glass-topbar",
    amber: "amber-glow-card",
    conflict: "conflict-card",
  };

  return (
    <div className={cn(
      variantClasses[variant],
      padding && variant !== "sidebar" && variant !== "topbar" ? "p-6" : "",
      className
    )}>
      {children}
    </div>
  );
}

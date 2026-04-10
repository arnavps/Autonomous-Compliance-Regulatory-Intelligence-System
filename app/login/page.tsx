"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth, UserRole } from "@/lib/auth-context";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const { setRole } = useAuth();
  const router = useRouter();

  const handleEnterWorkspace = () => {
    if (!email || !password) {
      toast.error("Please enter your credentials first");
      return;
    }
    if (!selectedRole) {
      toast.error("Please select your institutional role");
      return;
    }

    setRole(selectedRole);
    toast.success(`Access granted as ${selectedRole}`);
    router.push("/dashboard/q-and-a");
  };

  const roles = [
    {
      id: "COMPLIANCE" as UserRole,
      title: "Compliance Officer",
      desc: "Focus on audit trails, SEBI/RBI filing automation, and risk mitigation workflows.",
      icon: "shield",
    },
    {
      id: "LAWYER" as UserRole,
      title: "Legal Counsel",
      desc: "Prioritize case law research, legislative amendments, and litigation management tools.",
      icon: "balance",
    },
    {
      id: "RISK" as UserRole,
      title: "Risk Analyst",
      desc: "Access real-time volatility monitoring, conflict matrices, and predictive impact modeling.",
      icon: "speed",
    },
  ];

  return (
    <div className="bg-background text-on-surface font-body selection:bg-primary-fixed selection:text-primary h-screen flex overflow-hidden">
      {/* Left Panel (55%): Login and Brand */}
      <main className="w-full lg:w-[55%] h-full bg-surface-container-low hex-grid relative flex flex-col p-6 md:p-8 border-r-[0.5px] border-outline-variant/20">
        {/* Brand Header */}
        <header className="flex items-center gap-3 mb-8">
          <div className="bg-primary p-1.5">
            <span className="material-symbols-outlined text-on-primary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              shield
            </span>
          </div>
          <h1 className="font-headline italic text-xl text-primary font-bold tracking-tight">ACRIS</h1>
        </header>

        <div className="max-w-md mx-auto w-full flex flex-col justify-center flex-grow overflow-hidden">
          <div className="mb-6">
            <h2 className="font-headline text-3xl md:text-4xl text-on-surface mb-2 leading-tight">
              Regulatory Intelligence, Built for India.
            </h2>
            <p className="font-body text-on-surface-variant text-base">Sign in to your compliance workspace.</p>
          </div>

          {/* Login Form Card */}
          <div className="glass-elevation p-5 md:p-8 border-[0.5px] border-outline-variant/30 bg-white/40">
            <form className="space-y-4 md:space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-1">
                <label className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">Institutional Email</label>
                <input
                  className="w-full surgical-input py-2 font-body focus:ring-0 focus:outline-none text-sm"
                  placeholder="officer@ledger.gov.in"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-end">
                  <label className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">Password</label>
                  <button type="button" className="font-label text-[9px] uppercase text-primary hover:underline">
                    Forgot?
                  </button>
                </div>
                <input
                  className="w-full surgical-input py-2 font-body focus:ring-0 focus:outline-none text-sm"
                  placeholder="••••••••"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button
                type="button"
                className="w-full bg-primary text-on-primary py-3 font-label uppercase tracking-widest text-xs hover:bg-primary/90 transition-all active:opacity-80"
                onClick={() => {
                  if (email && password) toast.success("Credentials verified. Select a role to proceed.");
                  else toast.error("Please enter credentials");
                }}
              >
                Continue
              </button>

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-outline-variant/20"></div>
                <span className="flex-shrink mx-4 font-label text-[9px] uppercase text-on-surface-variant">Or Corporate SSO</span>
                <div className="flex-grow border-t border-outline-variant/20"></div>
              </div>

              <button
                type="button"
                className="w-full border-[0.5px] border-outline text-on-surface py-3 font-label uppercase tracking-widest text-xs hover:bg-surface-variant/30 transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-base">key</span>
                Single Sign-On
              </button>
            </form>
          </div>
        </div>

        {/* Footer Metadata */}
        <footer className="mt-8 flex justify-between items-center opacity-60">
          <span className="font-label text-[9px] uppercase tracking-tighter">v4.0.2-STABLE // SECURED BY RSA-4096</span>
          <div className="hidden sm:flex gap-3">
            <span className="font-label text-[9px] uppercase tracking-tighter">SEBI COMPLIANT</span>
            <span className="font-label text-[9px] uppercase tracking-tighter">RBI-GRID v2</span>
          </div>
        </footer>
      </main>

      {/* Right Panel (45%): Role Selection */}
      <aside className="hidden lg:flex w-[45%] h-full bg-[#1A1714] relative flex-col p-8 md:p-10 overflow-hidden">
        {/* Abstract Tech Background Overlay */}
        <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
          <img
            className="w-full h-full object-cover grayscale mix-blend-overlay"
            alt="Technical Background"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC1b_g6caIMI2M-nsrU26zh_koJNQGJ9AXI7ueIyxMFuph8_fCx3tDToZk3ywb17lPOPPRd3ZWWydJu2xhbb3NtAFslh72wqYSdpkzlBDo56kiQgtQBKJRREaWoTFl8P8ZJpDFWNuRj-B65eoX7_DqAdPJur2TUBMgZjsmd35I9Stcahh1HLWNzKysEloMygxmvDqMhocZ6KuIsQQc35yeONUP3K7IQyTkRMNhV7lzRNGRqFm8TlvnrePyzyxxS6vD3otwu0JJ9piE"
          />
        </div>

        <div className="relative z-10 flex flex-col h-full overflow-hidden">
          <div className="mb-8">
            <h3 className="font-headline text-2xl text-[#FBF9F4] mb-2 leading-tight">Select your role to customize your workspace.</h3>
            <p className="font-body text-sm text-[#FBF9F4]/60">Your analytical tools and data feeds will be optimized for your function.</p>
          </div>

          {/* Role Cards Grid */}
          <div className="space-y-3 flex-grow overflow-y-auto pr-2 custom-scrollbar">
            {roles.map((role) => (
              <div
                key={role.id}
                onClick={() => setSelectedRole(role.id)}
                className={cn(
                  "p-4 flex items-start gap-4 cursor-pointer transition-all group border-[0.5px]",
                  selectedRole === role.id
                    ? "amber-glow bg-[#FBF9F4]/10 border-[#884E00]/40"
                    : "bg-[#FBF9F4]/5 border-white/10 hover:bg-[#FBF9F4]/10"
                )}
              >
                <div className={cn("p-2 transition-colors", selectedRole === role.id ? "bg-primary/20 text-primary" : "bg-white/10 text-[#FBF9F4]/80")}>
                  <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: selectedRole === role.id ? "'FILL' 1" : "" }}>
                    {role.icon}
                  </span>
                </div>
                <div className="flex-grow">
                  <h4 className={cn("font-headline text-lg mb-0.5", selectedRole === role.id ? "text-primary" : "text-[#FBF9F4]")}>{role.title}</h4>
                  <p className="font-body text-xs text-[#FBF9F4]/50 leading-relaxed">{role.desc}</p>
                </div>
                {selectedRole === role.id && (
                  <div className="self-center">
                    <span className="material-symbols-outlined text-primary text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
                      check_circle
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Stepper and Actions */}
          <div className="mt-8 space-y-4 md:space-y-6">
            {/* Linear Stepper */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className={cn("w-2 h-2", email && password ? "bg-tertiary" : "bg-white/20")}></div>
                <span className={cn("font-label text-[9px] uppercase tracking-widest", email && password ? "text-tertiary" : "text-white/20")}>Credentials</span>
              </div>
              <div className="h-[1px] w-6 bg-white/20"></div>
              <div className="flex items-center gap-2">
                <div className={cn("w-2 h-2", selectedRole ? "bg-primary" : "bg-white/20")}></div>
                <span className={cn("font-label text-[9px] uppercase tracking-widest", selectedRole ? "text-primary" : "text-white/20")}>Role</span>
              </div>
              <div className="h-[1px] w-6 bg-white/10"></div>
              <div className="flex items-center gap-2 opacity-30">
                <div className="w-2 h-2 bg-white"></div>
                <span className="font-label text-[9px] uppercase tracking-widest text-white">Workspace</span>
              </div>
            </div>
            
            <button
              onClick={handleEnterWorkspace}
              className="w-full bg-primary text-on-primary py-4 font-label uppercase tracking-[0.2em] text-xs hover:bg-primary/90 transition-all flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(136,78,0,0.2)] disabled:opacity-50"
            >
              Enter Workspace
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}

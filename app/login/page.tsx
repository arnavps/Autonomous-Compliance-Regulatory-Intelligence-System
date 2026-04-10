"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth, UserRole } from "@/lib/auth-context";
import { GlassCard } from "@/components/ui/GlassCard";
import { Stepper } from "@/components/ui/Stepper";
import { Shield, ShieldCheck, Scale, Gauge, Lock, Mail, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function LoginPage() {
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setRole } = useAuth();
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      setStep(1);
    } else {
      toast.error("Please enter credentials");
    }
  };

  const selectRole = (role: UserRole) => {
    setRole(role);
    toast.success(`Access granted as ${role}`);
    router.push("/qa");
  };

  const roles = [
    {
      id: "COMPLIANCE" as UserRole,
      title: "Compliance Officer",
      desc: "Monitor regulatory updates, parse circulars, and map obligations.",
      icon: ShieldCheck,
      color: "border-amber-primary/40 group-hover:bg-amber-primary/10",
      iconColor: "text-amber-primary"
    },
    {
      id: "LAWYER" as UserRole,
      title: "Legal Counsel",
      desc: "Perform case research, draft amendments, and manage legal risks.",
      icon: Scale,
      color: "border-blue-500/40 group-hover:bg-blue-500/10",
      iconColor: "text-blue-500"
    },
    {
      id: "RISK" as UserRole,
      title: "Risk Analyst",
      desc: "Analyze exposure matrix, track enforcements, and model impact.",
      icon: Gauge,
      color: "border-purple-500/40 group-hover:bg-purple-500/10",
      iconColor: "text-purple-500"
    }
  ];

  return (
    <div className="min-h-screen bg-sand-bg flex items-center justify-center p-6 bg-fixed bg-[url('data:image/svg+xml,%3Csvg viewBox=\"0 0 200 200\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cfilter id=\"noiseFilter\"%3E%3CfeTurbulence type=\"fractalNoise\" baseFrequency=\"0.65\" numOctaves=\"3\" stitchTiles=\"stitch\"/%3E%3C/filter%3E%3Crect width=\"100%25\" height=\"100%25\" filter=\"url(%23noiseFilter)\" opacity=\"0.03\"/%3E%3C/svg%3E')]">
      <div className="w-full max-w-[1000px]">
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-12">
          <div className="h-16 w-16 bg-white/40 glass-elevated rounded-2xl flex items-center justify-center mb-4 border border-white/60">
            <Shield className="h-8 w-8 text-amber-primary fill-amber-primary/10" />
          </div>
          <h1 className="text-4xl font-serif font-bold text-foreground">ACRIS</h1>
          <p className="font-mono text-[10px] font-bold tracking-[0.3em] text-amber-primary/40 uppercase mt-2">Autonomous Compliance & Intelligence</p>
        </div>

        <Stepper 
          steps={[{ label: "Identity" }, { label: "Role Selection" }]} 
          currentStep={step} 
          className="mb-12"
        />

        {step === 0 ? (
          <GlassCard variant="elevated" className="max-w-[440px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-serif font-bold mb-2">Welcome Back</h2>
            <p className="text-xs text-slate-500 mb-8">Enter your secure intelligence credentials.</p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">Office Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="officename@institution.in"
                    className="w-full bg-white/40 border border-slate-200 focus:border-amber-primary/40 focus:ring-4 focus:ring-amber-primary/5 p-2.5 pl-10 rounded-xl transition-all outline-none text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">Master Key</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-white/40 border border-slate-200 focus:border-amber-primary/40 focus:ring-4 focus:ring-amber-primary/5 p-2.5 pl-10 rounded-xl transition-all outline-none text-sm"
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-amber-primary text-white py-3 rounded-xl font-bold text-sm tracking-wide shadow-lg shadow-amber-primary/20 hover:bg-amber-secondary transition-all flex items-center justify-center gap-2 group"
              >
                Authenticate
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </GlassCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {roles.map((r) => (
              <button 
                key={r.id} 
                onClick={() => selectRole(r.id)}
                className="group text-left h-full"
              >
                <GlassCard variant="elevated" className={cn(
                  "h-full transition-all duration-300 transform group-hover:-translate-y-2 group-hover:shadow-2xl border-2 border-transparent",
                  r.color
                )}>
                  <div className={cn(
                    "h-12 w-12 rounded-xl flex items-center justify-center mb-6 transition-all duration-300",
                    r.id === "COMPLIANCE" ? "bg-amber-primary/10 text-amber-primary" : 
                    r.id === "LAWYER" ? "bg-blue-500/10 text-blue-500" : "bg-purple-500/10 text-purple-500"
                  )}>
                    <r.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-serif font-bold mb-3">{r.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed mb-6 italic">{r.desc}</p>
                  
                  <div className="flex items-center gap-2 text-[10px] font-mono font-bold tracking-widest text-slate-400 group-hover:text-amber-primary transition-all">
                    SELECT ROLE <ArrowRight className="h-3 w-3" />
                  </div>
                </GlassCard>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

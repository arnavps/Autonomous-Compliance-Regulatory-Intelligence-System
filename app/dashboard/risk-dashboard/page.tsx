"use client";

import { useEffect, useState } from "react";
import { 
  TrendingUp, 
  ShieldAlert, 
  Download,
  Play,
  CheckCircle2,
  Activity,
  History,
  Brain,
  Timer,
  Plus,
  ArrowRight,
  Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { usePipelineStore } from "@/lib/store/pipelineStore";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";

export default function RiskDashboardPage() {
  const { role } = useAuth();
  const { isActive } = usePipelineStore();
  const [stats, setStats] = useState({ 
    total_circulars: 0, 
    total_conflicts: 0,
    exposure_score: 84.2,
    pending_reviews: 3
  });
  const [exposureData, setExposureData] = useState<any[]>([]);
  const [timelineData, setTimelineData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsRes, exposureRes, timelineRes] = await Promise.all([
          fetch("http://localhost:8000/api/stats").then(res => res.json()),
          fetch("http://localhost:8000/api/risk/exposure").then(res => res.json()),
          fetch("http://localhost:8000/api/risk/timeline").then(res => res.json())
        ]);
        
        setStats(prev => ({ ...prev, ...statsRes }));
        setExposureData(exposureRes.matrix || []);
        setTimelineData(timelineRes.events || []);
      } catch (err) {
        console.error("Failed to fetch dashboard intelligence:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const triggerAnalysis = async () => {
    try {
      toast.info("Engaging Neural Orchestration Pipeline...");
      await fetch("http://localhost:8000/api/ingest", { method: "POST" });
    } catch (err) {
      toast.error("Orchestration failed to initialize.");
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-surface font-body p-8 lg:p-12 animate-in fade-in duration-1000">
      {/* Header Section */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 mb-12 pb-8 border-b border-outline-variant/20">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className="px-2 py-1 bg-primary/10 text-primary text-[10px] font-label font-bold uppercase tracking-widest border border-primary/20">
              Institutional Risk Overview
            </span>
            <span className="h-[1px] w-8 bg-outline-variant/30" />
            <PipelineMiniStatus isActive={isActive} />
          </div>
          <h1 className="font-headline text-5xl font-bold text-on-surface tracking-tight mb-2 italic">Intelligence Dashboard</h1>
          <p className="text-stone-500 font-serif text-lg max-w-2xl opacity-70">
            Aggregate regulatory exposure and conflict intelligence for the current compliance cycle.
          </p>
        </div>
        
        <div className="flex gap-4">
          <button className="px-6 py-3 bg-surface-container-high border border-outline-variant/30 text-[10px] font-label font-bold uppercase tracking-widest flex items-center hover:bg-surface-container-highest transition-all">
            <Download size={14} className="mr-3" /> Export Intelligence
          </button>
          <button 
            onClick={triggerAnalysis}
            className="px-8 py-3 bg-primary text-on-primary text-[10px] font-label font-bold uppercase tracking-widest flex items-center shadow-xl shadow-primary/20 hover:brightness-110 active:scale-95 transition-all"
          >
            <Play size={12} className="mr-3 fill-white" /> Trigger Orchestration
          </button>
        </div>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-16">
        <MetricCard 
          label="Aggregate Exposure" 
          value={`${stats.exposure_score}%`} 
          footer="Institutional threshold: 90%"
          icon={<TrendingUp size={18} className="text-primary" />}
          progress={stats.exposure_score}
          trend="+2.4% vs LY"
          variant="primary"
        />
        <MetricCard 
          label="Critical Collisions" 
          value={stats.total_conflicts.toString()} 
          footer={`${stats.pending_reviews} pending legal vetting`}
          icon={<ShieldAlert size={18} className="text-error" />}
          variant="error"
          badges={[
            { label: "High Priority", type: "error" },
            { label: "Neural detected", type: "primary" }
          ]}
        />
        <MetricCard 
          label="Tracked Circulars" 
          value={stats.total_circulars.toString()} 
          footer="Across 4 Jurisdictions"
          icon={<Brain size={18} className="text-secondary" />}
          variant="secondary"
          avatars={3}
        />
        <MetricCard 
          label="Compliance Health" 
          value="98.2" 
          footer="Last Audit: 12h ago"
          icon={<CheckCircle2 size={18} className="text-tertiary" />}
          variant="tertiary"
          verified={true}
        />
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-6">
          <Loader2 className="h-12 w-12 text-primary animate-spin" />
          <p className="text-[10px] font-label text-stone-500 uppercase tracking-widest font-bold">Synchronizing Global Risk Mesh...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Exposure Matrix */}
          <section className="col-span-1 lg:col-span-8 glass-panel amber-glow p-8">
            <div className="flex justify-between items-center mb-10">
              <h2 className="font-headline text-2xl font-bold italic">Exposure Lattice</h2>
              <div className="flex gap-6">
                {['Critical', 'Elevated', 'Nominal'].map((l, i) => (
                  <div key={l} className="flex items-center gap-2">
                    <div className={cn("h-2 w-2", i === 0 ? 'bg-error' : i === 1 ? 'bg-primary' : 'bg-tertiary')} />
                    <span className="text-[10px] font-label text-stone-500 font-bold tracking-widest uppercase">{l}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-outline-variant/10">
                    <th className="pb-5 text-[10px] font-label text-stone-500 uppercase tracking-widest font-bold">Domain</th>
                    <th className="pb-5 text-[10px] font-label text-stone-500 uppercase tracking-widest font-bold">NBFC</th>
                    <th className="pb-5 text-[10px] font-label text-stone-500 uppercase tracking-widest font-bold">Bank</th>
                    <th className="pb-5 text-[10px] font-label text-stone-500 uppercase tracking-widest font-bold">Fintech</th>
                    <th className="pb-5 text-[10px] font-label text-stone-500 uppercase tracking-widest font-bold">FPI-II</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {exposureData.map((row, i) => (
                    <tr key={i} className="group hover:bg-surface-container-low transition-colors duration-500">
                      <td className="py-7 font-headline font-bold text-xl text-on-surface">{row.domain}</td>
                      <HeatmapCell value={row.nbfc} />
                      <HeatmapCell value={row.bank} />
                      <HeatmapCell value={row.fintech} />
                      <HeatmapCell value={row.fpi} />
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Timeline Feed */}
          <div className="col-span-1 lg:col-span-4 flex flex-col gap-8">
            <section className="glass-panel p-8 amber-glow border-l-2 border-primary">
              <div className="flex items-center gap-3 mb-8">
                <History size={18} className="text-primary" />
                <h2 className="font-headline text-2xl font-bold italic">Mandate Horizon</h2>
              </div>
              
              <div className="space-y-12 relative ml-2">
                <div className="absolute left-[-9px] top-2 bottom-2 w-[1px] bg-outline-variant/30" />
                {timelineData.slice(0, 3).map((item, i) => (
                  <div key={i} className="relative transition-all hover:translate-x-1">
                    <div className={cn(
                      "absolute left-[-13px] top-1.5 h-2 w-2 rotate-45 border-2 border-background",
                      item.type === 'present' ? 'bg-primary scale-125' : 'bg-stone-300'
                    )} />
                    <p className="text-[10px] font-label text-stone-400 font-bold uppercase tracking-widest mb-1">{item.date}</p>
                    <h4 className="font-headline text-lg font-bold leading-tight mb-2">{item.label}</h4>
                    <p className="text-xs text-stone-500 font-serif italic mb-3 opacity-80">{item.sublabel}</p>
                    {item.type === 'present' && (
                       <span className="px-2 py-0.5 bg-primary/10 text-primary text-[9px] font-label font-bold uppercase tracking-widest">
                         Current Focus Window
                       </span>
                    )}
                  </div>
                ))}
              </div>

              <button className="mt-8 w-full py-3 bg-surface-container-high text-[10px] font-label font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-surface-container-highest transition-all">
                View Full Scanning Timeline
                <ArrowRight size={12} />
              </button>
            </section>

            <div className="glass-panel p-8 border-dashed border-stone-300 bg-transparent flex flex-col items-center justify-center text-center group transition-all hover:bg-surface-container-low shadow-none">
              <div className="h-12 w-12 bg-surface-container flex items-center justify-center mb-4 transition-colors group-hover:bg-primary/10">
                <Plus className="text-stone-400 group-hover:text-primary" />
              </div>
              <p className="font-label text-[10px] uppercase tracking-widest text-stone-500 font-bold">Custom Risk Sector</p>
              <p className="text-[9px] text-stone-400 mt-2 font-serif italic opacity-60">Define custom surveillance vectors for specific asset classes.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PipelineMiniStatus({ isActive }: { isActive: boolean }) {
  return (
    <div className="flex items-center gap-3 px-3 py-1 bg-surface-container-high border border-outline-variant/30 rounded-full h-8">
      <div className="relative">
        <Activity size={12} className={cn("text-primary", isActive && "animate-pulse")} />
        {isActive && <div className="absolute inset-0 bg-primary/20 blur-sm rounded-full animate-ping" />}
      </div>
      <span className="text-[9px] font-label font-bold uppercase tracking-[0.1em] text-stone-500">
        {isActive ? "Pipeline Active" : "Neural Ledger Synced"}
      </span>
      <div className="h-3 w-[1px] bg-outline-variant/30" />
      <span className="text-[9px] font-label font-bold text-stone-400">v4.2.1-PRO</span>
    </div>
  );
}

function MetricCard({ label, value, footer, icon, progress, badges, avatars, verified, variant, trend }: any) {
  const colorMap = {
    primary: "border-primary",
    error: "border-error text-error",
    secondary: "border-secondary",
    tertiary: "border-tertiary"
  };

  return (
    <div className={cn(
      "glass-panel p-8 border-l-2 amber-glow transition-all hover:-translate-y-1 group",
      // @ts-ignore
      colorMap[variant]
    )}>
      <div className="flex justify-between items-start mb-4">
        <p className="text-[10px] font-label uppercase tracking-widest text-stone-500 font-bold">{label}</p>
        <div className="opacity-40 group-hover:opacity-100 transition-opacity">{icon}</div>
      </div>
      
      <div className="flex items-baseline gap-3 mb-6">
        <h3 className="font-headline text-4xl font-bold tracking-tight">{value}</h3>
        {trend && <span className="text-[10px] font-label font-bold text-primary">{trend}</span>}
      </div>

      <div className="space-y-4">
        {progress !== undefined && (
          <div className="h-1 w-full bg-surface-container-high overflow-hidden">
            <motion.div 
              initial={{ width: 0 }} 
              animate={{ width: `${progress}%` }} 
              className={cn("h-full", variant === 'primary' ? 'bg-primary' : 'bg-stone-400')} 
            />
          </div>
        )}
        
        {badges && (
          <div className="flex flex-wrap gap-2">
            {badges.map((b: any, i: number) => (
              <span key={i} className={cn(
                "px-2 py-0.5 text-[8px] font-label font-bold uppercase tracking-wider",
                b.type === 'error' ? 'bg-error/10 text-error' : 'bg-primary/10 text-primary'
              )}>
                {b.label}
              </span>
            ))}
          </div>
        )}

        {avatars && (
          <div className="flex -space-x-2">
            {[...Array(avatars)].map((_, i) => (
              <div key={i} className="h-7 w-7 rounded-full border-2 border-background bg-stone-200" />
            ))}
            <div className="h-7 w-7 bg-surface-container-highest flex items-center justify-center text-[9px] font-label text-stone-500 border-2 border-background">+4</div>
          </div>
        )}

        {verified && (
          <div className="flex items-center gap-2 text-tertiary">
            <CheckCircle2 size={12} />
            <span className="text-[10px] font-label font-bold uppercase tracking-widest">Signed & Encrypted</span>
          </div>
        )}

        <p className="text-[10px] font-label text-stone-400 uppercase tracking-widest font-bold pt-2 border-t border-outline-variant/10">
          {footer}
        </p>
      </div>
    </div>
  );
}

function HeatmapCell({ value }: { value: number }) {
  const intensity = value > 0.8 ? 'bg-error text-white' : value > 0.4 ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface-variant opacity-60';
  
  return (
    <td className="p-2">
      <div className={cn(
        "h-14 w-full flex flex-col items-center justify-center transition-all hover:scale-105 cursor-crosshair border-l-2",
        intensity,
        value > 0.8 ? 'border-red-900 shadow-lg shadow-error/20' : value > 0.4 ? 'border-primary shadow-sm' : 'border-stone-300'
      )}>
        <span className="text-sm font-label font-bold">{value.toFixed(2)}</span>
        <span className="text-[8px] font-label uppercase tracking-widest opacity-60">Impact</span>
      </div>
    </td>
  );
}

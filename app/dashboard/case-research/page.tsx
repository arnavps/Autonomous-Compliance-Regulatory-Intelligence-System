"use client";

import { useState } from "react";
import { 
  Scale, 
  Search, 
  BookOpen, 
  Gavel, 
  History,
  CornerDownRight,
  ShieldAlert,
  ChevronRight,
  Loader2,
  FileText
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function CaseResearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const handleSearch = () => {
    if (!query) return;
    setIsSearching(true);
    setSearchResults([]);
    setTimeout(() => {
      setIsSearching(false);
      setSearchResults([
        { title: `In Re: ${query} Interpretations`, citation: "2024 SCC Online SC 882", relevance: "0.98", summary: "Detailed brief on regulatory frameworks." },
        { title: "Institutional Lending v. State", citation: "Civil Appeal 442/2023", relevance: "0.84", summary: "Precedent regarding fiduciary duties." }
      ]);
      toast.success("Intelligence Engine: 2 nodes matched.");
    }, 1500);
  };

  const precedents = [
    { title: "SEBI vs. Sahara India Real Estate", date: "2012", citation: "Civil Appeal No. 9813 of 2011", impact: "High" },
    { title: "Standard Chartered Bank vs. Custodian", date: "2000", citation: "AIR 2000 SC 1481", impact: "Medium" }
  ];

  return (
    <div className="h-full flex flex-col space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b-[0.5px] border-border/20">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="tech-label px-2 py-0.5 bg-secondary/10 text-secondary">LEGAL KNOWLEDGE BASE</span>
            <span className="h-[1px] w-12 bg-border/30" />
          </div>
          <h1 className="text-4xl font-serif tracking-tight text-foreground">
            Case Research
          </h1>
          <p className="text-muted-foreground font-sans text-sm mt-2 max-w-xl">
            Semantic search across 50,000+ legislative precedents and court rulings via the ACRIS Legal Engine.
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-3 px-6 py-2.5 bg-surface-container-low border-[0.5px] border-border/30 text-[10px] font-bold uppercase tracking-widest hover:bg-surface-container-high transition-all">
             <BookOpen className="h-4 w-4" />
             My Library
          </button>
        </div>
      </div>

      {/* Hero Search Section */}
      <div className="bg-surface-container-low border-[0.5px] border-border/20 p-12 relative overflow-hidden flex flex-col items-center">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
         
         <div className="relative z-10 w-full max-w-3xl">
           <div className="relative group">
             <input 
               type="text" 
               value={query}
               onChange={(e) => setQuery(e.target.value)}
               placeholder="Enter legal citation or query (e.g. 'fiduciary duties of NBFC directors')"
               className="w-full bg-white border-[0.5px] border-border/30 px-8 py-6 text-xl font-serif italic outline-none focus:border-primary shadow-2xl shadow-primary/5 pr-16"
               onKeyDown={(e) => e.key === "Enter" && handleSearch()}
             />
             <button 
               onClick={handleSearch}
               className="absolute right-6 top-1/2 -translate-y-1/2 p-2 text-primary hover:bg-primary/5 transition-all"
             >
               {isSearching ? <Loader2 className="h-6 w-6 animate-spin" /> : <Search className="h-6 w-6" />}
             </button>
           </div>
           
           <div className="mt-6 flex flex-wrap gap-3 justify-center">
             {["Fiduciary Duties", "LODR Compliance", "RBI Master Circular", "Insider Trading"].map((tag) => (
               <button key={tag} className="tech-label px-3 py-1 bg-white/50 border-[0.5px] border-border/10 hover:border-primary/40 transition-all text-muted-foreground">
                 {tag}
               </button>
             ))}
           </div>
         </div>
      </div>

      {/* Main Content: Results or Precedents */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-0">
         {/* Sidebar: Recent Sessions */}
         <div className="lg:col-span-4 flex flex-col space-y-6">
            <div>
              <h3 className="tech-label text-muted-foreground mb-4">Past Citations</h3>
              <div className="space-y-4">
                {precedents.map((p, i) => (
                  <div key={i} className="p-4 border-[0.5px] border-border/20 hover:bg-white transition-all group cursor-pointer">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-[9px] text-muted-foreground">{p.date}</span>
                      <span className={cn("tech-label", p.impact === "High" ? "text-destructive" : "text-amber-primary")}>{p.impact} Impact</span>
                    </div>
                    <h5 className="text-sm font-bold font-serif italic">{p.title}</h5>
                    <p className="font-mono text-[10px] text-muted-foreground mt-1">{p.citation}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-6 bg-surface-container-lowest border-[0.5px] border-border/20">
               <div className="flex items-center gap-3 text-destructive mb-3">
                 <ShieldAlert className="h-5 w-5" />
                 <span className="tech-label">Live Conflict Alert</span>
               </div>
               <p className="text-xs text-muted-foreground leading-relaxed">
                 A recent high-court ruling may affect standard arbitration clauses in NBFC contracts.
               </p>
               <button 
                 onClick={() => router.push("/dashboard/amendment-workbench")}
                 className="mt-4 flex items-center gap-2 text-primary tech-label hover:gap-3 transition-all">
                 Review Amendment <ChevronRight className="h-3 w-3" />
               </button>
            </div>
         </div>

         {/* Knowledge Graph / Terminal placeholder */}
         <div className="lg:col-span-8 flex flex-col bg-surface-container-low border-[0.5px] border-border/20 p-8">
            <div className="flex items-center gap-3 mb-8">
               <History className="h-5 w-5 text-primary" />
               <h3 className="tech-label">Active Research Session</h3>
            </div>
            
            <div className="flex-1 flex flex-col items-center justify-center text-center opacity-40">
               <Scale size={64} className="mb-6 text-muted-foreground" />
               <p className="text-serif text-lg italic max-w-sm">No analysis active. Enter a query above to initiate the Neural Legal Engine.</p>
               <div className="mt-8 flex gap-4">
                  <div className="h-1 w-12 bg-border/20" />
                  <div className="h-1 w-12 bg-border/20" />
                  <div className="h-1 w-12 bg-border/20" />
               </div>
            </div>

            <div className="mt-auto border-t-[0.5px] border-border/10 pt-6 flex items-center gap-4 text-muted-foreground font-mono text-[10px]">
               <CornerDownRight size={14} />
               <span>SYSTEM: ENGINE_READY | DATABASE: SEBI_RBI_SUPREME_COURT | SESSION: AC-104</span>
            </div>
         </div>
      </div>
    </div>
  );
}

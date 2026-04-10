"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="text-on-surface antialiased">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 md:px-12 h-20 bg-[#F7F5F0]/80 backdrop-blur-xl border-b-[0.5px] border-primary/10">
        <div className="text-2xl font-headline font-black tracking-tighter text-primary">ACRIS</div>
        <nav className="hidden lg:flex items-center space-x-12">
          <Link className="text-primary font-label uppercase text-[10px] tracking-[0.3em] font-bold border-b-2 border-primary" href="#">Product</Link>
          <Link className="text-on-surface-variant/70 hover:text-primary transition-colors font-label uppercase text-[10px] tracking-[0.3em]" href="#">Solutions</Link>
          <Link className="text-on-surface-variant/70 hover:text-primary transition-colors font-label uppercase text-[10px] tracking-[0.3em]" href="#">Intelligence</Link>
          <Link className="text-on-surface-variant/70 hover:text-primary transition-colors font-label uppercase text-[10px] tracking-[0.3em]" href="#">Institutional</Link>
        </nav>
        <div className="flex items-center space-x-8">
          <div className="hidden md:flex items-center space-x-6">
            <span className="material-symbols-outlined text-on-surface-variant/60 hover:text-primary cursor-pointer text-xl">account_balance</span>
            <span className="material-symbols-outlined text-on-surface-variant/60 hover:text-primary cursor-pointer text-xl">terminal</span>
          </div>
          <Link href="/login">
            <button className="bg-primary text-on-primary px-8 py-2.5 font-label text-[10px] uppercase tracking-[0.25em] hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/20">
              Execute Report
            </button>
          </Link>
        </div>
      </header>

      <main className="pt-20">
        {/* Ticker */}
        <div className="ticker-wrap h-8 flex items-center">
          <div className="ticker font-label text-[9px] uppercase tracking-widest text-on-surface-variant/50">
            <span>RBI-CIRC-2024-X4 STATUS: ANALYZED • SEBI-LODR-AMD-V2 STATUS: RECONCILED • MOF-GST-GUIDELINE-56 STATUS: PENDING • RBI-CIRC-2024-X4 STATUS: ANALYZED • SEBI-LODR-AMD-V2 STATUS: RECONCILED • MOF-GST-GUIDELINE-56 STATUS: PENDING • </span>
            <span>RBI-CIRC-2024-X4 STATUS: ANALYZED • SEBI-LODR-AMD-V2 STATUS: RECONCILED • MOF-GST-GUIDELINE-56 STATUS: PENDING • RBI-CIRC-2024-X4 STATUS: ANALYZED • SEBI-LODR-AMD-V2 STATUS: RECONCILED • MOF-GST-GUIDELINE-56 STATUS: PENDING • </span>
          </div>
        </div>

        {/* Hero Section */}
        <section className="relative min-h-[95vh] flex flex-col items-center justify-center px-6 overflow-hidden amber-glow">
          {/* Sovereign Ledger Visualization */}
          <div className="absolute inset-0 z-0 opacity-40">
            <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background z-10" />
            <img 
              alt="Complex Ledger Mesh" 
              className="w-full h-full object-cover scale-110 blur-[1px] mix-blend-multiply" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA0oeQoEpPg-KtYzL4hJZGpbNgqFo03XBG1aFkioFEUukTmvb3HMRMfBN4PtlYiWE56xwlstnRAib0F7V1efvxmPmQLGei5407xyYBZ1lNq8xd0_IjEScWMM7OAGrQpkRRUqbm3YO_MyyxbZhDxIxB3VCWq2ZyemLvmZ59t02UslL9ASKy4_kp1SN8WrTjRV_-jc5zJJLrJUY5tv7fueior9Bx66fQnqu_sk3GhNr1egc6qo9lU6yG008ZthffaAu5eHhnEBZy9UGc"
            />
            <div className="absolute inset-0 glass-24 opacity-60" />
          </div>

          <div className="relative z-20 max-w-7xl w-full grid grid-cols-12 gap-12 items-center">
            {/* Left: Headlines */}
            <div className="col-span-12 lg:col-span-7 space-y-10">
              <div className="inline-flex items-center space-x-3 bg-white/40 backdrop-blur px-4 py-1.5 border-l-4 border-primary shadow-sm">
                <span className="material-symbols-outlined text-[16px] text-primary">verified_user</span>
                <span className="font-label text-[11px] tracking-[0.2em] uppercase text-on-surface-variant font-bold">Protocol v4.2 Deployment</span>
              </div>
              <h1 className="text-6xl md:text-8xl font-headline font-black text-on-surface leading-[0.9] chiseled">
                Sovereign <br/>Intelligence <br/><span className="italic text-primary">Modern Ledger.</span>
              </h1>
              <p className="text-xl md:text-2xl font-body text-on-surface-variant/80 max-w-xl leading-relaxed">
                Autonomous compliance monitoring and risk mapping engineered for India&apos;s premier financial institutions.
              </p>
              <div className="flex flex-wrap items-center gap-8">
                <Link href="/login">
                  <button className="bg-primary text-on-primary px-10 py-6 font-label text-[10px] uppercase tracking-[0.3em] font-bold shadow-2xl shadow-primary/30 flex items-center group">
                    Access Institutional Portal
                    <span className="material-symbols-outlined ml-3 text-sm transition-transform group-hover:translate-x-2">arrow_forward</span>
                  </button>
                </Link>
                <a className="font-label text-[10px] uppercase tracking-[0.3em] font-bold text-primary border-b border-primary/30 hover:border-primary transition-all pb-1" href="#">
                  Review Corpus
                </a>
              </div>
            </div>

            {/* Right: Access Portal Card (Instrument Panel) */}
            <div className="col-span-12 lg:col-span-5 relative">
              <div className="glass-24 p-1 rounded-sm shadow-2xl overflow-hidden group">
                <div className="bg-[#F7F5F0] p-8 space-y-8 relative">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <span className="material-symbols-outlined text-6xl">grid_view</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-outline-variant/30 pb-4">
                    <div className="space-y-1">
                      <div className="font-label text-[9px] uppercase tracking-widest text-on-surface-variant/50">System Terminal</div>
                      <div className="font-headline text-lg font-bold">Institutional Access</div>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="font-label text-[9px] uppercase tracking-widest text-on-surface-variant font-bold">Institutional ID</label>
                      <div className="bg-surface-container-high p-4 border border-outline-variant/20 font-mono text-xs text-on-surface-variant">
                        AUTH_PROT_9921_X
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="glass-12 p-4 text-center">
                        <div className="font-label text-[18px] font-bold text-primary">99.8%</div>
                        <div className="font-label text-[8px] uppercase tracking-widest text-on-surface-variant">Uptime</div>
                      </div>
                      <div className="glass-12 p-4 text-center">
                        <div className="font-label text-[18px] font-bold text-primary">0.2s</div>
                        <div className="font-label text-[8px] uppercase tracking-widest text-on-surface-variant">Latency</div>
                      </div>
                    </div>
                  </div>
                  <Link href="/login" className="block w-full">
                    <button className="w-full py-4 border border-primary text-primary font-label text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-primary hover:text-white transition-all">
                      Initialize Secure Connection
                    </button>
                  </Link>
                </div>
              </div>
              
              {/* Floating Detail Card */}
              <div className="absolute -bottom-8 -left-12 hidden xl:block">
                <div className="glass-12 p-6 w-64 shadow-xl border-l-4 border-primary">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-primary/10 flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary text-sm">shield_with_heart</span>
                    </div>
                    <span className="font-label text-[9px] uppercase tracking-widest font-bold">Deep Audit</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-on-surface-variant/80 italic">
                    &quot;Every node in the ledger is mapped against current RBI circulars in real-time.&quot;
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Asymmetrical Capabilities Section */}
        <section className="py-40 px-6 md:px-12 bg-white relative">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-12 gap-8 items-start">
              {/* Header Component */}
              <div className="col-span-12 lg:col-span-5 space-y-8 sticky top-32">
                <div className="font-label text-[10px] uppercase tracking-[0.5em] text-primary font-bold">System Capabilities</div>
                <h2 className="font-headline text-5xl md:text-6xl font-black text-on-surface leading-tight chiseled">
                  Precision <br/><span className="italic text-primary">Reconciliation.</span>
                </h2>
                <p className="font-body text-lg text-on-surface-variant/70 leading-relaxed max-w-md">
                  The ACRIS engine employs multi-modal LLMs to construct a living digital twin of your institution&apos;s regulatory environment.
                </p>
                <div className="h-px w-24 bg-primary" />
              </div>
              
              {/* Cards Grid */}
              <div className="col-span-12 lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6 pt-12 lg:pt-0">
                {/* Card 1 */}
                <div className="glass-12 p-10 space-y-12 min-h-[420px] flex flex-col justify-between shadow-sm hover:translate-y-[-8px] transition-all duration-500">
                  <div className="space-y-6">
                    <span className="material-symbols-outlined text-primary text-4xl">database</span>
                    <h3 className="font-headline text-2xl font-bold">Semantic Core</h3>
                    <p className="text-sm leading-relaxed text-on-surface-variant/80">Continuous semantic parsing of RBI, SEBI, and Ministry updates. Maps intent and dependencies across products.</p>
                  </div>
                  <div className="font-label text-[9px] uppercase tracking-[0.2em] font-bold text-primary">
                    • Live Feed Integration<br/>• Cross-Map Annotation
                  </div>
                </div>
                
                {/* Card 2 (Offset) */}
                <div className="glass-12 p-10 space-y-12 min-h-[420px] flex flex-col justify-between shadow-sm md:mt-16 hover:translate-y-[-8px] transition-all duration-500">
                  <div className="space-y-6">
                    <span className="material-symbols-outlined text-primary text-4xl">analytics</span>
                    <h3 className="font-headline text-2xl font-bold">Conflict Logic</h3>
                    <p className="text-sm leading-relaxed text-on-surface-variant/80">Flags contradictions between new circulars and internal procedures. Resolve debt before it becomes liability.</p>
                  </div>
                  <div className="font-label text-[9px] uppercase tracking-[0.2em] font-bold text-primary">
                    • Gap Analysis Engine<br/>• Audit-Ready Logs
                  </div>
                </div>
                
                {/* Card 3 */}
                <div className="glass-12 p-10 space-y-12 min-h-[420px] flex flex-col justify-between shadow-sm hover:translate-y-[-8px] transition-all duration-500">
                  <div className="space-y-6">
                    <span className="material-symbols-outlined text-primary text-4xl">warning</span>
                    <h3 className="font-headline text-2xl font-bold">Predictive Risk</h3>
                    <p className="text-sm leading-relaxed text-on-surface-variant/80">Early warning signals extracted from draft papers. Stay months ahead of the evolving landscape.</p>
                  </div>
                  <div className="font-label text-[9px] uppercase tracking-[0.2em] font-bold text-primary">
                    • Draft Monitoring<br/>• Impact Projection
                  </div>
                </div>
                
                {/* Card 4 (Surgical Tool Detail) */}
                <div className="bg-primary p-10 space-y-8 min-h-[420px] flex flex-col justify-center text-on-primary md:mt-16 shadow-2xl">
                  <div className="font-label text-[10px] uppercase tracking-[0.4em] opacity-70">Architecture</div>
                  <h3 className="font-headline text-3xl font-bold">Engineered for Sovereign Scale.</h3>
                  <p className="text-xs leading-loose opacity-80">Built on private, air-gapped infrastructure for Tier-1 Indian banks. Zero-knowledge compliance mapping.</p>
                  <button className="bg-white text-primary py-3 font-label text-[9px] uppercase tracking-widest font-bold">View Technical Specs</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Institutional Proof */}
        <section className="py-32 px-6 bg-surface-container-low/30 overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <span className="font-label text-[10px] uppercase tracking-[0.8em] text-on-surface-variant/50">Trusted Institutional Nodes</span>
            </div>
            <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-40">
              <div className="logo-reflection font-headline text-4xl font-bold grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-default">HDFC BANK</div>
              <div className="logo-reflection font-headline text-4xl font-bold grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-default">KOTAK</div>
              <div className="logo-reflection font-headline text-4xl font-bold grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-default">CRED</div>
              <div className="logo-reflection font-headline text-4xl font-bold grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-default">ICICI</div>
              <div className="logo-reflection font-headline text-4xl font-bold grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-default">GROWW</div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-20 px-6 md:px-12 bg-white border-t border-primary/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
          <div className="space-y-6">
            <div className="font-headline text-3xl font-black text-primary tracking-tighter">ACRIS</div>
            <p className="font-label text-[11px] tracking-widest text-on-surface-variant/60 max-w-xs leading-loose uppercase">
              Sovereign Regulatory Intelligence for the Indian Financial Ecosystem.
            </p>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full border border-outline-variant/30 flex items-center justify-center hover:bg-primary/5 transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-sm">alternate_email</span>
              </div>
              <div className="w-8 h-8 rounded-full border border-outline-variant/30 flex items-center justify-center hover:bg-primary/5 transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-sm">public</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-16">
            <div className="space-y-6">
              <div className="font-label text-[10px] uppercase tracking-widest font-bold text-on-surface">Protocols</div>
              <div className="flex flex-col gap-4 font-label text-[10px] tracking-widest text-on-surface-variant/70 uppercase">
                <a className="hover:text-primary transition-colors" href="#">Privacy Protocol</a>
                <a className="hover:text-primary transition-colors" href="#">Compliance Framework</a>
                <a className="hover:text-primary transition-colors" href="#">Security Layer</a>
              </div>
            </div>
            <div className="space-y-6">
              <div className="font-label text-[10px] uppercase tracking-widest font-bold text-on-surface">Manuscripts</div>
              <div className="flex flex-col gap-4 font-label text-[10px] tracking-widest text-on-surface-variant/70 uppercase">
                <a className="hover:text-primary transition-colors" href="#">Legal Manuscript</a>
                <a className="hover:text-primary transition-colors" href="#">API Docs</a>
                <a className="hover:text-primary transition-colors" href="#">Whitepaper</a>
              </div>
            </div>
            <div className="space-y-6 hidden lg:block">
              <div className="font-label text-[10px] uppercase tracking-widest font-bold text-on-surface">Intelligence</div>
              <div className="flex flex-col gap-4 font-label text-[10px] tracking-widest text-on-surface-variant/70 uppercase">
                <a className="hover:text-primary transition-colors" href="#">Corpus Access</a>
                <a className="hover:text-primary transition-colors" href="#">System Status</a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-primary/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="font-label text-[9px] uppercase tracking-widest text-on-surface-variant/40">
            © 2024 ACRIS Institutional Intelligence. All rights reserved.
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary/20" />
            <span className="font-label text-[9px] uppercase tracking-widest text-on-surface-variant/40">Secure Connection: Active</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

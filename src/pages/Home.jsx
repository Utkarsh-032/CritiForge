import { ArrowRight, Bot, Code2, Globe2, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import FeaturesSection from "../components/home/FeaturesSection";

const reviewTools = [
  { name: "Website Review", description: "UX, accessibility & performance", icon: Globe2, color: "text-cyan-300", background: "bg-cyan-400/10" },
  { name: "Code Review", description: "Quality, security & best practices", icon: Code2, color: "text-violet-300", background: "bg-violet-400/10" },
  { name: "AI Mentor", description: "Guidance for every engineering decision", icon: Bot, color: "text-fuchsia-300", background: "bg-fuchsia-400/10" },
];

export default function Home() {
  return (
    <>
      <section className="relative min-h-[calc(100vh-72px)] overflow-hidden bg-[#0B1120] text-white" style={{ backgroundColor: "#0B1120" }}>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_30%,rgba(109,40,217,0.20),transparent_32%),radial-gradient(circle_at_82%_44%,rgba(8,145,178,0.16),transparent_28%)]" />
        <div className="pointer-events-none absolute left-1/2 top-0 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-violet-400/50 to-transparent" />

        <div className="relative mx-auto grid min-h-[calc(100vh-72px)] max-w-7xl items-center gap-14 px-6 py-16 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:px-10 xl:px-0">
        <div className="max-w-2xl">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/10 px-3.5 py-1.5 text-sm font-medium text-violet-200">
            <Sparkles size={15} />
            AI engineering review workspace
          </div>
          <h1 className="max-w-xl text-5xl font-semibold leading-[1.06] tracking-tight sm:text-6xl lg:text-7xl">
            Review Better.<br />Build Smarter.<br /><span className="bg-gradient-to-r from-violet-300 to-cyan-300 bg-clip-text text-transparent">Ship with Confidence.</span>
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-slate-400 sm:text-xl">
            CritiForge reviews websites and code, identifies meaningful problems, and turns them into clear, actionable improvements.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link to="/dashboard" className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 px-5 py-3.5 font-semibold text-white shadow-lg shadow-violet-950/60 transition-all duration-200 hover:-translate-y-0.5 hover:from-violet-400 hover:to-indigo-400 hover:shadow-violet-500/25">
              Start Reviewing <ArrowRight size={17} />
            </Link>
            <Link to="/dashboard" className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-5 py-3.5 font-semibold text-slate-200 transition-all duration-200 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/10 hover:text-white">
              View Demo
            </Link>
          </div>
        </div>

        <div id="demo" className="relative mx-auto w-full max-w-lg lg:justify-self-end">
          <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-violet-500/10 blur-3xl" />
          <div className="rounded-3xl border border-white/10 bg-slate-950/40 p-5 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-5">
              <div>
                <p className="text-sm font-medium text-slate-400">CritiForge Analysis</p>
                <p className="mt-1 font-semibold text-white">Review. Improve. Ship.</p>
              </div>
              <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">Complete</span>
            </div>

            <div className="space-y-3 py-5">
              {reviewTools.map(({ name, description, icon: Icon, color, background }) => (
                <div key={name} className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.03] p-3.5 transition-colors duration-200 hover:border-white/10 hover:bg-white/[0.06]">
                  <span className={`grid size-10 place-items-center rounded-xl ${background} ${color}`}><Icon size={19} /></span>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-slate-100">{name}</p>
                    <p className="mt-0.5 text-xs text-slate-500">{description}</p>
                  </div>
                  <span className="size-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(74,222,128,0.8)]" />
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-violet-400/15 bg-gradient-to-r from-violet-500/15 to-cyan-500/10 p-4">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-sm text-slate-300">Overall Score</p>
                  <p className="mt-1 text-3xl font-semibold tracking-tight text-white">92<span className="text-lg text-slate-400">/100</span></p>
                </div>
                <span className="text-sm font-semibold text-emerald-300">Excellent</span>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-[92%] rounded-full bg-gradient-to-r from-violet-400 to-cyan-300" />
              </div>
            </div>
          </div>
        </div>
        </div>
      </section>
      <FeaturesSection />
    </>
  );
}

import { ArrowRight, Bot, Code2, Globe2, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import FeaturesSection from "../components/home/FeaturesSection";
import { getReviewHistory, subscribeToReviewHistory } from "../services/reviewHistory";

const reviewTools = [
  { type: "website", name: "Website Review", description: "UX, accessibility & performance", icon: Globe2, color: "text-cyan-300", background: "bg-cyan-400/10" },
  { type: "code", name: "Code Review", description: "Quality, security & best practices", icon: Code2, color: "text-violet-300", background: "bg-violet-400/10" },
  { type: "mentor", name: "AI Mentor", description: "Guidance for every engineering decision", icon: Bot, color: "text-fuchsia-300", background: "bg-fuchsia-400/10" },
];

const typeLabels = { website: "Website Review", code: "Code Review", mentor: "AI Mentor" };
const scoreLabel = (score) => score >= 90 ? "Excellent" : score >= 75 ? "Strong" : score >= 60 ? "Fair" : score >= 40 ? "Needs Work" : "Critical";
const clampScore = (value) => Math.max(0, Math.min(100, Number(value)));
const getTime = (entry) => { const time = Date.parse(entry?.createdAt); return Number.isFinite(time) ? time : 0; };
const relativeTime = (value) => {
  const timestamp = Date.parse(value);
  if (!Number.isFinite(timestamp)) return null;
  const seconds = Math.max(0, Math.round((Date.now() - timestamp) / 1000));
  if (seconds < 60) return "just now";
  const minutes = Math.round(seconds / 60); if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60); if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
};

export default function Home() {
  const [history, setHistory] = useState(getReviewHistory);
  useEffect(() => subscribeToReviewHistory(() => setHistory(getReviewHistory())), []);
  useEffect(() => { document.title = "CritiForge | AI Engineering Reviews"; }, []);
  const { latestActivity, latestScored } = useMemo(() => {
    const newest = [...history].sort((a, b) => getTime(b) - getTime(a));
    return {
      latestActivity: newest[0] || null,
      latestScored: newest.find((item) => (item.type === "website" || item.type === "code") && Number.isFinite(Number(item.score))) || null,
    };
  }, [history]);
  const state = latestScored ? "scored" : latestActivity?.type === "mentor" ? "mentor" : "empty";
  const activeRecord = state === "scored" ? latestScored : latestActivity;
  const score = latestScored ? clampScore(latestScored.score) : null;

  const toolStatus = (type) => {
    if (latestActivity?.type === type) return "Latest";
    if (history.some((item) => item.type === type)) return "Completed";
    return "Ready";
  };

  return <>
    <section className="relative min-h-[calc(100vh-72px)] overflow-hidden bg-[#050507] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_30%,rgba(109,40,217,0.20),transparent_32%),radial-gradient(circle_at_82%_44%,rgba(8,145,178,0.16),transparent_28%)]" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-violet-400/50 to-transparent" />
      <div className="relative mx-auto grid min-h-[calc(100vh-72px)] max-w-7xl items-center gap-14 px-6 py-16 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:px-10 xl:px-0">
        <div className="max-w-2xl">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/10 px-3.5 py-1.5 text-sm font-medium text-violet-200"><Sparkles size={15} />AI engineering review workspace</div>
          <h1 className="max-w-xl text-5xl font-semibold leading-[1.06] tracking-tight sm:text-6xl lg:text-7xl">Review Better.<br />Build Smarter.<br /><span className="bg-gradient-to-r from-violet-300 to-cyan-300 bg-clip-text text-transparent">Ship with Confidence.</span></h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-slate-400 sm:text-xl">CritiForge reviews websites and code, identifies meaningful problems, and turns them into clear, actionable improvements.</p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row"><Link to="/dashboard" className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 px-5 py-3.5 font-semibold text-white shadow-lg shadow-violet-950/60 transition-all duration-200 hover:-translate-y-0.5 hover:from-violet-400 hover:to-indigo-400 hover:shadow-violet-500/25">Start Reviewing <ArrowRight size={17} /></Link><Link to="/dashboard" className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-5 py-3.5 font-semibold text-slate-200 transition-all duration-200 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/10 hover:text-white">View Workspace</Link></div>
        </div>
        <div className="relative mx-auto w-full max-w-lg lg:justify-self-end"><div className="absolute -inset-4 -z-10 rounded-[2rem] bg-violet-500/10 blur-3xl" />
          <div className="rounded-3xl border border-white/10 bg-[#0D0D12]/95 p-5 shadow-2xl shadow-black/30 sm:p-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-5"><div><p className="text-sm font-medium text-slate-400">CritiForge Analysis</p><p className="mt-1 font-semibold text-white">{state === "empty" ? "Your workspace is ready" : activeRecord?.title || typeLabels[activeRecord?.type]}</p></div><span className={state === "empty" ? "rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-300" : state === "mentor" ? "rounded-full border border-fuchsia-400/20 bg-fuchsia-400/10 px-3 py-1 text-xs font-semibold text-fuchsia-200" : "rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-1 text-xs font-semibold text-violet-200"}>{state === "empty" ? "Ready to review" : state === "mentor" ? "Mentor session completed" : "Latest analysis"}</span></div>
            <div className="space-y-3 py-5">{reviewTools.map(({ type, name, description, icon: Icon, color, background }) => { const status = toolStatus(type); return <div key={name} className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.03] p-3.5"><span className={`grid size-10 place-items-center rounded-xl ${background} ${color}`}><Icon size={19} /></span><div className="min-w-0 flex-1"><p className="font-medium text-slate-100">{name}</p><p className="mt-0.5 text-xs text-slate-500">{description}</p></div><span className={status === "Latest" ? "rounded-full bg-violet-400/15 px-2 py-1 text-xs font-medium text-violet-200" : status === "Completed" ? "rounded-full bg-emerald-400/10 px-2 py-1 text-xs font-medium text-emerald-300" : "rounded-full bg-white/5 px-2 py-1 text-xs font-medium text-slate-400"}>{status}</span></div>; })}</div>
            {state === "scored" && <div className="rounded-2xl border border-violet-400/15 bg-gradient-to-r from-violet-500/15 to-cyan-500/10 p-4"><div className="flex items-end justify-between gap-4"><div><p className="text-sm text-slate-300">{typeLabels[latestScored.type]}</p><p className="mt-1 text-3xl font-semibold tracking-tight text-white">{score}<span className="text-lg text-slate-400">/100</span></p></div><div className="text-right"><span className="text-sm font-semibold text-cyan-200">{scoreLabel(score)}</span>{relativeTime(latestScored.createdAt) && <p className="mt-1 text-xs text-slate-400">{relativeTime(latestScored.createdAt)}</p>}</div></div><div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10" role="progressbar" aria-label={`${typeLabels[latestScored.type]} overall score`} aria-valuemin="0" aria-valuemax="100" aria-valuenow={score}><div className="h-full rounded-full bg-gradient-to-r from-violet-400 to-cyan-300" style={{ width: `${score}%` }} /></div></div>}
            {state === "mentor" && <div className="rounded-2xl border border-fuchsia-400/15 bg-gradient-to-r from-fuchsia-500/10 to-cyan-500/10 p-4"><p className="text-sm text-fuchsia-200">Mentor session completed</p><p className="mt-1 text-lg font-semibold text-white">{latestActivity?.title || latestActivity?.metadata?.topic}</p>{relativeTime(latestActivity?.createdAt) && <p className="mt-2 text-xs text-slate-400">{relativeTime(latestActivity.createdAt)}</p>}</div>}
            {state === "empty" && <div className="rounded-2xl border border-white/[0.08] bg-[#121218] p-4"><p className="text-sm font-semibold text-white">No analysis yet</p><p className="mt-1 text-sm leading-6 text-slate-400">Run your first review to generate structured scores, findings, and actionable recommendations.</p><Link to="/website-review" className="mt-4 inline-flex items-center gap-2 rounded-xl bg-violet-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-violet-400">Start First Review <ArrowRight size={16} /></Link></div>}
            {state === "mentor" && <div className="pt-1"><p className="text-sm leading-6 text-slate-400">Complete a Website or Code Review to generate an engineering score.</p><Link to="/code-review" className="mt-3 inline-flex items-center gap-2 rounded-xl bg-violet-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-violet-400">Analyze Code <ArrowRight size={16} /></Link></div>}
          </div>
        </div>
      </div>
    </section>
    <FeaturesSection />
  </>;
}

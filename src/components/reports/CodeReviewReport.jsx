import { ChevronDown, CheckCircle2, Sparkles } from "lucide-react";
import { useState } from "react";
import ScoreCard from "./ScoreCard";
import ScoreProgress from "./ScoreProgress";

const severityStyles = {
  critical: "bg-rose-500/20 text-rose-100 ring-rose-400/30",
  high: "bg-rose-400/15 text-rose-200 ring-rose-400/25",
  medium: "bg-amber-400/15 text-amber-200 ring-amber-400/25",
  low: "bg-cyan-400/15 text-cyan-200 ring-cyan-400/25",
};

function IssueCard({ issue }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <article className="rounded-2xl border border-white/10 bg-[#0F172A]/70 p-4">
      <button type="button" onClick={() => setExpanded((value) => !value)} className="flex w-full items-start justify-between gap-3 text-left">
        <div><div className="flex flex-wrap items-center gap-2"><h3 className="font-semibold text-white">{issue.title}</h3><span className="rounded-full bg-white/5 px-2 py-0.5 text-xs text-slate-300">{issue.category}</span></div><p className="mt-1 text-xs text-slate-500">Line: {issue.lineReference}</p></div>
        <span className={`flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold capitalize ring-1 ${severityStyles[issue.severity]}`}><ChevronDown className={`size-3.5 transition ${expanded ? "rotate-180" : ""}`} />{issue.severity}</span>
      </button>
      {expanded && <div className="mt-4 space-y-3 border-t border-white/10 pt-4 text-sm leading-6"><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Why it matters</p><p className="mt-1 text-slate-300">{issue.explanation}</p></div><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Suggested fix</p><p className="mt-1 text-slate-300">{issue.suggestedFix}</p></div></div>}
    </article>
  );
}

export default function CodeReviewReport({ report }) {
  const severityCounts = ["critical", "high", "medium", "low"].map((severity) => ({ severity, count: report.issues.filter((issue) => issue.severity === severity).length }));
  const scoreLabels = { quality: "Quality", maintainability: "Maintainability", security: "Security", performance: "Performance", bestPractices: "Best Practices" };

  return (
    <section className="space-y-6 rounded-[28px] border border-white/10 bg-white/[0.04] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.25)] backdrop-blur-xl sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3"><div><span className="inline-flex items-center gap-2 rounded-full bg-violet-400/15 px-3 py-1 text-xs font-semibold text-violet-100 ring-1 ring-violet-400/25"><Sparkles className="size-3.5" />AI Analysis</span><p className="mt-3 text-lg font-semibold text-white">Code review report</p><p className="mt-1 text-sm leading-6 text-slate-400">{report.summary}</p></div><ScoreCard label="Overall score" score={report.overallScore} /></div>
      <div className="rounded-2xl border border-white/10 bg-[#0F172A]/60 p-5"><h2 className="font-semibold text-white">Score breakdown</h2><div className="mt-5 space-y-4">{Object.entries(report.scores).map(([key, score]) => <ScoreProgress key={key} label={scoreLabels[key]} score={score} />)}</div></div>
      <div><div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-lg font-semibold text-white">Review findings</h2><div className="flex flex-wrap gap-2">{severityCounts.map(({ severity, count }) => <span key={severity} className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ring-1 ${severityStyles[severity]}`}>{count} {severity}</span>)}</div></div>{report.issues.length ? <div className="mt-4 grid gap-3 md:grid-cols-2">{report.issues.map((issue, index) => <IssueCard key={`${issue.title}-${index}`} issue={issue} />)}</div> : <p className="mt-4 rounded-xl border border-white/10 bg-[#0F172A]/60 p-4 text-sm text-slate-400">No meaningful issues were identified.</p>}</div>
      <div><h2 className="text-lg font-semibold text-white">Strengths</h2><ul className="mt-4 grid gap-3 md:grid-cols-2">{report.strengths.map((strength, index) => <li key={`${strength}-${index}`} className="flex gap-3 rounded-xl border border-white/5 bg-white/[0.03] p-3 text-sm leading-6 text-slate-300"><CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-300" />{strength}</li>)}</ul></div>
      <div><h2 className="text-lg font-semibold text-white">Refactoring suggestions</h2><div className="mt-4 grid gap-3">{report.refactoringSuggestions.map((suggestion, index) => <article key={`${suggestion.title}-${index}`} className="rounded-2xl border border-white/10 bg-[#0F172A]/70 p-4"><h3 className="font-semibold text-white">{suggestion.title}</h3><p className="mt-2 text-sm leading-6 text-slate-400">{suggestion.reason}</p>{suggestion.exampleCode && <pre className="mt-4 overflow-x-auto rounded-xl border border-white/10 bg-slate-950/80 p-4 text-xs leading-6 text-cyan-100"><code>{suggestion.exampleCode}</code></pre>}</article>)}</div></div>
    </section>
  );
}

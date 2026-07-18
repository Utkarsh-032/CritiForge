const severityStyles = { high: "bg-rose-400/15 text-rose-200 ring-rose-400/25", medium: "bg-amber-400/15 text-amber-200 ring-amber-400/25", low: "bg-cyan-400/15 text-cyan-200 ring-cyan-400/25" };

export default function IssueCard({ issue }) {
  return (
    <article className="rounded-2xl border border-white/10 bg-[#0F172A]/70 p-4">
      <div className="flex items-start justify-between gap-3"><h3 className="font-semibold text-white">{issue.title}</h3><span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ring-1 ${severityStyles[issue.severity] || severityStyles.low}`}>{issue.severity}</span></div>
      <p className="mt-2 text-sm leading-6 text-slate-400">{issue.description}</p>
    </article>
  );
}

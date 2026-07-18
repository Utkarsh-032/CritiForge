import IssueCard from "./IssueCard";
import RecommendationCard from "./RecommendationCard";
import ScoreCard from "./ScoreCard";
import ScoreProgress from "./ScoreProgress";

export default function ReportPanel({ report, type }) {
  const metricEntries = Object.entries(report.scores).filter(([key]) => key !== "overall");
  const issuesBySeverity = report.issues.reduce((groups, issue) => ({ ...groups, [issue.severity]: [...(groups[issue.severity] || []), issue] }), {});
  return (
    <section className="space-y-6 rounded-[28px] border border-white/10 bg-white/[0.04] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.25)] backdrop-blur-xl sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-sm font-semibold text-white">{type} report</p><p className="mt-1 text-sm text-slate-400">Deterministic demo data · Source: {report.source}</p></div><span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-semibold text-emerald-200 ring-1 ring-emerald-400/20">Demo result</span></div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5"><ScoreCard label="Overall score" score={report.scores.overall} />{metricEntries.map(([label, score]) => <ScoreCard key={label} label={label} score={score} />)}</div>
      <div className="rounded-2xl border border-white/10 bg-[#0F172A]/60 p-5"><h2 className="font-semibold text-white">Score breakdown</h2><div className="mt-5 space-y-4">{metricEntries.map(([label, score]) => <ScoreProgress key={label} label={label} score={score} />)}</div></div>
      <div><h2 className="text-lg font-semibold text-white">{type === "Code review" ? "Bugs and review findings" : "Issues by severity"}</h2><div className="mt-4 space-y-5">{Object.entries(issuesBySeverity).map(([severity, issues]) => <div key={severity}><p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{severity} priority</p><div className="grid gap-3 md:grid-cols-2">{issues.map((issue) => <IssueCard key={issue.title} issue={issue} />)}</div></div>)}</div></div>
      <div><h2 className="text-lg font-semibold text-white">{type === "Code review" ? "Refactoring suggestions" : "Recommendations"}</h2><ul className="mt-4 grid gap-3 md:grid-cols-2">{report.recommendations.map((recommendation) => <RecommendationCard key={recommendation} recommendation={recommendation} />)}</ul></div>
    </section>
  );
}

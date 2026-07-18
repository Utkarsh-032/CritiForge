const reports = [
  {
    title: "Website Review",
    score: 92,
    status: "Excellent",
    statusClass: "bg-emerald-400/15 text-emerald-200 ring-emerald-400/20",
    tone: "from-emerald-400 to-cyan-400",
    note: "Strong visual balance and crisp hierarchy.",
  },
  {
    title: "Code Review",
    score: 87,
    status: "Strong",
    statusClass: "bg-violet-400/15 text-violet-200 ring-violet-400/20",
    tone: "from-violet-400 to-fuchsia-400",
    note: "Healthy structure with a few cleanup opportunities.",
  },
  {
    title: "Accessibility Audit",
    score: 95,
    status: "Outstanding",
    statusClass: "bg-cyan-400/15 text-cyan-200 ring-cyan-400/20",
    tone: "from-cyan-400 to-sky-400",
    note: "Excellent contrast and strong keyboard readiness.",
  },
];

export default function RecentReports() {
  return (
    <section className="space-y-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-violet-300/80">Recent Reports</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">Latest review snapshots</h2>
      </div>

      <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-4 shadow-[0_20px_80px_rgba(0,0,0,0.25)] backdrop-blur-xl sm:p-5">
        <div className="space-y-4">
          {reports.map((report) => (
            <article
              key={report.title}
              className="rounded-2xl border border-white/10 bg-[#0F172A]/70 p-4 transition-all duration-300 hover:border-violet-400/25 hover:bg-[#101A31]/90"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-semibold text-white">{report.title}</h3>
                  <p className="mt-1 text-sm text-slate-400">{report.note}</p>
                </div>
                <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ring-1 ${report.statusClass}`}>
                  {report.status}
                </span>
              </div>

              <div className="mt-4 flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Score</p>
                  <p className="mt-1 text-2xl font-semibold text-white">
                    {report.score}
                    <span className="text-sm font-medium text-slate-400">/100</span>
                  </p>
                </div>
                <p className="text-sm font-medium text-slate-300">Premium result</p>
              </div>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/5">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${report.tone}`}
                  style={{ width: `${report.score}%` }}
                />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

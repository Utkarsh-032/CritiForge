export default function ScoreCard({ label, score, accent = "from-violet-400 to-cyan-300" }) {
  const value = Math.max(0, Math.min(100, Number(score) || 0));
  return (
    <article className="rounded-2xl border border-white/10 bg-[#0F172A]/70 p-4 shadow-lg shadow-black/10">
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">{label || "Overall score"}</p>
      <p className="mt-2 text-3xl font-semibold tracking-tight text-white">{value}<span className="text-base font-medium text-slate-400">/100</span></p>
      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10" role="progressbar" aria-label={`${label || "Overall score"} score`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={value}><div className={`h-full rounded-full bg-gradient-to-r ${accent}`} style={{ width: `${value}%` }} /></div>
    </article>
  );
}

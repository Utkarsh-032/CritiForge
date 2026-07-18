export default function ScoreCard({ label, score, accent = "from-violet-400 to-cyan-300" }) {
  return (
    <article className="rounded-2xl border border-white/10 bg-[#0F172A]/70 p-4 shadow-lg shadow-black/10">
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-semibold tracking-tight text-white">{score}<span className="text-base font-medium text-slate-400">/100</span></p>
      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10"><div className={`h-full rounded-full bg-gradient-to-r ${accent}`} style={{ width: `${score}%` }} /></div>
    </article>
  );
}

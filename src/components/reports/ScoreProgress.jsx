export default function ScoreProgress({ label, score }) {
  const value = Math.max(0, Math.min(100, Number(score) || 0));
  return (
    <div>
      <div className="flex items-center justify-between gap-3 text-sm"><span className="min-w-0 text-slate-300">{label || "Score"}</span><span className="shrink-0 font-semibold text-white">{value}/100</span></div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10" role="progressbar" aria-label={`${label || "Score"} score`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={value}><div className="h-full rounded-full bg-gradient-to-r from-violet-400 to-cyan-300" style={{ width: `${value}%` }} /></div>
    </div>
  );
}

export default function ScoreProgress({ label, score }) {
  return (
    <div>
      <div className="flex items-center justify-between text-sm"><span className="text-slate-300">{label}</span><span className="font-semibold text-white">{score}/100</span></div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-violet-400 to-cyan-300" style={{ width: `${score}%` }} /></div>
    </div>
  );
}

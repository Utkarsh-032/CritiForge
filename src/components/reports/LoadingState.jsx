export default function LoadingState({ label = "Preparing your report" }) {
  return <div className="flex items-center gap-3 rounded-2xl border border-violet-400/20 bg-violet-500/10 p-4 text-sm text-violet-100"><span className="size-5 animate-spin rounded-full border-2 border-violet-200/30 border-t-violet-200" />{label}…</div>;
}

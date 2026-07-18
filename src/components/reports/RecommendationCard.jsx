import { CheckCircle2 } from "lucide-react";

export default function RecommendationCard({ recommendation }) {
  return <li className="flex gap-3 rounded-xl border border-white/5 bg-white/[0.03] p-3 text-sm leading-6 text-slate-300"><CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-300" />{recommendation}</li>;
}

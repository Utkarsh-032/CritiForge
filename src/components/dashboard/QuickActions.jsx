import { ArrowUpRight, Bot, Code2, Globe2 } from "lucide-react";
import { Link } from "react-router-dom";

const actions = [
  {
    title: "Website Review",
    description: "Audit UX, visual hierarchy, and clarity in one pass.",
    to: "/website-review",
    icon: Globe2,
    accent: "from-cyan-400/20 via-cyan-400/10 to-transparent",
    badge: "UX",
    badgeClass: "bg-cyan-400/15 text-cyan-200 ring-cyan-400/20",
  },
  {
    title: "Code Review",
    description: "Inspect structure, quality, and maintainability signals.",
    to: "/code-review",
    icon: Code2,
    accent: "from-violet-400/20 via-violet-400/10 to-transparent",
    badge: "Code",
    badgeClass: "bg-violet-400/15 text-violet-200 ring-violet-400/20",
  },
  {
    title: "AI Mentor",
    description: "Get guided feedback, suggestions, and next steps.",
    to: "/ai-mentor",
    icon: Bot,
    accent: "from-fuchsia-400/20 via-fuchsia-400/10 to-transparent",
    badge: "Mentor",
    badgeClass: "bg-fuchsia-400/15 text-fuchsia-200 ring-fuchsia-400/20",
  },
];

export default function QuickActions() {
  return (
    <section className="space-y-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-violet-300/80">Quick Actions</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">Start a premium review flow</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {actions.map(({ title, description, to, icon: Icon, accent, badge, badgeClass }) => (
          <Link
            key={title}
            to={to}
            className="group relative overflow-hidden rounded-3xl border border-white/10 bg-[#121b2e] p-5 shadow-[0_12px_32px_rgba(0,0,0,0.18)] transition-[transform,border-color,box-shadow] duration-200 ease-out hover:-translate-y-1 hover:border-violet-400/30 hover:shadow-lg hover:shadow-violet-950/25"
          >
            <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${accent} opacity-70 transition-opacity duration-200 group-hover:opacity-100`} />
            <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/5" />

            <div className="relative flex h-full flex-col gap-5">
              <div className="flex items-start justify-between gap-4">
                <div className="grid size-12 place-items-center rounded-2xl border border-white/10 bg-[#0F172A] text-white shadow-lg shadow-black/20 transition-transform duration-200 group-hover:scale-105">
                  <Icon size={22} strokeWidth={1.8} className="text-white" />
                </div>
                <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ring-1 ${badgeClass}`}>{badge}</span>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-white">{title}</h3>
                <p className="max-w-xs text-sm leading-6 text-slate-300">{description}</p>
              </div>

              <div className="mt-auto flex items-center justify-between pt-3 text-sm font-medium text-slate-200">
                <span>Open action</span>
                <span className="inline-flex items-center gap-1 text-violet-200 transition-transform duration-200 group-hover:translate-x-0.5">
                  Open Tool
                  <ArrowUpRight size={16} />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

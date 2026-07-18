import { CheckCircle2 } from "lucide-react";

const sections = [
  {
    label: "UI improvements",
    count: 3,
    badgeClass: "bg-violet-400/15 text-violet-200 ring-violet-400/20",
    items: [
      "Refine spacing rhythm across the dashboard cards.",
      "Increase contrast on secondary labels and helper text.",
      "Strengthen hover states for interactive surfaces.",
    ],
  },
  {
    label: "Performance suggestions",
    count: 2,
    badgeClass: "bg-cyan-400/15 text-cyan-200 ring-cyan-400/20",
    items: [
      "Memoize repeated dashboard card data structures.",
      "Defer non-critical visuals until the viewport reaches them.",
    ],
  },
  {
    label: "Accessibility issue",
    count: 1,
    badgeClass: "bg-amber-400/15 text-amber-200 ring-amber-400/20",
    items: [
      "Improve focus visibility on low-emphasis action elements.",
    ],
  },
  {
    label: "Code optimizations",
    count: 4,
    badgeClass: "bg-emerald-400/15 text-emerald-200 ring-emerald-400/20",
    items: [
      "Extract repeated card styling into a shared utility pattern.",
      "Keep dashboard data in local constants for easier reuse.",
      "Use tighter component boundaries for future scaling.",
      "Simplify icon and badge mappings into structured config.",
    ],
  },
];

export default function AIInsights() {
  return (
    <section className="h-full space-y-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-violet-300/80">AI Insights</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">High-signal recommendations</h2>
      </div>

      <div className="rounded-[30px] border border-white/10 bg-[#121b2e] p-5 shadow-[0_16px_48px_rgba(0,0,0,0.2)] sm:p-6">
        <div className="grid gap-4 lg:grid-cols-2">
          {sections.map((section) => (
            <article
              key={section.label}
              className="rounded-2xl border border-white/10 bg-[#0F172A] p-4 transition-[border-color,background-color] duration-200 hover:border-violet-400/20 hover:bg-[#101A31]"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-base font-semibold text-white">{section.label}</h3>
                <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ring-1 ${section.badgeClass}`}>
                  {section.count} items
                </span>
              </div>

              <ul className="mt-4 space-y-3">
                {section.items.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-6 text-slate-300">
                    <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-violet-300" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

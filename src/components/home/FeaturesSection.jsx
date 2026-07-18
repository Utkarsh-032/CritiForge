import { BarChart3, Brain, Code2, Globe2 } from "lucide-react";

const features = [
  {
    title: "Website Review",
    description: "Review UI, UX, accessibility and performance.",
    icon: Globe2,
    accent: "from-cyan-400/60 to-blue-500/30",
    iconStyle: "bg-cyan-400/10 text-cyan-300",
  },
  {
    title: "Code Review",
    description: "Receive best-practice recommendations and bug detection.",
    icon: Code2,
    accent: "from-violet-400/60 to-indigo-500/30",
    iconStyle: "bg-violet-400/10 text-violet-300",
  },
  {
    title: "AI Mentor",
    description: "Learn why issues matter with educational AI explanations.",
    icon: Brain,
    accent: "from-fuchsia-400/60 to-violet-500/30",
    iconStyle: "bg-fuchsia-400/10 text-fuchsia-300",
  },
  {
    title: "Engineering Reports",
    description: "Receive structured reports, scores and actionable improvements.",
    icon: BarChart3,
    accent: "from-emerald-400/60 to-cyan-500/30",
    iconStyle: "bg-emerald-400/10 text-emerald-300",
  },
];

export default function FeaturesSection() {
  return (
    <section className="relative overflow-hidden bg-[#0B1120] px-6 py-24 sm:px-8 lg:px-10 lg:py-32" aria-labelledby="features-heading">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 size-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/5 blur-3xl" />

      <div className="relative mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-300">Built for engineering teams</p>
          <h2 id="features-heading" className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Everything You Need to Ship Better Software
          </h2>
          <p className="mt-5 text-lg leading-8 text-slate-400">
            CritiForge brings website reviews, code critiques, and clear improvements into one modern workspace.
          </p>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {features.map(({ title, description, icon: Icon, accent, iconStyle }) => (
            <article key={title} className="group relative rounded-2xl bg-gradient-to-br p-px transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-violet-950/30">
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${accent} opacity-70 transition-opacity duration-300 group-hover:opacity-100`} />
              <div className="relative h-full rounded-2xl bg-slate-950/75 p-7 backdrop-blur-xl sm:p-8">
                <span className={`grid size-12 place-items-center rounded-xl ${iconStyle}`}>
                  <Icon size={23} strokeWidth={1.8} />
                </span>
                <h3 className="mt-6 text-xl font-semibold text-white">{title}</h3>
                <p className="mt-3 max-w-sm leading-7 text-slate-400">{description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

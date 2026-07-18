export default function PageHeader({ eyebrow, title, description }) {
  return (
    <header className="max-w-3xl">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-violet-300/80">{eyebrow}</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">{title}</h1>
      <p className="mt-3 text-base leading-7 text-slate-400 sm:text-lg">{description}</p>
    </header>
  );
}

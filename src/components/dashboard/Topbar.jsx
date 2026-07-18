import { Bell, Menu, Search } from "lucide-react";

export default function Topbar({ onMenuToggle, title = "Dashboard" }) {
  return (
    <header className="sticky top-0 z-30 flex min-h-[76px] items-center justify-between gap-4 border-b border-white/10 bg-[#0B1120]/85 px-5 backdrop-blur-xl sm:px-8 lg:px-10">
      <div className="flex items-center gap-3">
        <button type="button" className="grid size-10 place-items-center rounded-lg text-slate-300 transition-colors hover:bg-white/10 hover:text-white lg:hidden" aria-label="Open dashboard navigation" onClick={onMenuToggle}><Menu size={21} /></button>
        <div><p className="text-xs font-medium text-violet-300">CritiForge workspace · Review. Improve. Ship.</p><h1 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">{title}</h1></div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <label className="hidden w-56 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-slate-500 transition-colors focus-within:border-violet-400/50 md:flex">
          <Search size={17} />
          <input type="search" placeholder="Search workspace..." className="w-full bg-transparent text-sm text-slate-200 outline-none placeholder:text-slate-500" />
        </label>
        <button type="button" className="relative grid size-10 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-300 transition-colors hover:bg-white/10 hover:text-white" aria-label="Notifications"><Bell size={18} /><span className="absolute right-2 top-2 size-1.5 rounded-full bg-violet-400" /></button>
        <button type="button" className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-violet-400 to-indigo-600 text-sm font-semibold text-white shadow-lg shadow-violet-950/40" aria-label="Open profile menu">JD</button>
      </div>
    </header>
  );
}

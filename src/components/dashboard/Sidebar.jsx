import { Bot, Code2, Globe2, LayoutDashboard, Settings, Sparkles, X } from "lucide-react";
import { NavLink } from "react-router-dom";

const navigation = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "Website Review", to: "/website-review", icon: Globe2 },
  { label: "Code Review", to: "/code-review", icon: Code2 },
  { label: "AI Mentor", to: "/ai-mentor", icon: Bot },
  { label: "Settings", to: "/settings", icon: Settings },
];

export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {isOpen && <button type="button" className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm lg:hidden" aria-label="Close navigation menu" onClick={onClose} />}
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-white/10 bg-[#0B1120]/95 px-4 py-6 shadow-2xl shadow-black/30 backdrop-blur-xl transition-transform duration-300 lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between px-3">
          <NavLink to="/" className="flex items-center gap-3" aria-label="CritiForge home" onClick={onClose}>
            <span className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-cyan-400 text-white shadow-lg shadow-violet-500/20"><Sparkles size={19} /></span>
            <span className="text-xl font-semibold tracking-tight text-white">Criti<span className="text-violet-400">Forge</span></span>
          </NavLink>
          <button type="button" className="grid size-9 place-items-center rounded-lg text-slate-400 hover:bg-white/10 hover:text-white lg:hidden" aria-label="Close navigation menu" onClick={onClose}><X size={19} /></button>
        </div>

        <p className="mt-10 px-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Workspace</p>
        <nav className="mt-3 space-y-1" aria-label="Dashboard navigation">
          {navigation.map(({ label, to, icon: Icon }) => (
            <NavLink key={to} to={to} onClick={onClose} className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200 ${isActive ? "bg-violet-500/15 text-violet-200 shadow-sm shadow-violet-950/30" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}>
              <Icon size={19} strokeWidth={1.8} />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}

import { Menu, Sparkles, X } from "lucide-react";
import { useState } from "react";
import { NavLink } from "react-router-dom";

const navigation = [
  { label: "Home", to: "/", end: true },
  { label: "Dashboard", to: "/dashboard" },
  { label: "Website Review", to: "/website-review" },
  { label: "Code Review", to: "/code-review" },
  { label: "AI Mentor", to: "/ai-mentor" },
];

function navLinkClass({ isActive }) {
  return `rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
    isActive
      ? "bg-white/10 text-white"
      : "text-slate-400 hover:bg-white/5 hover:text-white"
  }`;
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0B1120]/95 backdrop-blur-xl" style={{ backgroundColor: "rgba(11, 17, 32, 0.95)" }}>
      <nav className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
        <NavLink to="/" end className="group flex items-center gap-2.5" aria-label="CritiForge home" onClick={closeMenu}>
          <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-cyan-400 text-white shadow-lg shadow-violet-500/25 transition-transform duration-200 group-hover:scale-105">
            <Sparkles size={18} strokeWidth={2.5} />
          </span>
          <span className="text-lg font-semibold tracking-tight text-white">Criti<span className="text-violet-400">Forge</span></span>
        </NavLink>

        <div className="hidden items-center gap-1 lg:flex">
          {navigation.map(({ label, to, end }) => (
            <NavLink key={to} to={to} end={end} className={navLinkClass}>
              {label}
            </NavLink>
          ))}
        </div>

        <NavLink to="/dashboard" className="hidden rounded-lg bg-gradient-to-r from-violet-500 to-indigo-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:from-violet-400 hover:to-indigo-400 hover:shadow-violet-500/35 lg:inline-flex">
          Start Reviewing
        </NavLink>

        <button type="button" className="grid size-10 place-items-center rounded-lg text-slate-300 transition-colors hover:bg-white/10 hover:text-white lg:hidden" aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"} aria-expanded={isOpen} onClick={() => setIsOpen((open) => !open)}>
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {isOpen && (
        <div className="border-t border-white/10 bg-[#0B1120]/95 px-4 py-4 backdrop-blur-xl lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            {navigation.map(({ label, to, end }) => (
              <NavLink key={to} to={to} end={end} className={navLinkClass} onClick={closeMenu}>
                {label}
              </NavLink>
            ))}
            <NavLink to="/dashboard" className="mt-3 rounded-lg bg-gradient-to-r from-violet-500 to-indigo-500 px-4 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:from-violet-400 hover:to-indigo-400" onClick={closeMenu}>
              Start Reviewing
            </NavLink>
          </div>
        </div>
      )}
    </header>
  );
}

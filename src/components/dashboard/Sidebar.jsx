import { X } from "lucide-react";
import { useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { mainNavigation, workspaceNavigation } from "../../config/navigation";
import CritiForgeLogo from "../brand/CritiForgeLogo";

function NavigationLinks({ items, onClose }) {
  return items.map(({ label, to, icon: Icon, end }) => <NavLink key={to} to={to} end={end} onClick={onClose} className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-[background-color,color] duration-200 ${isActive ? "bg-violet-500/15 text-violet-200" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}><Icon size={19} />{label}</NavLink>);
}

export default function Sidebar({ isOpen, onClose }) {
  const closeRef = useRef(null); const previousFocus = useRef(null);
  useEffect(() => {
    if (!isOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    previousFocus.current = document.activeElement;
    const escape = (event) => { if (event.key === "Escape") onClose(); };
    document.body.style.overflow = "hidden"; closeRef.current?.focus(); window.addEventListener("keydown", escape);
    return () => { document.body.style.overflow = previousOverflow; window.removeEventListener("keydown", escape); if (previousFocus.current instanceof HTMLElement && document.contains(previousFocus.current)) previousFocus.current.focus(); };
  }, [isOpen, onClose]);
  return <>{isOpen && <button type="button" className="fixed inset-0 z-40 bg-black/70 lg:hidden" aria-label="Close navigation menu" onClick={onClose} />}<aside id="application-navigation" className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-white/[0.08] bg-[#08080C] px-4 py-6 shadow-2xl shadow-black/40 transition-transform duration-200 ease-out motion-reduce:transition-none lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}><div className="flex items-center justify-between px-3"><NavLink to="/" end aria-label="Go to CritiForge home" onClick={onClose} className="group rounded-lg focus-visible:outline-none"><CritiForgeLogo className="transition-transform duration-150 group-hover:scale-[1.02]" /></NavLink><button ref={closeRef} type="button" className="grid size-9 place-items-center rounded-lg text-slate-400 hover:bg-white/10 hover:text-white lg:hidden" aria-label="Close navigation menu" onClick={onClose}><X size={19} /></button></div><p className="mt-10 px-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Main</p><nav className="mt-3 space-y-1" aria-label="Main navigation"><NavigationLinks items={mainNavigation} onClose={onClose} /></nav><p className="mt-7 px-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Workspace</p><nav className="mt-3 space-y-1" aria-label="Workspace navigation"><NavigationLinks items={workspaceNavigation} onClose={onClose} /></nav></aside></>;
}

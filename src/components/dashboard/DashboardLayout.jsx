import { useState } from "react";
import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import PageTransition from "../layout/PageTransition";

export default function DashboardLayout({ children, title = "Dashboard" }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const mainRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    document.title = `${title} | CritiForge`;
    window.scrollTo({ top: 0, behavior: "auto" });
    mainRef.current?.scrollTo({ top: 0, behavior: "auto" });
    const focusFrame = window.requestAnimationFrame(() => mainRef.current?.focus({ preventScroll: true }));
    return () => window.cancelAnimationFrame(focusFrame);
  }, [location.pathname, title]);

  return (
    <div className="min-h-screen bg-[#050507] text-white">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="lg:pl-72">
        <Topbar title={title} isMenuOpen={isSidebarOpen} onMenuToggle={() => setIsSidebarOpen((open) => !open)} />
        <main ref={mainRef} tabIndex={-1} aria-label={`${title} content`} className="mx-auto w-full max-w-7xl px-5 py-8 outline-none sm:px-8 lg:px-10 lg:py-10"><PageTransition>{children}</PageTransition></main>
      </div>
    </div>
  );
}

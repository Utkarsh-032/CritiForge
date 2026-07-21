import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import PageTransition from "./PageTransition";

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-[#050507] text-white">
      <Navbar />
      <main className="flex-1">
        <PageTransition><Outlet /></PageTransition>
      </main>
      <footer className="border-t border-white/10 bg-[#050507] py-6 text-center text-sm text-slate-400">
        © 2026 CritiForge. Review. Improve. Ship.
      </footer>
    </div>
  );
}

import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-[#0B1120] text-white">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-white/10 bg-[#0B1120] py-6 text-center text-sm text-slate-400">
        © 2026 CritiForge. Review. Improve. Ship.
      </footer>
    </div>
  );
}

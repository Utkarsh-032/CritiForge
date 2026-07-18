import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function DashboardLayout({ children, title = "Dashboard" }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#050507] text-white">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="lg:pl-72">
        <Topbar title={title} isMenuOpen={isSidebarOpen} onMenuToggle={() => setIsSidebarOpen((open) => !open)} />
        <main className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-8 lg:px-10 lg:py-10">{children}</main>
      </div>
    </div>
  );
}

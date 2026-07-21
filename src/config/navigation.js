import { Bot, Code2, Globe2, House, LayoutDashboard } from "lucide-react";

export const navigationItems = [
  { label: "Home", to: "/", icon: House, group: "main", end: true },
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard, group: "workspace", end: true },
  { label: "Website Review", to: "/website-review", icon: Globe2, group: "workspace", end: true },
  { label: "Code Review", to: "/code-review", icon: Code2, group: "workspace", end: true },
  { label: "AI Mentor", to: "/ai-mentor", icon: Bot, group: "workspace", end: true },
];

export const landingNavigation = navigationItems;
export const mainNavigation = navigationItems.filter((item) => item.group === "main");
export const workspaceNavigation = navigationItems.filter((item) => item.group === "workspace");

import { Outlet, useLocation } from "react-router-dom";
import DashboardLayout from "./DashboardLayout";

const titles = {
  "/dashboard": "Dashboard",
  "/website-review": "Website Review",
  "/code-review": "Code Review",
  "/ai-mentor": "AI Mentor",
};

export default function ApplicationLayout() {
  const location = useLocation();
  return <DashboardLayout title={titles[location.pathname] || "CritiForge"}><Outlet /></DashboardLayout>;
}

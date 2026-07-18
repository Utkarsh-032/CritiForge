import DashboardLayout from "../components/dashboard/DashboardLayout";
import AIInsights from "../components/dashboard/AIInsights";
import QuickActions from "../components/dashboard/QuickActions";
import RecentReports from "../components/dashboard/RecentReports";

export default function Dashboard() {
  return (
    <DashboardLayout title="Dashboard">
      <div className="space-y-8">
        <QuickActions />

        <div className="grid gap-8 xl:grid-cols-5">
          <div className="xl:col-span-2">
            <RecentReports />
          </div>
          <div className="xl:col-span-3">
            <AIInsights />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

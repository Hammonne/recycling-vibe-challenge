import { DashboardOverview } from "@/components/dashboard-overview";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-100 px-6 py-10 md:px-10">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <DashboardOverview />
      </main>
    </div>
  );
}

import type { ReactNode } from "react";

import { DashboardDataProvider } from "@/components/dashboard/DashboardDataContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

type DashboardRootLayoutProps = {
  children: ReactNode;
};

export default function DashboardRootLayout({
  children,
}: DashboardRootLayoutProps) {
  return (
    <DashboardDataProvider>
      <DashboardLayout>{children}</DashboardLayout>
    </DashboardDataProvider>
  );
}

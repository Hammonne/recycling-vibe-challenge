"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type RecyclingType = "variado" | "vidrio" | "carton" | "plastico";

export type ManualRecyclingRecord = {
  id: string;
  address: string;
  recyclingType: RecyclingType;
  estimatedKg: number;
  coordinates: [number, number];
  createdAt: string;
};

type WeeklyTrendPoint = {
  day: string;
  kg: number;
};

type DashboardDataContextValue = {
  manualRecords: ManualRecyclingRecord[];
  weeklyTrend: WeeklyTrendPoint[];
  addManualRecord: (
    record: Omit<ManualRecyclingRecord, "id" | "createdAt">,
  ) => { ok: boolean; reason?: string; record?: ManualRecyclingRecord };
};

const BASE_WEEKLY_TREND: WeeklyTrendPoint[] = [
  { day: "Lun", kg: 560 },
  { day: "Mar", kg: 620 },
  { day: "Mie", kg: 590 },
  { day: "Jue", kg: 700 },
  { day: "Vie", kg: 740 },
  { day: "Sab", kg: 680 },
  { day: "Dom", kg: 640 },
];

const DashboardDataContext = createContext<DashboardDataContextValue | null>(null);

export function DashboardDataProvider({ children }: { children: ReactNode }) {
  const [manualRecords, setManualRecords] = useState<ManualRecyclingRecord[]>([]);

  const addManualRecord = useCallback<
    DashboardDataContextValue["addManualRecord"]
  >((recordInput) => {
    let result:
      | { ok: true; record: ManualRecyclingRecord }
      | { ok: false; reason: string };

    setManualRecords((previous) => {
      if (previous.length >= 5) {
        result = {
          ok: false,
          reason: "Limite de 5 registros manuales alcanzado en esta sesion.",
        };
        return previous;
      }

      const nextRecord: ManualRecyclingRecord = {
        ...recordInput,
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        createdAt: new Date().toISOString(),
      };
      result = { ok: true, record: nextRecord };
      return [...previous, nextRecord];
    });

    return result!;
  }, []);

  const weeklyTrend = useMemo(() => {
    const trend = BASE_WEEKLY_TREND.map((point) => ({ ...point }));
    const recordsKg = manualRecords.reduce((sum, record) => sum + record.estimatedKg, 0);
    trend[trend.length - 1].kg += recordsKg;
    return trend;
  }, [manualRecords]);

  const contextValue = useMemo<DashboardDataContextValue>(
    () => ({
      manualRecords,
      weeklyTrend,
      addManualRecord,
    }),
    [addManualRecord, manualRecords, weeklyTrend],
  );

  return (
    <DashboardDataContext.Provider value={contextValue}>
      {children}
    </DashboardDataContext.Provider>
  );
}

export function useDashboardData() {
  const context = useContext(DashboardDataContext);
  if (!context) {
    throw new Error("useDashboardData must be used within DashboardDataProvider.");
  }
  return context;
}

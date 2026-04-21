import type { CollectionInsight, ImpactMetric } from "@/types/impact";

export const impactMetrics: ImpactMetric[] = [
  {
    label: "Kg reciclados este mes",
    value: "4,280",
    unit: "kg",
    trend: "+18% vs. mes anterior",
    trendPositive: true,
  },
  {
    label: "CO2 evitado",
    value: "7.9",
    unit: "t",
    trend: "+12% por mejor segregacion",
    trendPositive: true,
  },
  {
    label: "Trazabilidad de recolecciones",
    value: "96",
    unit: "%",
    trend: "Objetivo operativo: 98%",
    trendPositive: true,
  },
  {
    label: "Material rechazado por contaminacion",
    value: "4",
    unit: "%",
    trend: "-2 pp tras capacitacion",
    trendPositive: true,
  },
];

export const collectionInsights: CollectionInsight[] = [
  {
    title: "Edificios activos",
    value: "24",
    helper: "7 administradores con frecuencia semanal",
  },
  {
    title: "Recicladores en ruta",
    value: "11",
    helper: "Cobertura priorizada por densidad",
  },
  {
    title: "Rutas optimizadas",
    value: "39",
    helper: "16% menos kilometros recorridos",
  },
];

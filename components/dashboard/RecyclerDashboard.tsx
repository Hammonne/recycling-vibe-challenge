"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { Bike, Car, Footprints } from "lucide-react";
import { useDashboardData } from "@/components/dashboard/DashboardDataContext";

type RouteStatus = "idle" | "routing" | "completed";
type TransportMode = "walk" | "bike" | "car";

type RecyclerTask = {
  id: number;
  title: string;
  location: string;
  completed: boolean;
  coordinates: [number, number];
};

const RecyclerRouteMap = dynamic(
  () =>
    import("@/components/dashboard/RecyclerRouteMap").then((module) => ({
      default: module.RecyclerRouteMap,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="mt-4 h-[500px] w-full animate-pulse rounded-xl bg-gray-100" />
    ),
  },
);

const initialRouteTasks: RecyclerTask[] = [
  {
    id: 1,
    title: "Recolectar plastico",
    location: "Museo Pedro de Osma",
    completed: false,
    coordinates: [-12.1496, -77.0243],
  },
  {
    id: 2,
    title: "Validar pesado de carton",
    location: "Puente de los Suspiros",
    completed: false,
    coordinates: [-12.151, -77.0229],
  },
  {
    id: 3,
    title: "Recolectar vidrio",
    location: "Bajada de los Baños",
    completed: false,
    coordinates: [-12.1503, -77.0211],
  },
  {
    id: 4,
    title: "Cerrar ruta organicos",
    location: "Malecon Sousa",
    completed: true,
    coordinates: [-12.1479, -77.0233],
  },
];

export function RecyclerDashboard() {
  // Estado operativo de la jornada: idle (espera), routing (ruta activa), completed (ruta cerrada).
  const [routeStatus, setRouteStatus] = useState<RouteStatus>("idle");
  const [isNavigating, setIsNavigating] = useState(false);
  const [transportMode, setTransportMode] = useState<TransportMode>("walk");
  const [tasks, setTasks] = useState<RecyclerTask[]>(initialRouteTasks);
  const [simulatedKg, setSimulatedKg] = useState(0);
  const { manualRecords } = useDashboardData();

  const pendingTasks = tasks.filter((task) => !task.completed);
  const completedTasks = tasks.filter((task) => task.completed);

  const activePins = useMemo(() => {
    return tasks.filter((task) => !task.completed).slice(0, 2);
  }, [tasks]);

  const firstActivePinId = routeStatus === "routing" ? activePins[0]?.id : undefined;

  const startNavigation = () => {
    if (routeStatus === "idle") {
      setRouteStatus("routing");
      setIsNavigating(true);
    }
  };

  const stopNavigation = () => {
    setIsNavigating(false);
  };

  const completeTask = (taskId: number) => {
    setTasks((previousTasks) =>
      previousTasks.map((task) =>
        task.id === taskId ? { ...task, completed: true } : task,
      ),
    );
    setSimulatedKg((previousKg) => previousKg + 120);
  };

  const allTasksCompleted = pendingTasks.length === 0;

  useEffect(() => {
    if (allTasksCompleted && routeStatus !== "completed") {
      // Cuando no hay pendientes, cerramos automaticamente el flujo de ruta.
      setRouteStatus("completed");
      setIsNavigating(false);
    }
  }, [allTasksCompleted, routeStatus]);

  const etaByTransport: Record<TransportMode, string> = {
    walk: "8 min",
    bike: "5 min",
    car: "4 min",
  };

  return (
    <section className="flex flex-col gap-5">
      <header className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-600">
          Panel de campo
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">
          Vista Reciclador
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Flujo operativo: recibir ruta, iniciar recorrido y completar tareas.
        </p>
      </header>

      <div className="grid gap-3">
        {!isNavigating && (
          <div className="grid grid-cols-3 gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
            <button
              type="button"
              onClick={() => setTransportMode("walk")}
              className={`flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition ${
                transportMode === "walk"
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              <Footprints className="h-4 w-4" />
              Caminando
            </button>
            <button
              type="button"
              onClick={() => setTransportMode("bike")}
              className={`flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition ${
                transportMode === "bike"
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              <Bike className="h-4 w-4" />
              Bicicleta
            </button>
            <button
              type="button"
              onClick={() => setTransportMode("car")}
              className={`flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition ${
                transportMode === "car"
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              <Car className="h-4 w-4" />
              Carro
            </button>
          </div>
        )}

        <button
          type="button"
          onClick={startNavigation}
          disabled={routeStatus !== "idle"}
          className="w-full rounded-2xl bg-emerald-600 px-5 py-4 text-left text-base font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {routeStatus === "idle" && "Comenzar Ruta"}
          {routeStatus === "routing" && "Ruta en curso"}
          {routeStatus === "completed" && "Ruta completada"}
          <span className="mt-1 block text-sm font-medium text-emerald-100">
            {routeStatus === "idle" &&
              "Activa geolocalizacion y secuencia de recoleccion"}
            {routeStatus === "routing" &&
              "Prioriza el primer punto resaltado en el mapa"}
            {routeStatus === "completed" && "Todas las tareas fueron cerradas"}
          </span>
        </button>

        <button
          type="button"
          className="w-full rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-left text-base font-semibold text-rose-700 transition hover:bg-rose-100"
        >
          Reportar Incidencia
          <span className="mt-1 block text-sm font-medium text-rose-600">
            Contenedor bloqueado, contaminacion o acceso restringido
          </span>
        </button>
      </div>

      <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-semibold uppercase tracking-[0.08em] text-slate-500">
          Mapa de ruta (simulado) - Barranco, Lima
        </h3>
        <RecyclerRouteMap
          tasks={tasks}
          manualRecords={manualRecords}
          routeStatus={routeStatus}
          transportMode={transportMode}
          isNavigating={isNavigating}
          firstActivePinId={firstActivePinId}
          etaLabel={etaByTransport[transportMode]}
          distanceLabel="1.2 km"
          onStopNavigation={stopNavigation}
        />
      </article>

      {!isNavigating && (
        <div className="grid gap-4 md:grid-cols-2">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold uppercase tracking-[0.08em] text-slate-500">
            Tareas pendientes
          </h3>
          <ul className="mt-3 flex flex-col gap-2">
            {pendingTasks.map((task) => (
              <li
                key={task.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-amber-100 bg-amber-50 px-3 py-2"
              >
                <span className="text-sm font-medium text-slate-700">
                  {task.title} - {task.location}
                </span>
                <button
                  type="button"
                  onClick={() => completeTask(task.id)}
                  className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-700"
                >
                  Completar
                </button>
              </li>
            ))}
          </ul>
          {pendingTasks.length === 0 && (
            <p className="mt-3 text-sm font-medium text-emerald-700">
              No hay tareas pendientes.
            </p>
          )}
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold uppercase tracking-[0.08em] text-slate-500">
            Tareas completadas
          </h3>
          <ul className="mt-3 flex flex-col gap-2">
            {completedTasks.map((task) => (
              <li
                key={task.id}
                className="rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700"
              >
                {task.title} - {task.location}
              </li>
            ))}
          </ul>
          <p className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            Impacto simulado: +{simulatedKg} kg reciclados para la vista ejecutiva.
          </p>
        </article>
      </div>
      )}
    </section>
  );
}

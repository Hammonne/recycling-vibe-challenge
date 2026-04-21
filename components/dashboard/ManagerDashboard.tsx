"use client";

import { useMemo, useState } from "react";
import { MapPin, Plus, X } from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  type RecyclingType,
  useDashboardData,
} from "@/components/dashboard/DashboardDataContext";

const managerKpis = [
  { label: "Total reciclado semanal", value: "4,530 kg", accent: "text-emerald-600" },
  { label: "Contenedores al 90%+", value: "12 alertas", accent: "text-rose-600" },
  { label: "Rutas activas", value: "9 en curso", accent: "text-slate-700" },
];

const fillAlerts = [
  "Torre Azul - Plastico (95%)",
  "Parque Central - Vidrio (93%)",
  "Condominio Norte - Mixtos (98%)",
];

const LIMA_ADDRESS_SUGGESTIONS: Array<{
  label: string;
  coordinates: [number, number];
}> = [
  { label: "Av. Pedro de Osma 201, Barranco", coordinates: [-12.1495, -77.0241] },
  { label: "Jr. Cajamarca 404, Barranco", coordinates: [-12.1477, -77.0219] },
  { label: "Parque Kennedy, Miraflores", coordinates: [-12.1217, -77.0297] },
  { label: "Larcomar, Miraflores", coordinates: [-12.1311, -77.0303] },
  { label: "Av. La Marina 2000, San Miguel", coordinates: [-12.0762, -77.0822] },
];

function estimateKgFromQuantity(value: string) {
  const normalized = value.toLowerCase().trim();
  const amount = Number(normalized.match(/(\d+([.,]\d+)?)/)?.[0]?.replace(",", ".") ?? 0);
  if (!amount || Number.isNaN(amount)) return 0;
  if (normalized.includes("kg")) return amount;
  if (normalized.includes("saco")) return amount * 8;
  if (normalized.includes("bolsa")) return amount * 2.5;
  if (normalized.includes("caja")) return amount * 4;
  return amount * 3;
}

export function ManagerDashboard() {
  const { addManualRecord, manualRecords, weeklyTrend } = useDashboardData();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [address, setAddress] = useState("");
  const [quantityInput, setQuantityInput] = useState("");
  const [selectedType, setSelectedType] = useState<RecyclingType>("variado");
  const [selectedCoordinates, setSelectedCoordinates] = useState<[number, number] | null>(
    null,
  );
  const [toast, setToast] = useState<string | null>(null);

  const filteredSuggestions = useMemo(() => {
    const term = address.toLowerCase().trim();
    if (!term) return LIMA_ADDRESS_SUGGESTIONS;
    return LIMA_ADDRESS_SUGGESTIONS.filter((item) =>
      item.label.toLowerCase().includes(term),
    );
  }, [address]);

  const totalWeeklyKg = weeklyTrend.reduce((sum, point) => sum + point.kg, 0);
  const managerKpis = [
    {
      label: "Total reciclado semanal",
      value: `${Math.round(totalWeeklyKg).toLocaleString()} kg`,
      accent: "text-emerald-600",
    },
    { label: "Contenedores al 90%+", value: "12 alertas", accent: "text-rose-600" },
    { label: "Rutas activas", value: "9 en curso", accent: "text-slate-700" },
  ];

  const useCurrentLocation = () => {
    if (typeof window === "undefined" || !navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = Number(position.coords.latitude.toFixed(5));
        const lng = Number(position.coords.longitude.toFixed(5));
        setAddress(`Ubicacion actual (${lat}, ${lng})`);
        setSelectedCoordinates([position.coords.latitude, position.coords.longitude]);
      },
      () => {
        setAddress("Barranco, Lima (sin permiso de geolocalizacion)");
        setSelectedCoordinates([-12.1492, -77.0211]);
      },
    );
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const estimatedKg = estimateKgFromQuantity(quantityInput);
    if (!address || !selectedCoordinates || estimatedKg <= 0) {
      setToast("Completa direccion, cantidad valida y coordenadas.");
      return;
    }

    const result = addManualRecord({
      address,
      coordinates: selectedCoordinates,
      recyclingType: selectedType,
      estimatedKg,
    });

    if (!result.ok) {
      setToast(result.reason ?? "No se pudo registrar el punto.");
      return;
    }

    setToast(`Punto registrado en ${address} con ${estimatedKg.toFixed(1)} kg`);
    setAddress("");
    setQuantityInput("");
    setSelectedType("variado");
    setSelectedCoordinates(null);
    setIsDrawerOpen(false);
    setTimeout(() => setToast(null), 2800);
  };

  return (
    <section className="flex flex-col gap-6">
      <header className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-600">
          Operaciones
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">
          Vista Encargado
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Monitorea KPIs semanales, estado de contenedores y tendencia de
          recoleccion.
        </p>
        <button
          type="button"
          onClick={() => setIsDrawerOpen(true)}
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
        >
          <Plus className="h-4 w-4" />
          Registrar Nueva Recarga
        </button>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        {managerKpis.map((kpi) => (
          <article
            key={kpi.label}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <p className="text-sm text-slate-500">{kpi.label}</p>
            <p className={`mt-2 text-2xl font-semibold ${kpi.accent}`}>
              {kpi.value}
            </p>
          </article>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold uppercase tracking-[0.08em] text-slate-500">
            Tendencia de reciclaje (kg/dia)
          </h3>
          <div className="mt-4 h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="day" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="kg"
                  stroke="#059669"
                  strokeWidth={3}
                  dot={{ fill: "#047857", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold uppercase tracking-[0.08em] text-slate-500">
            Alertas contenedores llenos
          </h3>
          <ul className="mt-4 flex flex-col gap-2">
            {fillAlerts.map((alert) => (
              <li
                key={alert}
                className="rounded-xl border border-rose-100 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700"
              >
                {alert}
              </li>
            ))}
          </ul>
        </article>
      </div>

      {isDrawerOpen && (
        <div className="fixed inset-0 z-40 bg-slate-900/35 backdrop-blur-[2px]">
          <aside className="absolute right-0 top-0 h-full w-full max-w-md overflow-y-auto border-l border-slate-200 bg-white p-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">
                Registro de Recoleccion
              </h3>
              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="rounded-full p-1 text-slate-500 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form className="mt-5 flex flex-col gap-4" onSubmit={handleSubmit}>
              <label className="text-sm font-medium text-slate-700">
                Ubicacion
                <div className="mt-2 flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2">
                  <MapPin className="h-4 w-4 text-slate-400" />
                  <input
                    className="w-full text-sm outline-none"
                    placeholder="Ingresa direccion en Lima"
                    value={address}
                    onChange={(event) => {
                      setAddress(event.target.value);
                      setSelectedCoordinates(null);
                    }}
                  />
                </div>
              </label>

              <button
                type="button"
                onClick={useCurrentLocation}
                className="w-fit rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Usar ubicacion actual
              </button>

              {filteredSuggestions.length > 0 && (
                <ul className="rounded-xl border border-slate-200 bg-slate-50 p-2">
                  {filteredSuggestions.slice(0, 4).map((suggestion) => (
                    <li key={suggestion.label}>
                      <button
                        type="button"
                        onClick={() => {
                          setAddress(suggestion.label);
                          setSelectedCoordinates(suggestion.coordinates);
                        }}
                        className="w-full rounded-lg px-2 py-1.5 text-left text-sm text-slate-700 hover:bg-white"
                      >
                        {suggestion.label}
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              <label className="text-sm font-medium text-slate-700">
                Tipo de Reciclaje
                <select
                  className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                  value={selectedType}
                  onChange={(event) => setSelectedType(event.target.value as RecyclingType)}
                >
                  <option value="variado">♻️ Variado</option>
                  <option value="vidrio">🍾 Vidrio</option>
                  <option value="carton">📦 Carton</option>
                  <option value="plastico">🥤 Plastico</option>
                </select>
              </label>

              <label className="text-sm font-medium text-slate-700">
                Cantidad (ej: 3 sacos, 4 kg, 2 bolsas)
                <input
                  className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                  value={quantityInput}
                  onChange={(event) => setQuantityInput(event.target.value)}
                  placeholder="Ej: 3 sacos"
                />
                <p className="mt-1 text-xs text-slate-500">
                  Estimado: {estimateKgFromQuantity(quantityInput).toFixed(1)} kg
                </p>
              </label>

              <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
                Registros manuales en sesion: {manualRecords.length}/5
              </p>

              <button
                type="submit"
                className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                Guardar registro
              </button>
            </form>
          </aside>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-4 right-4 z-50 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-lg">
          {toast}
        </div>
      )}
    </section>
  );
}

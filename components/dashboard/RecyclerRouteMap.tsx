"use client";

import { useEffect, useMemo, useState } from "react";
import { LocateFixed, MoveUp } from "lucide-react";
import type { ManualRecyclingRecord } from "@/components/dashboard/DashboardDataContext";

type RouteStatus = "idle" | "routing" | "completed";
type TransportMode = "walk" | "bike" | "car";

type TaskPoint = {
  id: number;
  location: string;
  completed: boolean;
  coordinates: [number, number];
};

type NearbyPoint = {
  id: number;
  name: string;
  coordinates: [number, number];
};

type MarkerState = "active-pending" | "inactive" | "completed";

type RecyclerRouteMapProps = {
  tasks: TaskPoint[];
  manualRecords: ManualRecyclingRecord[];
  routeStatus: RouteStatus;
  transportMode: TransportMode;
  isNavigating: boolean;
  firstActivePinId?: number;
  etaLabel: string;
  distanceLabel: string;
  onStopNavigation: () => void;
};

const barrancoCenter: [number, number] = [-12.1492, -77.0211];
const EARTH_RADIUS_KM = 6371;
const MAX_ACTIVE_ROUTE_POINTS = 5;

function toRadians(value: number) {
  return (value * Math.PI) / 180;
}

function haversineDistanceKm(a: [number, number], b: [number, number]) {
  const [lat1, lon1] = a;
  const [lat2, lon2] = b;
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const lat1Rad = toRadians(lat1);
  const lat2Rad = toRadians(lat2);

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(dLon / 2) ** 2;

  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h));
}

function isValidLimaLandCoordinate(point: [number, number]) {
  const [lat, lng] = point;
  return lat >= -12.3 && lat <= -12.0 && lng >= -77.2 && lng <= -76.9;
}

function calculateOptimizedRoute(
  start: [number, number],
  points: NearbyPoint[],
): NearbyPoint[] {
  const remaining = [...points];
  const sorted: NearbyPoint[] = [];
  let current = start;

  while (remaining.length > 0) {
    let nearestIndex = 0;
    let nearestDistance = haversineDistanceKm(
      current,
      remaining[0].coordinates,
    );

    for (let index = 1; index < remaining.length; index += 1) {
      const distance = haversineDistanceKm(
        current,
        remaining[index].coordinates,
      );
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = index;
      }
    }

    const [nearestPoint] = remaining.splice(nearestIndex, 1);
    sorted.push(nearestPoint);
    current = nearestPoint.coordinates;
  }

  return sorted;
}

export function RecyclerRouteMap({
  tasks,
  manualRecords,
  routeStatus,
  transportMode,
  isNavigating,
  firstActivePinId,
  etaLabel,
  distanceLabel,
  onStopNavigation,
}: RecyclerRouteMapProps) {
  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null,
  );
  const [recenterTick, setRecenterTick] = useState(0);
  const [leafletApi, setLeafletApi] = useState<{
    MapContainer: (typeof import("react-leaflet"))["MapContainer"];
    Marker: (typeof import("react-leaflet"))["Marker"];
    Polyline: (typeof import("react-leaflet"))["Polyline"];
    TileLayer: (typeof import("react-leaflet"))["TileLayer"];
    Tooltip: (typeof import("react-leaflet"))["Tooltip"];
    useMap: (typeof import("react-leaflet"))["useMap"];
    L: typeof import("leaflet");
  } | null>(null);
  const navigationTarget = tasks.find(
    (task) => task.id === firstActivePinId,
  )?.coordinates;

  useEffect(() => {
    // Esto asegura que toda la inicializacion del mapa ocurra solo en browser.
    if (typeof window !== "undefined") {
      setLeafletLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!leafletLoaded) return;

    let isMounted = true;

    void Promise.all([import("leaflet"), import("react-leaflet")])
      .then(([L, reactLeaflet]) => {
        if (!isMounted) return;
        setLeafletApi({
          L,
          MapContainer: reactLeaflet.MapContainer,
          Marker: reactLeaflet.Marker,
          Polyline: reactLeaflet.Polyline,
          TileLayer: reactLeaflet.TileLayer,
          Tooltip: reactLeaflet.Tooltip,
          useMap: reactLeaflet.useMap,
        });
      })
      .catch(() => {
        if (!isMounted) return;
        setLeafletApi(null);
      });

    return () => {
      isMounted = false;
    };
  }, [leafletLoaded]);

  useEffect(() => {
    if (
      !leafletLoaded ||
      typeof window === "undefined" ||
      !navigator.geolocation
    ) {
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation([position.coords.latitude, position.coords.longitude]);
      },
      () => {
        // Fallback robusto: si deniega permisos mantenemos centro de Barranco (UTEC).
        setUserLocation(barrancoCenter);
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 60000,
      },
    );
  }, [leafletLoaded]);

  const markerIconFactory = useMemo(() => {
    if (!leafletApi?.L || typeof window === "undefined") {
      return null;
    }

    return (markerState: MarkerState, activePulse: boolean) => {
      if (!leafletApi.L.divIcon) {
        return leafletApi.L.icon({
          iconUrl:
            "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='26' height='40' viewBox='0 0 26 40'><path fill='%23059669' d='M13 0C6 0 0.7 5.3 0.7 12.3c0 8.6 10 21.9 11.6 24a1 1 0 0 0 1.6 0c1.6-2.1 11.6-15.4 11.6-24C25.3 5.3 20 0 13 0z'/></svg>",
          iconSize: [26, 40],
          iconAnchor: [13, 38],
        });
      }

      const pulse = activePulse
        ? '<span class="adoptai-marker-pulse" aria-hidden="true"></span>'
        : "";
      const palette: Record<MarkerState, string> = {
        "active-pending": "#059669",
        inactive: "#9ca3af",
        completed: "#9ca3af",
      };
      const colorHex = palette[markerState];

      return leafletApi.L.divIcon({
        className: "adoptai-marker-root",
        iconSize: [28, 36],
        iconAnchor: [14, 34],
        html: `
          <div class="adoptai-marker-shell">
            ${pulse}
            <span class="adoptai-marker-dot" style="background:${colorHex};"></span>
            <span class="adoptai-marker-tip" style="background:${colorHex};"></span>
          </div>
        `,
      });
    };
  }, [leafletApi]);

  const userLocationIcon = useMemo(() => {
    if (!leafletApi?.L || typeof window === "undefined") {
      return null;
    }

    return leafletApi.L.divIcon({
      className: "adoptai-user-location-root",
      iconSize: [18, 18],
      iconAnchor: [9, 9],
      html: `
        <span style="display:block;width:18px;height:18px;border-radius:999px;background:#2563eb;border:3px solid #ffffff;box-shadow:0 2px 10px rgba(15,23,42,0.35);"></span>
      `,
    });
  }, [leafletApi]);

  const manualRecordIcon = useMemo(() => {
    if (!leafletApi?.L || typeof window === "undefined") return null;
    return leafletApi.L.divIcon({
      className: "adoptai-manual-location-root",
      iconSize: [20, 20],
      iconAnchor: [10, 10],
      html: `<span style="display:block;width:20px;height:20px;border-radius:999px;background:#f59e0b;border:3px solid #ffffff;box-shadow:0 3px 10px rgba(15,23,42,0.3);"></span>`,
    });
  }, [leafletApi]);

  const activePoints = useMemo(() => {
    const baseLocation = userLocation ?? barrancoCenter;
    const pendingTaskPoints: NearbyPoint[] = tasks
      .filter((task) => !task.completed)
      .map((task) => ({
        id: task.id,
        name: `${task.location} - Punto #${task.id}`,
        coordinates: task.coordinates,
      }))
      .filter((point) => isValidLimaLandCoordinate(point.coordinates));

    const sortedByDistance = [...pendingTaskPoints].sort(
      (a, b) =>
        haversineDistanceKm(baseLocation, a.coordinates) -
        haversineDistanceKm(baseLocation, b.coordinates),
    );
    const closestPoints = sortedByDistance.slice(0, MAX_ACTIVE_ROUTE_POINTS);
    return calculateOptimizedRoute(baseLocation, closestPoints);
  }, [tasks, userLocation]);

  const routePath = useMemo(() => {
    const baseLocation = userLocation ?? barrancoCenter;
    return [baseLocation, ...activePoints.map((point) => point.coordinates)];
  }, [activePoints, userLocation]);

  const requestCurrentLocation = () => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      setUserLocation(barrancoCenter);
      setRecenterTick((previous) => previous + 1);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation([position.coords.latitude, position.coords.longitude]);
        setRecenterTick((previous) => previous + 1);
      },
      () => {
        setUserLocation(barrancoCenter);
        setRecenterTick((previous) => previous + 1);
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 10000,
      },
    );
  };

  if (
    !leafletLoaded ||
    !leafletApi ||
    !markerIconFactory ||
    !userLocationIcon ||
    !manualRecordIcon
  ) {
    return (
      <div className="h-[500px] w-full animate-pulse rounded-xl bg-slate-100" />
    );
  }

  const { MapContainer, Marker, Polyline, TileLayer, Tooltip, useMap } =
    leafletApi;

  const MapUpdater = ({
    currentLocation,
    destination,
    navigationEnabled,
    recenterVersion,
    activeRoute,
  }: {
    currentLocation: [number, number] | null;
    destination?: [number, number];
    navigationEnabled: boolean;
    recenterVersion: number;
    activeRoute: [number, number][];
  }) => {
    const map = useMap();

    useEffect(() => {
      if (currentLocation) {
        map.flyTo(currentLocation, 16, { animate: true, duration: 1.2 });
      }
    }, [map, currentLocation]);

    useEffect(() => {
      if (navigationEnabled && destination) {
        map.flyTo(destination, 17, { animate: true, duration: 1.4 });
      }
    }, [map, navigationEnabled, destination]);

    useEffect(() => {
      if (currentLocation && recenterVersion > 0) {
        map.flyTo(currentLocation, 16, { animate: true, duration: 0.9 });
      }
    }, [map, currentLocation, recenterVersion]);

    useEffect(() => {
      if (activeRoute.length >= 2) {
        map.fitBounds(activeRoute, {
          padding: [40, 40],
          animate: true,
          duration: 1.1,
        });
      }
    }, [map, activeRoute]);

    return null;
  };

  return (
    <div className="relative mt-4 h-[500px] overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
      <MapContainer
        center={userLocation ?? barrancoCenter}
        zoom={16}
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        <MapUpdater
          currentLocation={userLocation}
          destination={navigationTarget}
          navigationEnabled={isNavigating}
          recenterVersion={recenterTick}
          activeRoute={routePath}
        />

        <Polyline
          positions={routePath}
          pathOptions={{
            color: "#0ea5e9",
            weight: 8,
            opacity: 0.72,
            lineCap: "round",
            lineJoin: "round",
          }}
        />

        {activePoints.map((point, index) => {
          const isNextStop = index === 0;
          const distanceLabel = haversineDistanceKm(
            userLocation ?? barrancoCenter,
            point.coordinates,
          ).toFixed(2);
          const markerIcon = markerIconFactory(
            "active-pending",
            isNextStop && routeStatus === "routing",
          );

          return (
            <Marker
              key={`nearby-${point.id}`}
              position={point.coordinates}
              icon={markerIcon}
            >
              <Tooltip direction="top" offset={[0, -24]} opacity={0.95}>
                {isNextStop
                  ? `Siguiente Parada: ${point.name} (${distanceLabel} km)`
                  : `${point.name} (${distanceLabel} km)`}
              </Tooltip>
            </Marker>
          );
        })}

        {userLocation && (
          <Marker position={userLocation} icon={userLocationIcon}>
            <Tooltip direction="top" offset={[0, -12]} opacity={0.95}>
              Tu estas aqui
            </Tooltip>
          </Marker>
        )}

        {manualRecords.map((record) => (
          <Marker
            key={record.id}
            position={record.coordinates}
            icon={manualRecordIcon}
          >
            <Tooltip direction="top" offset={[0, -12]} opacity={0.95}>
              {`Registro manual: ${record.address} (${record.estimatedKg.toFixed(1)} kg)`}
            </Tooltip>
          </Marker>
        ))}
      </MapContainer>

      <button
        type="button"
        onClick={requestCurrentLocation}
        className="absolute right-3 top-3 z-[500] rounded-full border border-white/60 bg-white/85 p-2 text-slate-700 shadow-md backdrop-blur-sm transition hover:bg-white"
        aria-label="Recentrar en mi ubicacion"
      >
        <LocateFixed className="h-4 w-4" />
      </button>

      {isNavigating && (
        <>
          <div className="pointer-events-none absolute left-3 right-3 top-3 rounded-2xl border border-cyan-200/40 bg-cyan-950/78 px-4 py-3 text-white shadow-lg backdrop-blur-md md:right-auto md:min-w-[420px]">
            <p className="flex items-center gap-2 text-base font-semibold">
              <MoveUp className="h-5 w-5" />
              En 200m gira a la derecha por Av. Pedro de Osma
            </p>
            <p className="mt-1 text-sm text-cyan-100">
              Destino: Museo Pedro de Osma
            </p>
          </div>

          <div className="absolute bottom-3 left-3 right-3 rounded-2xl border border-white/45 bg-white/70 px-4 py-3 shadow-lg backdrop-blur-md">
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm text-slate-700">
                <span className="font-semibold text-slate-900">
                  ETA: {etaLabel}
                </span>
                <span className="ml-3">Distancia: {distanceLabel}</span>
              </div>
              <button
                type="button"
                onClick={onStopNavigation}
                className="rounded-lg bg-rose-600 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-rose-700"
              >
                Finalizar
              </button>
            </div>
          </div>
        </>
      )}

      {!isNavigating && (
        <div className="pointer-events-none absolute left-3 top-3 rounded-xl border border-white/40 bg-white/55 px-3 py-2 backdrop-blur-md">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-800">
            Ruta Activa: Barranco - Sector 4
          </p>
          <p className="mt-1 text-[11px] font-medium text-slate-600">
            Mostrando hasta {MAX_ACTIVE_ROUTE_POINTS} tareas pendientes cercanas
          </p>
        </div>
      )}
    </div>
  );
}

import { collectionInsights, impactMetrics } from "@/lib/metrics";

export function ExecutiveDashboard() {
  return (
    <section className="flex flex-col gap-8">
      <header className="rounded-3xl border border-emerald-200/40 bg-gradient-to-br from-emerald-950 via-slate-950 to-slate-900 p-8 text-white shadow-2xl">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-emerald-300">
          Plataforma de reciclaje inteligente
        </p>
        <h2 className="mt-4 max-w-3xl text-3xl font-semibold leading-tight md:text-5xl">
          Conectamos edificios residenciales con recicladores para escalar
          eficiencia logistica y trazabilidad urbana.
        </h2>
        <p className="mt-4 max-w-3xl text-sm text-slate-200 md:text-base">
          Vista ejecutiva para operaciones B2B con foco en impacto ESG,
          cumplimiento y calidad de material recuperado.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {impactMetrics.map((metric) => (
          <article
            key={metric.label}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <p className="text-sm text-slate-500">{metric.label}</p>
            <p className="mt-3 text-3xl font-semibold text-slate-900">
              {metric.value}
              <span className="ml-1 text-base font-medium text-slate-500">
                {metric.unit}
              </span>
            </p>
            <p
              className={`mt-3 text-sm ${
                metric.trendPositive ? "text-emerald-600" : "text-rose-600"
              }`}
            >
              {metric.trend}
            </p>
          </article>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {collectionInsights.map((insight) => (
          <article
            key={insight.title}
            className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
          >
            <p className="text-sm font-medium text-slate-500">{insight.title}</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">
              {insight.value}
            </p>
            <p className="mt-2 text-sm text-slate-600">{insight.helper}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

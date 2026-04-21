# AdoptAI Challenge: Smart Recycling Platform

## Problema de negocio

La recoleccion urbana en edificios residenciales sigue siendo fragmentada:

- Los administradores no tienen visibilidad de cumplimiento por edificio.
- Los recicladores operan con rutas suboptimas y poca predictibilidad.
- La calidad del material recuperado se degrada por contaminacion en origen.

Esto genera costos logisticos altos, baja trazabilidad y reportes ESG poco confiables para actores B2B (administraciones, operadores de residuos, inmobiliarias y aliados corporativos).

## Propuesta de valor

Construir una plataforma digital que conecte administradores de edificios con recicladores mediante:

- **Orquestacion de recolecciones** con ventanas y frecuencia por edificio.
- **Rutas optimizadas** para reducir kilometraje, costo operativo y emisiones.
- **Trazabilidad punta a punta** para auditar retiros, volumen y calidad de material.
- **Tablero de impacto ESG** con metricas accionables para decisiones comerciales.

## Entregables del reto

Este repositorio inicial incluye:

1. Boilerplate en Next.js 15 (App Router), TypeScript y Tailwind CSS.
2. Estructura de carpetas para escalabilidad: `components`, `lib`, `types`.
3. Dashboard base en `app/page.tsx` con metricas simuladas:
   - Kg reciclados.
   - CO2 evitado.
   - Indicadores operativos de trazabilidad y calidad.
4. Bitacora de decisiones y prompts en `JOURNEY.md` para evidenciar AI Usage y razonamiento tecnico.

## Stack tecnico

- Next.js (App Router)
- TypeScript
- Tailwind CSS

## Como correr el proyecto

```bash
npm install
npm run dev
```

Luego abre `http://localhost:3000`.

## Enfoque esperado en siguientes iteraciones

- Integracion de simulador de rutas (heuristicas + restricciones por edificio).
- Modelo de datos para eventos de recoleccion y score de calidad de material.
- Flujos B2B: onboarding de edificios, asignacion de recicladores y reporte ESG exportable.

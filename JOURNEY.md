# JOURNEY LOG - AdoptAI Technical Challenge

Este documento registra prompts, decisiones, iteraciones y dead ends del proceso.
El objetivo es demostrar criterio de producto, razonamiento tecnico y uso de IA.

---

## 2026-04-21 - Bootstrap inicial

### Prompt objetivo

"Generar boilerplate inicial con Next.js 15 (App Router), Tailwind y TypeScript; incluir narrativa de negocio, bitacora y dashboard de impacto."

### Decisiones tecnicas tomadas

- Se usa `create-next-app` con App Router y TypeScript para acelerar base productiva.
- Se define estructura modular desde el dia cero:
  - `components`: UI reutilizable.
  - `lib`: datos simulados, utilidades y logica transversal.
  - `types`: contratos de datos para mantener consistencia.
- Se implementa dashboard inicial con foco ejecutivo (B2B + ESG), no solo visual.

### Razonamiento de negocio

- El MVP debe comunicar valor rapidamente a stakeholders no tecnicos:
  - Eficiencia logistica (rutas, kilometros, capacidad operativa).
  - Calidad de material recuperado (menos contaminacion).
  - Impacto ESG medible (CO2 evitado y trazabilidad auditable).

### Dead ends / riesgos detectados

- La maquina local corre Node 18 y Next.js 15+ recomienda Node 20.9+.
- El scaffold se genera, pero ejecutar y validar build puede fallar hasta actualizar Node.
- Mitigacion: actualizar runtime antes de pruebas CI/CD y demo final.

### Proximos pasos sugeridos

1. Subir Node a version compatible.
2. Definir modelo de dominio (`Building`, `Pickup`, `Recycler`, `Route`, `MaterialBatch`).
3. Conectar datos mock a una capa API local.
4. Agregar grafica temporal de impacto y estado de rutas.

---

## 📅 2026-04-21 - Ajuste de Políticas de Ejecución (Windows PowerShell)

### ❌ El Problema

Al intentar levantar el servidor de desarrollo (`npm run dev`), el sistema bloqueó la ejecución de scripts (`UnauthorizedAccess`).

### 🛠️ Decisión

Se ajustó la política de ejecución de scripts de PowerShell (`Set-ExecutionPolicy RemoteSigned -Scope CurrentUser`).

### ✅ Resultado

El entorno está plenamente operativo. El comando `npm run dev` ahora se ejecuta sin restricciones de seguridad del sistema operativo.

### 🧠 Aprendizaje

## Como Vibe Engineer, entiendo que el entorno local a menudo requiere configurar permisos de seguridad del SO. Documentar este paso es crítico para que cualquier otro desarrollador que clone este repo pueda levantar el proyecto sin los mismos bloqueos.

## Template para futuras entradas

### Fecha

- yyyy-mm-dd

### Prompt

- ...

### Decision

- ...

### Resultado

- ...

### Dead end

- ...

### Aprendizaje

- ...

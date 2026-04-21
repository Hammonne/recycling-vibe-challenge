# JOURNEY LOG - AdoptAI Technical Challenge

Este documento registra el proceso iterativo, las decisiones técnicas, los desafíos resueltos y el razonamiento de negocio detrás del desarrollo de **AdoptAI**.

---

## 📅 2026-04-21 - Bootstrap y Resiliencia Técnica

### 🚀 Acción inicial

- Inicialización del proyecto con **Next.js 15 (App Router)**, Tailwind CSS y TypeScript.
- Configuración de estructura modular: `/components`, `/lib`, `/types`.

### ❌ El Problema: Windows vs. Node.js

Errores críticos de instalación con `@tailwindcss/oxide` y binarios nativos. Conflictos de "File Locking" impedían la gestión de dependencias.

### 🛠️ Decisión Técnica

- Migración de PowerShell a **CMD como Administrador** para forzar la limpieza de `node_modules`.
- Implementación de una estrategia de limpieza agresiva y gestión de procesos huérfanos del SO para permitir la compilación.
- **Aprendizaje:** Un ingeniero debe dominar su entorno de trabajo antes de escribir la primera línea de lógica.

---

## 📅 2026-04-21 - Evolución de Producto: Enfoque Multi-Persona

### 🧠 Criterio de Negocio

Se decidió evolucionar de una "Landing Page" estática a una **Plataforma B2B Operativa** dividida en tres roles clave para la cadena de reciclaje:

1. **Ejecutivo:** Dashboard de impacto ESG y cumplimiento.
2. **Encargado:** Gestión de activos, alertas de contenedores y registro de campo.
3. **Reciclador:** UX móvil orientada a la navegación y eficiencia en ruta.

---

## 📅 2026-04-21 - Implementación de Mapas y Desafíos SSR

### ❌ El Problema: Hydration Errors

Leaflet.js requiere acceso al objeto `window`, el cual no existe durante el renderizado del lado del servidor (SSR) de Next.js, causando el error `window is not defined`.

### 🛠️ Decisión Técnica

- Uso de **Dynamic Imports** (`next/dynamic`) con la opción `{ ssr: false }`.
- Implementación de un "Loading State" con esqueletos de CSS para mejorar la percepción de carga mientras el mapa se inicializa en el cliente.

---

## 📅 2026-04-21 - Optimización de Rutas y Data Science

### ❌ El Problema: Caos Geoespacial

La generación aleatoria inicial ubicaba puntos en el océano y creaba rutas ineficientes (líneas cruzadas) que no servían para una operación real.

### 🛠️ Solución Algorítmica

- **Geofencing Manual:** Se estableció una lista maestra de coordenadas reales en **Barranco, Miraflores, San Miguel y Chorrillos**, asegurando que los puntos siempre caigan en tierra firme.
- **Algoritmo de Vecino más Cercano (Greedy TSP):** Implementación de una heurística de optimización de rutas donde el punto inicial es la ubicación real del usuario y cada parada subsiguiente es el nodo más cercano no visitado.
- **Top-K Filtering:** Se limitó la ruta activa a un máximo de **5 puntos** para reducir la carga cognitiva del reciclador y asegurar la operatividad del MVP.

### 🧠 Aprendizaje

En logística urbana, "menos es más". Filtrar por densidad y cercanía real aporta más valor que mostrar cientos de puntos desordenados.

---

## 📅 2026-04-21 - Registro Operativo y Normalización

### 🚀 Acción

Desarrollo del **Formulario de Registro de Recolección** en la Vista Encargado.

### 🛠️ Detalles Técnicos

- **Parser de Cantidades:** Lógica para transformar entradas de lenguaje natural (ej: "3 sacos", "10 kg") en valores numéricos normalizados para analítica.
- **Geolocalización Reactiva:** Uso de la API `navigator.geolocation` para situar nuevos puntos de reciclaje informal detectados en campo.
- **Fix de UI:** Resolución de errores de escala en gráficos de Recharts mediante el uso de `ResponsiveContainer` y manejo de estados asíncronos.

---

## 🎯 Conclusión Técnica

El MVP de **AdoptAI** demuestra capacidad para manejar:

- **Frameworks modernos:** Next.js 15 y Tailwind.
- **Algoritmia:** Optimización de rutas y grafos.
- **Logística Urbana:** Gestión de datos geoespaciales reales en Lima, Perú.
- **Resiliencia:** Resolución de bloqueos de bajo nivel en el entorno de desarrollo.

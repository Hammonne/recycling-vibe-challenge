# AdoptAI Challenge: Smart Recycling Platform ♻️

Este repositorio contiene el MVP de la plataforma AdoptAI, una herramienta operativa para la gestión de reciclaje urbano en Lima, Perú.

---

## 📄 JOURNEY LOG (Bitácora de Desarrollo)

### 📅 Fase 1: Setup y Resiliencia Técnica

- **El Bloqueo:** Fallos críticos en la instalación de dependencias nativas en Windows (`@tailwindcss/oxide`) y bloqueos de archivos en PowerShell.
- **La Solución:** Limpieza profunda de `node_modules`, gestión de procesos del SO vía `cmd` como Administrador y forzado de caché de npm.
- **Aprendizaje:** La ingeniería de software comienza dominando el entorno de trabajo.

### 📅 Fase 2: Arquitectura Multi-Rol

Se transformó la landing estática en un sistema operativo con tres frentes:

1. **Ejecutivo:** Dashboard de impacto ESG.
2. **Encargado:** Registro de recolecciones y alertas de contenedores.
3. **Reciclador:** Logística de campo con navegación real.

### 📅 Fase 3: Logística y Algoritmia (Data Science Path)

- **Fix SSR:** Solución al error `window is not defined` mediante carga dinámica de componentes de mapas para evitar conflictos con el servidor de Next.js.
- **Geolocalización Real:** Integración con la API del navegador para situar al usuario en el mapa de Lima y generar puntos de interés en tierra firme (Barranco, Miraflores, San Miguel, Chorrillos).
- **Algoritmo de Optimización de Ruta:** Implementación de la heurística de "Vecino más cercano" (Nearest Neighbor) para encadenar los puntos de forma lógica, evitando cruces ineficientes.
- **Filtrado Top-5:** Selección estricta de las 5 tareas más cercanas para garantizar un flujo de trabajo manejable y visualmente limpio.

---

## 🚀 PROPUESTA DE VALOR DEL MVP

### 1. Dashboard Ejecutivo

Visualización de Kg reciclados, CO2 evitado y métricas de calidad de material para cumplimiento de estándares ESG corporativos.

### 2. Gestión del Encargado

- **Registro Inteligente:** Formulario para ingresar recolecciones manuales.
- **Normalización:** Lógica para procesar entradas como "3 sacos" o "10 kg" y convertirlas a datos métricos.
- **Monitoreo:** Panel de alertas para contenedores que superan el 90% de su capacidad.

### 3. Operación del Reciclador

- **Navegación Interactiva:** Mapa dinámico con Leaflet que traza la ruta óptima entre los 5 puntos más cercanos.
- **Modo "Comenzar":** Simulación de navegación estilo Google Maps que guía al usuario punto por punto por las calles de Lima.

---

## 🛠️ STACK TÉCNICO

- **Framework:** Next.js 15 (App Router)
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS
- **Mapas:** Leaflet.js
- **Gráficos:** Recharts

## ⚙️ INSTALACIÓN

```bash
npm install
npm run dev
```

Luego abre http://localhost:3000.

Desarrollado por Jimena - Estudiante de Data Science en UTEC (2026).

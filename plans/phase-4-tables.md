# Plan: Fase 4 - Gestión de Mesas

## Objetivo
Desarrollar el sistema de gestión de mesas, permitiendo la creación, configuración y seguimiento del estado en tiempo real de las mesas del restaurante.

## Alcance
- **Backend:**
  - Modelo `Table` (número, capacidad, estado, ubicación).
  - CRUD completo para administrar las mesas.
  - Endpoints para actualizar estados rápidamente.
- **Frontend:**
  - Mapa visual de mesas (grilla o layout).
  - Indicadores visuales de estado (Libre, Ocupada, Reservada).
  - Formulario de gestión (Admin) y vista de consulta (Meseros).

## Pasos de Implementación

1. **Backend - Modelo de Mesa**
   - Definir `src/models/Table.ts`.
   - Implementar las capas Service y Controller.
   - Definir rutas en `src/routes/tableRoutes.ts`.

2. **Backend - Integración**
   - Registrar las rutas de mesas en `app.ts`.

3. **Frontend - Componentes**
   - Crear componente `TableManager.tsx` para el Admin.
   - Crear componente `TableMap.tsx` para la vista de meseros.

4. **Verificación**
   - Verificar la creación de mesas.
   - Probar el cambio de estado de una mesa.

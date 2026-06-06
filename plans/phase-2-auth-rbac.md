# Plan: Fase 2 - Autenticación, Usuarios y RBAC

## Objetivo
Implementar el sistema de autenticación basado en JWT y control de acceso basado en roles (RBAC) para proteger los endpoints de la API.

## Alcance
- **Backend:**
  - Modelo de Usuario (esquema MongoDB/Mongoose) con campos: `username`, `email`, `password` (hash), `role` (admin, mesero, cocinero, cajero).
  - Servicio de autenticación: registro, login, generación/validación de JWT.
  - Middleware `authMiddleware`: para verificar tokens válidos.
  - Middleware `roleMiddleware`: para verificar permisos basados en roles.
  - Endpoints: `POST /api/auth/register`, `POST /api/auth/login`.
- **Frontend:**
  - Estructura de rutas protegidas (React Router).
  - Contexto o Store (Redux) para manejar el estado del usuario autenticado.

## Pasos de Implementación

1. **Backend - Modelo de Usuario**
   - Definir `src/models/User.ts`.
   - Instalar `bcryptjs` y `@types/bcryptjs`.
   - Implementar hashing de contraseñas.

2. **Backend - Autenticación y Middlewares**
   - Crear `src/services/authService.ts`.
   - Crear `src/controllers/authController.ts`.
   - Crear `src/middlewares/authMiddleware.ts` y `roleMiddleware.ts`.
   - Crear `src/routes/authRoutes.ts`.

3. **Backend - Integración**
   - Registrar rutas en `app.ts`.

4. **Frontend - Autenticación**
   - Crear servicios de API (`frontend/src/services/authService.ts`).
   - Configurar estado global en Redux (`authSlice`).
   - Implementar componentes básicos de Login.

## Verificación
- Probar el registro y login (obtención de token).
- Probar acceso a un endpoint protegido con un token válido.
- Probar acceso restringido (ej. un mesero intentando acceder a una ruta de admin).

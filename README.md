# DocaLink — Panel Web

Panel web de DocaLink (paquete `docalink`): administración de la plataforma y paneles propios para cada tipo de proveedor (médicos, centros estéticos, farmacias, laboratorios, ambulancias, insumos médicos). React 19 + Vite + TypeScript + MUI + TailwindCSS, con React Query para datos remotos y Zustand para estado de sesión.

## Requisitos

- Node.js 18+
- pnpm (el proyecto trae `pnpm-workspace.yaml` y config de `pnpm` en `package.json`; usar `npm` como alternativa es posible pero no es lo que se usa habitualmente aquí)

## Instalación

```bash
pnpm install
```

## Variables de entorno

Crear un archivo `.env` en la raíz con:

```
VITE_API_URL=
VITE_APP_NAME=
VITE_NODE_ENV=
```

`VITE_API_URL` debe apuntar al backend (`medi-connect-backend`) corriendo en local o en Render.

## Desarrollo

```bash
pnpm dev
```

Levanta Vite en modo desarrollo con recarga en caliente.

## Build y otros comandos

```bash
pnpm build      # build de producción (a dist/)
pnpm preview    # sirve el build de producción en local, para probarlo
pnpm lint       # ESLint
```

## Verificación de tipos

El `tsconfig.json` de la raíz es solo de referencias (`files: []`) y no valida nada por sí solo. Para chequear tipos de verdad hay que apuntar explícitamente al proyecto de la app:

```bash
npx tsc -p tsconfig.app.json --noEmit
```

## Deploy

El deploy productivo corre en **Vercel**, a partir de la rama `develop` (no `main` — `main` en este repo está desactualizada respecto a lo que realmente se despliega).

## Estructura del proyecto

- `src/app/` — configuración raíz: router, store de autenticación
- `src/features/` — un módulo por área funcional: `admin-dashboard`, `doctor-panel`, `aesthetic-panel`, `pharmacy-panel`, `laboratory-panel`, `ambulance-panel`, `supplies-panel`, `auth`, `patient`
- `src/shared/` — componentes, hooks y utilidades reutilizadas entre paneles (ej. `ImageCropperModal`, `CreateAdModal`, tablas de datos)

Varios paneles de proveedor reutilizan directamente componentes de `doctor-panel` (ej. `aesthetic-panel` importa `ProfileSection` y `AdsSection` de ahí) en vez de duplicarlos — al tocar esos componentes compartidos, revisar el impacto en todos los paneles que los usan.

# 📍 Ubicación de Pantallas - MediConnet

Este documento contiene la ubicación de todas las pantallas del proyecto para facilitar la navegación y el desarrollo.

---

## 🏠 Pantallas Principales

### Home (Página de Inicio)
- **Ruta**: `/home` (pública)
- **Archivo**: `src/features/home/presentation/pages/HomePage.tsx`
- **Descripción**: Página principal de la aplicación con hero section, servicios destacados y características

### Catálogo de Servicios
- **Ruta**: `/services` (pública)
- **Archivo**: `src/features/home/presentation/pages/ServicesCatalogPage.tsx`
- **Descripción**: Catálogo de servicios disponibles

---

## 🔐 Autenticación

### Registro
- **Ruta**: `/register` (pública)
- **Archivo**: `src/features/auth/presentation/pages/RegisterPage.tsx`
- **Descripción**: Formulario de registro de nuevos usuarios

### Recuperar Contraseña
- **Ruta**: `/forgot-password` (pública)
- **Archivo**: `src/features/auth/presentation/pages/ForgotPasswordPage.tsx`
- **Descripción**: Página para solicitar recuperación de contraseña

> **Nota**: La pantalla de Login fue eliminada. La aplicación redirige directamente a `/home`.

---

## 🔍 Búsqueda y Especialidades

### Búsqueda
- **Ruta**: `/search` (pública)
- **Archivo**: `src/features/search/presentation/pages/SearchPage.tsx`
- **Descripción**: Página de búsqueda de proveedores médicos

### Especialidades
- **Ruta**: `/specialties` (pública)
- **Archivo**: `src/features/search/presentation/pages/SpecialtiesPage.tsx`
- **Descripción**: Lista de especialidades médicas disponibles

### Lista de Doctores por Especialidad
- **Ruta**: `/specialties/:specialtyName` (protegida)
- **Archivo**: `src/features/doctors/presentation/pages/DoctorsListPage.tsx`
- **Descripción**: Lista de doctores filtrados por especialidad

### Perfil de Doctor
- **Ruta**: `/doctor/:id` (protegida)
- **Archivo**: `src/features/doctors/presentation/pages/DoctorProfilePage.tsx`
- **Descripción**: Detalles del perfil de un doctor específico

---

## 💊 Farmacias

### Lista de Farmacias
- **Ruta**: `/pharmacies` (pública)
- **Archivo**: `src/features/pharmacies/presentation/pages/PharmaciesListPage.tsx`
- **Descripción**: Lista de todas las farmacias disponibles

### Detalle de Farmacia
- **Ruta**: `/pharmacies/:id` (pública)
- **Archivo**: `src/features/pharmacies/presentation/pages/PharmacyDetailPage.tsx`
- **Descripción**: Detalles de una farmacia específica y sus sucursales

### Detalle de Sucursal
- **Ruta**: `/pharmacy-branch/:id` (pública)
- **Archivo**: `src/features/pharmacies/presentation/pages/BranchDetailPage.tsx`
- **Descripción**: Detalles de una sucursal específica de farmacia

---

## 🧪 Laboratorios

### Lista de Laboratorios
- **Ruta**: `/laboratories` (pública)
- **Archivo**: `src/features/laboratories/ui/pages/LaboratoriesPage.tsx`
- **Descripción**: Lista de todos los laboratorios disponibles

### Detalle de Laboratorio
- **Ruta**: `/laboratories/:id` (pública)
- **Archivo**: `src/features/laboratories/ui/pages/LaboratoryDetailPage.tsx`
- **Descripción**: Detalles de un laboratorio específico con opción de agendar exámenes

---

## 🚑 Ambulancias

### Lista de Ambulancias
- **Ruta**: `/ambulances` (pública)
- **Archivo**: `src/features/ambulance/presentation/pages/AmbulancesListPage.tsx`
- **Descripción**: Lista de servicios de ambulancia disponibles

### Detalle de Ambulancia
- **Ruta**: `/ambulances/:id` (pública)
- **Archivo**: `src/features/ambulance/presentation/pages/AmbulanceDetailPage.tsx`
- **Descripción**: Detalles de un servicio de ambulancia específico

### Solicitar Ambulancia
- **Ruta**: `/ambulance/request` (protegida)
- **Archivo**: `src/features/ambulance/presentation/pages/RequestAmbulancePage.tsx`
- **Descripción**: Formulario para solicitar una ambulancia

### Seguimiento de Ambulancia
- **Ruta**: `/ambulance/tracking/:id` (protegida)
- **Archivo**: `src/features/ambulance/presentation/pages/AmbulanceTrackingPage.tsx`
- **Descripción**: Página de seguimiento en tiempo real de una ambulancia solicitada

---

## 📦 Insumos Médicos

### Lista de Tiendas de Insumos
- **Ruta**: `/supplies` (pública)
- **Archivo**: `src/features/supplies/presentation/pages/SuppliesListPage.tsx`
- **Descripción**: Lista de tiendas de insumos médicos disponibles

### Detalle de Tienda de Insumos
- **Ruta**: `/supplies/:id` (pública)
- **Archivo**: `src/features/supplies/presentation/pages/SupplyStoreDetailPage.tsx`
- **Descripción**: Detalles de una tienda de insumos médicos específica

---

## 👤 Perfil y Citas

### Perfil de Usuario
- **Ruta**: `/profile` (protegida)
- **Archivo**: `src/features/profile/pages/ProfilePage.tsx`
- **Descripción**: Página de perfil del usuario con información personal, historial médico, medicación y datos profesionales

### Mis Citas
- **Ruta**: `/appointments` (protegida)
- **Archivo**: `src/features/appointments/presentation/pages/AppointmentsPage.tsx`
- **Descripción**: Gestión de citas pagadas y recordatorios del usuario

---

## 💳 Checkout

### Página de Pago
- **Ruta**: `/checkout` (protegida)
- **Archivo**: `src/features/booking/presentation/pages/CheckoutPage.tsx`
- **Descripción**: Página de checkout y confirmación de reservas

---

## 📂 Estructura de Carpetas por Feature

### 🏠 Home
```
src/features/home/
├── presentation/
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   └── ServicesCatalogPage.tsx
│   ├── components/
│   │   ├── HeroSection.tsx
│   │   ├── IconMapper.tsx
│   │   └── ServiceCategoryCard.tsx
│   └── hooks/
│       └── useHome.ts
```

### 🔐 Auth
```
src/features/auth/
├── presentation/
│   ├── pages/
│   │   ├── RegisterPage.tsx
│   │   ├── ForgotPasswordPage.tsx
│   │   └── LoginPage.tsx (eliminada, no se usa)
│   └── components/
│       └── MediConnectLogo.tsx
```

### 🔍 Search
```
src/features/search/
├── presentation/
│   ├── pages/
│   │   ├── SearchPage.tsx
│   │   └── SpecialtiesPage.tsx
│   └── components/
│       ├── ProviderCard.tsx
│       └── SpecialtyCard.tsx
```

### 👨‍⚕️ Doctors
```
src/features/doctors/
├── presentation/
│   ├── pages/
│   │   ├── DoctorsListPage.tsx
│   │   └── DoctorProfilePage.tsx
│   └── components/
│       └── AvailabilityCalendar.tsx
```

### 💊 Pharmacies
```
src/features/pharmacies/
├── presentation/
│   ├── pages/
│   │   ├── PharmaciesListPage.tsx
│   │   ├── PharmacyDetailPage.tsx
│   │   └── BranchDetailPage.tsx
│   ├── components/
│   │   ├── PharmacyCard.tsx
│   │   ├── BranchCard.tsx
│   │   ├── ReviewForm.tsx
│   │   └── ReviewItem.tsx
│   └── hooks/
│       └── usePharmacy.ts
```

### 🧪 Laboratories
```
src/features/laboratories/
├── ui/
│   ├── pages/
│   │   ├── LaboratoriesPage.tsx
│   │   └── LaboratoryDetailPage.tsx
│   ├── components/
│   │   ├── LaboratoryCard.tsx
│   │   ├── LaboratorySearch.tsx
│   │   ├── AppointmentModal.tsx
│   │   ├── DatePickerSection.tsx
│   │   ├── TimeSlotsSection.tsx
│   │   ├── PatientForm.tsx
│   │   ├── ReviewForm.tsx
│   │   └── ReviewItem.tsx
│   └── hooks/
│       └── useLaboratory.ts
```

### 🚑 Ambulance
```
src/features/ambulance/
├── presentation/
│   ├── pages/
│   │   ├── AmbulancesListPage.tsx
│   │   ├── AmbulanceDetailPage.tsx
│   │   ├── RequestAmbulancePage.tsx
│   │   └── AmbulanceTrackingPage.tsx
│   ├── components/
│   │   ├── AmbulanceCard.tsx
│   │   ├── AmbulanceSearch.tsx
│   │   ├── AmbulanceForm.tsx
│   │   ├── ReviewForm.tsx
│   │   └── ReviewItem.tsx
│   └── hooks/
│       └── useAmbulanceService.ts
```

### 📦 Supplies
```
src/features/supplies/
├── presentation/
│   ├── pages/
│   │   ├── SuppliesListPage.tsx
│   │   └── SupplyStoreDetailPage.tsx
│   ├── components/
│   │   ├── SupplyStoreCard.tsx
│   │   ├── SupplyStoreSearch.tsx
│   │   ├── ReviewForm.tsx
│   │   └── ReviewItem.tsx
│   └── hooks/
│       └── useSupply.ts
```

### 👤 Profile
```
src/features/profile/
├── pages/
│   └── ProfilePage.tsx
├── components/
│   ├── ProfileTabs.tsx
│   ├── PersonalInfoCard.tsx
│   ├── EditProfileModal.tsx
│   ├── MedicalHistoryCard.tsx
│   ├── MedicalRecordModal.tsx
│   ├── MedicationCard.tsx
│   ├── MedicationReminderModal.tsx
│   ├── ProfessionalCard.tsx
│   └── ProfessionalRequestModal.tsx
└── hooks/
    └── useProfile.ts
```

### 📅 Appointments
```
src/features/appointments/
├── presentation/
│   ├── pages/
│   │   └── AppointmentsPage.tsx
│   ├── components/
│   │   ├── AppointmentCard.tsx
│   │   ├── ReminderCard.tsx
│   │   ├── ReminderForm.tsx
│   │   └── ConfirmDeleteModal.tsx
│   └── hooks/
│       ├── useAppointment.ts
│       └── useReminder.ts
```

### 💳 Booking
```
src/features/booking/
├── presentation/
│   ├── pages/
│   │   └── CheckoutPage.tsx
│   └── components/
│       └── BookingSummary.tsx
```

---

## 🗂️ Layouts y Componentes Compartidos

### Layouts
- **AppLayout**: `src/shared/layouts/AppLayout.tsx` - Layout principal con header
- **AuthLayout**: `src/shared/layouts/AuthLayout.tsx` - Layout para páginas de autenticación

### Componentes Compartidos
- **Footer**: `src/shared/components/Footer.tsx`
- **NavigationBar**: `src/shared/components/NavigationBar.tsx` (ya no se usa en el header principal)

---

## 🛣️ Configuración de Rutas

### Archivo Principal de Rutas
- **AppRouter**: `src/app/router/AppRouter.tsx` - Configuración de todas las rutas

### Constantes de Rutas
- **ROUTES**: `src/app/config/constants.ts` - Constantes con todas las rutas definidas

### Protección de Rutas
- **ProtectedRoute**: `src/app/router/ProtectedRoute.tsx` - Guard para rutas protegidas
- **RoleRoute**: `src/app/router/RoleRoute.tsx` - Guard para rutas con roles específicos

---

## 📝 Notas Importantes

1. **Rutas Públicas**: Las rutas públicas no requieren autenticación y están disponibles para todos los usuarios.

2. **Rutas Protegidas**: Las rutas protegidas requieren que el usuario esté autenticado. Si no lo está, se redirige a `/home`.

3. **Login Eliminado**: La pantalla de login fue eliminada. La aplicación redirige directamente a `/home` al iniciar.

4. **Header Simplificado**: El header ahora solo muestra:
   - Logo MEDICONES
   - Navegación: Servicios, Beneficios, Contacto
   - Botones: Iniciar sesión / Registrarse (o Cerrar sesión si está autenticado)

5. **Estructura de Features**: Cada feature sigue la arquitectura Clean Architecture con:
   - `domain/` - Entidades y reglas de negocio
   - `application/` - Casos de uso
   - `infrastructure/` - APIs y repositorios
   - `presentation/` o `ui/` - Componentes y páginas React

---

## 🔗 Acceso Rápido

### Para encontrar una pantalla específica:
1. Busca el nombre de la pantalla en este documento
2. Ve a la ruta indicada en "Archivo"
3. O busca por la ruta en `AppRouter.tsx` para ver cómo está configurada

### Para agregar una nueva pantalla:
1. Crea el archivo en el feature correspondiente: `src/features/[feature]/presentation/pages/[Nombre]Page.tsx`
2. Agrega la ruta en `src/app/router/AppRouter.tsx`
3. Agrega la constante en `src/app/config/constants.ts`
4. Actualiza este documento

---

**Última actualización**: Diciembre 2024


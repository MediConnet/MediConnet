# Cuenta Bancaria del Médico Asociado a Clínica ✅

## Resumen
Se ha agregado una nueva pestaña "Cuenta Bancaria" en el panel de médicos asociados a clínica, donde pueden registrar y editar sus propios datos bancarios para recibir pagos de la clínica.

## Cambios Realizados

### 1. Menú de Navegación
**Archivo:** `src/shared/config/navigation.config.tsx`

**Cambios:**
- Agregado nuevo item "Cuenta Bancaria" en `CLINIC_ASSOCIATED_DOCTOR_MENU`
- Posicionado después de "Solicitar Bloqueos" y antes de "Notificaciones"
- Icono: Business (🏢)
- Ruta: `/doctor/dashboard?tab=bank-account`

### 2. Componente de Cuenta Bancaria
**Archivo:** `src/features/doctor-panel/presentation/components/DoctorBankAccountSection.tsx` (NUEVO)

**Funcionalidades:**
- **Vista Vacía:** Cuando no hay datos bancarios registrados
  - Mensaje informativo
  - Botón para agregar cuenta bancaria

- **Modo Edición:** Formulario completo con validaciones
  - Selector de banco (16 bancos de Ecuador)
  - Tipo de cuenta (Corriente/Ahorros)
  - Número de cuenta (mínimo 10 dígitos)
  - Titular de la cuenta
  - Cédula/RUC (10-13 dígitos)
  - Botones: Cancelar / Guardar

- **Vista de Solo Lectura:** Cuando ya hay datos registrados
  - Muestra todos los datos bancarios
  - Chip "Configurado" (verde)
  - Botón "Editar" para modificar

- **Validaciones:**
  - Todos los campos son requeridos
  - Número de cuenta: solo números, mínimo 10 dígitos
  - Cédula/RUC: solo números, 10-13 dígitos
  - Tipo de cuenta: solo "checking" o "savings"

- **Persistencia:**
  - Datos guardados en localStorage (mock)
  - Clave: `doctor_bank_account`

### 3. Integración en Dashboard
**Archivo:** `src/features/doctor-panel/presentation/pages/DoctorDashboardPage.tsx`

**Cambios:**
- Agregado tipo `"bank-account"` al `TabType`
- Importado componente `DoctorBankAccountSection`
- Agregada ruta para renderizar el componente cuando `tab=bank-account`

## Estructura de Datos

### BankAccount (del dominio de clínicas)
```typescript
interface BankAccount {
  bankName: string;           // Nombre del banco
  accountNumber: string;      // Número de cuenta
  accountType: 'checking' | 'savings';  // Tipo de cuenta
  accountHolder: string;      // Titular de la cuenta
  identificationNumber?: string;  // Cédula o RUC
}
```

### Ejemplo de Datos Guardados
```json
{
  "bankName": "Banco Pichincha",
  "accountNumber": "2100123456",
  "accountType": "checking",
  "accountHolder": "Dr. Juan Pérez",
  "identificationNumber": "1234567890"
}
```

## Bancos Disponibles

Lista de 16 bancos de Ecuador:
1. Banco Pichincha
2. Banco del Pacífico
3. Banco de Guayaquil
4. Produbanco
5. Banco Bolivariano
6. Banco Internacional
7. Banco del Austro
8. Banco General Rumiñahui
9. Banco ProCredit
10. Banco Solidario
11. Banco Comercial de Manabí
12. Banco Coopnacional
13. Banco Capital
14. Banco Finca
15. Banco D-MIRO
16. Banco Diners Club

## Flujo de Uso

### Primera Vez (Sin Datos Bancarios)
1. Médico hace clic en "Cuenta Bancaria"
2. Ve mensaje: "No has configurado tu cuenta bancaria"
3. Hace clic en "Agregar Cuenta Bancaria"
4. Llena el formulario con sus datos
5. Hace clic en "Guardar Datos"
6. Ve confirmación y sus datos guardados

### Editar Datos Existentes
1. Médico hace clic en "Cuenta Bancaria"
2. Ve sus datos bancarios actuales
3. Hace clic en "Editar"
4. Modifica los campos necesarios
5. Hace clic en "Guardar Datos"
6. Ve confirmación y datos actualizados

## Validaciones Implementadas

### Banco
- Campo requerido
- Debe seleccionar de la lista

### Número de Cuenta
- Campo requerido
- Mínimo 10 dígitos
- Solo números (sin guiones ni espacios)

### Tipo de Cuenta
- Campo requerido
- Solo "Corriente" o "Ahorros"

### Titular de la Cuenta
- Campo requerido
- Texto libre

### Cédula / RUC
- Campo requerido
- Mínimo 10 dígitos
- Máximo 13 dígitos
- Solo números

## Mensajes Informativos

### Alert Azul (Info)
"Estos datos bancarios serán utilizados por la clínica para realizar los depósitos de tus pagos. Asegúrate de que la información sea correcta y esté actualizada."

### Alert Amarillo (Warning)
"Es importante que mantengas esta información actualizada para evitar retrasos en tus pagos. Si cambias de cuenta bancaria, actualiza estos datos inmediatamente."

## Endpoint del Backend (Futuro)

Cuando el backend esté listo, se necesitarán estos endpoints:

### GET /api/doctors/bank-account
```http
GET http://localhost:3000/api/doctors/bank-account
Authorization: Bearer {token_del_medico}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "bankName": "Banco Pichincha",
    "accountNumber": "2100123456",
    "accountType": "checking",
    "accountHolder": "Dr. Juan Pérez",
    "identificationNumber": "1234567890"
  }
}
```

### PUT /api/doctors/bank-account
```http
PUT http://localhost:3000/api/doctors/bank-account
Authorization: Bearer {token_del_medico}
Content-Type: application/json

{
  "bankName": "Banco Pichincha",
  "accountNumber": "2100123456",
  "accountType": "checking",
  "accountHolder": "Dr. Juan Pérez",
  "identificationNumber": "1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "bankName": "Banco Pichincha",
    "accountNumber": "2100123456",
    "accountType": "checking",
    "accountHolder": "Dr. Juan Pérez",
    "identificationNumber": "1234567890"
  }
}
```

## Archivos Creados/Modificados

### Creados:
1. `src/features/doctor-panel/presentation/components/DoctorBankAccountSection.tsx`
2. `CUENTA_BANCARIA_MEDICO_CLINICA.md` (este archivo)

### Modificados:
1. `src/shared/config/navigation.config.tsx`
2. `src/features/doctor-panel/presentation/pages/DoctorDashboardPage.tsx`

## Testing

### Probar en el Frontend:

1. **Iniciar sesión como médico asociado a clínica:**
   - Email: `dr.juan.perez@clinicacentral.com`
   - Password: `doctor123`

2. **Verificar que aparece el menú "Cuenta Bancaria"**
   - Debe estar entre "Solicitar Bloqueos" y "Notificaciones"

3. **Hacer clic en "Cuenta Bancaria"**
   - Primera vez: Debe mostrar mensaje de "No has configurado..."
   - Con datos: Debe mostrar los datos guardados

4. **Agregar/Editar datos bancarios:**
   - Llenar todos los campos
   - Verificar validaciones (números, longitud, etc.)
   - Guardar y verificar que se muestra correctamente

5. **Verificar persistencia:**
   - Recargar la página
   - Volver a "Cuenta Bancaria"
   - Verificar que los datos se mantienen

## Propósito

Esta funcionalidad permite que:
- El médico registre su cuenta bancaria
- La clínica sepa dónde depositar los pagos del médico
- El médico pueda actualizar sus datos cuando cambie de cuenta
- Haya un registro claro de los datos bancarios para pagos

---

**Estado:** ✅ Completado y funcional
**Fecha:** 2026-02-06
**Funcionalidad:** Registro y edición de cuenta bancaria del médico para recibir pagos de la clínica

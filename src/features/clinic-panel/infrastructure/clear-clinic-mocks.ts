/**
 * Utilidad para limpiar todos los datos mock de clínica del localStorage
 * Úsalo para hacer pruebas serias con el backend real
 */

export const clearClinicMocks = () => {
  // Limpiar médicos
  const clinicDoctorsKeys = Object.keys(localStorage).filter(key => 
    key.startsWith('clinic_doctors_')
  );
  clinicDoctorsKeys.forEach(key => localStorage.removeItem(key));

  // Limpiar invitaciones
  const clinicInvitationsKeys = Object.keys(localStorage).filter(key => 
    key.startsWith('clinic_invitations_')
  );
  clinicInvitationsKeys.forEach(key => localStorage.removeItem(key));

  // Limpiar perfil de clínica (si es mock)
  localStorage.removeItem('clinic_profile');

  // Limpiar dashboard (si es mock)
  localStorage.removeItem('clinic_dashboard');

  // Limpiar citas
  const clinicAppointmentsKeys = Object.keys(localStorage).filter(key => 
    key.startsWith('clinic_appointments_')
  );
  clinicAppointmentsKeys.forEach(key => localStorage.removeItem(key));

  console.log('✅ Datos mock de clínica eliminados del localStorage');
};

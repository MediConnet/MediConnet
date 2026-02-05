import type { ClinicPayment } from '../domain/clinic-payment.entity';
import type { ClinicToDoctorPayment } from '../domain/clinic-to-doctor-payment.entity';
import type { PaymentDistribution } from '../domain/payment-distribution.entity';

/**
 * Mock: Pagos recibidos por la clínica del administrador
 */
export const getClinicPaymentsMock = (clinicId: string = 'clinic-001'): ClinicPayment[] => {
  return [
    {
      id: 'cp-001',
      clinicId: clinicId,
      clinicName: 'Clínica San Francisco',
      totalAmount: 1000,
      appCommission: 150,
      netAmount: 850,
      status: 'paid',
      paymentDate: '2026-01-28T10:00:00Z',
      createdAt: '2026-01-25T08:00:00Z',
      appointments: [
        {
          id: 'apt-001',
          doctorId: 'doc-001',
          doctorName: 'Dr. Juan Pérez',
          patientName: 'María González',
          amount: 500,
          date: '2026-01-20T09:00:00Z',
        },
        {
          id: 'apt-002',
          doctorId: 'doc-002',
          doctorName: 'Dra. Ana López',
          patientName: 'Carlos Ramírez',
          amount: 500,
          date: '2026-01-22T14:00:00Z',
        },
      ],
      isDistributed: true,
      distributedAmount: 850,
      remainingAmount: 0,
    },
    {
      id: 'cp-002',
      clinicId: clinicId,
      clinicName: 'Clínica San Francisco',
      totalAmount: 1500,
      appCommission: 225,
      netAmount: 1275,
      status: 'pending',
      paymentDate: null,
      createdAt: '2026-02-01T08:00:00Z',
      appointments: [
        {
          id: 'apt-003',
          doctorId: 'doc-001',
          doctorName: 'Dr. Juan Pérez',
          patientName: 'Laura Martínez',
          amount: 600,
          date: '2026-01-28T10:00:00Z',
        },
        {
          id: 'apt-004',
          doctorId: 'doc-002',
          doctorName: 'Dra. Ana López',
          patientName: 'Pedro Sánchez',
          amount: 450,
          date: '2026-01-29T11:00:00Z',
        },
        {
          id: 'apt-005',
          doctorId: 'doc-001',
          doctorName: 'Dr. Juan Pérez',
          patientName: 'Sofia Torres',
          amount: 450,
          date: '2026-01-30T15:00:00Z',
        },
      ],
      isDistributed: false,
      distributedAmount: 0,
      remainingAmount: 1275,
    },
  ];
};

/**
 * Mock: Pagos de la clínica a sus médicos
 */
export const getClinicToDoctorPaymentsMock = (clinicId: string = 'clinic-001'): ClinicToDoctorPayment[] => {
  return [
    {
      id: 'cdp-001',
      clinicId: clinicId,
      clinicName: 'Clínica San Francisco',
      doctorId: 'doc-001',
      doctorName: 'Dr. Juan Pérez',
      amount: 500,
      status: 'paid',
      paymentDate: '2026-01-29T10:00:00Z',
      createdAt: '2026-01-28T10:00:00Z',
      clinicPaymentId: 'cp-001',
      doctorBankAccount: {
        bankName: 'Banco Pichincha',
        accountNumber: '2100123456789',
        accountType: 'checking',
        accountHolder: 'Juan Pérez',
      },
    },
    {
      id: 'cdp-002',
      clinicId: clinicId,
      clinicName: 'Clínica San Francisco',
      doctorId: 'doc-002',
      doctorName: 'Dra. Ana López',
      amount: 350,
      status: 'paid',
      paymentDate: '2026-01-29T10:00:00Z',
      createdAt: '2026-01-28T10:00:00Z',
      clinicPaymentId: 'cp-001',
      doctorBankAccount: {
        bankName: 'Banco de Guayaquil',
        accountNumber: '0123456789',
        accountType: 'savings',
        accountHolder: 'Ana López',
      },
    },
    {
      id: 'cdp-003',
      clinicId: clinicId,
      clinicName: 'Clínica San Francisco',
      doctorId: 'doc-001',
      doctorName: 'Dr. Juan Pérez',
      amount: 700,
      status: 'pending',
      paymentDate: null,
      createdAt: '2026-02-01T08:00:00Z',
      clinicPaymentId: 'cp-002',
      doctorBankAccount: {
        bankName: 'Banco Pichincha',
        accountNumber: '2100123456789',
        accountType: 'checking',
        accountHolder: 'Juan Pérez',
      },
    },
    {
      id: 'cdp-004',
      clinicId: clinicId,
      clinicName: 'Clínica San Francisco',
      doctorId: 'doc-002',
      doctorName: 'Dra. Ana López',
      amount: 575,
      status: 'pending',
      paymentDate: null,
      createdAt: '2026-02-01T08:00:00Z',
      clinicPaymentId: 'cp-002',
      doctorBankAccount: {
        bankName: 'Banco de Guayaquil',
        accountNumber: '0123456789',
        accountType: 'savings',
        accountHolder: 'Ana López',
      },
    },
  ];
};

/**
 * Mock: Distribución de un pago
 */
export const getPaymentDistributionMock = (clinicPaymentId: string): PaymentDistribution => {
  return {
    clinicPaymentId: clinicPaymentId,
    totalReceived: 1275,
    distributions: [
      {
        doctorId: 'doc-001',
        doctorName: 'Dr. Juan Pérez',
        amount: 700,
        percentage: 54.9,
        status: 'pending',
      },
      {
        doctorId: 'doc-002',
        doctorName: 'Dra. Ana López',
        amount: 575,
        percentage: 45.1,
        status: 'pending',
      },
    ],
    totalDistributed: 1275,
    remaining: 0,
    createdAt: '2026-02-01T08:00:00Z',
    updatedAt: '2026-02-01T08:00:00Z',
  };
};

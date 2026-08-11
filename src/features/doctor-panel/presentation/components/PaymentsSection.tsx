import { AttachMoney, CreditCard, CheckCircle, HourglassEmpty, AccountBalance, Edit, Info } from "@mui/icons-material";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  InputAdornment,
  Alert,
  CircularProgress,
} from "@mui/material";
import { DataGrid, type GridColDef, type GridPaginationModel } from "@mui/x-data-grid";
import Grid2 from "@mui/material/Grid2";
import { useState, useEffect } from "react";
import { getDoctorBankAccountAPI, updateDoctorBankAccountAPI, type BankAccountData } from "../../infrastructure/payments.api";
import { formatMoney } from "../../../../shared/lib/formatMoney";
import { getUserFriendlyMessage } from "../../../../shared/lib/api-error";
import { useDoctorDashboard } from "../hooks/useDoctorDashboard";
import { useDoctorPayments } from "../hooks/useDoctorPayments";

import { handleLetterInput, handleNumberInput } from "../../../../shared/lib/inputValidation";
import { ECUADOR_BANKS } from "../../../../shared/config/domain.constants";

interface Props {
  isAesthetic?: boolean;
}

export const PaymentsSection = ({ isAesthetic = false }: Props = {}) => {
  const { data } = useDoctorDashboard();
  const doctorName = data?.doctor?.name || "Dr. Juan Pérez";

  const isClinicAssociated = (data as any)?.doctor?.clinicId ? true : false;
  const clinicName = (data as any)?.doctor?.clinicName || '';
  const paymentSource = isClinicAssociated ? 'clinic' : 'admin';

  const {
    payments,
    loading: loadingPayments,
    total,
    page,
    setPage,
    limit,
    setLimit,
  } = useDoctorPayments();

  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: limit });

  const [bankDialogOpen, setBankDialogOpen] = useState(false);
  const [bankError, setBankError] = useState<string | null>(null);

  const [bankAccount, setBankAccount] = useState<BankAccountData | null>(null);
  const [savingBank, setSavingBank] = useState(false);
  const [bankData, setBankData] = useState({
    bankName: "",
    accountNumber: "",
    accountType: "checking",
    accountHolder: "",
  });

  useEffect(() => {
    getDoctorBankAccountAPI()
      .then((data) => {
        setBankAccount(data);
        if (data) {
          setBankData({
            bankName: data.bankName,
            accountNumber: data.accountNumber,
            accountType: data.accountType,
            accountHolder: data.accountHolder,
          });
        }
      })
      .catch(() => setBankAccount(null));
  }, []);

  const handleSaveBankData = async () => {
    if (bankData.accountNumber.length < 10) {
      setBankError('El número de cuenta debe tener al menos 10 dígitos');
      return;
    }
    setBankError(null);
    setSavingBank(true);
    try {
      const updated = await updateDoctorBankAccountAPI({
        bankName: bankData.bankName,
        accountNumber: bankData.accountNumber,
        accountType: bankData.accountType,
        accountHolder: bankData.accountHolder,
      });
      setBankAccount(updated);
      setBankDialogOpen(false);
    } catch (err: any) {
      setBankError(getUserFriendlyMessage(err, { fallback: 'No fue posible guardar los datos bancarios.' }));
    } finally {
      setSavingBank(false);
    }
  };

  const totals = payments.reduce(
    (acc, p) => ({
      totalAmount: acc.totalAmount + p.amount,
      totalCommission: acc.totalCommission + p.commission,
      totalNet: acc.totalNet + p.netAmount,
    }),
    { totalAmount: 0, totalCommission: 0, totalNet: 0 },
  );

  const handlePaginationChange = (model: GridPaginationModel) => {
    setPaginationModel(model);
    setPage(model.page + 1);
    setLimit(model.pageSize);
  };

  const columns: GridColDef[] = [
    {
      field: "patientName",
      headerName: "Paciente",
      flex: 1,
      minWidth: 180,
    },
    {
      field: "date",
      headerName: "Fecha",
      width: 120,
      valueGetter: (_value, row) => new Date(row.date).toLocaleDateString("es-ES"),
    },
    {
      field: "amount",
      headerName: "Monto Cobrado",
      width: 140,
      align: "right",
      renderCell: (params) => <Typography fontWeight={600}>{formatMoney(params.value)}</Typography>,
    },
    {
      field: "commission",
      headerName: "Comisión",
      width: 120,
      align: "right",
      renderCell: (params) => <Typography color="text.secondary">{formatMoney(params.value)}</Typography>,
    },
    {
      field: "netAmount",
      headerName: "Total Neto",
      width: 130,
      align: "right",
      renderCell: (params) => <Typography fontWeight={600} color="#10b981">{formatMoney(params.value)}</Typography>,
    },
    {
      field: "status",
      headerName: "Estado",
      width: 120,
      align: "center",
      renderCell: (params) => (
        <Chip
          icon={params.value === "paid" ? <CheckCircle /> : <HourglassEmpty />}
          label={params.value === "paid" ? "Pagado" : "Pendiente"}
          color={params.value === "paid" ? "success" : "warning"}
          size="small"
        />
      ),
    },
  ];

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-800">Pagos e Ingresos</h3>
          <p className="text-sm text-gray-500 mt-1">
            Listado de citas pagadas con tarjeta, comisiones y total neto
          </p>
        </div>
      </div>

      {paymentSource === 'admin' ? (
        <Alert severity="info" icon={<Info />} sx={{ mb: 3, bgcolor: '#eff6ff', border: '1px solid #bfdbfe' }}>
          <Typography variant="body2" fontWeight={600}>Médico Independiente</Typography>
          <Typography variant="caption">Recibes pagos directamente del administrador de la plataforma</Typography>
        </Alert>
      ) : (
        <Alert severity="info" icon={<Info />} sx={{ mb: 3, bgcolor: '#fef3c7', border: '1px solid #fde68a' }}>
          <Typography variant="body2" fontWeight={600}>Médico Asociado a Clínica</Typography>
          <Typography variant="caption">Tus pagos son gestionados por <strong>{clinicName}</strong>.</Typography>
        </Alert>
      )}

      <Grid2 container spacing={3} mb={4}>
        <Grid2 size={{ xs: 12, sm: 4 }}>
          <Card elevation={0} sx={{ bgcolor: "#f0fdfa", border: "1px solid #d1fae5" }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <AttachMoney sx={{ color: "#14b8a6", fontSize: 32 }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">Total Cobrado</Typography>
                  <Typography variant="h6" fontWeight={700} color="#14b8a6">{formatMoney(totals.totalAmount)}</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 4 }}>
          <Card elevation={0} sx={{ bgcolor: "#fef3c7", border: "1px solid #fde68a" }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <CreditCard sx={{ color: "#f59e0b", fontSize: 32 }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">Comisión App (15%)</Typography>
                  <Typography variant="h6" fontWeight={700} color="#f59e0b">{formatMoney(totals.totalCommission)}</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 4 }}>
          <Card elevation={0} sx={{ bgcolor: "#ecfdf5", border: "1px solid #a7f3d0" }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <CheckCircle sx={{ color: "#10b981", fontSize: 32 }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">Total Neto</Typography>
                  <Typography variant="h6" fontWeight={700} color="#10b981">{formatMoney(totals.totalNet)}</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>

      <Card elevation={0} sx={{ border: "1px solid #e5e7eb", mb: 4 }}>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <AccountBalance sx={{ color: "#06b6d4", fontSize: 28 }} />
              <div>
                <Typography variant="h6" fontWeight={600}>Datos Bancarios</Typography>
                <Typography variant="body2" color="text.secondary">Información para recibir pagos</Typography>
              </div>
            </div>
            <Button variant="outlined" startIcon={<Edit />} onClick={() => { setBankDialogOpen(true); }} sx={{ textTransform: "none" }}>
              {bankAccount ? "Editar" : "Agregar"}
            </Button>
          </div>
          {bankAccount ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Typography variant="caption" color="text.secondary">Banco</Typography>
                <Typography variant="body1" fontWeight={600}>{bankAccount.bankName}</Typography>
              </div>
              <div>
                <Typography variant="caption" color="text.secondary">Número de Cuenta</Typography>
                <Typography variant="body1" fontWeight={600}>{bankAccount.accountNumber}</Typography>
              </div>
              <div>
                <Typography variant="caption" color="text.secondary">Tipo de Cuenta</Typography>
                <Typography variant="body1" fontWeight={600}>{bankAccount.accountType === 'checking' || bankAccount.accountType === 'Corriente' ? 'Corriente' : 'Ahorros'}</Typography>
              </div>
              <div>
                <Typography variant="caption" color="text.secondary">Titular</Typography>
                <Typography variant="body1" fontWeight={600}>{bankAccount.accountHolder}</Typography>
              </div>
            </div>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic" }}>
              No hay datos bancarios registrados. Agrega tu información para recibir pagos.
            </Typography>
          )}
        </CardContent>
      </Card>

      {loadingPayments ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ height: 500, width: "100%", bgcolor: "white", borderRadius: 2, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          <DataGrid
            rows={payments}
            columns={columns}
            loading={loadingPayments}
            paginationMode="server"
            rowCount={total}
            paginationModel={paginationModel}
            onPaginationModelChange={handlePaginationChange}
            pageSizeOptions={[5, 10, 20]}
            disableRowSelectionOnClick
            getRowId={(row) => row.id}
            sx={{ border: "none" }}
          />
        </Box>
      )}

      <Dialog open={bankDialogOpen} onClose={() => setBankDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Datos Bancarios</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <FormControl fullWidth required>
              <InputLabel>Banco</InputLabel>
              <Select value={bankData.bankName} onChange={(e) => setBankData({ ...bankData, bankName: e.target.value })} label="Banco">
                {ECUADOR_BANKS.map((bank) => (<MenuItem key={bank} value={bank}>{bank}</MenuItem>))}
              </Select>
            </FormControl>
            <TextField label="Número de Cuenta" value={bankData.accountNumber} onChange={(e) => handleNumberInput(e, (value) => setBankData({ ...bankData, accountNumber: value }))} fullWidth required helperText="Solo números" />
            <FormControl fullWidth>
              <InputLabel>Tipo de Cuenta</InputLabel>
              <Select value={bankData.accountType} onChange={(e) => setBankData({ ...bankData, accountType: e.target.value })} label="Tipo de Cuenta">
                <MenuItem value="checking">Corriente</MenuItem>
                <MenuItem value="savings">Ahorros</MenuItem>
              </Select>
            </FormControl>
            <TextField label="Titular de la Cuenta" value={bankData.accountHolder} onChange={(e) => handleLetterInput(e, (value) => setBankData({ ...bankData, accountHolder: value }))} fullWidth required helperText="Solo letras y espacios" />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBankDialogOpen(false)} sx={{ textTransform: "none" }}>Cancelar</Button>
          <Button onClick={handleSaveBankData} variant="contained" disabled={savingBank || !bankData.bankName || !bankData.accountNumber || !bankData.accountHolder}
            sx={{ textTransform: "none", backgroundColor: "#06b6d4", "&:hover": { backgroundColor: "#0891b2" } }}>
            {savingBank ? "Guardando..." : "Guardar"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

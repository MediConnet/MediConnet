import {
  Add,
  Campaign,
  Delete,
  Edit,
  ToggleOff,
  ToggleOn,
} from '@mui/icons-material';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { DataGrid, type GridColDef, type GridRenderCellParams } from '@mui/x-data-grid';
import { useState } from 'react';
import { DashboardLayout } from '../../../../shared/layouts/DashboardLayout';
import type { CreateAdminAdPayload, AdminAd } from '../../infrastructure/admin-ads.api';
import { useAdminAds } from '../hooks/useAdminAds';
import { useAdminNotificationsLayout } from '../hooks/useAdminNotificationsLayout';

const CURRENT_ADMIN = { name: 'Admin General', roleLabel: 'Super Admin', initials: 'AG' };

const TARGET_SCREENS = [
  { value: 'Home', label: 'Inicio' },
  { value: 'DoctorDetail', label: 'Detalle Médico' },
  { value: 'FarmaciaDetail', label: 'Detalle Farmacia' },
  { value: 'LaboratorioDetail', label: 'Detalle Laboratorio' },
  { value: 'AmbulanciaDetail', label: 'Detalle Ambulancia' },
];

const EMPTY_FORM: CreateAdminAdPayload = {
  badge_text: '',
  title: '',
  subtitle: '',
  action_text: 'Ver más',
  image_url: '',
  start_date: new Date().toISOString().split('T')[0],
  end_date: '',
  target_screen: 'Home',
  target_id: '',
  bg_color_hex: '#FFFFFF',
  accent_color_hex: '#009688',
  priority_order: 5,
};

function toBase64(file: File): Promise<string> {
  return new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onload = () => res(reader.result as string);
    reader.onerror = rej;
    reader.readAsDataURL(file);
  });
}

export const AdsManagementPage = () => {
  const { ads, isLoading, createAd, updateAd, deleteAd, toggleAd } = useAdminAds();
  const { appointments, notificationsViewAllPath } = useAdminNotificationsLayout();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAd, setEditingAd] = useState<AdminAd | null>(null);
  const [form, setForm] = useState<CreateAdminAdPayload>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false, message: '', severity: 'success',
  });

  const showSnack = (message: string, severity: 'success' | 'error' = 'success') =>
    setSnackbar({ open: true, message, severity });

  const openCreate = () => {
    setEditingAd(null);
    setForm(EMPTY_FORM);
    setDialogOpen(true);
  };

  const openEdit = (ad: AdminAd) => {
    setEditingAd(ad);
    setForm({
      badge_text: ad.badgeText,
      title: ad.title,
      subtitle: ad.subtitle || '',
      action_text: ad.actionText,
      image_url: ad.imageUrl || '',
      start_date: ad.startDate,
      end_date: ad.endDate || '',
      target_screen: ad.targetScreen,
      target_id: ad.targetId || '',
      bg_color_hex: ad.bgColorHex || '#FFFFFF',
      accent_color_hex: ad.accentColorHex || '#009688',
      priority_order: ad.priorityOrder,
    });
    setDialogOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const base64 = await toBase64(file);
    setForm((f) => ({ ...f, image_url: base64 }));
  };

  const handleSave = async () => {
    if (!form.badge_text || !form.title || !form.action_text || !form.start_date || !form.target_screen) {
      showSnack('Completa los campos obligatorios', 'error');
      return;
    }
    setSaving(true);
    try {
      const payload = { ...form, end_date: form.end_date || undefined, target_id: form.target_id || undefined };
      if (editingAd) {
        await updateAd(editingAd.id, payload);
        showSnack('Anuncio actualizado');
      } else {
        await createAd(payload);
        showSnack('Anuncio creado y publicado');
      }
      setDialogOpen(false);
    } catch (e: any) {
      showSnack(e.message || 'Error al guardar', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (ad: AdminAd) => {
    if (!window.confirm(`¿Eliminar el anuncio "${ad.title}"?`)) return;
    try {
      await deleteAd(ad.id);
      showSnack('Anuncio eliminado');
    } catch (e: any) {
      showSnack(e.message || 'Error al eliminar', 'error');
    }
  };

  const handleToggle = async (ad: AdminAd) => {
    try {
      await toggleAd(ad.id);
      showSnack(`Anuncio ${ad.isActive ? 'desactivado' : 'activado'}`);
    } catch (e: any) {
      showSnack(e.message || 'Error', 'error');
    }
  };

  const filtered = ads.filter((ad) => {
    if (activeFilter === 'active') return ad.isActive;
    if (activeFilter === 'inactive') return !ad.isActive;
    return true;
  });

  const columns: GridColDef<AdminAd>[] = [
    {
      field: 'title',
      headerName: 'Anuncio',
      width: 280,
      renderCell: (p: GridRenderCellParams<AdminAd>) => (
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ height: '100%' }}>
          <Avatar
            src={p.row.imageUrl}
            variant="rounded"
            sx={{ width: 48, height: 48, bgcolor: p.row.bgColorHex || 'grey.200', flexShrink: 0 }}
          >
            <Campaign />
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="body2" fontWeight={600} noWrap>{p.row.title}</Typography>
            <Chip label={p.row.badgeText} size="small" sx={{ mt: 0.5, bgcolor: p.row.accentColorHex, color: '#fff', fontSize: 10 }} />
          </Box>
        </Stack>
      ),
    },
    {
      field: 'providerName',
      headerName: 'Origen',
      width: 130,
      renderCell: (p: GridRenderCellParams<AdminAd>) => (
        <Chip
          label={p.row.isAdminAd ? 'Admin' : p.row.providerName}
          color={p.row.isAdminAd ? 'primary' : 'default'}
          size="small"
        />
      ),
    },
    {
      field: 'targetScreen',
      headerName: 'Pantalla',
      width: 150,
      renderCell: (p: GridRenderCellParams<AdminAd>) => (
        <Typography variant="body2">{TARGET_SCREENS.find(s => s.value === p.row.targetScreen)?.label ?? p.row.targetScreen}</Typography>
      ),
    },
    {
      field: 'startDate',
      headerName: 'Fechas',
      width: 160,
      renderCell: (p: GridRenderCellParams<AdminAd>) => (
        <Box>
          <Typography variant="caption" display="block">Inicio: {p.row.startDate}</Typography>
          <Typography variant="caption" display="block" color="text.secondary">
            Fin: {p.row.endDate || 'Sin límite'}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'priorityOrder',
      headerName: 'Prioridad',
      width: 90,
      renderCell: (p: GridRenderCellParams<AdminAd>) => (
        <Chip label={`#${p.row.priorityOrder}`} size="small" variant="outlined" />
      ),
    },
    {
      field: 'isActive',
      headerName: 'Activo',
      width: 90,
      renderCell: (p: GridRenderCellParams<AdminAd>) => (
        <Tooltip title={p.row.isActive ? 'Desactivar' : 'Activar'}>
          <IconButton size="small" onClick={() => handleToggle(p.row)} color={p.row.isActive ? 'success' : 'default'}>
            {p.row.isActive ? <ToggleOn /> : <ToggleOff />}
          </IconButton>
        </Tooltip>
      ),
    },
    {
      field: 'actions',
      headerName: 'Acciones',
      width: 120,
      sortable: false,
      renderCell: (p: GridRenderCellParams<AdminAd>) => (
        <Stack direction="row" spacing={0.5} alignItems="center" sx={{ height: '100%' }}>
          <Tooltip title="Editar">
            <span>
              <IconButton size="small" onClick={() => openEdit(p.row)} disabled={!p.row.isAdminAd}>
                <Edit fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title={p.row.isAdminAd ? 'Eliminar' : 'Solo se pueden eliminar anuncios del admin'}>
            <span>
              <IconButton size="small" color="error" onClick={() => handleDelete(p.row)} disabled={!p.row.isAdminAd}>
                <Delete fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
        </Stack>
      ),
    },
  ];

  return (
    <DashboardLayout
      role="ADMIN"
      userProfile={CURRENT_ADMIN}
      appointments={appointments}
      notificationsVariant="professional"
      notificationsViewAllPath={notificationsViewAllPath}
    >
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Campaign sx={{ fontSize: 32, color: 'primary.main' }} />
            <Box>
              <Typography variant="h4" fontWeight={700}>Gestión de Anuncios</Typography>
              <Typography variant="body2" color="text.secondary">
                Crea y administra los anuncios del carrusel
              </Typography>
            </Box>
          </Stack>
          <Button variant="contained" startIcon={<Add />} onClick={openCreate} sx={{ textTransform: 'none' }}>
            Nuevo Anuncio
          </Button>
        </Stack>

        {/* Filtro */}
        <Stack direction="row" spacing={1} mb={2}>
          {(['all', 'active', 'inactive'] as const).map((f) => (
            <Chip
              key={f}
              label={f === 'all' ? 'Todos' : f === 'active' ? 'Activos' : 'Inactivos'}
              onClick={() => setActiveFilter(f)}
              color={activeFilter === f ? 'primary' : 'default'}
              variant={activeFilter === f ? 'filled' : 'outlined'}
            />
          ))}
        </Stack>

        {/* Grid */}
        <Box sx={{ height: 600, bgcolor: 'white', borderRadius: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <DataGrid
            rows={filtered}
            columns={columns}
            loading={isLoading}
            rowHeight={72}
            initialState={{ pagination: { paginationModel: { page: 0, pageSize: 10 } } }}
            pageSizeOptions={[10, 20, 50]}
            disableColumnResize
            disableRowSelectionOnClick
            sx={{
              border: 'none',
              '& .MuiDataGrid-cell': { display: 'flex', alignItems: 'center' },
              '& .MuiDataGrid-cell:focus': { outline: 'none' },
            }}
          />
        </Box>
      </Box>

      {/* Dialog Crear/Editar */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingAd ? 'Editar Anuncio' : 'Nuevo Anuncio'}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ pt: 1 }}>
            {/* Imagen */}
            <Box>
              <Typography variant="caption" color="text.secondary" mb={0.5} display="block">
                Imagen del anuncio
              </Typography>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar
                  src={form.image_url?.startsWith('data:') || form.image_url?.startsWith('http') ? form.image_url : undefined}
                  variant="rounded"
                  sx={{ width: 64, height: 64, bgcolor: 'grey.100' }}
                >
                  <Campaign />
                </Avatar>
                <Button variant="outlined" component="label" size="small" sx={{ textTransform: 'none' }}>
                  Subir imagen
                  <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
                </Button>
              </Stack>
            </Box>

            <Stack direction="row" spacing={2}>
              <TextField
                label="Badge / Etiqueta *"
                value={form.badge_text}
                onChange={(e) => setForm((f) => ({ ...f, badge_text: e.target.value }))}
                size="small"
                fullWidth
                placeholder="Ej: OFERTA"
              />
              <TextField
                label="Prioridad"
                type="number"
                value={form.priority_order}
                onChange={(e) => setForm((f) => ({ ...f, priority_order: Number(e.target.value) }))}
                size="small"
                sx={{ width: 110 }}
                inputProps={{ min: 1, max: 99 }}
              />
            </Stack>

            <TextField
              label="Título *"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              size="small"
              fullWidth
              placeholder="Ej: 20% OFF en consultas"
            />

            <TextField
              label="Descripción"
              value={form.subtitle}
              onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))}
              size="small"
              fullWidth
              multiline
              rows={2}
            />

            <TextField
              label="Texto del botón *"
              value={form.action_text}
              onChange={(e) => setForm((f) => ({ ...f, action_text: e.target.value }))}
              size="small"
              fullWidth
              placeholder="Ej: Ver más"
            />

            <Stack direction="row" spacing={2}>
              <TextField
                label="Fecha inicio *"
                type="date"
                value={form.start_date}
                onChange={(e) => setForm((f) => ({ ...f, start_date: e.target.value }))}
                size="small"
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Fecha fin"
                type="date"
                value={form.end_date}
                onChange={(e) => setForm((f) => ({ ...f, end_date: e.target.value }))}
                size="small"
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Stack>

            <FormControl size="small" fullWidth>
              <InputLabel>Pantalla destino *</InputLabel>
              <Select
                value={form.target_screen}
                label="Pantalla destino *"
                onChange={(e) => setForm((f) => ({ ...f, target_screen: e.target.value }))}
              >
                {TARGET_SCREENS.map((s) => (
                  <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="ID destino (opcional)"
              value={form.target_id}
              onChange={(e) => setForm((f) => ({ ...f, target_id: e.target.value }))}
              size="small"
              fullWidth
              placeholder="ID del médico, farmacia, etc."
            />

            <Stack direction="row" spacing={2}>
              <Box flex={1}>
                <Typography variant="caption" color="text.secondary">Color de fondo</Typography>
                <Stack direction="row" spacing={1} alignItems="center" mt={0.5}>
                  <input
                    type="color"
                    value={form.bg_color_hex}
                    onChange={(e) => setForm((f) => ({ ...f, bg_color_hex: e.target.value }))}
                    style={{ width: 40, height: 32, border: 'none', cursor: 'pointer', borderRadius: 4 }}
                  />
                  <Typography variant="body2">{form.bg_color_hex}</Typography>
                </Stack>
              </Box>
              <Box flex={1}>
                <Typography variant="caption" color="text.secondary">Color acento</Typography>
                <Stack direction="row" spacing={1} alignItems="center" mt={0.5}>
                  <input
                    type="color"
                    value={form.accent_color_hex}
                    onChange={(e) => setForm((f) => ({ ...f, accent_color_hex: e.target.value }))}
                    style={{ width: 40, height: 32, border: 'none', cursor: 'pointer', borderRadius: 4 }}
                  />
                  <Typography variant="body2">{form.accent_color_hex}</Typography>
                </Stack>
              </Box>
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setDialogOpen(false)} sx={{ textTransform: 'none' }}>Cancelar</Button>
          <Button variant="contained" onClick={handleSave} disabled={saving} sx={{ textTransform: 'none' }}>
            {saving ? 'Guardando...' : editingAd ? 'Guardar cambios' : 'Crear anuncio'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={snackbar.severity} variant="filled" onClose={() => setSnackbar((s) => ({ ...s, open: false }))}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </DashboardLayout>
  );
};

import {
  Add, Campaign, Delete, Edit, ToggleOff, ToggleOn,
} from "@mui/icons-material";
import {
  Avatar, Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle,
  FormControl, IconButton, InputLabel, MenuItem, Select, Stack, TextField, Tooltip, Typography,
} from "@mui/material";
import { type GridColDef, type GridRenderCellParams, type GridPaginationModel } from "@mui/x-data-grid";
import { useState, useMemo } from "react";
import { DashboardLayout } from "../../../../shared/layouts/DashboardLayout";
import type { CreateAdminAdPayload, AdminAd } from "../../infrastructure/admin-ads.api";
import { useAdminAds } from "../hooks/useAdminAds";
import { useAdminNotificationsLayout } from "../hooks/useAdminNotificationsLayout";
import { DataTable, TableToolbar, TablePageLayout } from "../../../../shared/components/DataTable";
import { useFeedbackStore } from "../../../../app/store/feedback.store";
import { FEEDBACK } from "../../../../shared/constants/feedback-messages";

const CURRENT_ADMIN = { name: "Admin General", roleLabel: "Super Admin", initials: "AG" };

const STATUS_COLORS: Record<string, "warning" | "success" | "error" | "default"> = {
  PENDING: "warning", APPROVED: "success", REJECTED: "error",
};
const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pendiente", APPROVED: "Aprobado", REJECTED: "Rechazado",
};
const TARGET_SCREENS = [
  { value: "Home", label: "Inicio" },
  { value: "DoctorDetail", label: "Detalle Médico" },
  { value: "FarmaciaDetail", label: "Detalle Farmacia" },
  { value: "LaboratorioDetail", label: "Detalle Laboratorio" },
  { value: "AmbulanciaDetail", label: "Detalle Ambulancia" },
];
const EMPTY_FORM: CreateAdminAdPayload = {
  badge_text: "", title: "", subtitle: "", action_text: "Ver más", image_url: "",
  start_date: new Date().toISOString().split("T")[0], end_date: "",
  target_screen: "Home", target_id: "", bg_color_hex: "#FFFFFF", accent_color_hex: "#009688", priority_order: 5,
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
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 10 });
  const { ads, pagination, isLoading, createAd, updateAd, deleteAd, toggleAd, refetch } = useAdminAds();
  const { appointments, notificationsViewAllPath } = useAdminNotificationsLayout();
  const feedback = useFeedbackStore();

  const handlePaginationChange = (newModel: GridPaginationModel) => {
    setPaginationModel(newModel);
    refetch(newModel.page + 1, newModel.pageSize);
  };

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAd, setEditingAd] = useState<AdminAd | null>(null);
  const [form, setForm] = useState<CreateAdminAdPayload>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");

  const openCreate = () => { setEditingAd(null); setForm(EMPTY_FORM); setDialogOpen(true); };
  const openEdit = (ad: AdminAd) => {
    setEditingAd(ad);
    setForm({
      badge_text: ad.badgeText, title: ad.title, subtitle: ad.subtitle || "",
      action_text: ad.actionText, image_url: ad.imageUrl || "",
      start_date: ad.startDate, end_date: ad.endDate || "",
      target_screen: ad.targetScreen, target_id: ad.targetId || "",
      bg_color_hex: ad.bgColorHex || "#FFFFFF", accent_color_hex: ad.accentColorHex || "#009688",
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
      feedback.showFeedback("error", FEEDBACK.ERROR.VALIDATION.title, "Completa los campos obligatorios"); return;
    }
    setSaving(true);
    try {
      const payload = { ...form, end_date: form.end_date || undefined, target_id: form.target_id || undefined };
      if (editingAd) {
        await updateAd(editingAd.id, payload);
        feedback.showFeedback("success", FEEDBACK.SUCCESS.UPDATE.title, FEEDBACK.SUCCESS.UPDATE.message);
      } else {
        await createAd(payload);
        feedback.showFeedback("success", FEEDBACK.SUCCESS.SAVE.title, FEEDBACK.SUCCESS.SAVE.message);
      }
      setDialogOpen(false);
    } catch (e: any) {
      feedback.showFeedback("error", FEEDBACK.ERROR.GENERIC.title, e.message || FEEDBACK.ERROR.GENERIC.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (ad: AdminAd) => {
    feedback.showDelete("Eliminar anuncio", `¿Estás seguro de eliminar el anuncio "${ad.title}"?`, async () => {
      try {
        await deleteAd(ad.id);
        feedback.showFeedback("success", FEEDBACK.SUCCESS.DELETE.title, FEEDBACK.SUCCESS.DELETE.message);
      } catch (e: any) {
        feedback.showFeedback("error", FEEDBACK.ERROR.GENERIC.title, e.message || FEEDBACK.ERROR.GENERIC.message);
      }
    });
  };

  const handleToggle = async (ad: AdminAd) => {
    try {
      await toggleAd(ad.id);
      feedback.showFeedback("success", FEEDBACK.SUCCESS.UPDATE.title, `Anuncio ${ad.isActive ? "desactivado" : "activado"}`);
    } catch (e: any) {
      feedback.showFeedback("error", FEEDBACK.ERROR.GENERIC.title, e.message || FEEDBACK.ERROR.GENERIC.message);
    }
  };

  const filtered = useMemo(() => {
    if (activeFilter === "active") return ads.filter((a) => a.isActive);
    if (activeFilter === "inactive") return ads.filter((a) => !a.isActive);
    return ads;
  }, [ads, activeFilter]);

  const columns: GridColDef<AdminAd>[] = [
    {
      field: "title",
      headerName: "Anuncio",
      width: 320,
      renderCell: (p: GridRenderCellParams<AdminAd>) => (
        <Stack direction="row" spacing={1} alignItems="center" sx={{ height: "100%", px: 1 }}>
          <Avatar src={p.row.imageUrl} variant="rounded"
            sx={{ width: 48, height: 48, bgcolor: p.row.bgColorHex || "grey.200", flexShrink: 0 }}>
            <Campaign />
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            {p.row.badgeText && (
              <Chip label={p.row.badgeText} size="small"
                sx={{ mb: 0.3, bgcolor: p.row.accentColorHex, color: "#fff", fontSize: 12, fontWeight: 700 }} />
            )}
            <Typography variant="body2" fontWeight={600} noWrap>{p.row.title}</Typography>
            {p.row.subtitle && (
              <Typography variant="caption" color="text.secondary" noWrap sx={{ maxWidth: 200, display: "block" }}>
                {p.row.subtitle}
              </Typography>
            )}
          </Box>
        </Stack>
      ),
    },
    {
      field: "status",
      headerName: "Estado",
      width: 120,
      renderCell: (p) => (
        <Chip label={STATUS_LABELS[p.row.status] || p.row.status} color={STATUS_COLORS[p.row.status] || "default"} size="small" />
      ),
    },
    {
      field: "providerName",
      headerName: "Origen",
      width: 130,
      renderCell: (p) => (
        <Chip label={p.row.isAdminAd ? "Admin" : p.row.providerName} color={p.row.isAdminAd ? "primary" : "default"} size="small" />
      ),
    },
    {
      field: "targetScreen",
      headerName: "Pantalla",
      width: 150,
      renderCell: (p) => (
        <Typography variant="body2">{TARGET_SCREENS.find((s) => s.value === p.row.targetScreen)?.label ?? p.row.targetScreen}</Typography>
      ),
    },
    {
      field: "startDate",
      headerName: "Fechas",
      width: 170,
      renderCell: (p) => (
        <Box>
          <Typography variant="caption" display="block">Inicio: {p.row.startDate}</Typography>
          <Typography variant="caption" display="block" color="text.secondary">Fin: {p.row.endDate || "Sin límite"}</Typography>
        </Box>
      ),
    },
    {
      field: "isActive",
      headerName: "Activo",
      width: 80,
      renderCell: (p) => (
        <Tooltip title={p.row.isActive ? "Desactivar" : "Activar"}>
          <IconButton size="small" onClick={() => handleToggle(p.row)} color={p.row.isActive ? "success" : "default"}>
            {p.row.isActive ? <ToggleOn /> : <ToggleOff />}
          </IconButton>
        </Tooltip>
      ),
    },
    {
      field: "actions",
      headerName: "Acciones",
      width: 110,
      sortable: false,
      renderCell: (p) => (
        <Stack direction="row" spacing={0.5} alignItems="center" sx={{ height: "100%" }}>
          <Tooltip title="Editar"><IconButton size="small" onClick={() => openEdit(p.row)}><Edit fontSize="small" /></IconButton></Tooltip>
          <Tooltip title="Eliminar"><IconButton size="small" color="error" onClick={() => handleDelete(p.row)}><Delete fontSize="small" /></IconButton></Tooltip>
        </Stack>
      ),
    },
  ];

  return (
    <DashboardLayout role="ADMIN" userProfile={CURRENT_ADMIN} appointments={appointments}
      notificationsVariant="professional" notificationsViewAllPath={notificationsViewAllPath}>
      <TablePageLayout>
        <TableToolbar
          title="Gestión de Anuncios"
          subtitle="Crea y administra los anuncios del carrusel"
          titleIcon={<Campaign sx={{ fontSize: 32 }} />}
          filters={[
            {
              key: "active",
              label: "Estado",
              value: activeFilter,
              onChange: setActiveFilter,
              options: [
                { value: "all", label: "Todos" },
                { value: "active", label: "Activos" },
                { value: "inactive", label: "Inactivos" },
              ],
            },
          ]}
          actions={[{ label: "Nuevo Anuncio", icon: <Add />, onClick: openCreate, variant: "contained" }]}
          sx={{ mb: 3 }}
        />

        <DataTable<AdminAd>
          rows={filtered}
          columns={columns}
          rowCount={pagination.total}
          paginationModel={paginationModel}
          onPaginationModelChange={handlePaginationChange}
          pageSizeOptions={[10, 20, 50]}
          loading={isLoading}
          rowHeight={80}
          emptyTitle="Sin anuncios"
          emptyDescription="No hay anuncios que coincidan con el filtro seleccionado."
        />

        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>{editingAd ? "Editar Anuncio" : "Nuevo Anuncio"}</DialogTitle>
          <DialogContent dividers>
            <Stack spacing={2} sx={{ pt: 1 }}>
              <Box>
                <Typography variant="caption" color="text.secondary" mb={0.5} display="block">Imagen del anuncio</Typography>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar src={form.image_url?.startsWith("data:") || form.image_url?.startsWith("http") ? form.image_url : undefined}
                    variant="rounded" sx={{ width: 64, height: 64, bgcolor: "grey.100" }}>
                    <Campaign />
                  </Avatar>
                  <Box>
                    <Button variant="outlined" component="label" size="small" sx={{ textTransform: "none" }}>
                      Subir imagen
                      <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
                    </Button>
                    <Typography variant="caption" display="block" color="text.secondary" mt={0.5}>
                      Recomendado: 1200 × 500 px · Máx. 5MB
                    </Typography>
                  </Box>
                </Stack>
              </Box>
              <TextField label="Badge / Etiqueta *" value={form.badge_text} size="small" fullWidth placeholder="Ej: OFERTA"
                onChange={(e) => setForm((f) => ({ ...f, badge_text: e.target.value }))} />
              <TextField label="Título *" value={form.title} size="small" fullWidth placeholder="Ej: 20% OFF en consultas"
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
              <TextField label="Descripción" value={form.subtitle} size="small" fullWidth multiline rows={2}
                onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))} />
              <TextField label="Texto del botón *" value={form.action_text} size="small" fullWidth placeholder="Ej: Ver más"
                onChange={(e) => setForm((f) => ({ ...f, action_text: e.target.value }))} />
              <Stack direction="row" spacing={2}>
                <TextField label="Fecha inicio *" type="date" value={form.start_date} size="small" fullWidth InputLabelProps={{ shrink: true }}
                  onChange={(e) => setForm((f) => ({ ...f, start_date: e.target.value }))} />
                <TextField label="Fecha fin" type="date" value={form.end_date} size="small" fullWidth InputLabelProps={{ shrink: true }}
                  onChange={(e) => setForm((f) => ({ ...f, end_date: e.target.value }))} />
              </Stack>
              <FormControl size="small" fullWidth>
                <InputLabel>Pantalla destino *</InputLabel>
                <Select value={form.target_screen} label="Pantalla destino *"
                  onChange={(e) => setForm((f) => ({ ...f, target_screen: e.target.value }))}>
                  {TARGET_SCREENS.map((s) => <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>)}
                </Select>
              </FormControl>
              <Stack direction="row" spacing={2}>
                <Box flex={1}>
                  <Typography variant="caption" color="text.secondary">Color de fondo</Typography>
                  <Stack direction="row" spacing={1} alignItems="center" mt={0.5}>
                    <input type="color" value={form.bg_color_hex}
                      onChange={(e) => setForm((f) => ({ ...f, bg_color_hex: e.target.value }))}
                      style={{ width: 40, height: 32, border: "none", cursor: "pointer", borderRadius: 4 }} />
                    <Typography variant="body2">{form.bg_color_hex}</Typography>
                  </Stack>
                </Box>
                <Box flex={1}>
                  <Typography variant="caption" color="text.secondary">Color acento</Typography>
                  <Stack direction="row" spacing={1} alignItems="center" mt={0.5}>
                    <input type="color" value={form.accent_color_hex}
                      onChange={(e) => setForm((f) => ({ ...f, accent_color_hex: e.target.value }))}
                      style={{ width: 40, height: 32, border: "none", cursor: "pointer", borderRadius: 4 }} />
                    <Typography variant="body2">{form.accent_color_hex}</Typography>
                  </Stack>
                </Box>
              </Stack>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2 }}>
            <Button onClick={() => setDialogOpen(false)} sx={{ textTransform: "none" }}>Cancelar</Button>
            <Button variant="contained" onClick={handleSave} disabled={saving} sx={{ textTransform: "none" }}>
              {saving ? "Guardando..." : editingAd ? "Guardar cambios" : "Crear anuncio"}
            </Button>
          </DialogActions>
        </Dialog>
      </TablePageLayout>
    </DashboardLayout>
  );
};

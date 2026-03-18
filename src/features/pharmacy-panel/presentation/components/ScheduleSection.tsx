import { AccessTime, Edit } from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useState } from "react";
import type { PharmacyProfile, WorkSchedule } from "../../domain/pharmacy-profile.entity";
import { EditScheduleModal } from "./EditScheduleModal";
import { useUpdatePharmacyProfile } from "../hooks/usePharmacyProfile";

interface ScheduleSectionProps {
  profile: PharmacyProfile;
  onUpdate: (updatedProfile: PharmacyProfile) => void;
}

const DAYS_LABELS: Record<string, string> = {
  monday: "Lunes",
  tuesday: "Martes",
  wednesday: "Miércoles",
  thursday: "Jueves",
  friday: "Viernes",
  saturday: "Sábado",
  sunday: "Domingo",
};

export const ScheduleSection = ({ profile, onUpdate }: ScheduleSectionProps) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [snackMsg, setSnackMsg] = useState<string | null>(null);
  const { mutateAsync: updateProfile, isPending } = useUpdatePharmacyProfile();

  const handleSave = async (updatedSchedule: WorkSchedule[]) => {
    try {
      const updated = await updateProfile({ ...profile, schedule: updatedSchedule });
      onUpdate(updated);
      setIsEditOpen(false);
      setSnackMsg("Horarios guardados correctamente.");
    } catch (err: any) {
      setSnackMsg(err?.message || "Error al guardar horarios.");
    }
  };

  return (
    <Box>
      <Paper
        elevation={0}
        sx={{
          p: 4,
          borderRadius: 3,
          border: "1px solid",
          borderColor: "grey.200",
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Box>
            <Typography variant="h5" fontWeight={700}>
              Horarios de Atención
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Configura los días y horas de atención de tu farmacia
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<Edit />}
            onClick={() => setIsEditOpen(true)}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Editar Horarios
          </Button>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "grey.50" }}>
                <TableCell sx={{ fontWeight: 600 }}>Día</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="center">
                  Estado
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="right">
                  Horario
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {profile.schedule && profile.schedule.length > 0 ? (
                profile.schedule.map((schedule: WorkSchedule) => (
                  <TableRow key={schedule.day} hover>
                    <TableCell>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <AccessTime sx={{ color: "text.secondary", fontSize: 20 }} />
                        <Typography variant="body1" fontWeight={500}>
                          {DAYS_LABELS[schedule.day] || schedule.day}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={schedule.isOpen ? "Abierto" : "Cerrado"}
                        color={schedule.isOpen ? "success" : "default"}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body1" fontWeight={500}>
                        {schedule.isOpen
                          ? `${schedule.startTime} - ${schedule.endTime}`
                          : "Cerrado"}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      No hay horarios configurados
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Modal de Edición */}
      <EditScheduleModal
        open={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        schedule={profile.schedule || []}
        onSave={handleSave}
        isSaving={isPending}
      />
      {snackMsg && (
        <Box sx={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, bgcolor: snackMsg.includes('Error') ? 'error.main' : 'success.main', color: 'white', px: 3, py: 1.5, borderRadius: 2, boxShadow: 3 }}>
          {snackMsg}
          <Button size="small" sx={{ color: 'white', ml: 1 }} onClick={() => setSnackMsg(null)}>✕</Button>
        </Box>
      )}
    </Box>
  );
};


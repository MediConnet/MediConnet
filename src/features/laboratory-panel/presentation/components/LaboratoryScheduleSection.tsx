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
import type { LaboratoryDashboard, WorkSchedule } from "../../domain/LaboratoryDashboard.entity";
import { EditScheduleModal } from "./EditScheduleModal";
import { updateLaboratoryProfileAPI } from "../../infrastructure/laboratories.repository";

interface LaboratoryScheduleSectionProps {
  data: LaboratoryDashboard;
  onUpdate: (updatedData: LaboratoryDashboard) => void;
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

export const LaboratoryScheduleSection = ({
  data,
  onUpdate,
}: LaboratoryScheduleSectionProps) => {
  const [isEditOpen, setIsEditOpen] = useState(false);

  const schedule = data.laboratory.workSchedule || [];

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
              Configura los días y horas de atención de tu laboratorio
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
              {schedule.length > 0 ? (
                schedule.map((item: WorkSchedule) => (
                  <TableRow key={item.day} hover>
                    <TableCell>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <AccessTime sx={{ color: "text.secondary", fontSize: 20 }} />
                        <Typography variant="body1" fontWeight={500}>
                          {DAYS_LABELS[item.day] || item.day}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={item.isOpen ? "Abierto" : "Cerrado"}
                        color={item.isOpen ? "success" : "default"}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body1" fontWeight={500}>
                        {item.isOpen
                          ? `${item.startTime} - ${item.endTime}`
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
        schedule={schedule}
        onSave={async (updatedSchedule) => {
          try {
            await updateLaboratoryProfileAPI({
              workSchedule: updatedSchedule.map((s) => ({
                day: s.day as
                  | "monday"
                  | "tuesday"
                  | "wednesday"
                  | "thursday"
                  | "friday"
                  | "saturday"
                  | "sunday",
                enabled: !!s.isOpen,
                startTime: s.startTime,
                endTime: s.endTime,
              })),
            });
          } catch (e) {
            console.error("Error guardando horarios laboratorio:", e);
          }

          const updatedData = {
            ...data,
            laboratory: {
              ...data.laboratory,
              workSchedule: updatedSchedule,
            },
          };
          onUpdate(updatedData);
        }}
      />
    </Box>
  );
};


import { AccessTime, Edit } from "@mui/icons-material";
import {
  Box,
  Button,
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
import type { SupplyDashboard, WorkSchedule } from "../../domain/SupplyDashboard.entity";
import { EditScheduleModal } from "./EditScheduleModal";

interface SuppliesScheduleSectionProps {
  data: SupplyDashboard;
  onUpdate: (updatedData: SupplyDashboard) => void;
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

export const SuppliesScheduleSection = ({
  data,
  onUpdate,
}: SuppliesScheduleSectionProps) => {
  const [isEditOpen, setIsEditOpen] = useState(false);

  const defaultSchedule: WorkSchedule[] = [
    { day: "monday", enabled: true, startTime: "08:00", endTime: "18:00" },
    { day: "tuesday", enabled: true, startTime: "08:00", endTime: "18:00" },
    { day: "wednesday", enabled: true, startTime: "08:00", endTime: "18:00" },
    { day: "thursday", enabled: true, startTime: "08:00", endTime: "18:00" },
    { day: "friday", enabled: true, startTime: "08:00", endTime: "18:00" },
    { day: "saturday", enabled: false, startTime: "08:00", endTime: "18:00" },
    { day: "sunday", enabled: false, startTime: "08:00", endTime: "18:00" },
  ];

  const schedule = data.supply.workSchedule || defaultSchedule;

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
          mb={4}
        >
          <Box>
            <Typography variant="h5" fontWeight={700}>
              Horarios de Atención
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Configura los días y horas de atención de tu negocio
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
              <TableRow sx={{ bgcolor: "#f9fafb" }}>
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
              {schedule.map((daySchedule) => (
                <TableRow key={daySchedule.day} hover>
                  <TableCell>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <AccessTime sx={{ color: "text.secondary", fontSize: 20 }} />
                      <Typography fontWeight={500}>
                        {DAYS_LABELS[daySchedule.day] || daySchedule.day}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell align="center">
                    <Typography
                      variant="body2"
                      color={daySchedule.enabled ? "success.main" : "text.secondary"}
                      fontWeight={600}
                    >
                      {daySchedule.enabled ? "Abierto" : "Cerrado"}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    {daySchedule.enabled ? (
                      <Typography variant="body2" fontWeight={500}>
                        {daySchedule.startTime} - {daySchedule.endTime}
                      </Typography>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        -
                      </Typography>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <EditScheduleModal
        open={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        data={data}
        onSave={(updatedData) => {
          onUpdate(updatedData);
        }}
      />
    </Box>
  );
};


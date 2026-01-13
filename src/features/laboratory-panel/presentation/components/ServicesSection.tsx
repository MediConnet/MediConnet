import { Add, Edit, Science } from "@mui/icons-material";
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
import type { LaboratoryDashboard, LaboratoryStudy } from "../../domain/LaboratoryDashboard.entity";
import { EditServicesModal } from "./EditServicesModal";

interface ServicesSectionProps {
  data: LaboratoryDashboard;
  onUpdate: (updatedData: LaboratoryDashboard) => void;
}

export const ServicesSection = ({
  data,
  onUpdate,
}: ServicesSectionProps) => {
  const [isEditOpen, setIsEditOpen] = useState(false);

  const studies = data.laboratory.studies || [];

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
              Servicios / Exámenes
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Gestiona los tipos de exámenes que ofrece tu laboratorio
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={studies.length > 0 ? <Edit /> : <Add />}
            onClick={() => setIsEditOpen(true)}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            {studies.length > 0 ? "Editar Exámenes" : "Agregar Exámenes"}
          </Button>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "grey.50" }}>
                <TableCell sx={{ fontWeight: 600 }}>Tipo de Examen</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Preparación Básica</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {studies.length > 0 ? (
                studies.map((study: LaboratoryStudy) => (
                  <TableRow key={study.id} hover>
                    <TableCell>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Science sx={{ color: "primary.main", fontSize: 20 }} />
                        <Typography variant="body1" fontWeight={500}>
                          {study.name}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {study.preparation || "Sin preparación especificada"}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={2} align="center" sx={{ py: 4 }}>
                    <Stack spacing={2} alignItems="center">
                      <Science sx={{ fontSize: 48, color: "grey.400" }} />
                      <Typography variant="body2" color="text.secondary">
                        No hay exámenes configurados
                      </Typography>
                      <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() => setIsEditOpen(true)}
                        sx={{ textTransform: "none" }}
                      >
                        Agregar Primer Examen
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Modal de Edición */}
      <EditServicesModal
        open={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        studies={studies}
        onSave={(updatedStudies) => {
          const updatedData = {
            ...data,
            laboratory: {
              ...data.laboratory,
              studies: updatedStudies,
            },
          };
          onUpdate(updatedData);
        }}
      />
    </Box>
  );
};


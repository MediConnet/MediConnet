import {
  Box,
  Typography,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  Notifications as NotifIcon,
  Event,
  Block,
  Message as MessageIcon,
  Info,
  CheckCircle,
  Cancel,
  Schedule,
} from "@mui/icons-material";
import { useState, useEffect, useCallback } from "react";
import {
  getClinicAssociatedAppointmentsAPI,
  getDateBlockRequestsAPI,
  getReceptionMessagesAPI,
} from "../../association/api/clinic-associated.api";
import { useClinicAssociatedDoctor } from "../../association/hooks/useClinicAssociatedDoctor";
import { LoadingSpinner } from "../../../shared/components/LoadingSpinner";
import { logApiError } from "../../../shared/lib/api-error";
import type { ClinicAssociatedAppointment } from "../../association/types/ClinicAssociatedDoctor.entity";
import type { DateBlockRequest } from "../../association/types/ClinicAssociatedDoctor.entity";
import type { ReceptionMessage } from "../../association/types/ClinicAssociatedDoctor.entity";

interface NotificationItem {
  id: string;
  type: "appointment" | "block" | "message";
  title: string;
  description: string;
  date: string;
  icon: React.ReactNode;
  color: string;
}

const formatDateTime = (dateStr: string): string => {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateStr;
  }
};

export const DoctorNotificationsSection = () => {
  const { clinicInfo } = useClinicAssociatedDoctor({ fetchProfile: false });

  const [doctorNotifications, setDoctorNotifications] = useState<NotificationItem[]>([]);
  const [clinicNotifications, setClinicNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadNotifications = useCallback(async () => {
    setLoading(true);

    try {
      const [aptData, blockData, msgData] = await Promise.all([
        getClinicAssociatedAppointmentsAPI({ limit: 10 }).catch(() => [] as ClinicAssociatedAppointment[]),
        getDateBlockRequestsAPI({ limit: 10 }).catch(() => [] as DateBlockRequest[]),
        getReceptionMessagesAPI({ limit: 10 }).catch(() => [] as ReceptionMessage[]),
      ]);

      const doctorItems: NotificationItem[] = [];
      const clinicItems: NotificationItem[] = [];

      for (const apt of aptData) {
        if (apt.date) {
          doctorItems.push({
            id: `apt-${apt.id}`,
            type: "appointment",
            title: `Cita ${apt.status === "COMPLETED" ? "completada" : apt.status === "CANCELLED" ? "cancelada" : "programada"}`,
            description: `${apt.patientName || "Paciente"} — ${apt.reason || "Sin motivo"}`,
            date: apt.date,
            icon: apt.status === "COMPLETED" ? <CheckCircle /> : apt.status === "CANCELLED" ? <Cancel /> : <Event />,
            color: apt.status === "COMPLETED" ? "#14b8a6" : apt.status === "CANCELLED" ? "#ef4444" : "#f59e0b",
          });
        }
      }

      for (const block of blockData) {
        doctorItems.push({
          id: `block-${block.id}`,
          type: "block",
          title: `Bloqueo ${block.status === "approved" ? "aprobado" : block.status === "rejected" ? "rechazado" : "pendiente"}`,
          description: `${formatDateTime(block.startDate)} – ${formatDateTime(block.endDate)}: ${block.reason}`,
          date: block.createdAt,
          icon: block.status === "approved" ? <CheckCircle /> : block.status === "rejected" ? <Cancel /> : <Block />,
          color: block.status === "approved" ? "#14b8a6" : block.status === "rejected" ? "#ef4444" : "#f59e0b",
        });
      }

      for (const msg of msgData) {
        clinicItems.push({
          id: `msg-${msg.id}`,
          type: "message",
          title: msg.from === "reception" ? "Mensaje de la clínica" : "Tu mensaje",
          description: msg.message || "Sin contenido",
          date: msg.timestamp,
          icon: <MessageIcon />,
          color: "#3b82f6",
        });
      }

      doctorItems.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      clinicItems.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      setDoctorNotifications(doctorItems);
      setClinicNotifications(clinicItems);
    } catch (err) {
      logApiError("DoctorNotificationsSection", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  if (!clinicInfo) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (loading) {
    return <LoadingSpinner text="Cargando notificaciones..." />;
  }

  const hasAny = doctorNotifications.length > 0 || clinicNotifications.length > 0;

  if (!hasAny) {
    return (
      <Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
          <NotifIcon sx={{ fontSize: 32, color: "#14b8a6" }} />
          <Typography variant="h5" sx={{ fontWeight: 700 }}>Notificaciones</Typography>
        </Box>
        <Card>
          <CardContent sx={{ textAlign: "center", py: 6 }}>
            <NotifIcon sx={{ fontSize: 64, color: "#e5e7eb", mb: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              No hay notificaciones
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Las notificaciones aparecerán aquí cuando tengas actividad.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
        <NotifIcon sx={{ fontSize: 32, color: "#14b8a6" }} />
        <Typography variant="h5" sx={{ fontWeight: 700 }}>Notificaciones</Typography>
      </Box>

      <Alert severity="info" icon={<Info />} sx={{ mb: 3 }}>
        <Typography variant="body2" fontWeight={600}>Centro de notificaciones</Typography>
        <Typography variant="body2" sx={{ mt: 0.5 }}>
          Aquí puedes ver tus citas, solicitudes de bloqueo y mensajes de la clínica.
        </Typography>
      </Alert>

      {doctorNotifications.length > 0 && (
        <>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
            <Schedule sx={{ fontSize: 20, color: "#14b8a6" }} />
            Mis Notificaciones
          </Typography>
          <Card sx={{ mb: 4 }}>
            <CardContent sx={{ p: 0 }}>
              <List disablePadding>
                {doctorNotifications.map((item, idx) => (
                  <Box key={item.id}>
                    {idx > 0 && <Divider component="li" />}
                    <ListItem>
                      <ListItemIcon sx={{ color: item.color, minWidth: 40 }}>
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {item.title}
                            </Typography>
                            <Chip
                              label={item.type === "appointment" ? "Cita" : item.type === "block" ? "Bloqueo" : "Mensaje"}
                              size="small"
                              variant="outlined"
                              sx={{ height: 20, fontSize: 10 }}
                            />
                          </Box>
                        }
                        secondary={
                          <>
                            <Typography variant="caption" color="text.secondary" component="span">
                              {item.description}
                            </Typography>
                            <br />
                            <Typography variant="caption" color="text.disabled" component="span">
                              {formatDateTime(item.date)}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                  </Box>
                ))}
              </List>
            </CardContent>
          </Card>
        </>
      )}

      {clinicNotifications.length > 0 && (
        <>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
            <MessageIcon sx={{ fontSize: 20, color: "#3b82f6" }} />
            Notificaciones de Clínica
          </Typography>
          <Card>
            <CardContent sx={{ p: 0 }}>
              <List disablePadding>
                {clinicNotifications.map((item, idx) => (
                  <Box key={item.id}>
                    {idx > 0 && <Divider component="li" />}
                    <ListItem>
                      <ListItemIcon sx={{ color: item.color, minWidth: 40 }}>
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {item.title}
                            </Typography>
                            <Chip
                              label="Mensaje"
                              size="small"
                              variant="outlined"
                              sx={{ height: 20, fontSize: 10 }}
                            />
                          </Box>
                        }
                        secondary={
                          <>
                            <Typography variant="caption" color="text.secondary" component="span">
                              {item.description}
                            </Typography>
                            <br />
                            <Typography variant="caption" color="text.disabled" component="span">
                              {formatDateTime(item.date)}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                  </Box>
                ))}
              </List>
            </CardContent>
          </Card>
        </>
      )}
    </Box>
  );
};
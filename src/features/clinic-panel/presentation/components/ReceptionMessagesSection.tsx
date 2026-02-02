import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Stack,
  Paper,
  Avatar,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Send, Message as MessageIcon, Person } from "@mui/icons-material";
import { useState, useEffect, useRef } from "react";
import { useClinicReceptionMessages } from "../hooks/useClinicReceptionMessages";
import { useClinicDoctors } from "../hooks/useClinicDoctors";
import { LoadingSpinner } from "../../../../shared/components/LoadingSpinner";
 

interface ReceptionMessagesSectionProps {
  clinicId: string;
}

export const ReceptionMessagesSection = ({ clinicId }: ReceptionMessagesSectionProps) => {
  const { doctors } = useClinicDoctors(clinicId);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>("");
  const [messageText, setMessageText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, loading, sending, sendMessage, markAsRead } = useClinicReceptionMessages(
    clinicId,
    selectedDoctorId || undefined
  );

  useEffect(() => {
    // Scroll al final cuando hay nuevos mensajes
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    // Marcar mensajes no leídos como leídos cuando se cargan
    const unreadIds = messages.filter((msg) => !msg.isRead && msg.from === "doctor").map((msg) => msg.id);
    if (unreadIds.length > 0) {
      markAsRead(unreadIds);
    }
  }, [messages, markAsRead]);

  const handleSend = async () => {
    if (!messageText.trim() || !selectedDoctorId) return;
    try {
      await sendMessage(messageText.trim(), selectedDoctorId);
      setMessageText("");
    } catch (error) {
      console.error("Error enviando mensaje:", error);
      alert("Error al enviar el mensaje");
    }
  };

  const formatTime = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
    } catch {
      return timestamp;
    }
  };

  const formatDate = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" });
    } catch {
      return timestamp;
    }
  };

  const selectedDoctor = doctors.find((d) => d.id === selectedDoctorId);

  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
        Mensajería con Médicos
      </Typography>

      <Card>
        <CardContent>
          {/* Selector de médico */}
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Seleccionar Médico</InputLabel>
            <Select
              value={selectedDoctorId}
              label="Seleccionar Médico"
              onChange={(e) => setSelectedDoctorId(e.target.value)}
            >
              <MenuItem value="">
                <em>Selecciona un médico</em>
              </MenuItem>
              {doctors
                .filter((d) => d.isActive)
                .map((doctor) => (
                  <MenuItem key={doctor.id} value={doctor.id}>
                    {doctor.name || doctor.email} - {doctor.specialty || "Sin especialidad"}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>

          {selectedDoctorId ? (
            <>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                {selectedDoctor?.name || selectedDoctor?.email}
                {selectedDoctor?.specialty && ` - ${selectedDoctor.specialty}`}
              </Typography>

              {/* Área de mensajes */}
              <Paper
                sx={{
                  height: 400,
                  overflowY: "auto",
                  p: 2,
                  mb: 2,
                  bgcolor: "grey.50",
                }}
              >
                {loading ? (
                  <LoadingSpinner text="Cargando mensajes..." />
                ) : messages.length === 0 ? (
                  <Typography variant="body2" color="text.secondary" textAlign="center" py={3}>
                    No hay mensajes aún. Inicia una conversación con el médico.
                  </Typography>
                ) : (
                  <Stack spacing={2}>
                    {messages.map((message, index) => {
                      const isReception = message.from === "reception";
                      const showDate =
                        index === 0 ||
                        formatDate(messages[index - 1].timestamp) !== formatDate(message.timestamp);

                      return (
                        <Box key={message.id}>
                          {showDate && (
                            <Box sx={{ textAlign: "center", my: 2 }}>
                              <Chip
                                label={formatDate(message.timestamp)}
                                size="small"
                                variant="outlined"
                              />
                            </Box>
                          )}
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: isReception ? "flex-end" : "flex-start",
                              mb: 1,
                            }}
                          >
                            <Box
                              sx={{
                                maxWidth: "70%",
                                display: "flex",
                                gap: 1,
                                flexDirection: isReception ? "row-reverse" : "row",
                              }}
                            >
                              <Avatar
                                sx={{
                                  bgcolor: isReception ? "primary.main" : "secondary.main",
                                  width: 32,
                                  height: 32,
                                }}
                              >
                                {isReception ? <MessageIcon /> : <Person />}
                              </Avatar>
                              <Box
                                sx={{
                                  bgcolor: isReception ? "primary.main" : "grey.200",
                                  color: isReception ? "white" : "text.primary",
                                  p: 1.5,
                                  borderRadius: 2,
                                  position: "relative",
                                }}
                              >
                                <Typography variant="caption" sx={{ display: "block", mb: 0.5, opacity: 0.8 }}>
                                  {message.senderName || (isReception ? "Recepción" : message.doctorName || "Médico")}
                                </Typography>
                                <Typography variant="body2">{message.message}</Typography>
                                <Typography
                                  variant="caption"
                                  sx={{
                                    display: "block",
                                    mt: 0.5,
                                    opacity: 0.7,
                                    fontSize: "0.7rem",
                                  }}
                                >
                                  {formatTime(message.timestamp)}
                                </Typography>
                                {!message.isRead && !isReception && (
                                  <Chip
                                    label="Nuevo"
                                    size="small"
                                    color="primary"
                                    sx={{
                                      position: "absolute",
                                      top: -8,
                                      right: -8,
                                      height: 16,
                                      fontSize: "0.6rem",
                                    }}
                                  />
                                )}
                              </Box>
                            </Box>
                          </Box>
                        </Box>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </Stack>
                )}
              </Paper>

              {/* Campo de envío */}
              <Box sx={{ display: "flex", gap: 1 }}>
                <TextField
                  fullWidth
                  multiline
                  maxRows={3}
                  placeholder="Escribe un mensaje al médico..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  disabled={sending}
                />
                <Button
                  variant="contained"
                  startIcon={<Send />}
                  onClick={handleSend}
                  disabled={sending || !messageText.trim()}
                  sx={{ backgroundColor: "#14b8a6", "&:hover": { backgroundColor: "#0d9488" } }}
                >
                  Enviar
                </Button>
              </Box>
            </>
          ) : (
            <Typography variant="body2" color="text.secondary" textAlign="center" py={3}>
              Selecciona un médico para comenzar la conversación
            </Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

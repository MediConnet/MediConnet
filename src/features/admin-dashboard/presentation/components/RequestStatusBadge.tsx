import { AccessTime, Cancel, CheckCircle } from "@mui/icons-material";
import { Chip } from "@mui/material";
import {
  RequestStatusLabel,
  type RequestStatusType,
} from "../../domain/request-status.enum";

interface Props {
  status: RequestStatusType;
}

export const RequestStatusBadge = ({ status }: Props) => {
  let color:
    | "default"
    | "primary"
    | "secondary"
    | "error"
    | "info"
    | "success"
    | "warning" = "default";
  let icon = null;

  switch (status) {
    case "PENDING":
      color = "warning"; // Amarillo/Naranja
      icon = <AccessTime fontSize="small" />;
      break;
    case "APPROVED":
      color = "success"; // Verde
      icon = <CheckCircle fontSize="small" />;
      break;
    case "REJECTED":
      color = "error"; // Rojo
      icon = <Cancel fontSize="small" />;
      break;
  }

  return (
    <Chip
      icon={icon}
      label={RequestStatusLabel[status]}
      color={color}
      variant="outlined"
      size="small"
      sx={{ fontWeight: 500 }}
    />
  );
};

import {
  Assignment,
  Cancel,
  CheckCircle,
  Edit,
  Notifications,
} from "@mui/icons-material";
import { Avatar, Box, Chip, Paper, Typography } from "@mui/material";
import type {
  ActivityHistory,
  ActivityType,
} from "../../../admin-dashboard/domain/activity-history.entity";

interface Props {
  history: ActivityHistory;
}

const getActivityConfig = (type: ActivityType) => {
  switch (type) {
    case "REGISTRATION":
      return {
        icon: <Assignment fontSize="small" />,
        colorBg: "#E0F2F1",
        colorText: "#009688",
        label: "Registro",
      };
    case "APPROVAL":
      return {
        icon: <CheckCircle fontSize="small" />,
        colorBg: "#E8F5E9",
        colorText: "#2E7D32",
        label: "Aprobación",
      };
    case "REJECTION":
      return {
        icon: <Cancel fontSize="small" />,
        colorBg: "#FFEBEE",
        colorText: "#D32F2F",
        label: "Rechazo",
      };
    case "ANNOUNCEMENT":
      return {
        icon: <Notifications fontSize="small" />,
        colorBg: "#FFF3E0",
        colorText: "#EF6C00",
        label: "Anuncio",
      };
    case "UPDATE":
      return {
        icon: <Edit fontSize="small" />,
        colorBg: "#FFF8E1",
        colorText: "#FBC02D",
        label: "Edición",
      };
  }
};

export const ActivityItem = ({ history }: Props) => {
  const config = getActivityConfig(history.type);

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderRadius: 2,
        mb: 2,
        border: "1px solid transparent",
        transition: "all 0.2s",
        "&:hover": {
          bgcolor: "grey.50",
          borderColor: "grey.200",
        },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Avatar
          sx={{
            bgcolor: config.colorBg,
            color: config.colorText,
            width: 40,
            height: 40,
          }}
        >
          {config.icon}
        </Avatar>

        <Box>
          <Typography variant="body1" fontWeight={500} color="text.primary">
            {history.title}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Por: {history.actor} &bull; {history.date}
          </Typography>
        </Box>
      </Box>

      <Chip
        label={config.label}
        size="small"
        sx={{
          bgcolor: config.colorBg,
          color: config.colorText,
          fontWeight: 600,
          borderRadius: 1,
          height: 24,
          minWidth: 80,
        }}
      />
    </Paper>
  );
};

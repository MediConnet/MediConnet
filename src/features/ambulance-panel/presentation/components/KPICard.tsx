import { Box, Paper, Skeleton, Typography } from "@mui/material";
import type { ReactNode } from "react";

interface Props {
  title: string;
  value: string | number | undefined;
  icon: ReactNode;
  iconColor?: string;
  isLoading?: boolean;
}

export const KPICard = ({
  title,
  value,
  icon,
  iconColor = "rgba(6, 182, 212, 0.1)",
  isLoading = false,
}: Props) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 3,
        border: "1px solid",
        borderColor: "grey.100",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: "100%",
      }}
    >
      <Box>
        <Typography variant="body2" color="text.secondary" mb={0.5}>
          {title}
        </Typography>
        <Typography variant="h5" fontWeight={700} color="text.primary">
          {isLoading ? <Skeleton width={60} /> : value}
        </Typography>
      </Box>

      <Box
        sx={{
          width: 48,
          height: 48,
          borderRadius: 2,
          bgcolor: iconColor,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "text.primary",
        }}
      >
        {icon}
      </Box>
    </Paper>
  );
};

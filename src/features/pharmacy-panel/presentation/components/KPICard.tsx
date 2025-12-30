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
  iconColor = "rgba(0, 0, 0, 0.04)",
  isLoading = false,
}: Props) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 3,
        border: "1px solid",
        borderColor: "grey.200",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: "100%",
        boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          borderColor: "grey.300",
        },
      }}
    >
      <Box>
        <Typography
          variant="body2"
          color="text.secondary"
          fontWeight={500}
          mb={0.5}
        >
          {title}
        </Typography>
        <Typography variant="h4" fontWeight={700} color="text.primary">
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
        }}
      >
        {icon}
      </Box>
    </Paper>
  );
};

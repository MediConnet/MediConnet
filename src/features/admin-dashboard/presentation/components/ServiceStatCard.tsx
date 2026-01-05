import { Box, Paper, Skeleton, Typography } from "@mui/material";
import type { ReactNode } from "react";

interface Props {
  title: string;
  count: number | undefined;
  icon: ReactNode;
  isLoading?: boolean;
  iconColorBg?: string;
  iconColorText?: string;
}

export const ServiceStatCard = ({
  title,
  count,
  icon,
  isLoading = false,
  iconColorBg = "#E0F2F1",
  iconColorText = "#009688",
}: Props) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 3,
        border: "1px solid",
        borderColor: "grey.100",
        height: "100%",
        transition: "all 0.3s ease-in-out",
        cursor: "pointer",
        "&:hover": {
          transform: "translateY(-5px) scale(1.02)",
          boxShadow: "0 10px 20px rgba(0,0,0,0.08)",
          borderColor: "transparent",
        },
      }}
    >
      <Box
        sx={{
          bgcolor: iconColorBg,
          color: iconColorText,
          borderRadius: "50%",
          p: 1.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 2,
        }}
      >
        {isLoading ? (
          <Skeleton variant="circular" width={24} height={24} />
        ) : (
          icon
        )}
      </Box>

      <Typography variant="h4" fontWeight={700} sx={{ mb: 0.5 }}>
        {isLoading ? <Skeleton width={40} /> : count}
      </Typography>

      <Typography variant="body2" color="text.secondary" fontWeight={500}>
        {title}
      </Typography>
    </Paper>
  );
};

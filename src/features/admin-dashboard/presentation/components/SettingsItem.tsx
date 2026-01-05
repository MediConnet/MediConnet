import { Box, Checkbox, Typography } from "@mui/material";
import Grid2 from "@mui/material/Grid2";

interface Props {
  title: string;
  description: string;
  checked: boolean;
  // Función opcional por si queremos manejar el cambio de estado más adelante
  onChange?: (checked: boolean) => void;
}

export const SettingsItem = ({
  title,
  description,
  checked,
  onChange,
}: Props) => {
  return (
    <Grid2
      container
      alignItems="center"
      justifyContent="space-between"
      sx={{ py: 2 }}
    >
      <Grid2 size={{ xs: 10 }}>
        <Box>
          <Typography variant="subtitle1" fontWeight={600} color="text.primary">
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </Box>
      </Grid2>
      <Grid2 size={{ xs: 2 }} container justifyContent="flex-end">
        <Checkbox
          checked={checked}
          onChange={(e) => onChange?.(e.target.checked)}
          sx={{
            color: "grey.300",
            "&.Mui-checked": {
              color: "primary.main",
            },
          }}
        />
      </Grid2>
    </Grid2>
  );
};

import { Box, TextField, Typography } from "@mui/material";

interface CommissionSettingItemProps {
  title: string;
  description: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

export const CommissionSettingItem = ({
  title,
  description,
  value,
  onChange,
  min = 0,
  max = 100,
}: CommissionSettingItemProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    if (!isNaN(newValue) && newValue >= min && newValue <= max) {
      onChange(newValue);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        py: 2,
      }}
    >
      <Box sx={{ flex: 1 }}>
        <Typography variant="body2" fontWeight={600}>
          {title}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {description}
        </Typography>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <TextField
          type="number"
          value={value}
          onChange={handleChange}
          size="small"
          inputProps={{
            min,
            max,
            step: 0.5,
            style: { textAlign: "right" },
          }}
          sx={{ width: 80 }}
        />
        <Typography variant="body2" color="text.secondary">
          %
        </Typography>
      </Box>
    </Box>
  );
};

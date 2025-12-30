import { Box, Paper, Rating, Typography } from "@mui/material";
import type { Review } from "../../domain/review.entity";

interface Props {
  review: Review;
}

export const ReviewItem = ({ review }: Props) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        mb: 2,
        borderRadius: 2,
        border: "1px solid",
        borderColor: "grey.100",
        transition: "all 0.2s",
        "&:hover": {
          borderColor: "grey.300",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        },
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="flex-start"
        mb={1}
      >
        <Typography variant="subtitle1" fontWeight={700} color="text.primary">
          {review.patientName}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {review.date}
        </Typography>
      </Box>

      <Rating
        value={review.rating}
        readOnly
        size="small"
        sx={{ color: "#FFC107", mb: 1.5 }}
      />

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ lineHeight: 1.6 }}
      >
        {review.comment}
      </Typography>
    </Paper>
  );
};

"use client";

import { Box, CircularProgress, Typography } from "@mui/material";
import { useLanguage } from "@/context/LanguageContext";

export default function LoadingRegion({ label }: { label?: string }) {
  const { t } = useLanguage();
  const message = label ?? t("common.loading");
  return (
    <Box
      role="status"
      aria-live="polite"
      aria-busy="true"
      sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 1.5, py: 2 }}
    >
      <CircularProgress size={20} />
      <Typography variant="body2">{message}</Typography>
    </Box>
  );
}

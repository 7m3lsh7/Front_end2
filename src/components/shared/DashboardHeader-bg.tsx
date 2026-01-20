"use client";

import React from "react";
import { Box, Typography } from "@mui/material";

interface DashboardHeaderProps {
  name: string;
  year: string;
  subtitle?: string;
  children?: React.ReactNode;
}
const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  name,
  year,
  subtitle,
  children,
}) => {
  return (
    <Box
      sx={{
        mb: 5,
        textAlign: "left",
        background: `
          linear-gradient(
            180deg,
            rgba(132, 132, 132, 0.35),
            rgba(30, 30, 30, 0.35)
          )
        `,
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        borderRadius: "50px",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.35)",
        border: "1px solid rgba(255, 255, 255, 0.15)",
        padding: "48px",
        maxWidth: "1200px",
      }}
    >
      {/* Header text */}
      <Typography variant="h2" sx={{ color: "white" }}>
        Welcome, {name}
      </Typography>

      <Typography
        variant="h2"
        sx={{ color: "rgba(255, 255, 255, 0.32)", mb: 0.5 }}
      >
        {year}
      </Typography>

      {subtitle && (
        <Typography variant="h5" sx={{ color: "rgba(255, 255, 255, 0.42)" }}>
          {subtitle}
        </Typography>
      )}

      {children && (
        <Box sx={{ mt: 4 }}>
          {children}
        </Box>
      )}
    </Box>
  );
};

export default DashboardHeader;

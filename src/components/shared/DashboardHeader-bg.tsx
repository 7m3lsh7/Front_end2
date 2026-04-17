"use client";

import React from "react";
import { Box, Typography } from "@mui/material";

interface DashboardHeaderProps {
  name?: string;
  year?: string;
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
        position: "relative",
        overflow: "hidden",
<<<<<<< HEAD
        borderTopLeftRadius: { xs: "20px", md: "50px" },
        borderTopRightRadius: { xs: "20px", md: "50px" },
=======
        textAlign: "left",



        borderTopLeftRadius: { xs: "20px", md: "50px" },
        borderTopRightRadius: { xs: "20px", md: "50px" },


>>>>>>> a4e0ea5a8280e355608569163c10e2a29430e494
        padding: { xs: "20px", md: "50px" },
        maxWidth: "1760px",
        width: "100%",
        mx: "auto",
<<<<<<< HEAD
=======

>>>>>>> a4e0ea5a8280e355608569163c10e2a29430e494
        "&::before": {
          content: '""',
          position: "absolute",
          inset: 0,

          backdropFilter: "blur(3px)",
          WebkitBackdropFilter: "blur(14px)",

          background: `
      linear-gradient(
        180deg,
        rgba(255,255,255,0.08),
        rgba(255,255,255,0)
      )
    `,

          maskImage: `
      linear-gradient(
        180deg,
        black 0%,
        black 40%,
        transparent 100%
      )
    `,
          WebkitMaskImage: `
      linear-gradient(
        180deg,
        black 0%,
        black 40%,
        transparent 100%
      )
    `,

          zIndex: 0,
        },

        "& > *": {
          position: "relative",
          zIndex: 1,
        },
      }}

    >
      {/* Header text */}
      <Typography variant="h2" sx={{ color: "white" }}>
        {name}
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
<<<<<<< HEAD
        <Box  sx={{ mt: 4 }} >
=======
        <Box sx={{ mt: { xs: "10px", md: "70px" }, mb: { xs: "10px", md: "100px" } }}>
>>>>>>> a4e0ea5a8280e355608569163c10e2a29430e494
          {children}
        </Box>
      )}
    </Box>
  );
};

export default DashboardHeader;

"use client";

import React from "react";
import { Box, Typography, useTheme, alpha } from "@mui/material";
import { motion } from "framer-motion";

interface SectionTitleCardProps {
  title: string;
  align?: "left" | "center" | "right";
}

export default function SectionTitleCard({ title, align = "left" }: SectionTitleCardProps) {
  const theme = useTheme();
  const primary = theme.palette.primary.main;

  return (
    <Box
      component="section"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: align === "center" ? "center" : align === "right" ? "flex-end" : "flex-start",
        mb: 2,
      }}
    >
      <Typography
        variant="h4"
        component={motion.h2}
        initial={{ opacity: 0, x: align === "center" ? 0 : -20, y: align === "center" ? 20 : 0 }}
        whileInView={{ opacity: 1, x: 0, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        sx={{
          fontWeight: 800,
          background: `linear-gradient(90deg, ${theme.palette.text.primary} 0%, ${primary} 100%)`,
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          display: "inline-block",
          m: 0,
          pb: 1,
          position: "relative",
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: 0,
            left: align === "center" ? "50%" : 0,
            transform: align === "center" ? "translateX(-50%)" : "none",
            width: "60px",
            height: "4px",
            borderRadius: "2px",
            background: primary,
            boxShadow: `0 0 10px ${alpha(primary, 0.5)}`,
            transition: "width 0.3s ease",
          },
          "&:hover::after": {
            width: "100%",
          }
        }}
      >
        {title}
      </Typography>
    </Box>
  );
}

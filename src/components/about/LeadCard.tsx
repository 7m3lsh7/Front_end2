"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Box, Typography, IconButton, useTheme, alpha } from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import { motion } from "framer-motion";
import type { TeamLead } from "@/types/developer";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

interface LeadCardProps {
  lead: TeamLead;
}

export default function LeadCard({ lead }: LeadCardProps) {
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const secondary = theme.palette.secondary?.main || primary;
  const [imgError, setImgError] = useState(false);
  const showImage = lead.image && !imgError;

  return (
    <Box
      component={motion.div}
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        alignItems: { xs: "center", md: "flex-start" },
        gap: { xs: 4, md: 5 },
        bgcolor: alpha(theme.palette.background.paper, 0.7),
        backdropFilter: "blur(16px)",
        borderRadius: 4,
        p: { xs: 4, md: 5 },
        position: "relative",
        boxShadow: `0 10px 40px ${alpha(theme.palette.common.black, 0.08)}`,
        border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
        overflow: "visible",
        "&::before": {
          content: '""',
          position: "absolute",
          top: -2, left: -2, right: -2, bottom: -2,
          background: `linear-gradient(45deg, ${primary}, ${secondary}, ${primary})`,
          backgroundSize: "200% 200%",
          animation: "gradientFlow 5s ease infinite",
          zIndex: -1,
          borderRadius: "calc(16px + 2px)",
          opacity: 0,
          transition: "opacity 0.3s ease",
        },
        "&:hover::before": {
          opacity: 1,
        },
        "@keyframes gradientFlow": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" }
        }
      }}
    >
      <Box
        component={motion.div}
        whileHover={{ scale: 1.05, rotate: 2 }}
        transition={{ type: "spring", stiffness: 200 }}
        sx={{
          width: { xs: 180, md: 240 },
          height: { xs: 180, md: 240 },
          borderRadius: "50%",
          overflow: "hidden",
          flexShrink: 0,
          bgcolor: alpha(primary, 0.1),
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          boxShadow: `0 8px 32px ${alpha(primary, 0.2)}`,
          border: `4px solid ${theme.palette.background.paper}`,
        }}
      >
        {showImage && (
          <>
            {/* background blurred */}
            <Image
              src={lead.image!}
              alt=""
              fill
              style={{
                objectFit: "cover",
                filter: "blur(16px)",
                transform: "scale(1.2)",
              }}
            />

            {/* main image */}
            <Image
              src={lead.image!}
              alt={lead.name}
              fill
              onError={() => setImgError(true)}
              style={{
                objectFit: "cover",
              }}
            />
          </>
        )}

        {!showImage && (
          <Typography
            sx={{
              fontSize: "4rem",
              fontWeight: 800,
              color: primary,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              textShadow: `0 2px 10px ${alpha(primary, 0.3)}`,
            }}
          >
            {getInitials(lead.name)}
          </Typography>
        )}
      </Box>
      <Box sx={{ flex: 1, minWidth: 0, pt: { md: 2 } }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            color: theme.palette.text.primary,
            mb: 1,
            letterSpacing: "-0.01em",
          }}
        >
          {lead.name}
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: primary,
            fontWeight: 700,
            mb: 3,
            display: "inline-block",
            background: `linear-gradient(90deg, ${primary}, ${secondary})`,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {lead.role}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: theme.palette.text.secondary,
            lineHeight: 1.9,
            mb: 4,
            fontSize: "1.05rem",
          }}
        >
          {lead.bio}
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          {lead.githubUrl && (
            <IconButton
              component={motion.a}
              whileHover={{ scale: 1.2, rotate: -5, backgroundColor: alpha(primary, 0.1) }}
              whileTap={{ scale: 0.9 }}
              href={lead.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              sx={{
                color: theme.palette.text.primary,
                bgcolor: alpha(theme.palette.text.primary, 0.05),
                p: 1.5,
              }}
            >
              <GitHubIcon fontSize="medium" />
            </IconButton>
          )}
          {lead.linkedinUrl && (
            <IconButton
              component={motion.a}
              whileHover={{ scale: 1.2, rotate: 5, backgroundColor: alpha("#0077b5", 0.1) }}
              whileTap={{ scale: 0.9 }}
              href={lead.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              sx={{
                color: "#0077b5",
                bgcolor: alpha("#0077b5", 0.05),
                p: 1.5,
              }}
            >
              <LinkedInIcon fontSize="medium" />
            </IconButton>
          )}
        </Box>
      </Box>
    </Box>
  );
}

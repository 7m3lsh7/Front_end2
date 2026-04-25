"use client";
import { Card, CardContent, Typography, Box, useTheme, alpha } from "@mui/material";
import { motion } from "framer-motion";

interface CategoryCardProps {
  number: string;
  title: string;
  onClick: () => void;
  index?: number;
}

export default function CategoryCard({
  number,
  title,
  onClick,
  index = 0,
}: CategoryCardProps) {
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1, type: "spring", stiffness: 100 }}
      whileHover={{ scale: 1.05, x: 10 }}
      whileTap={{ scale: 0.95 }}
    >
      <Card
        onClick={onClick}
        sx={{
          background: alpha(theme.palette.background.paper, 0.7),
          backdropFilter: "blur(20px)",
          borderRadius: "20px",
          cursor: "pointer",
          border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
          borderLeft: `6px solid ${theme.palette.primary.main}`,
          boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.1)}`,
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0, right: 0, bottom: 0, left: 0,
            background: `linear-gradient(90deg, transparent, ${alpha(primary, 0.05)}, transparent)`,
            transform: "translateX(-100%)",
            transition: "transform 0.5s ease",
          },
          "&:hover::before": {
            transform: "translateX(100%)",
          },
        }}
      >
        <CardContent
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 3,
            padding: "24px !important",
          }}
        >
          <Box
            sx={{
              width: "64px",
              height: "64px",
              borderRadius: "16px",
              background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.4)}`,
            }}
          >
            <Typography
              sx={{
                fontSize: "32px",
                fontWeight: 800,
                color: theme.palette.primary.contrastText,
                textShadow: "0 2px 4px rgba(0,0,0,0.2)",
              }}
            >
              {number}
            </Typography>
          </Box>

          <Typography
            variant="h5"
            sx={{
              fontWeight: 800,
              color: theme.palette.text.primary,
              letterSpacing: "-0.01em",
            }}
          >
            {title}
          </Typography>
        </CardContent>
      </Card>
    </motion.div>
  );
}

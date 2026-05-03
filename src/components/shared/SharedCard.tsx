import React from "react";
import Link from "next/link";
import { Card, Box, Typography, Divider, useTheme } from "@mui/material";
import { CardData } from "@/types/SharedCard";

type SharedCardProps = CardData;

const SharedCard: React.FC<SharedCardProps> = ({
  icon: Icon,
  title,
  description,
  href,
}) => {
  const theme = useTheme();

  return (

      <Card
      component={Link}
      href={href}
        tabIndex={0}
        sx={{
          textDecoration: "none" ,
          width: "100%",
          maxWidth: 505,
          height: 270,
          borderRadius: 3,
          cursor: "pointer",
          bgcolor: theme.palette.background.paper,
          display: "flex",
          flexDirection: "column",
          transition: "all 0.3s ease",
          "&:hover": {
            outline: `2px solid ${theme.palette.primary.main}`,
            transform: "translateY(-2px)",
          },
          [theme.breakpoints.up("lg")]: {
            maxWidth: 390,
            height: 220,
          },
          [theme.breakpoints.up("md")]: {
            maxWidth: 282,
            height: 195,
          },
          [theme.breakpoints.down("sm")]: {
            maxWidth: "90vw",
            height: 200,
          },
        }}
      >
        <Box
          sx={{
            width: "90%",
            height: "55%",
            margin: "auto",
          }}
        >
          {/* Icon + Title */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box
              sx={{
                width: 60,
                height: 60,
                bgcolor: theme.palette.primary.main,
                borderRadius: 3,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {Icon && (typeof Icon === "function" || (typeof Icon === "object" && 'render' in Icon)) ? (
                // @ts-ignore - Handle SVGR functional component
                <Icon width={40} height={40} />
              ) : Icon ? (
                // Handle Next.js static image import object or string
                <img src={typeof Icon === 'string' ? Icon : (Icon as any).src} alt={title} width={40} height={40} style={{ objectFit: 'contain' }} />
              ) : (
                // Fallback if no icon provided
                <Box sx={{ width: 40, height: 40, bgcolor: 'rgba(255,255,255,0.2)', borderRadius: 1 }} />
              )}
            </Box>

            <Box sx={{ marginLeft: 2.5, flex: 1 }}>
              <Typography variant="body4" color="text.primary">
                {title}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 2.5 }} />

          {/* Description */}
          <Box sx={{ marginLeft: 2.5 }}>
            <Typography variant="h5" color="text.secondary">
              {description}
            </Typography>
          </Box>
        </Box>
      </Card>
  );
};

export default SharedCard;
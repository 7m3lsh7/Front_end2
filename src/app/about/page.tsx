"use client";

import React from "react";
import {
  Box,
  Container,
  Typography,
  useTheme,
  alpha,
  keyframes,
} from "@mui/material";
import { motion } from "framer-motion";
import SharedNavbar from "@/components/layout/SharedNavbar";
import LeadCard from "@/components/about/LeadCard";
import TeamCarousel from "@/components/about/TeamCarousel";
import SectionTitleCard from "@/components/about/SectionTitleCard";
import { teamLead, aboutTeams, aboutStats } from "@/data/about";
import { useLanguage } from "@/context/LanguageContext";

// Define a floating animation for the background gradients
const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50, damping: 15 } },
};

export default function AboutPage() {
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const { t } = useLanguage();

  const localizedLead = {
    ...teamLead,
    role: t("about.teamLeadRole", teamLead.role),
    bio: t("about.teamLeadBio", teamLead.bio),
  };

  const localizedTeams = aboutTeams.map((team) => ({
    ...team,
    title: t(`about.teams.${team.key}`, team.title),
    developers: team.developers.map((dev, index) => ({
      ...dev,
      role: t(
        `about.roles.${team.key}`,
        dev.role
      ),
      name: t(`about.members.${team.key}.${index}`, dev.name),
    })),
  }));

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      sx={{
        minHeight: "100vh",
        bgcolor: theme.palette.background.default,
        pb: 10,
        overflow: "hidden",
      }}
    >
      <SharedNavbar />

      {/* Hero */}
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          pt: { xs: 8, md: 14 },
          pb: { xs: 8, md: 12 },
          px: 2,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Animated Gradient Background */}
        <Box
          sx={{
            position: "absolute",
            top: "-50%",
            left: "-50%",
            width: "200%",
            height: "200%",
            background: `radial-gradient(circle at 50% 50%, ${alpha(primary, 0.12)}, transparent 50%),
                         radial-gradient(circle at 80% 20%, ${alpha(theme.palette.secondary?.main || primary, 0.1)}, transparent 50%)`,
            backgroundSize: "200% 200%",
            animation: `${gradientAnimation} 15s ease infinite`,
            zIndex: 0,
            pointerEvents: "none",
          }}
        />

        <Container 
          maxWidth="md" 
          sx={{ position: "relative", zIndex: 1 }}
          component={motion.div}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Box
            component={motion.div}
            variants={itemVariants}
            sx={{
              p: { xs: 3, md: 5 },
              borderRadius: 4,
              background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.6)} 0%, ${alpha(theme.palette.background.paper, 0.2)} 100%)`,
              backdropFilter: "blur(20px)",
              border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
              boxShadow: `0 8px 32px 0 ${alpha(theme.palette.common.black, 0.1)}`,
              textAlign: "center",
              position: "relative",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0, left: 0, right: 0, height: "1px",
                background: `linear-gradient(90deg, transparent, ${alpha(primary, 0.5)}, transparent)`,
              }
            }}
          >
            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontWeight: 800,
                background: `linear-gradient(45deg, ${theme.palette.text.primary}, ${primary})`,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mb: 2,
                fontSize: { xs: "2rem", sm: "2.75rem", md: "3.5rem" },
                letterSpacing: "-0.02em",
                filter: `drop-shadow(0px 2px 4px ${alpha(theme.palette.common.black, 0.1)})`,
              }}
            >
              {t("about.title")}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: theme.palette.text.secondary,
                textAlign: "center",
                maxWidth: 600,
                mx: "auto",
                lineHeight: 1.8,
                fontSize: { xs: "1rem", md: "1.125rem" },
              }}
            >
              {t("about.subtitle")}
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Stats */}
      <Container 
        maxWidth="md" 
        sx={{ mb: { xs: 8, md: 12 }, px: { xs: 2, sm: 2 } }}
        component={motion.div}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr 1fr", sm: "1fr 1fr" },
            gap: { xs: 2, sm: 4 },
            justifyContent: "center",
            maxWidth: 500,
            mx: "auto",
          }}
        >
          {aboutStats.map((stat, i) => (
            <Box
              key={i}
              component={motion.div}
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              sx={{
                bgcolor: alpha(theme.palette.background.paper, 0.6),
                backdropFilter: "blur(12px)",
                borderRadius: 4,
                p: 4,
                textAlign: "center",
                border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
                borderTop: `1px solid ${alpha(primary, 0.3)}`,
                boxShadow: `0 8px 32px 0 ${alpha(theme.palette.common.black, 0.05)}`,
                position: "relative",
                overflow: "hidden",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  background: `linear-gradient(135deg, transparent 0%, ${alpha(primary, 0.05)} 100%)`,
                  zIndex: 0,
                },
              }}
            >
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 800,
                  color: primary,
                  mb: 1,
                  position: "relative",
                  zIndex: 1,
                  textShadow: `0 2px 10px ${alpha(primary, 0.3)}`,
                }}
              >
                {stat.value}
              </Typography>
              <Typography
                variant="body1"
                sx={{ 
                  color: theme.palette.text.secondary, 
                  fontWeight: 600,
                  position: "relative",
                  zIndex: 1,
                }}
              >
                {t("about.coreSquad", stat.label)}
              </Typography>
            </Box>
          ))}
        </Box>
      </Container>

      {/* Team Lead */}
      <Container 
        maxWidth="md" 
        sx={{ mb: { xs: 8, md: 12 }, px: { xs: 2, sm: 2 } }}
        component={motion.div}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <Box sx={{ mb: 5 }}>
          <SectionTitleCard title={t("about.teamLead")} align="center" />
        </Box>
        <LeadCard lead={localizedLead} />
      </Container>

      {/* Teams: Backend, Frontend, Flutter */}
      {localizedTeams.map((team, index) => (
        <Box
          key={team.key}
          component={motion.div}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          sx={{
            position: "relative",
            py: { xs: 6, sm: 8, md: 10 },
            mb: index !== localizedTeams.length - 1 ? 2 : 0,
            overflow: "hidden",
            "&::before": {
               content: '""',
               position: "absolute",
               top: 0, left: 0, right: 0, bottom: 0,
               background: `linear-gradient(180deg, transparent 0%, ${alpha(primary, 0.03)} 50%, transparent 100%)`,
               pointerEvents: "none",
            }
          }}
        >
          <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 2 }, mb: 5, position: "relative", zIndex: 1 }}>
            <SectionTitleCard title={team.title} />
          </Container>
          <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 2 }, position: "relative", zIndex: 1 }}>
            <TeamCarousel developers={team.developers} />
          </Container>
        </Box>
      ))}
    </Box>
  );
}

"use client";

import React from "react";
import Link from "next/link";
import {
  Box,
  Container,
  Typography,
  Button,
  useTheme,
  alpha,
  Stack,
} from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import AssignmentIcon from "@mui/icons-material/Assignment";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import GroupsIcon from "@mui/icons-material/Groups";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import PersonIcon from "@mui/icons-material/Person";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import CalendarViewMonthIcon from "@mui/icons-material/CalendarViewMonth";
import EventNoteIcon from "@mui/icons-material/EventNote";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import SharedNavbar from "@/components/layout/SharedNavbar";
import { useLanguage } from "@/context/LanguageContext";

export default function HomePage() {
  const theme = useTheme();
  const { t } = useLanguage();
  const primary = theme.palette.primary.main;
  const primaryLight = alpha(primary, 0.12);
  const HERO_BULLETS = [
    t("home.heroBullet1"),
    t("home.heroBullet2"),
    t("home.heroBullet3"),
  ];
  const GOAL_PARAGRAPHS = [t("home.goal1"), t("home.goal2"), t("home.goal3")];
  const WHO_IT_FOR = [
    { icon: <PersonIcon sx={{ fontSize: 36 }} />, title: t("home.audience.studentsTitle"), description: t("home.audience.studentsDesc") },
    { icon: <MenuBookIcon sx={{ fontSize: 36 }} />, title: t("home.audience.teachersTitle"), description: t("home.audience.teachersDesc") },
    { icon: <AdminPanelSettingsIcon sx={{ fontSize: 36 }} />, title: t("home.audience.adminsTitle"), description: t("home.audience.adminsDesc") },
  ];
  const FEATURES = [
    { icon: <CalendarViewMonthIcon sx={{ fontSize: 28 }} />, title: t("home.features.quarterTitle"), detail: t("home.features.quarterDetail") },
    { icon: <AssignmentIcon sx={{ fontSize: 28 }} />, title: t("home.features.finalTitle"), detail: t("home.features.finalDetail") },
    { icon: <EmojiEventsIcon sx={{ fontSize: 28 }} />, title: t("home.features.jadaratTitle"), detail: t("home.features.jadaratDetail") },
    { icon: <EventNoteIcon sx={{ fontSize: 28 }} />, title: t("home.features.yearsTitle"), detail: t("home.features.yearsDetail") },
    { icon: <CheckCircleOutlineIcon sx={{ fontSize: 28 }} />, title: t("home.features.averagesTitle"), detail: t("home.features.averagesDetail") },
  ];
  const ACHIEVEMENTS = [
    { icon: <GroupsIcon sx={{ fontSize: 40 }} />, value: "500+", label: t("home.achievements.studentsLabel"), detail: t("home.achievements.studentsDetail") },
    { icon: <AssignmentIcon sx={{ fontSize: 40 }} />, value: "100%", label: t("home.achievements.trackedLabel"), detail: t("home.achievements.trackedDetail") },
    { icon: <TrendingUpIcon sx={{ fontSize: 40 }} />, value: "98%", label: t("home.achievements.satisfactionLabel"), detail: t("home.achievements.satisfactionDetail") },
    { icon: <EmojiEventsIcon sx={{ fontSize: 40 }} />, value: "A+", label: t("home.achievements.accuracyLabel"), detail: t("home.achievements.accuracyDetail") },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: theme.palette.background.default,
        pb: 8,
      }}
    >
      <SharedNavbar />

      {/* Hero */}
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          pt: { xs: 6, md: 10 },
          pb: { xs: 8, md: 12 },
          px: 2,
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "100%",
            background: `linear-gradient(135deg, ${primaryLight} 0%, transparent 50%), linear-gradient(180deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
            pointerEvents: "none",
          }}
        />
        <Container maxWidth="md" sx={{ position: "relative" }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <Box
              sx={{
                width: 72,
                height: 72,
                borderRadius: 2,
                bgcolor: primary,
                color: theme.palette.getContrastText(primary),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 3,
                boxShadow: `0 8px 24px ${alpha(primary, 0.35)}`,
              }}
            >
              <SchoolIcon sx={{ fontSize: 40 }} />
            </Box>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 700,
                color: theme.palette.text.primary,
                mb: 1.5,
                fontSize: { xs: "1.75rem", sm: "2.25rem", md: "2.5rem" },
              }}
            >
              {t("home.title")}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: theme.palette.text.secondary,
                maxWidth: 520,
                mb: 3,
                fontSize: { xs: "0.95rem", md: "1rem" },
              }}
            >
              {t("home.subtitle")}
            </Typography>
            <Stack
              spacing={1}
              sx={{
                textAlign: "left",
                maxWidth: 420,
                mb: 4,
                "& .MuiTypography-root": {
                  fontSize: { xs: "0.9rem", md: "0.95rem" },
                  color: theme.palette.text.secondary,
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 1,
                },
              }}
            >
              {HERO_BULLETS.map((text, i) => (
                <Typography key={i} variant="body2">
                  <Box
                    component="span"
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      bgcolor: primary,
                      mt: 1.2,
                      flexShrink: 0,
                    }}
                  />
                  {text}
                </Typography>
              ))}
            </Stack>
            <Button
              component={Link}
              href="/login"
              variant="contained"
              size="large"
              sx={{
                bgcolor: primary,
                color: theme.palette.getContrastText(primary),
                px: 4,
                py: 1.5,
                borderRadius: 2,
                fontWeight: 700,
                textTransform: "none",
                boxShadow: `0 4px 14px ${alpha(primary, 0.4)}`,
                "&:hover": {
                  bgcolor: theme.palette.primary.dark,
                  boxShadow: `0 6px 20px ${alpha(primary, 0.5)}`,
                },
              }}
            >
              {t("auth.signIn")}
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Goal / Purpose — expanded */}
      <Container maxWidth="md" sx={{ py: { xs: 6, md: 8 } }}>
        <Box
          sx={{
            bgcolor: theme.palette.background.paper,
            borderRadius: 3,
            p: { xs: 3, md: 5 },
            boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.06)}`,
            borderLeft: `4px solid ${primary}`,
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: theme.palette.text.primary,
              mb: 3,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Box
              component="span"
              sx={{
                width: 8,
                height: 32,
                borderRadius: 1,
                bgcolor: primary,
              }}
            />
            {t("home.goalTitle")}
          </Typography>
          <Stack spacing={2}>
            {GOAL_PARAGRAPHS.map((paragraph, i) => (
              <Typography
                key={i}
                variant="body2"
                sx={{
                  color: theme.palette.text.secondary,
                  lineHeight: 1.85,
                  fontSize: { xs: "0.95rem", md: "1rem" },
                }}
              >
                {paragraph}
              </Typography>
            ))}
          </Stack>
        </Box>
      </Container>

      {/* Who it's for */}
      <Box
        sx={{
          bgcolor: alpha(primary, 0.04),
          py: { xs: 6, md: 8 },
          borderTop: `1px solid ${alpha(primary, 0.12)}`,
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: theme.palette.text.primary,
              textAlign: "center",
              mb: 1,
            }}
          >
            {t("home.audienceTitle")}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: theme.palette.text.secondary,
              textAlign: "center",
              mb: 4,
              maxWidth: 560,
              mx: "auto",
            }}
          >
            {t("home.audienceSubtitle")}
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
              gap: 3,
            }}
          >
            {WHO_IT_FOR.map((item, index) => (
              <Box
                key={index}
                sx={{
                  bgcolor: theme.palette.background.paper,
                  borderRadius: 3,
                  p: 3,
                  boxShadow: `0 4px 16px ${alpha(theme.palette.common.black, 0.06)}`,
                  border: `1px solid ${alpha(primary, 0.2)}`,
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: `0 8px 24px ${alpha(primary, 0.12)}`,
                  },
                }}
              >
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: 2,
                    bgcolor: primaryLight,
                    color: primary,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 2,
                  }}
                >
                  {item.icon}
                </Box>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    color: theme.palette.text.primary,
                    mb: 1,
                  }}
                >
                  {item.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: theme.palette.text.secondary,
                    lineHeight: 1.7,
                  }}
                >
                  {item.description}
                </Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Features */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: theme.palette.text.primary,
            textAlign: "center",
            mb: 1,
          }}
        >
          {t("home.featuresTitle")}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: theme.palette.text.secondary,
            textAlign: "center",
            mb: 4,
          }}
        >
          {t("home.featuresSubtitle")}
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" },
            gap: 2,
          }}
        >
          {FEATURES.map((item, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                gap: 2,
                p: 2,
                borderRadius: 2,
                bgcolor: theme.palette.background.paper,
                border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                "&:hover": {
                  borderColor: alpha(primary, 0.3),
                  bgcolor: alpha(primary, 0.02),
                },
              }}
            >
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 1.5,
                  bgcolor: primaryLight,
                  color: primary,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {item.icon}
              </Box>
              <Box>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 700,
                    color: theme.palette.text.primary,
                    mb: 0.5,
                  }}
                >
                  {item.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: theme.palette.text.secondary,
                    lineHeight: 1.6,
                  }}
                >
                  {item.detail}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Container>

      {/* Achievements — with details */}
      <Box
        sx={{
          bgcolor: alpha(primary, 0.06),
          py: { xs: 6, md: 8 },
          borderTop: `1px solid ${alpha(primary, 0.12)}`,
          borderBottom: `1px solid ${alpha(primary, 0.12)}`,
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: theme.palette.text.primary,
              textAlign: "center",
              mb: 1,
            }}
          >
            {t("home.achievementsTitle")}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: theme.palette.text.secondary,
              textAlign: "center",
              mb: 4,
            }}
          >
            {t("home.achievementsSubtitle")}
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(4, 1fr)",
              },
              gap: 3,
            }}
          >
            {ACHIEVEMENTS.map((item, index) => (
              <Box
                key={index}
                sx={{
                  bgcolor: theme.palette.background.paper,
                  borderRadius: 3,
                  p: 3,
                  textAlign: "center",
                  boxShadow: `0 4px 16px ${alpha(theme.palette.common.black, 0.06)}`,
                  border: `1px solid ${alpha(primary, 0.2)}`,
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: `0 12px 28px ${alpha(primary, 0.15)}`,
                  },
                }}
              >
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: 2,
                    bgcolor: primaryLight,
                    color: primary,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mx: "auto",
                    mb: 2,
                  }}
                >
                  {item.icon}
                </Box>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    color: primary,
                    mb: 0.5,
                    fontSize: { xs: "1.75rem", md: "2rem" },
                  }}
                >
                  {item.value}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: theme.palette.text.primary,
                    fontWeight: 600,
                    mb: 1,
                  }}
                >
                  {item.label}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: theme.palette.text.secondary,
                    display: "block",
                    lineHeight: 1.5,
                  }}
                >
                  {item.detail}
                </Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Footer CTA */}
      <Container maxWidth="md" sx={{ py: { xs: 6, md: 8 } }}>
        <Box
          sx={{
            textAlign: "center",
            p: 4,
            borderRadius: 3,
            bgcolor: theme.palette.background.paper,
            boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.06)}`,
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: theme.palette.text.primary,
              mb: 1,
            }}
          >
            {t("home.ctaTitle")}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: theme.palette.text.secondary,
              mb: 2,
            }}
          >
            {t("home.ctaSubtitle")}
          </Typography>
          <Button
            component={Link}
            href="/login"
            variant="outlined"
            size="large"
            sx={{
              borderColor: primary,
              color: primary,
              fontWeight: 700,
              textTransform: "none",
              borderRadius: 2,
              px: 4,
              "&:hover": {
                borderColor: theme.palette.primary.dark,
                bgcolor: primaryLight,
              },
            }}
          >
            {t("auth.signIn")}
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
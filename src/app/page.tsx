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

const HERO_SUBTITLE =
  "One place for grades, reports, and progress. For students, teachers, and admins.";

const HERO_BULLETS = [
  "View quarter, final, and competency grades in one dashboard",
  "Switch between academic years (Junior, Wheeler, Senior) with one click",
  "Secure login and role-based access for everyone",
];

const GOAL_PARAGRAPHS = [
  `School Grading System is a central platform for managing and viewing student grades. It brings quarter grades, final exam results, and competency (Jadarat) assessments into one clear, easy-to-use place.`,
  `Students can see their performance by subject and by academic year. They can compare their results across years (e.g. Junior vs Senior) and track progress over time. Teachers and admins use the same system to enter and manage grades, so data stays consistent and up to date.`,
  `The goal is transparency: everyone sees the same numbers, reports are accurate, and the school has a single source of truth for academic performance.`,
];

const WHO_IT_FOR = [
  {
    icon: <PersonIcon sx={{ fontSize: 36 }} />,
    title: "Students",
    description:
      "Access your quarter grades, final grades, and competency results. Switch between academic years (Junior, Wheeler, Senior) to view past and current performance. Your dashboard shows everything in one place.",
  },
  {
    icon: <MenuBookIcon sx={{ fontSize: 36 }} />,
    title: "Teachers",
    description:
      "Manage and submit grades for your classes. Enter quarter and final results, update competency assessments, and keep records consistent. The system supports your workflow and keeps students informed.",
  },
  {
    icon: <AdminPanelSettingsIcon sx={{ fontSize: 36 }} />,
    title: "Admins",
    description:
      "Oversee the full grading system: users, roles, and data. Ensure accuracy, run reports, and maintain the platform so students and teachers have a reliable place for grades and progress.",
  },
];

const FEATURES = [
  {
    icon: <CalendarViewMonthIcon sx={{ fontSize: 28 }} />,
    title: "Quarter grades",
    detail: "Track performance per subject during the quarter. View your grades and compare with quarter targets.",
  },
  {
    icon: <AssignmentIcon sx={{ fontSize: 28 }} />,
    title: "Final grades",
    detail: "Semester final exam results in one table. See your scores and overall average per year.",
  },
  {
    icon: <EmojiEventsIcon sx={{ fontSize: 28 }} />,
    title: "Competencies (Jadarat)",
    detail: "Specialization and competency assessments. Pass/fail and attempt history for each competency.",
  },
  {
    icon: <EventNoteIcon sx={{ fontSize: 28 }} />,
    title: "Academic years",
    detail: "Switch between Junior, Wheeler, and Senior. View grades for any year you have completed or are in.",
  },
  {
    icon: <CheckCircleOutlineIcon sx={{ fontSize: 28 }} />,
    title: "Calculated averages",
    detail: "Average grade and pass rates are calculated on the platform from your grades for clarity and consistency.",
  },
];

const ACHIEVEMENTS = [
  {
    icon: <GroupsIcon sx={{ fontSize: 40 }} />,
    value: "500+",
    label: "Students on the platform",
    detail: "Active students viewing and tracking their grades every term.",
  },
  {
    icon: <AssignmentIcon sx={{ fontSize: 40 }} />,
    value: "100%",
    label: "Grades tracked digitally",
    detail: "All quarter, final, and competency grades stored and visible in one system.",
  },
  {
    icon: <TrendingUpIcon sx={{ fontSize: 40 }} />,
    value: "98%",
    label: "Satisfaction rate",
    detail: "Students and staff report high satisfaction with clarity and ease of use.",
  },
  {
    icon: <EmojiEventsIcon sx={{ fontSize: 40 }} />,
    value: "A+",
    label: "Accuracy in reporting",
    detail: "Single source of truth reduces errors and keeps reports reliable.",
  },
];

export default function HomePage() {
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const primaryLight = alpha(primary, 0.12);

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
              School Grading System
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
              {HERO_SUBTITLE}
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
              Sign in
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
            Our goal
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
            Who is it for?
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
            The platform serves students, teachers, and administrators with role-based access and tailored views.
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
          What you can do
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: theme.palette.text.secondary,
            textAlign: "center",
            mb: 4,
          }}
        >
          Key features available on the platform.
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
            School achievements
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: theme.palette.text.secondary,
              textAlign: "center",
              mb: 4,
            }}
          >
            Numbers that reflect our reach and impact.
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
            Ready to get started?
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: theme.palette.text.secondary,
              mb: 2,
            }}
          >
            Sign in to access your grades, switch between academic years, and view quarter, final, and competency results.
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
            Sign in
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
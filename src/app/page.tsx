"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Box,
  Container,
  Typography,
  Button,
  useTheme,
  alpha,
  Chip,
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
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import BarChartIcon from "@mui/icons-material/BarChart";
import SecurityIcon from "@mui/icons-material/Security";
import NotificationsIcon from "@mui/icons-material/Notifications";
import DownloadIcon from "@mui/icons-material/Download";
import SharedNavbar from "@/components/layout/SharedNavbar";
import { useLanguage } from "@/context/LanguageContext";

// ─── Animated Counter ────────────────────────────────────────────────────────
function AnimatedCounter({ target, suffix = "" }: { target: number | string; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const numTarget = typeof target === "string" ? parseFloat(target) : target;
    if (isNaN(numTarget)) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 2000;
          const steps = 60;
          const increment = numTarget / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= numTarget) {
              setCount(numTarget);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  const display =
    typeof target === "string" && isNaN(parseFloat(target))
      ? target
      : `${count}${suffix}`;

  return <span ref={ref}>{display}</span>;
}

// ─── Floating Particles ───────────────────────────────────────────────────────
function FloatingParticles({ color }: { color: string }) {
  const particles = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 6 + 2,
    duration: Math.random() * 15 + 10,
    delay: Math.random() * 8,
    animType: i % 3,
  }));

  return (
    <Box sx={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      {particles.map((p) => (
        <Box
          key={p.id}
          sx={{
            position: "absolute",
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            bgcolor: color,
            opacity: 0.12,
            animation: `particleFloat${p.animType} ${p.duration}s ${p.delay}s infinite ease-in-out`,
            "@keyframes particleFloat0": {
              "0%,100%": { transform: "translateY(0px) translateX(0px)" },
              "50%": { transform: "translateY(-30px) translateX(15px)" },
            },
            "@keyframes particleFloat1": {
              "0%,100%": { transform: "translateY(0px) translateX(0px)" },
              "50%": { transform: "translateY(20px) translateX(-25px)" },
            },
            "@keyframes particleFloat2": {
              "0%,100%": { transform: "translateY(0px) scale(1)" },
              "50%": { transform: "translateY(-15px) scale(1.8)" },
            },
          }}
        />
      ))}
    </Box>
  );
}

// ─── Feature Card ─────────────────────────────────────────────────────────────
function FeatureCard({
  icon,
  title,
  detail,
  color,
  index,
}: {
  icon: React.ReactNode;
  title: string;
  detail: string;
  color: string;
  index: number;
}) {
  const theme = useTheme();
  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        p: 2.5,
        borderRadius: 3,
        bgcolor: theme.palette.background.paper,
        border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
        transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
        cursor: "default",
        animationFillMode: "both",
        "&:hover": {
          transform: "translateY(-4px) scale(1.01)",
          borderColor: alpha(color, 0.5),
          boxShadow: `0 12px 32px ${alpha(color, 0.18)}`,
          bgcolor: alpha(color, 0.025),
        },
      }}
    >
      <Box
        sx={{
          width: 52,
          height: 52,
          borderRadius: 2,
          bgcolor: alpha(color, 0.12),
          color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          transition: "all 0.3s ease",
          "& svg": { fontSize: 26 },
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: 700, color: theme.palette.text.primary, mb: 0.5 }}
        >
          {title}
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: theme.palette.text.secondary, lineHeight: 1.65 }}
        >
          {detail}
        </Typography>
      </Box>
    </Box>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({
  icon,
  value,
  suffix,
  label,
  detail,
  color,
}: {
  icon: React.ReactNode;
  value: number | string;
  suffix?: string;
  label: string;
  detail: string;
  color: string;
}) {
  const theme = useTheme();
  return (
    <Box
      sx={{
        bgcolor: theme.palette.background.paper,
        borderRadius: 3,
        p: 3,
        textAlign: "center",
        border: `1px solid ${alpha(color, 0.18)}`,
        position: "relative",
        overflow: "hidden",
        transition: "all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          bgcolor: color,
          borderRadius: "3px 3px 0 0",
        },
        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: `0 16px 40px ${alpha(color, 0.2)}`,
        },
      }}
    >
      <Box
        sx={{
          width: 60,
          height: 60,
          borderRadius: 2,
          bgcolor: alpha(color, 0.1),
          color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mx: "auto",
          mb: 2,
          "& svg": { fontSize: 32 },
        }}
      >
        {icon}
      </Box>
      <Typography
        variant="h3"
        sx={{ fontWeight: 800, color, mb: 0.5, fontSize: { xs: "1.9rem", md: "2.3rem" } }}
      >
        <AnimatedCounter target={value} suffix={suffix} />
      </Typography>
      <Typography
        variant="body2"
        sx={{ fontWeight: 700, color: theme.palette.text.primary, mb: 0.75 }}
      >
        {label}
      </Typography>
      <Typography
        variant="caption"
        sx={{ color: theme.palette.text.secondary, lineHeight: 1.5, display: "block" }}
      >
        {detail}
      </Typography>
    </Box>
  );
}

// ─── Hero Dashboard Preview ───────────────────────────────────────────────────
function HeroDashboardPreview() {
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const bars = [65, 82, 71, 94, 78, 88];
  const colors = ["#4CAF50", primary, "#2196F3", "#E91E63", "#9C27B0", "#FF5722"];

  return (
    <Box
      sx={{
        bgcolor: theme.palette.background.paper,
        borderRadius: 4,
        p: 3,
        border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
        boxShadow: `0 24px 64px ${alpha(theme.palette.common.black, 0.18)}`,
        position: "relative",
        animation: "heroFloat 4s ease-in-out infinite",
        "@keyframes heroFloat": {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
        <Box>
          <Typography
            variant="caption"
            sx={{ color: theme.palette.text.secondary, fontWeight: 600 }}
          >
            GRADE OVERVIEW
          </Typography>
          <Typography
            variant="h6"
            sx={{ fontWeight: 800, color: theme.palette.text.primary, lineHeight: 1.2 }}
          >
            Academic 2025
          </Typography>
        </Box>
        <Chip
          label="● Live"
          size="small"
          sx={{
            bgcolor: alpha("#4CAF50", 0.15),
            color: "#4CAF50",
            fontWeight: 700,
            fontSize: "0.65rem",
          }}
        />
      </Box>

      {/* Bar chart */}
      <Box sx={{ display: "flex", gap: 1, alignItems: "flex-end", height: 100, mb: 2 }}>
        {bars.map((h, i) => (
          <Box key={i} sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Box
              sx={{
                width: "100%",
                height: `${h}%`,
                borderRadius: "4px 4px 0 0",
                bgcolor: colors[i],
                opacity: 0.85,
                "&:hover": { opacity: 1 },
                transition: "opacity 0.2s",
              }}
            />
          </Box>
        ))}
      </Box>

      <Box sx={{ display: "flex", gap: 1 }}>
        {["Math", "Sci", "Eng", "Hist", "Art", "PE"].map((s, i) => (
          <Typography
            key={i}
            variant="caption"
            sx={{
              flex: 1,
              textAlign: "center",
              color: theme.palette.text.secondary,
              fontSize: "0.6rem",
              fontWeight: 600,
            }}
          >
            {s}
          </Typography>
        ))}
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 1.5, mt: 2.5 }}>
        {[
          { label: "Average", value: "82%", color: primary },
          { label: "Students", value: "124", color: "#4CAF50" },
          { label: "Top Grade", value: "98", color: "#E91E63" },
        ].map((s, i) => (
          <Box
            key={i}
            sx={{
              bgcolor: alpha(s.color, 0.08),
              borderRadius: 2,
              p: 1.2,
              textAlign: "center",
              border: `1px solid ${alpha(s.color, 0.15)}`,
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 800, color: s.color, fontSize: "0.9rem" }}>
              {s.value}
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: theme.palette.text.secondary, fontSize: "0.6rem", fontWeight: 600 }}
            >
              {s.label}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Notification badge */}
      <Box
        sx={{
          position: "absolute",
          top: -14,
          right: -14,
          width: 44,
          height: 44,
          borderRadius: "50%",
          bgcolor: "#E91E63",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: `0 4px 16px ${alpha("#E91E63", 0.5)}`,
          animation: "notifPulse 2s ease-in-out infinite",
          "@keyframes notifPulse": {
            "0%,100%": { boxShadow: `0 4px 16px ${alpha("#E91E63", 0.4)}` },
            "50%": { boxShadow: `0 4px 24px ${alpha("#E91E63", 0.7)}` },
          },
        }}
      >
        <NotificationsIcon sx={{ fontSize: 20, color: "#fff" }} />
      </Box>
    </Box>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function HomePage() {
  const theme = useTheme();
  const { t } = useLanguage();
  const primary = theme.palette.primary.main;
  const isDark = theme.palette.mode === "dark";

  const WHO_IT_FOR = [
    {
      icon: <PersonIcon sx={{ fontSize: 32 }} />,
      title: t("home.audience.studentsTitle"),
      description: t("home.audience.studentsDesc"),
      color: "#4CAF50",
    },
    {
      icon: <MenuBookIcon sx={{ fontSize: 32 }} />,
      title: t("home.audience.teachersTitle"),
      description: t("home.audience.teachersDesc"),
      color: "#2196F3",
    },
    {
      icon: <AdminPanelSettingsIcon sx={{ fontSize: 32 }} />,
      title: t("home.audience.adminsTitle"),
      description: t("home.audience.adminsDesc"),
      color: primary,
    },
  ];

  const FEATURES = [
    {
      icon: <CalendarViewMonthIcon />,
      title: t("home.features.quarterTitle"),
      detail: t("home.features.quarterDetail"),
      color: "#4CAF50",
    },
    {
      icon: <AssignmentIcon />,
      title: t("home.features.finalTitle"),
      detail: t("home.features.finalDetail"),
      color: "#2196F3",
    },
    {
      icon: <EmojiEventsIcon />,
      title: t("home.features.jadaratTitle"),
      detail: t("home.features.jadaratDetail"),
      color: primary,
    },
    {
      icon: <EventNoteIcon />,
      title: t("home.features.yearsTitle"),
      detail: t("home.features.yearsDetail"),
      color: "#9C27B0",
    },
    {
      icon: <CheckCircleOutlineIcon />,
      title: t("home.features.averagesTitle"),
      detail: t("home.features.averagesDetail"),
      color: "#FF5722",
    },
    {
      icon: <BarChartIcon />,
      title: "Analytics Dashboard",
      detail: "Visual charts and performance reports for administrators and vice principals",
      color: "#00BCD4",
    },
    {
      icon: <NotificationsIcon />,
      title: "Smart Notifications",
      detail: "Real-time alerts for new grades, announcements, and important system events",
      color: "#E91E63",
    },
    {
      icon: <DownloadIcon />,
      title: "Export Reports",
      detail: "Download full grade reports as PDF with a single click anytime",
      color: "#FF9800",
    },
    {
      icon: <SecurityIcon />,
      title: "Secure & Role-Based",
      detail: "Each user only accesses their own data — teachers, students, and admins are isolated",
      color: "#607D8B",
    },
  ];

  const STATS = [
    {
      icon: <GroupsIcon />,
      value: 500,
      suffix: "+",
      label: t("home.achievements.studentsLabel"),
      detail: t("home.achievements.studentsDetail"),
      color: "#4CAF50",
    },
    {
      icon: <AssignmentIcon />,
      value: 100,
      suffix: "%",
      label: t("home.achievements.trackedLabel"),
      detail: t("home.achievements.trackedDetail"),
      color: "#2196F3",
    },
    {
      icon: <TrendingUpIcon />,
      value: 98,
      suffix: "%",
      label: t("home.achievements.satisfactionLabel"),
      detail: t("home.achievements.satisfactionDetail"),
      color: primary,
    },
    {
      icon: <EmojiEventsIcon />,
      value: "A+",
      label: t("home.achievements.accuracyLabel"),
      detail: t("home.achievements.accuracyDetail"),
      color: "#E91E63",
    },
  ];

  const NEW_BADGES = ["📊 Analytics", "🔔 Notifications", "📥 PDF Export", "🏆 Rankings", "📈 Grade Charts"];

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: theme.palette.background.default, overflow: "hidden" }}>
      <SharedNavbar />

      {/* ─── HERO ──────────────────────────────────────────────── */}
      <Box
        sx={{
          position: "relative",
          minHeight: { xs: "85vh", md: "88vh" },
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        {/* Radial background */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background: isDark
              ? `radial-gradient(ellipse 90% 60% at 50% -5%, ${alpha(primary, 0.22)} 0%, transparent 65%),
                 radial-gradient(ellipse 40% 40% at 85% 85%, ${alpha("#2196F3", 0.1)} 0%, transparent 50%)`
              : `radial-gradient(ellipse 90% 60% at 50% -5%, ${alpha(primary, 0.15)} 0%, transparent 65%),
                 radial-gradient(ellipse 40% 40% at 85% 85%, ${alpha("#2196F3", 0.06)} 0%, transparent 50%)`,
            pointerEvents: "none",
          }}
        />
        {/* Grid */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backgroundImage: `linear-gradient(${alpha(primary, 0.035)} 1px, transparent 1px), linear-gradient(90deg, ${alpha(primary, 0.035)} 1px, transparent 1px)`,
            backgroundSize: "56px 56px",
            pointerEvents: "none",
          }}
        />
        <FloatingParticles color={primary} />

        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1, py: { xs: 10, md: 0 } }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: "center",
              gap: { xs: 6, md: 10 },
            }}
          >
            {/* Left: Text */}
            <Box sx={{ flex: 1, textAlign: { xs: "center", md: "left" } }}>
              {/* Live badge */}
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 1,
                  px: 2,
                  py: 0.7,
                  borderRadius: 20,
                  bgcolor: alpha(primary, 0.1),
                  border: `1px solid ${alpha(primary, 0.25)}`,
                  mb: 3,
                }}
              >
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    bgcolor: primary,
                    animation: "liveDot 2s infinite",
                    "@keyframes liveDot": {
                      "0%,100%": { opacity: 1, transform: "scale(1)" },
                      "50%": { opacity: 0.4, transform: "scale(0.7)" },
                    },
                  }}
                />
                <Typography
                  variant="caption"
                  sx={{ fontWeight: 700, color: primary, letterSpacing: 0.5 }}
                >
                  NEW v2.0 — Enhanced Platform
                </Typography>
              </Box>

              <Typography
                component="h1"
                sx={{
                  fontWeight: 900,
                  fontSize: { xs: "2.2rem", sm: "2.8rem", md: "3.5rem" },
                  lineHeight: 1.1,
                  color: theme.palette.text.primary,
                  mb: 2,
                  letterSpacing: "-0.02em",
                }}
              >
                {t("home.title")}
                <Box
                  component="span"
                  sx={{
                    display: "block",
                    background: `linear-gradient(120deg, ${primary} 0%, ${alpha(primary, 0.65)} 100%)`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Grading System
                </Box>
              </Typography>

              <Typography
                variant="h6"
                sx={{
                  color: theme.palette.text.secondary,
                  fontWeight: 400,
                  maxWidth: 480,
                  mx: { xs: "auto", md: 0 },
                  mb: 4,
                  lineHeight: 1.75,
                  fontSize: { xs: "1rem", md: "1.1rem" },
                }}
              >
                {t("home.subtitle")}
              </Typography>

              {/* Feature badges */}
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 1,
                  mb: 4,
                  justifyContent: { xs: "center", md: "flex-start" },
                }}
              >
                {NEW_BADGES.map((badge, i) => (
                  <Chip
                    key={i}
                    label={badge}
                    size="small"
                    sx={{
                      bgcolor: alpha(theme.palette.background.paper, 0.9),
                      border: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
                      fontWeight: 600,
                      fontSize: "0.7rem",
                      backdropFilter: "blur(8px)",
                      transition: "all 0.2s",
                      "&:hover": { borderColor: primary, color: primary },
                    }}
                  />
                ))}
              </Box>

              {/* CTA */}
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  justifyContent: { xs: "center", md: "flex-start" },
                }}
              >
                <Button
                  component={Link}
                  href="/login"
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    bgcolor: primary,
                    color: "#000",
                    px: 4,
                    py: 1.6,
                    borderRadius: 3,
                    fontWeight: 800,
                    textTransform: "none",
                    fontSize: "1rem",
                    boxShadow: `0 8px 24px ${alpha(primary, 0.45)}`,
                    transition: "all 0.25s ease",
                    "&:hover": {
                      bgcolor: alpha(primary, 0.88),
                      boxShadow: `0 12px 36px ${alpha(primary, 0.55)}`,
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  {t("auth.signIn")}
                </Button>
                <Button
                  component={Link}
                  href="/about"
                  variant="outlined"
                  size="large"
                  sx={{
                    borderColor: alpha(theme.palette.divider, 0.8),
                    color: theme.palette.text.secondary,
                    px: 3,
                    py: 1.6,
                    borderRadius: 3,
                    fontWeight: 600,
                    textTransform: "none",
                    fontSize: "1rem",
                    transition: "all 0.25s ease",
                    "&:hover": {
                      borderColor: primary,
                      color: primary,
                      bgcolor: alpha(primary, 0.05),
                    },
                  }}
                >
                  {t("common.about")}
                </Button>
              </Box>
            </Box>

            {/* Right: Dashboard preview */}
            <Box sx={{ flex: "0 0 auto", width: { xs: "100%", md: 400 }, display: { xs: "none", md: "block" } }}>
              <HeroDashboardPreview />
            </Box>
          </Box>
        </Container>

        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 80,
            background: `linear-gradient(to top, ${theme.palette.background.default}, transparent)`,
            pointerEvents: "none",
          }}
        />
      </Box>

      {/* ─── STATS ──────────────────────────────────────────────── */}
      <Box sx={{ py: { xs: 6, md: 8 } }}>
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4, 1fr)" },
              gap: 3,
            }}
          >
            {STATS.map((stat, i) => (
              <StatCard key={i} {...stat} />
            ))}
          </Box>
        </Container>
      </Box>

      {/* ─── WHO IT'S FOR ───────────────────────────────────────── */}
      <Box
        sx={{
          py: { xs: 7, md: 10 },
          position: "relative",
          background: isDark
            ? `linear-gradient(135deg, ${alpha(primary, 0.04)} 0%, transparent 50%)`
            : `linear-gradient(135deg, ${alpha(primary, 0.025)} 0%, transparent 50%)`,
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 6 }}>
            <Typography
              variant="overline"
              sx={{ color: primary, fontWeight: 700, letterSpacing: 2, mb: 1, display: "block" }}
            >
              PLATFORM ROLES
            </Typography>
            <Typography
              variant="h3"
              sx={{ fontWeight: 800, color: theme.palette.text.primary, mb: 1.5 }}
            >
              {t("home.audienceTitle")}
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: theme.palette.text.secondary, maxWidth: 520, mx: "auto" }}
            >
              {t("home.audienceSubtitle")}
            </Typography>
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
              gap: 4,
            }}
          >
            {WHO_IT_FOR.map((item, i) => (
              <Box
                key={i}
                sx={{
                  bgcolor: theme.palette.background.paper,
                  borderRadius: 4,
                  p: 4,
                  position: "relative",
                  overflow: "hidden",
                  border: `1px solid ${alpha(item.color, 0.15)}`,
                  transition: "all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  cursor: "default",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: `0 20px 50px ${alpha(item.color, 0.2)}`,
                    borderColor: alpha(item.color, 0.4),
                  },
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 4,
                    bgcolor: item.color,
                    transform: "scaleX(0)",
                    transition: "transform 0.35s ease",
                    transformOrigin: "left",
                  },
                  "&:hover::after": { transform: "scaleX(1)" },
                }}
              >
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: 3,
                    bgcolor: alpha(item.color, 0.1),
                    color: item.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 3,
                  }}
                >
                  {item.icon}
                </Box>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 800, color: theme.palette.text.primary, mb: 1.5 }}
                >
                  {item.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: theme.palette.text.secondary, lineHeight: 1.75 }}
                >
                  {item.description}
                </Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* ─── FEATURES ───────────────────────────────────────────── */}
      <Box sx={{ py: { xs: 7, md: 10 }, bgcolor: alpha(theme.palette.background.paper, 0.5) }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 6 }}>
            <Typography
              variant="overline"
              sx={{ color: primary, fontWeight: 700, letterSpacing: 2, mb: 1, display: "block" }}
            >
              CAPABILITIES
            </Typography>
            <Typography
              variant="h3"
              sx={{ fontWeight: 800, color: theme.palette.text.primary, mb: 1.5 }}
            >
              {t("home.featuresTitle")}
            </Typography>
            <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
              {t("home.featuresSubtitle")}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" },
              gap: 2.5,
            }}
          >
            {FEATURES.map((item, i) => (
              <FeatureCard key={i} index={i} {...item} />
            ))}
          </Box>
        </Container>
      </Box>

      {/* ─── GOAL ───────────────────────────────────────────────── */}
      <Container maxWidth="md" sx={{ py: { xs: 6, md: 8 } }}>
        <Box
          sx={{
            bgcolor: theme.palette.background.paper,
            borderRadius: 4,
            p: { xs: 3, md: 6 },
            position: "relative",
            overflow: "hidden",
            border: `1px solid ${alpha(primary, 0.15)}`,
            boxShadow: `0 8px 40px ${alpha(theme.palette.common.black, 0.06)}`,
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: -50,
              right: -50,
              width: 220,
              height: 220,
              borderRadius: "50%",
              bgcolor: alpha(primary, 0.05),
              pointerEvents: "none",
            }}
          />
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
            <Box sx={{ width: 5, height: 36, borderRadius: 3, bgcolor: primary }} />
            <Typography variant="h4" sx={{ fontWeight: 800, color: theme.palette.text.primary }}>
              {t("home.goalTitle")}
            </Typography>
          </Box>
          {[t("home.goal1"), t("home.goal2"), t("home.goal3")].map((p, i) => (
            <Typography
              key={i}
              variant="body1"
              sx={{
                color: theme.palette.text.secondary,
                lineHeight: 1.9,
                mb: i < 2 ? 2 : 0,
                fontSize: "1rem",
              }}
            >
              {p}
            </Typography>
          ))}
        </Box>
      </Container>

      {/* ─── FINAL CTA ──────────────────────────────────────────── */}
      <Box sx={{ py: { xs: 8, md: 12 }, position: "relative", overflow: "hidden" }}>
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background: isDark
              ? `linear-gradient(135deg, ${alpha(primary, 0.12)} 0%, ${alpha("#2196F3", 0.08)} 100%)`
              : `linear-gradient(135deg, ${alpha(primary, 0.07)} 0%, ${alpha("#2196F3", 0.04)} 100%)`,
            pointerEvents: "none",
          }}
        />
        <FloatingParticles color={primary} />
        <Container maxWidth="sm" sx={{ position: "relative", textAlign: "center" }}>
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: 3,
              bgcolor: primary,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mx: "auto",
              mb: 3,
              boxShadow: `0 12px 32px ${alpha(primary, 0.45)}`,
              animation: "iconBounce 3s ease-in-out infinite",
              "@keyframes iconBounce": {
                "0%,100%": { transform: "translateY(0)" },
                "50%": { transform: "translateY(-10px)" },
              },
            }}
          >
            <SchoolIcon sx={{ fontSize: 42, color: "#000" }} />
          </Box>
          <Typography
            variant="h3"
            sx={{ fontWeight: 800, color: theme.palette.text.primary, mb: 2 }}
          >
            {t("home.ctaTitle")}
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: theme.palette.text.secondary, mb: 4, lineHeight: 1.75 }}
          >
            {t("home.ctaSubtitle")}
          </Typography>
          <Button
            component={Link}
            href="/login"
            variant="contained"
            size="large"
            endIcon={<ArrowForwardIcon />}
            sx={{
              bgcolor: primary,
              color: "#000",
              px: 6,
              py: 2,
              borderRadius: 3,
              fontWeight: 800,
              textTransform: "none",
              fontSize: "1.1rem",
              boxShadow: `0 10px 30px ${alpha(primary, 0.4)}`,
              transition: "all 0.3s ease",
              "&:hover": {
                bgcolor: alpha(primary, 0.88),
                transform: "translateY(-3px) scale(1.02)",
                boxShadow: `0 16px 44px ${alpha(primary, 0.5)}`,
              },
            }}
          >
            {t("auth.signIn")}
          </Button>
        </Container>
      </Box>
    </Box>
  );
}

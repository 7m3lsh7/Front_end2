'use client';

import { useMemo, useState } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Box,
    Stack,
    IconButton,
    Button,
    Avatar,
    Drawer,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import LogoutIcon from '@mui/icons-material/Logout';
import LanguageIcon from '@mui/icons-material/Language';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { navbarData } from '@/data/navbar';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/context/LanguageContext';
import { useThemeMode } from '@/context/ThemeModeContext';
import AccessibleIconButton from '@/components/a11y/AccessibleIconButton';

const LOGO_SRC = '/Images/login/logo.png';

type NavLink = { label: string; href: string };

export default function SharedNavbar() {
    const theme = useTheme();
    const [openDrawer, setOpenDrawer] = useState(false);
    const { user, logout } = useAuth();
    const router = useRouter();
    const { t, toggleLanguage } = useLanguage();
    const { mode, toggleMode } = useThemeMode();
    const {
        title,
        subtitle,
        centerLinks: defaultCenterLinks,
        profileHref,
    } = navbarData;
    const handleLogout = async () => {
        await logout();   
        router.replace("/login"); 
    };

    const centerLinks = useMemo<NavLink[]>(() => {
        // Not logged in: hide Years, keep Home/About.
        if (!user) {
            return defaultCenterLinks
                .filter((l) => l.href !== "/years")
                .map((l) => ({
                    href: l.href,
                    label: l.href === "/" ? t("common.home") : l.href === "/about" ? t("common.about") : l.label,
                }));
        }

        // Logged in: role-based nav
        if (user.role === "Student") {
            return [
                { href: "/student", label: t("common.home") },
                { href: "/student/years", label: t("common.years") },
                { href: "/about", label: t("common.about") },
            ];
        }

        if (user.role === "Teacher") {
            return [
                { href: "/teacher", label: t("common.home") },
                { href: "/about", label: t("common.about") },
            ];
        }

        if (user.role === "StudentAffairs") {
            return [
                { href: "/vice", label: t("common.home") },
                { href: "/about", label: t("common.about") },
            ];
        }

        // Admin or others
        return [
            { href: "/admin", label: t("common.home") },
            { href: "/about", label: t("common.about") },
        ];
    }, [defaultCenterLinks, t, user]);

    return (
        <>
            {/* ================= AppBar ================= */}
            <AppBar
                position="sticky"
                elevation={0}
                sx={{
                    backgroundColor: theme.palette.background.paper,
                    color: theme.palette.text.primary,
                    borderRadius: '0 0 24px 24px',
                    boxShadow: '0px 4px 20px rgba(0,0,0,0.05)',
                    px: { xs: 0.6, md: 2 },
                }}
            >
                <Toolbar
                    sx={{
                        justifyContent: 'space-between',
                        minHeight: { xs: 64, md: 80 },
                    }}
                >
                    {/* Left */}
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <Image
                            src={LOGO_SRC}
                            alt="Logo"
                            width={50}
                            height={40}
                            priority
                            style={{ objectFit: 'contain' }}
                        />

                        <Box>
                            <Typography variant="h4">{title}</Typography>
                            {subtitle && (
                                <Typography variant="h5" color="text.secondary" noWrap>
                                    {subtitle}
                                </Typography>
                            )}
                        </Box>
                    </Stack>

                    {/* Center (Desktop only) */}
                    <Stack
                        direction="row"
                        spacing={1}
                        sx={{ display: { xs: 'none', md: 'flex' } }}
                    >
                        {centerLinks?.map((link) => (
                            <Button
                                key={link.label}
                                component={Link}
                                href={link.href}
                                sx={{
                                    textTransform: 'none',
                                    color: theme.palette.text.primary,
                                    px: 2,
                                    '&:hover': {
                                        color: theme.palette.primary.main,
                                    },
                                }}
                            >
                                <Typography variant="h4">
                                    {link.label}
                                </Typography>
                            </Button>
                        ))}
                    </Stack>

                    {/* Right */}
                    <Stack direction="row" alignItems="center" spacing={1}>

                        {/* User */}
                        {user && (
                        <Button
                            component={Link}
                            href={profileHref}
                            sx={{
                                backgroundColor: theme.palette.primary.main,
                                color: theme.palette.primary.contrastText,
                                textTransform: 'none',
                                borderRadius: '15px',
                                boxShadow: 'none',
                                px: { xs: 1.2, md: 2 },
                            }}
                        >
                            <Avatar sx={{ width: 32, height: 32 }} />
                            <Box sx={{ ml: 1, display: { xs: 'none', sm: 'block' } }}>
                                <Typography variant="body1">{user.username}</Typography>
                                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                    {user.role}
                                </Typography>
                            </Box>
                        </Button>
                        )}
                        {/* Burger Menu (Mobile) */}
                        <AccessibleIconButton
                            label={t("common.openMenu")}
                            onClick={() => setOpenDrawer(true)}
                            sx={{ display: { xs: 'flex', md: 'none' } }}
                        >
                            <MenuIcon />
                        </AccessibleIconButton>
                        {/* Icons (Desktop) */}
                        <AccessibleIconButton
                            label={t("common.language")}
                            onClick={toggleLanguage}
                            sx={{
                                display: { xs: 'none', md: 'flex' },
                                backgroundColor: theme.palette.primary.main,
                                color: theme.palette.primary.contrastText,
                                borderRadius: '12px',
                            }}
                        >
                            <LanguageIcon />
                        </AccessibleIconButton>
                        <AccessibleIconButton
                            label={mode === "dark" ? t("common.lightMode") : t("common.darkMode")}
                            onClick={toggleMode}
                            sx={{
                                display: { xs: 'none', md: 'flex' },
                                backgroundColor: theme.palette.background.default,
                                color: theme.palette.text.primary,
                                borderRadius: '12px',
                            }}
                        >
                            {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
                        </AccessibleIconButton>
{user && (
                        <AccessibleIconButton
                            label={t("common.logout")}
                            onClick={handleLogout}
                            sx={{
                                display: { xs: 'none', md: 'flex' },
                                backgroundColor: theme.palette.error.main,
                                color: theme.palette.error.light,
                                borderRadius: '12px',
                            }}
                        >
                            <LogoutIcon />
                        </AccessibleIconButton>
)}
                    </Stack>
                </Toolbar>
            </AppBar>

            {/* ================= Mobile Drawer ================= */}
            <Drawer
                anchor="right"
                open={openDrawer}
                onClose={() => setOpenDrawer(false)}
                PaperProps={{
                    sx: {
                        width: '80%',
                        height: '100%',
                        backgroundColor: theme.palette.background.paper,
                        borderRadius: '16px 0 0 16px',
                    },
                }}
            >

                {/* Drawer Header */}
                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    px={2}
                    py={2}
                >
                    <Typography variant="h4">{t("common.menu")}</Typography>
                    <AccessibleIconButton label={t("common.closeMenu")} onClick={() => setOpenDrawer(false)}>
                        <CloseIcon />
                    </AccessibleIconButton>
                </Stack>

                {/* Links */}
                <Stack spacing={1} px={2} mt={2}>
                    {centerLinks?.map((link) => (
                        <Button
                            key={link.label}
                            component={Link}
                            href={link.href}
                            onClick={() => setOpenDrawer(false)}
                            sx={{
                                justifyContent: 'flex-start',
                                textTransform: 'none',
                                color: theme.palette.text.primary,
                                py: 1.5,
                            }}
                        >
                            <Typography variant="body3">
                                {link.label}
                            </Typography>
                        </Button>
                    ))}
                </Stack>

                {/* Bottom Actions */}
                <Box mt="auto" px={2} pb={3}>
                    <Stack

                        spacing={2}>
                        <Button
                            onClick={toggleLanguage}
                            startIcon={<LanguageIcon />}
                            sx={{
                                backgroundColor: theme.palette.primary.main,
                                color: theme.palette.text.primary,
                                justifyContent: 'flex-start',
                                textTransform: 'none',
                                borderRadius: '12px',
                                p: 2
                            }}
                        >
                            {t("common.language")}
                        </Button>
                        <Button
                            onClick={toggleMode}
                            startIcon={mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
                            sx={{
                                backgroundColor: theme.palette.background.default,
                                color: theme.palette.text.primary,
                                justifyContent: 'flex-start',
                                textTransform: 'none',
                                borderRadius: '12px',
                                p: 2
                            }}
                        >
                            {mode === "dark" ? t("common.lightMode") : t("common.darkMode")}
                        </Button>
{user && (
                        <Button
                        onClick={handleLogout}
                        startIcon={<LogoutIcon />}
                        sx={{
                            justifyContent: 'flex-start',
                            textTransform: 'none',
                            color: theme.palette.error.light,
                            backgroundColor: theme.palette.error.main,
                            borderRadius: '12px',
                            p: 2
                        }}
                    >
                        {t("common.logout")}
                    </Button>
)}
                    </Stack>
                </Box>
            </Drawer>
        </>
    );
}
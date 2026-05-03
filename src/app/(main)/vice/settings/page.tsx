'use client';

import React, { useState } from 'react';
import {
    Box, Container, Typography, Card, Stack,
    Button, Select, MenuItem, FormControl, InputLabel,
    Alert
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';
import SettingsIcon from '@mui/icons-material/Settings';
import SaveIcon from '@mui/icons-material/Save';

import { useLanguage } from '@/context/LanguageContext';
import { appToast } from '@/hooks/useAppToast';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
};

export default function ViceSettingsPage() {
    const { t } = useLanguage();
    const theme = useTheme();

    const primary = theme.palette.primary.main;
    const secondary = theme.palette.secondary.main;
    const glassCardSx = {
        background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.4)}, ${alpha(theme.palette.background.paper, 0.2)})`,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
        borderRadius: '24px',
        boxShadow: `0 8px 32px 0 ${alpha(theme.palette.common.black, 0.2)}`,
        p: 4,
    };

    // Mock state for mappings
    const [mappings, setMappings] = useState({
        junior: '2024-2025',
        wheeler: '2024-2025',
        senior: '2024-2025'
    });
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        setSaving(true);
        // Simulate API call to the proposed /api/Settings/YearMappings
        setTimeout(() => {
            appToast.success('Year mappings updated successfully!');
            setSaving(false);
        }, 1000);
    };

    const academicYears = ["2024-2025", "2025-2026", "2026-2027", "2027-2028"];

    return (
        <Box sx={{
            minHeight: '100vh',
            background: `radial-gradient(circle at top right, ${alpha(primary, 0.1)}, transparent 40%),
                   radial-gradient(circle at bottom left, ${alpha(secondary, 0.1)}, transparent 40%)`,
            pt: { xs: 4, md: 6 },
            pb: { xs: 8, md: 10 },
            px: { xs: 2, sm: 3, md: 4 },
        }}>
            <Container maxWidth="md">
                <Box component={motion.div} variants={containerVariants} initial="hidden" animate="visible">
                    {/* Header */}
                    <Box sx={{ mb: 6, display: 'flex', alignItems: 'center', gap: 3 }}>
                        <Box sx={{
                            width: 56, height: 56,
                            background: `linear-gradient(135deg, ${primary}, ${secondary})`,
                            borderRadius: '16px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: theme.palette.primary.contrastText,
                            boxShadow: `0 4px 20px ${alpha(primary, 0.4)}`,
                        }}>
                            <SettingsIcon fontSize="large" />
                        </Box>
                        <Box>
                            <Typography variant="h3" fontWeight={800} sx={{
                                background: `linear-gradient(135deg, ${theme.palette.text.primary}, ${theme.palette.text.secondary})`,
                                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
                            }}>
                                Global Settings
                            </Typography>
                            <Typography variant="h6" color="text.secondary" fontWeight={500}>
                                Configure system-wide mappings and configurations
                            </Typography>
                        </Box>
                    </Box>

                    <Stack spacing={4}>
                        <Card sx={glassCardSx} component={motion.div} variants={itemVariants}>
                            <Typography variant="h5" fontWeight={700} gutterBottom>
                                Academic Year Mappings
                            </Typography>
                            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                                Map educational levels to specific academic years. This controls which year is used when the system queries backend services for Junior, Wheeler, and Senior stages.
                            </Typography>

                            <Alert severity="info" sx={{ mb: 4, borderRadius: 2 }}>
                                Note: These settings are currently in mockup mode until the backend implements the proposed <strong>/api/Settings/YearMappings</strong> endpoints.
                            </Alert>

                            <Stack spacing={3}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 4, flexWrap: 'wrap' }}>
                                    <Typography fontWeight="bold" sx={{ minWidth: 100 }}>Junior Level:</Typography>
                                    <FormControl size="small" sx={{ minWidth: 200, flex: 1 }}>
                                        <InputLabel>Mapped Year</InputLabel>
                                        <Select value={mappings.junior} label="Mapped Year" onChange={(e) => setMappings({ ...mappings, junior: e.target.value })}>
                                            {academicYears.map(y => <MenuItem key={y} value={y}>{y}</MenuItem>)}
                                        </Select>
                                    </FormControl>
                                </Box>

                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 4, flexWrap: 'wrap' }}>
                                    <Typography fontWeight="bold" sx={{ minWidth: 100 }}>Wheeler Level:</Typography>
                                    <FormControl size="small" sx={{ minWidth: 200, flex: 1 }}>
                                        <InputLabel>Mapped Year</InputLabel>
                                        <Select value={mappings.wheeler} label="Mapped Year" onChange={(e) => setMappings({ ...mappings, wheeler: e.target.value })}>
                                            {academicYears.map(y => <MenuItem key={y} value={y}>{y}</MenuItem>)}
                                        </Select>
                                    </FormControl>
                                </Box>

                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 4, flexWrap: 'wrap' }}>
                                    <Typography fontWeight="bold" sx={{ minWidth: 100 }}>Senior Level:</Typography>
                                    <FormControl size="small" sx={{ minWidth: 200, flex: 1 }}>
                                        <InputLabel>Mapped Year</InputLabel>
                                        <Select value={mappings.senior} label="Mapped Year" onChange={(e) => setMappings({ ...mappings, senior: e.target.value })}>
                                            {academicYears.map(y => <MenuItem key={y} value={y}>{y}</MenuItem>)}
                                        </Select>
                                    </FormControl>
                                </Box>
                            </Stack>

                            <Box sx={{ mt: 5, display: 'flex', justifyContent: 'flex-end' }}>
                                <Button
                                    variant="contained"
                                    startIcon={<SaveIcon />}
                                    onClick={handleSave}
                                    disabled={saving}
                                    sx={{
                                        background: `linear-gradient(45deg, ${primary}, ${secondary})`,
                                        color: '#fff',
                                        fontWeight: 700,
                                        px: 4, py: 1,
                                        borderRadius: '12px',
                                        boxShadow: `0 4px 14px ${alpha(primary, 0.4)}`,
                                    }}
                                >
                                    {saving ? 'Saving...' : 'Save Settings'}
                                </Button>
                            </Box>
                        </Card>
                    </Stack>
                </Box>
            </Container>
        </Box>
    );
}

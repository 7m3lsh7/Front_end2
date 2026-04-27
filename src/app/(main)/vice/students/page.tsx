'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Box, Container, Typography, Stack, Button, Card, MenuItem, Select, FormControl, InputLabel, TextField, RadioGroup, FormControlLabel, Radio, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Alert, useTheme, alpha } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Link from 'next/link';
import { motion } from 'framer-motion';
import AddStudentModal from '@/components/vice/students/AddStudentModal';
import { ClassesAPI } from '@/data/classes.api';
import { ViceStudentsAPI } from '@/data/vice-students.api';
import type { Class } from '@/types/subject.types';
import type { ViceDepartment, ViceLevel } from '@/types/vice/students';
import { useLanguage } from '@/context/LanguageContext';
import LoadingRegion from '@/components/a11y/LoadingRegion';
import { appToast } from '@/hooks/useAppToast';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100 } }
};

export default function ViceStudentsPage() {
    const { t } = useLanguage();
    const theme = useTheme();
    const primary = theme.palette.primary.main;
    const secondary = theme.palette.secondary?.main || primary;
    const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
    const [yearId, setYearId] = useState<string>('2024-2025');
    const [department, setDepartment] = useState<ViceDepartment>('OM');
    const [level, setLevel] = useState<ViceLevel>('junior');
    const [className, setClassName] = useState('');

    const [classes, setClasses] = useState<Class[]>([]);
    const [selectedClassId, setSelectedClassId] = useState<number | null>(null);

    const [studentsLoading, setStudentsLoading] = useState(false);
    const [studentsError, setStudentsError] = useState<string | null>(null);
    const [students, setStudents] = useState<
        { id: string; studentCode: string; name: string; department: string; className: string }[]
    >([]);

    const [classesLoading, setClassesLoading] = useState(false);
    const [classesError, setClassesError] = useState<string | null>(null);
    const [creatingClass, setCreatingClass] = useState(false);
    const [creatingClassError, setCreatingClassError] = useState<string | null>(null);

    const canCreateClass = useMemo(
        () => !!yearId && !!department && !!className.trim(),
        [className, department, yearId]
    );

    const loadClasses = async () => {
        setClassesError(null);
        setClassesLoading(true);
        try {
            const data = await ClassesAPI.getByYear(yearId);
            setClasses(data);
        } catch (e: unknown) {
            setClassesError(e instanceof Error ? e.message : t('students.failedLoadClasses', 'Failed to load classes'));
            setClasses([]);
        } finally {
            setClassesLoading(false);
        }
    };

    const loadStudents = async () => {
        setStudentsError(null);
        setStudentsLoading(true);
        try {
            const data = await ViceStudentsAPI.list({
                year: level,
                department,
                classId: selectedClassId ?? undefined,
            });
            setStudents(
                data.map((s) => ({
                    id: s.id,
                    studentCode: s.studentCode,
                    name: s.name,
                    department: s.department,
                    className: s.className,
                }))
            );
        } catch (e: unknown) {
            setStudentsError(e instanceof Error ? e.message : t('students.failedLoadStudents', 'Failed to load students'));
            setStudents([]);
        } finally {
            setStudentsLoading(false);
        }
    };

    useEffect(() => {
        loadClasses();
        setSelectedClassId(null);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [yearId]);

    useEffect(() => {
        loadStudents();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [level, department, selectedClassId]);

    const handleCreateClass = async () => {
        setCreatingClassError(null);
        if (!canCreateClass) {
            setCreatingClassError(t('students.fillClassFields', 'Please fill required class fields'));
            return;
        }
        setCreatingClass(true);
        try {
            const created = await ClassesAPI.create({
                yearId,
                department,
                className: className.trim(),
            });
            setClassName('');
            await loadClasses();
            setSelectedClassId(created.classId);
        } catch (e: unknown) {
            setCreatingClassError(e instanceof Error ? e.message : t('students.failedCreateClass', 'Failed to create class'));
            appToast.error(e instanceof Error ? e.message : t('students.failedCreateClass', 'Failed to create class'));
        } finally {
            setCreatingClass(false);
        }
    };

    const glassCardSx = {
        p: 4, 
        borderRadius: '24px', 
        backgroundColor: alpha(theme.palette.background.paper, 0.7),
        backdropFilter: 'blur(24px)',
        border: `1px solid ${alpha(theme.palette.common.white, 0.15)}`,
        boxShadow: `0 12px 40px ${alpha(theme.palette.common.black, 0.08)}`,
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: `0 16px 50px ${alpha(primary, 0.1)}`,
        }
    };

    const badgeSx = {
        width: 40, height: 40,
        background: `linear-gradient(135deg, ${primary}, ${secondary})`,
        borderRadius: '12px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 'bold', color: theme.palette.primary.contrastText,
        boxShadow: `0 4px 12px ${alpha(primary, 0.4)}`,
        fontSize: '1.2rem'
    };

    return (
        <>
            <Box sx={{ position: 'relative', minHeight: '100vh', paddingBottom: 4, bgcolor: theme.palette.background.default, overflow: 'hidden' }}>
                {/* Animated Background Gradients */}
                <Box
                    component={motion.div}
                    animate={{ scale: [1, 1.1, 1], rotate: [0, -10, 0] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    sx={{
                        position: 'absolute', top: '-20%', right: '-10%', width: '100%', height: '100%',
                        background: `radial-gradient(circle at 70% 30%, ${alpha(primary, 0.15)}, transparent 50%)`,
                        zIndex: 0, pointerEvents: 'none',
                    }}
                />

                <Box sx={{ py: 4, position: 'relative', zIndex: 1 }}>
                    <Container maxWidth="lg">
                        <Box component={motion.div} initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} sx={{ mb: 6 }}>
                            <Typography variant="h2" sx={{ fontWeight: 800, background: `linear-gradient(45deg, ${theme.palette.text.primary}, ${primary})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                {t('students.studentsManagement')}
                            </Typography>
                        </Box>

                        <Box
                            component={motion.div}
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            sx={{
                                borderRadius: '32px',
                                position: 'relative',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 4,
                            }}
                        >
                            <Stack spacing={4}>
                                {/* Step 1: Create New Class */}
                                <Box component={motion.div} variants={itemVariants}>
                                    <Card sx={glassCardSx}>
                                        <Stack spacing={3}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <Box sx={badgeSx}>1</Box>
                                                <Typography variant="h5" fontWeight="800" sx={{ letterSpacing: '-0.01em' }}>{t('students.createNewClass')}</Typography>
                                            </Box>

                                            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                                                <FormControl fullWidth size="small" sx={{ maxWidth: 200 }}>
                                                    <InputLabel>{t('students.academicYear')}</InputLabel>
                                                    <Select label={t('students.academicYear')} value={yearId} onChange={(e) => setYearId(String(e.target.value))} sx={{ borderRadius: 2 }}>
                                                        <MenuItem value="2024-2025">2024-2025</MenuItem>
                                                    </Select>
                                                </FormControl>
                                                <FormControl fullWidth size="small" sx={{ maxWidth: 200 }}>
                                                    <InputLabel>{t('students.department')}</InputLabel>
                                                    <Select label={t('students.department')} value={department} onChange={(e) => setDepartment(e.target.value as ViceDepartment)} sx={{ borderRadius: 2 }}>
                                                        <MenuItem value="OM">OM</MenuItem>
                                                        <MenuItem value="SD">SD</MenuItem>
                                                    </Select>
                                                </FormControl>
                                                <TextField
                                                    label={t('students.className')}
                                                    size="small"
                                                    value={className}
                                                    onChange={(e) => setClassName(e.target.value)}
                                                    sx={{ borderRadius: 2, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                                />
                                                <Button
                                                    component={motion.button}
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    variant="contained"
                                                    startIcon={<AddIcon />}
                                                    onClick={handleCreateClass}
                                                    disabled={creatingClass}
                                                    sx={{
                                                        background: `linear-gradient(45deg, ${primary}, ${secondary})`,
                                                        color: theme.palette.primary.contrastText,
                                                        fontWeight: 700,
                                                        borderRadius: '12px',
                                                        px: 3, py: 1,
                                                        boxShadow: `0 4px 14px ${alpha(primary, 0.4)}`,
                                                    }}
                                                >
                                                    {creatingClass ? t('students.creating') : t('students.createClass')}
                                                </Button>
                                            </Box>
                                            {creatingClassError && <Alert severity="error" sx={{ borderRadius: 2 }}>{creatingClassError}</Alert>}
                                        </Stack>
                                    </Card>
                                </Box>

                                {/* Step 2: Select Class */}
                                <Box component={motion.div} variants={itemVariants}>
                                    <Card sx={glassCardSx}>
                                        <Stack spacing={3}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <Box sx={badgeSx}>2</Box>
                                                <Typography variant="h5" fontWeight="800" sx={{ letterSpacing: '-0.01em' }}>{t('students.selectClass')}</Typography>
                                            </Box>

                                            <Box sx={{ maxWidth: 400 }}>
                                                <FormControl fullWidth size="small">
                                                    <InputLabel>{t('students.selectClass')}</InputLabel>
                                                    <Select
                                                        label={t('students.selectClass')}
                                                        value={selectedClassId ?? ''}
                                                        onChange={(e) => setSelectedClassId(Number(e.target.value))}
                                                        disabled={classesLoading}
                                                        sx={{ borderRadius: 2 }}
                                                    >
                                                        {classesLoading ? (
                                                            <MenuItem disabled><LoadingRegion /></MenuItem>
                                                        ) : classes.length === 0 ? (
                                                            <MenuItem disabled>{t('teachers.noClassesForYear')}</MenuItem>
                                                        ) : (
                                                            classes.map((c) => (
                                                                <MenuItem key={c.classId} value={c.classId}>{c.className}</MenuItem>
                                                            ))
                                                        )}
                                                    </Select>
                                                </FormControl>
                                                {classesError && <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>{classesError}</Alert>}
                                            </Box>
                                        </Stack>
                                    </Card>
                                </Box>

                                {/* Step 3: Student Management */}
                                <Box component={motion.div} variants={itemVariants}>
                                    <Card sx={{ ...glassCardSx, mb: 4 }}>
                                        <Stack spacing={4}>
                                            {/* Header & Add Button */}
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    <Box sx={badgeSx}>3</Box>
                                                    <Typography variant="h5" fontWeight="800">{t('students.studentManagement')}</Typography>
                                                </Box>
                                                <Button
                                                    component={motion.button}
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    variant="contained"
                                                    startIcon={<AddIcon />}
                                                    onClick={() => setIsAddStudentModalOpen(true)}
                                                    sx={{
                                                        background: `linear-gradient(45deg, ${primary}, ${secondary})`,
                                                        color: theme.palette.primary.contrastText,
                                                        fontWeight: 700,
                                                        borderRadius: '12px',
                                                        boxShadow: `0 4px 14px ${alpha(primary, 0.4)}`,
                                                    }}
                                                >
                                                    {t('students.addNewStudent')}
                                                </Button>
                                            </Box>

                                            {/* Filters */}
                                            <Box sx={{ display: 'flex', gap: 6, flexWrap: 'wrap', bgcolor: alpha(theme.palette.background.default, 0.5), p: 2, borderRadius: 3 }}>
                                                <RadioGroup row value={department} onChange={(e) => setDepartment(e.target.value as ViceDepartment)}>
                                                    <FormControlLabel value="OM" control={<Radio sx={{ color: primary, '&.Mui-checked': { color: primary } }} />} label={<Typography fontWeight={600}>OM</Typography>} />
                                                    <FormControlLabel value="SD" control={<Radio sx={{ color: primary, '&.Mui-checked': { color: primary } }} />} label={<Typography fontWeight={600}>SD</Typography>} />
                                                </RadioGroup>
                                                <RadioGroup row value={level} onChange={(e) => setLevel(e.target.value as ViceLevel)}>
                                                    <FormControlLabel value="junior" control={<Radio sx={{ color: primary, '&.Mui-checked': { color: primary } }} />} label={<Typography fontWeight={600}>Junior</Typography>} />
                                                    <FormControlLabel value="wheeler" control={<Radio sx={{ color: primary, '&.Mui-checked': { color: primary } }} />} label={<Typography fontWeight={600}>Wheeler</Typography>} />
                                                    <FormControlLabel value="senior" control={<Radio sx={{ color: primary, '&.Mui-checked': { color: primary } }} />} label={<Typography fontWeight={600}>Senior</Typography>} />
                                                </RadioGroup>
                                            </Box>

                                            {/* Students List Title */}
                                            <Typography variant="h6" fontWeight="700" color="text.secondary">{t('students.studentsList')}</Typography>

                                            {/* Table */}
                                            <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 3, border: `1px solid ${alpha(theme.palette.divider, 0.2)}`, bgcolor: 'transparent' }} aria-busy={studentsLoading}>
                                                <Table>
                                                    <TableHead sx={{ backgroundColor: alpha(primary, 0.1) }}>
                                                        <TableRow>
                                                            <TableCell sx={{ fontWeight: 800, fontSize: '0.95rem' }}>{t('students.studentName')}</TableCell>
                                                            <TableCell sx={{ fontWeight: 800, fontSize: '0.95rem' }}>{t('students.studentId')}</TableCell>
                                                            <TableCell sx={{ fontWeight: 800, fontSize: '0.95rem' }}>{t('students.department')}</TableCell>
                                                            <TableCell sx={{ fontWeight: 800, fontSize: '0.95rem' }}>{t('students.class')}</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {studentsLoading ? (
                                                            <TableRow>
                                                                <TableCell colSpan={4}>
                                                                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                                                                        <CircularProgress color="primary" />
                                                                    </Box>
                                                                </TableCell>
                                                            </TableRow>
                                                        ) : students.length === 0 ? (
                                                            <TableRow>
                                                                <TableCell colSpan={4} align="center" sx={{ py: 4, color: 'text.secondary', fontWeight: 500 }}>
                                                                    {t('students.noStudentsFound')}
                                                                </TableCell>
                                                            </TableRow>
                                                        ) : (
                                                            students.map((s, idx) => (
                                                                <TableRow 
                                                                    key={s.id} 
                                                                    component={motion.tr} 
                                                                    initial={{ opacity: 0, y: 10 }} 
                                                                    animate={{ opacity: 1, y: 0 }} 
                                                                    transition={{ delay: idx * 0.05 }}
                                                                    sx={{ '&:hover': { bgcolor: alpha(primary, 0.05) }, transition: 'background-color 0.2s' }}
                                                                >
                                                                    <TableCell sx={{ fontWeight: 600 }}>{s.name}</TableCell>
                                                                    <TableCell>{s.studentCode}</TableCell>
                                                                    <TableCell>
                                                                        <Box sx={{ bgcolor: alpha(primary, 0.1), color: primary, display: 'inline-block', px: 1.5, py: 0.5, borderRadius: 1.5, fontWeight: 700, fontSize: '0.8rem' }}>
                                                                            {s.department}
                                                                        </Box>
                                                                    </TableCell>
                                                                    <TableCell>{s.className}</TableCell>
                                                                </TableRow>
                                                            ))
                                                        )}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                            {studentsError && <Alert severity="error" sx={{ borderRadius: 2 }}>{studentsError}</Alert>}

                                            {/* Footer Actions */}
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2, mt: 2 }}>
                                                <Button
                                                    component={Link}
                                                    href="/vice/students/all"
                                                    variant="outlined"
                                                    sx={{ borderRadius: '12px', fontWeight: 700, px: 3 }}
                                                >
                                                    {t('students.allStudents')}
                                                </Button>
                                                <Box sx={{ display: 'flex', gap: 2 }}>
                                                    <Button
                                                        variant="contained"
                                                        onClick={() => setIsAddStudentModalOpen(true)}
                                                        sx={{ borderRadius: '12px', fontWeight: 700, px: 3, boxShadow: `0 4px 14px ${alpha(primary, 0.3)}` }}
                                                    >
                                                        {t('students.addStudent')}
                                                    </Button>
                                                </Box>
                                            </Box>
                                        </Stack>
                                    </Card>
                                </Box>
                            </Stack>
                        </Box>
                    </Container>
                </Box >

                <AddStudentModal
                    open={isAddStudentModalOpen}
                    onClose={() => setIsAddStudentModalOpen(false)}
                    classId={selectedClassId}
                    year={level}
                    department={department}
                    onSubmit={async (payload) => {
                        if (!selectedClassId) throw new Error(t('modal.pleaseSelectClassFirst'));
                        await ViceStudentsAPI.create({
                            ...payload,
                            department,
                            year: level,
                            classId: selectedClassId,
                        });
                        await loadStudents();
                        appToast.success(t('modal.studentAddedSuccess'));
                    }}
                />
            </Box >
        </>
    );
}

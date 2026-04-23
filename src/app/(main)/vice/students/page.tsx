'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Box, Container, Typography, Stack, Button, Card, MenuItem, Select, FormControl, InputLabel, TextField, RadioGroup, FormControlLabel, Radio, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Alert } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Link from 'next/link';
import AddStudentModal from '@/components/vice/students/AddStudentModal';
import { ClassesAPI } from '@/data/classes.api';
import { ViceStudentsAPI } from '@/data/vice-students.api';
import type { Class } from '@/types/subject.types';
import type { ViceDepartment, ViceLevel } from '@/types/vice/students';

export default function ViceStudentsPage() {
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
            setClassesError(e instanceof Error ? e.message : 'Failed to load classes');
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
            setStudentsError(e instanceof Error ? e.message : 'Failed to load students');
            setStudents([]);
        } finally {
            setStudentsLoading(false);
        }
    };

    useEffect(() => {
        loadClasses();
        // reset selection when year changes
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
            setCreatingClassError('Please fill required class fields');
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
            setCreatingClassError(e instanceof Error ? e.message : 'Failed to create class');
        } finally {
            setCreatingClass(false);
        }
    };

    return (
           <>


        <Box sx={{ position: 'relative', minHeight: '100vh', paddingBottom: 4 }}>
            {/* Page Header Area */}
            <Box sx={{ py: 4, position: 'relative' }}>
                <Container maxWidth="lg">
                    <Box sx={{ mb: 6 }}>
                        <Typography variant="h3" fontWeight="bold" sx={{ color: '#000' }}>
                            Students Management
                        </Typography>
                    </Box>

                    {/* Main Content Glass Container with Background */}
                    <Box
                        sx={{
                            backgroundImage: 'url(/images/background1.png)',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            borderRadius: '24px',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.3)',
                            overflow: 'hidden',
                            position: 'relative',
                            minHeight: '600px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        {/* Dark Overlay inside the card */}
                        <Box
                            sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                                zIndex: 0,
                            }}
                        />

                        {/* Content inside the glass card */}
                        <Box sx={{
                            position: 'relative',
                            zIndex: 1,
                            width: '100%',
                            p: { xs: 3, md: 6 },
                        }}>
                            <Stack spacing={4}>

                                {/* Step 1: Create New Class */}
                                <Card sx={{ p: 3, borderRadius: '16px', backgroundColor: '#fff' }}>
                                    <Stack spacing={2}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Box sx={{
                                                width: 32, height: 32,
                                                backgroundColor: '#ffc107',
                                                borderRadius: '8px',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontWeight: 'bold', color: '#000'
                                            }}>
                                                1
                                            </Box>
                                            <Typography variant="h6" fontWeight="bold">Create New Class</Typography>
                                        </Box>

                                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                                            <FormControl fullWidth size="small" sx={{ maxWidth: 200, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                                                <InputLabel>Academic Year</InputLabel>
                                                <Select label="Academic Year" value={yearId} onChange={(e) => setYearId(String(e.target.value))}>
                                                    <MenuItem value="2024-2025">2024-2025</MenuItem>
                                                </Select>
                                            </FormControl>
                                            <FormControl fullWidth size="small" sx={{ maxWidth: 200, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                                                <InputLabel>Department</InputLabel>
                                                <Select label="Department" value={department} onChange={(e) => setDepartment(e.target.value as ViceDepartment)}>
                                                    <MenuItem value="OM">OM</MenuItem>
                                                    <MenuItem value="SD">SD</MenuItem>
                                                </Select>
                                            </FormControl>
                                            <TextField
                                                placeholder="class name"
                                                size="small"
                                                value={className}
                                                onChange={(e) => setClassName(e.target.value)}
                                                sx={{ backgroundColor: '#f5f5f5', borderRadius: 1 }}
                                            />
                                            <Button
                                                variant="contained"
                                                startIcon={<AddIcon />}
                                                onClick={handleCreateClass}
                                                disabled={creatingClass}
                                                sx={{
                                                    backgroundColor: '#ffc107',
                                                    color: '#000',
                                                    fontWeight: 'bold',
                                                    '&:hover': { backgroundColor: '#ffca2c' }
                                                }}
                                            >
                                                {creatingClass ? 'Creating...' : 'Create class'}
                                            </Button>
                                        </Box>
                                        {creatingClassError && <Alert severity="error">{creatingClassError}</Alert>}
                                    </Stack>
                                </Card>

                                {/* Step 2: Select Class */}
                                <Card sx={{ p: 3, borderRadius: '16px', backgroundColor: '#fff' }}>
                                    <Stack spacing={2}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Box sx={{
                                                width: 32, height: 32,
                                                backgroundColor: '#ffc107',
                                                borderRadius: '8px',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontWeight: 'bold', color: '#000'
                                            }}>
                                                2
                                            </Box>
                                            <Typography variant="h6" fontWeight="bold">Select Class</Typography>
                                        </Box>

                                        <Box>
                                            <FormControl fullWidth size="small" sx={{ backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                                                <InputLabel>Select Class</InputLabel>
                                                <Select
                                                    label="Select Class"
                                                    value={selectedClassId ?? ''}
                                                    onChange={(e) => setSelectedClassId(Number(e.target.value))}
                                                    disabled={classesLoading}
                                                >
                                                    {classesLoading ? (
                                                        <MenuItem disabled>
                                                            <CircularProgress size={18} sx={{ mr: 1 }} />
                                                            Loading...
                                                        </MenuItem>
                                                    ) : classes.length === 0 ? (
                                                        <MenuItem disabled>No classes available</MenuItem>
                                                    ) : (
                                                        classes.map((c) => (
                                                            <MenuItem key={c.classId} value={c.classId}>
                                                                {c.className}
                                                            </MenuItem>
                                                        ))
                                                    )}
                                                </Select>
                                            </FormControl>
                                            {classesError && <Alert severity="error" sx={{ mt: 1 }}>{classesError}</Alert>}
                                        </Box>
                                    </Stack>
                                </Card>

                                {/* Step 3: Student Management */}
                                <Card sx={{ p: 3, borderRadius: '16px', backgroundColor: '#fff', border: '1px solid #e0e0e0' }}>
                                    <Stack spacing={3}>
                                        {/* Header & Add Button */}
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <Box sx={{
                                                    width: 32, height: 32,
                                                    backgroundColor: '#ffc107',
                                                    borderRadius: '8px',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    fontWeight: 'bold', color: '#000'
                                                }}>
                                                    3
                                                </Box>
                                                <Typography variant="h6" fontWeight="bold">Student Management</Typography>
                                            </Box>
                                            <Button
                                                variant="contained"
                                                startIcon={<AddIcon />}
                                                onClick={() => setIsAddStudentModalOpen(true)}
                                                sx={{
                                                    backgroundColor: '#ffc107',
                                                    color: '#000',
                                                    fontWeight: 'bold',
                                                    '&:hover': { backgroundColor: '#ffca2c' }
                                                }}
                                            >
                                                Add New Student
                                            </Button>
                                        </Box>

                                        {/* Filters */}
                                        <Box sx={{ display: 'flex', gap: 4 }}>
                                            <RadioGroup row value={department} onChange={(e) => setDepartment(e.target.value as ViceDepartment)}>
                                                <FormControlLabel value="OM" control={<Radio sx={{ color: '#ffc107', '&.Mui-checked': { color: '#ffc107' } }} />} label="OM" />
                                                <FormControlLabel value="SD" control={<Radio sx={{ color: '#ffc107', '&.Mui-checked': { color: '#ffc107' } }} />} label="SD" />
                                            </RadioGroup>
                                            <RadioGroup row value={level} onChange={(e) => setLevel(e.target.value as ViceLevel)}>
                                                <FormControlLabel value="junior" control={<Radio sx={{ color: '#ffc107', '&.Mui-checked': { color: '#ffc107' } }} />} label="Junior" />
                                                <FormControlLabel value="wheeler" control={<Radio sx={{ color: '#ffc107', '&.Mui-checked': { color: '#ffc107' } }} />} label="Wheeler" />
                                                <FormControlLabel value="senior" control={<Radio sx={{ color: '#ffc107', '&.Mui-checked': { color: '#ffc107' } }} />} label="Senior" />
                                            </RadioGroup>
                                        </Box>

                                        {/* Students List Title */}
                                        <Typography variant="h6" fontWeight="bold">Students List</Typography>

                                        {/* Table */}
                                        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
                                            <Table>
                                                <TableHead sx={{ backgroundColor: '#ffc107' }}>
                                                    <TableRow>
                                                        <TableCell sx={{ fontWeight: 'bold' }}>Student Name</TableCell>
                                                        <TableCell sx={{ fontWeight: 'bold' }}>Student ID</TableCell>
                                                        <TableCell sx={{ fontWeight: 'bold' }}>Department</TableCell>
                                                        <TableCell sx={{ fontWeight: 'bold' }}>Class</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {studentsLoading ? (
                                                        <TableRow>
                                                            <TableCell colSpan={4}>
                                                                <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                                                                    <CircularProgress />
                                                                </Box>
                                                            </TableCell>
                                                        </TableRow>
                                                    ) : students.length === 0 ? (
                                                        <TableRow>
                                                            <TableCell colSpan={4}>No students found</TableCell>
                                                        </TableRow>
                                                    ) : (
                                                        students.map((s) => (
                                                            <TableRow key={s.id}>
                                                                <TableCell>{s.name}</TableCell>
                                                                <TableCell>{s.studentCode}</TableCell>
                                                                <TableCell>{s.department}</TableCell>
                                                                <TableCell>{s.className}</TableCell>
                                                            </TableRow>
                                                        ))
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                        {studentsError && <Alert severity="error">{studentsError}</Alert>}

                                        {/* Footer Actions */}
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                                            <Button
                                                component={Link}
                                                href="/vice/students/all"
                                                variant="contained"
                                                sx={{
                                                    backgroundColor: '#ffc107', color: '#000', fontWeight: 'bold', '&:hover': { backgroundColor: '#ffca2c' }
                                                }}
                                            >
                                                All Student
                                            </Button>
                                            <Box sx={{ display: 'flex', gap: 2 }}>
                                                <Button
                                                    variant="contained"
                                                    onClick={() => setIsAddStudentModalOpen(true)}
                                                    sx={{
                                                        backgroundColor: '#ffc107', color: '#000', fontWeight: 'bold', '&:hover': { backgroundColor: '#ffca2c' }
                                                    }}
                                                >
                                                    Add Student
                                                </Button>
                                                <Button
                                                    variant="contained"
                                                    sx={{
                                                        backgroundColor: '#ffc107', color: '#000', fontWeight: 'bold', '&:hover': { backgroundColor: '#ffca2c' }
                                                    }}
                                                >
                                                    Select All Student
                                                </Button>
                                            </Box>
                                        </Box>
                                    </Stack>
                                </Card>
                            </Stack>
                        </Box>
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
                    if (!selectedClassId) throw new Error('Please select a class');
                    await ViceStudentsAPI.create({
                        ...payload,
                        department,
                        year: level,
                        classId: selectedClassId,
                    });
                    await loadStudents();
                }}
            />
        </Box >
        </>
    );
}

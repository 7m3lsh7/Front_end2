'use client';

import React, { Suspense, useState } from 'react';
import { Alert, Box, Container, Typography, Stack, Card, RadioGroup, FormControlLabel, Radio, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, IconButton, Button, Divider } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import EditIcon from '@mui/icons-material/Edit';
import HistoryIcon from '@mui/icons-material/History';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function FinalGradesDashboardContent() {
    const params = useParams();
    const searchParams = useSearchParams();

    const level = typeof params?.level === 'string' ? params.level : 'junior';
    const semester = searchParams?.get('semester') || '1';

    const [departmentFilter, setDepartmentFilter] = useState('om');

    const students: Array<{ id: string; name: string; class: string; sem1: number; sem2: number }> = [];

    return (
        <Box sx={{ position: 'relative', minHeight: '100vh', backgroundColor: '#000' }}>
            {/* Background Pattern */}
            <Box sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(255, 193, 7, 0.05) 20px, rgba(255, 193, 7, 0.05) 21px)',
                zIndex: 0,
                pointerEvents: 'none'
            }} />

            <Box sx={{ py: 4, position: 'relative', zIndex: 1 }}>
                <Container maxWidth="xl">
                    <Stack spacing={4}>
                        {/* Header Title */}
                        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                            <IconButton component={Link} href={`/vice/grades/final?semester=${semester}`} sx={{ color: 'white' }}>
                                <ArrowBackIcon />
                            </IconButton>
                            <Typography variant="h5" fontWeight="bold" sx={{ color: '#fff' }}>
                                Student Assignment Dashboard - {level.charAt(0).toUpperCase() + level.slice(1)}
                            </Typography>
                        </Box>

                        {/* Main Content Card */}
                        <Card
                            sx={{
                                backgroundImage: 'url(/Images/Frame.png)',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                borderRadius: '24px',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
                                p: { xs: 3, md: 5 },
                                minHeight: '600px',
                                position: 'relative'
                            }}
                        >
                            <Box sx={{
                                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                borderRadius: '24px',
                                p: 4
                            }}>
                                <Stack spacing={3}>
                                    {/* Inner Title */}
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Box sx={{
                                            width: 40, height: 40,
                                            backgroundColor: '#ffc107',
                                            borderRadius: '8px',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            color: '#000'
                                        }}>
                                            <SchoolIcon />
                                        </Box>
                                        <Typography variant="h6" fontWeight="bold">Students List</Typography>
                                    </Box>

                                    {/* Simplified Filters (OM / SD) */}
                                    <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                                        <RadioGroup
                                            row
                                            value={departmentFilter}
                                            onChange={(e) => setDepartmentFilter(e.target.value)}
                                        >
                                            <FormControlLabel value="om" control={<Radio sx={{ color: '#ffc107', '&.Mui-checked': { color: '#ffc107' } }} />} label="OM" />
                                            <FormControlLabel value="sd" control={<Radio sx={{ color: '#ffc107', '&.Mui-checked': { color: '#ffc107' } }} />} label="SD" />
                                        </RadioGroup>
                                    </Box>

                                    <Divider sx={{ my: 1 }} />

                                    {/* Actions Row: Submit Button */}
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                        <Button
                                            variant="contained"
                                            startIcon={<AssignmentTurnedInIcon />}
                                            sx={{
                                                backgroundColor: '#ffc107',
                                                color: '#000',
                                                fontWeight: 'bold',
                                                textTransform: 'none',
                                                borderRadius: '8px',
                                                '&:hover': { backgroundColor: '#ffca2c' }
                                            }}
                                        >
                                            Submit for Approval
                                        </Button>
                                    </Box>

                                    {/* Table */}
                                    <Alert severity="warning">
                                        Final grades endpoint is not integrated yet. No mock data is displayed.
                                    </Alert>
                                    <TableContainer component={Paper} elevation={0} sx={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #eee' }}>
                                        <Table>
                                            <TableHead sx={{ backgroundColor: '#ffc107' }}>
                                                <TableRow>
                                                    <TableCell sx={{ fontWeight: 'bold', width: '25%' }}>Student Name</TableCell>
                                                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Class</TableCell>
                                                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Semester 1</TableCell>
                                                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Semester 2</TableCell>
                                                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {students.map((student) => (
                                                    <TableRow key={student.id} sx={{ backgroundColor: '#fff' }}>
                                                        <TableCell sx={{ fontWeight: 'bold' }}>{student.name}</TableCell>
                                                        <TableCell align="center" sx={{ fontWeight: 'bold', color: 'green' }}>{student.class}</TableCell>
                                                        <TableCell align="center">
                                                            <TextField
                                                                variant="outlined"
                                                                size="small"
                                                                defaultValue={student.sem1}
                                                                sx={{ maxWidth: 80, backgroundColor: '#fff' }}
                                                                inputProps={{ style: { textAlign: 'center', fontWeight: 'bold' } }}
                                                            />
                                                        </TableCell>
                                                        <TableCell align="center">
                                                            <TextField
                                                                variant="outlined"
                                                                size="small"
                                                                defaultValue={student.sem2}
                                                                sx={{ maxWidth: 80, backgroundColor: '#fff' }}
                                                                inputProps={{ style: { textAlign: 'center', fontWeight: 'bold' } }}
                                                            />
                                                        </TableCell>
                                                        <TableCell align="center">
                                                            <Stack direction="row" spacing={1} justifyContent="center">
                                                                <IconButton size="small" color="primary">
                                                                    <EditIcon fontSize="small" />
                                                                </IconButton>
                                                                <IconButton size="small" color="default">
                                                                    <HistoryIcon fontSize="small" />
                                                                </IconButton>
                                                            </Stack>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Stack>
                            </Box>
                        </Card>
                    </Stack>
                </Container>
            </Box>
        </Box>
    );
}

export default function FinalGradesDashboard() {
    return (
        <Suspense fallback={<Container sx={{ py: 4 }} />}>
            <FinalGradesDashboardContent />
        </Suspense>
    );
}

'use client';

import React, { useState } from 'react';
import { Alert, Box, Container, Typography, Stack, Card, RadioGroup, FormControlLabel, Radio, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, IconButton } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function QuarterGradesDashboard() {
    const params = useParams();
    // Default to URL param when available
    const level = typeof params?.level === 'string' ? params.level : 'junior';
    const subject = typeof params?.subject === 'string' ? decodeURIComponent(params.subject) : 'Subject';

    const [levelFilter, setLevelFilter] = useState(level);
    const [departmentFilter, setDepartmentFilter] = useState('om');
    const [classFilter, setClassFilter] = useState('class1');

    const students: Array<{ id: string; name: string; q1: number; q2: number; q3: number; q4: number }> = [];

    return (
        <Box sx={{ position: 'relative', minHeight: '100vh', backgroundColor: '#000' }}>
            {/* Background Image / Overlay */}
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
                            <IconButton component={Link} href={`/vice/grades/quarter/${level}`} sx={{ color: 'white' }}>
                                <ArrowBackIcon />
                            </IconButton>
                            <Typography variant="h4" fontWeight="bold" sx={{ color: '#fff' }}>
                                {subject} Grades - {level.charAt(0).toUpperCase() + level.slice(1)}
                            </Typography>
                        </Box>

                        {/* Main Content Card */}
                        <Card
                            sx={{
                                backgroundImage: 'url(/images/Frame.png)', // Using Frame.png as per other pages
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
                                <Stack spacing={4}>
                                    {/* Inner Title with Icon */}
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

                                    {/* Filters Section */}
                                    <Stack spacing={2} alignItems="center" sx={{ width: '100%' }}>
                                        {/* Level Filter */}
                                        <RadioGroup
                                            row
                                            value={levelFilter}
                                            onChange={(e) => setLevelFilter(e.target.value)}
                                        >
                                            <FormControlLabel value="junior" control={<Radio sx={{ color: '#ffc107', '&.Mui-checked': { color: '#ffc107' } }} />} label="Junior" />
                                            <FormControlLabel value="wheeler" control={<Radio sx={{ color: '#ffc107', '&.Mui-checked': { color: '#ffc107' } }} />} label="Wheeler" />
                                            <FormControlLabel value="senior" control={<Radio sx={{ color: '#ffc107', '&.Mui-checked': { color: '#ffc107' } }} />} label="Senior" />
                                        </RadioGroup>

                                        {/* Divider Line #1 */}
                                        <Box sx={{ width: '100%', height: '1px', backgroundColor: '#e0e0e0' }} />

                                        {/* Department Filter */}
                                        <RadioGroup
                                            row
                                            value={departmentFilter}
                                            onChange={(e) => setDepartmentFilter(e.target.value)}
                                        >
                                            <FormControlLabel value="om" control={<Radio sx={{ color: '#ffc107', '&.Mui-checked': { color: '#ffc107' } }} />} label="OM" />
                                            <FormControlLabel value="sd" control={<Radio sx={{ color: '#ffc107', '&.Mui-checked': { color: '#ffc107' } }} />} label="SD" />
                                        </RadioGroup>

                                        {/* Divider Line #2 */}
                                        <Box sx={{ width: '100%', height: '1px', backgroundColor: '#e0e0e0' }} />

                                        {/* Class Filter */}
                                        <RadioGroup
                                            row
                                            value={classFilter}
                                            onChange={(e) => setClassFilter(e.target.value)}
                                        >
                                            <FormControlLabel value="class1" control={<Radio sx={{ color: '#ffc107', '&.Mui-checked': { color: '#ffc107' } }} />} label="Class 1" />
                                            <FormControlLabel value="class2" control={<Radio sx={{ color: '#ffc107', '&.Mui-checked': { color: '#ffc107' } }} />} label="Class 2" />
                                            <FormControlLabel value="class3" control={<Radio sx={{ color: '#ffc107', '&.Mui-checked': { color: '#ffc107' } }} />} label="Class 3" />
                                        </RadioGroup>
                                    </Stack>

                                    {/* Table */}
                                    <Alert severity="warning">
                                        Quarter grades endpoint is not integrated yet. No mock data is displayed.
                                    </Alert>
                                    <TableContainer component={Paper} elevation={0} sx={{ borderRadius: '12px', overflow: 'hidden', mt: 4 }}>
                                        <Table>
                                            <TableHead sx={{ backgroundColor: '#ffc107' }}>
                                                <TableRow>
                                                    <TableCell sx={{ fontWeight: 'bold', width: '30%' }}>Student Name</TableCell>
                                                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Qarter 1</TableCell>
                                                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Qarter 2</TableCell>
                                                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Qarter 3</TableCell>
                                                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Qarter 4</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {students.map((student) => (
                                                    <TableRow key={student.id} sx={{ backgroundColor: '#fff' }}>
                                                        <TableCell sx={{ fontWeight: 'bold' }}>{student.name}</TableCell>
                                                        <TableCell align="center">
                                                            <TextField
                                                                variant="outlined"
                                                                size="small"
                                                                defaultValue={student.q1}
                                                                sx={{ maxWidth: 80, backgroundColor: '#fff' }}
                                                                inputProps={{ style: { textAlign: 'center', fontWeight: 'bold' } }}
                                                            />
                                                        </TableCell>
                                                        <TableCell align="center">
                                                            <TextField
                                                                variant="outlined"
                                                                size="small"
                                                                defaultValue={student.q2}
                                                                sx={{ maxWidth: 80, backgroundColor: '#fff' }}
                                                                inputProps={{ style: { textAlign: 'center', fontWeight: 'bold' } }}
                                                            />
                                                        </TableCell>
                                                        <TableCell align="center">
                                                            <TextField
                                                                variant="outlined"
                                                                size="small"
                                                                defaultValue={student.q3}
                                                                sx={{ maxWidth: 80, backgroundColor: '#fff' }}
                                                                inputProps={{ style: { textAlign: 'center', fontWeight: 'bold' } }}
                                                            />
                                                        </TableCell>
                                                        <TableCell align="center">
                                                            <TextField
                                                                variant="outlined"
                                                                size="small"
                                                                defaultValue={student.q4}
                                                                sx={{ maxWidth: 80, backgroundColor: '#fff' }}
                                                                inputProps={{ style: { textAlign: 'center', fontWeight: 'bold' } }}
                                                            />
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

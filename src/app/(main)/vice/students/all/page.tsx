"use client";

import React, { useState } from 'react';
import { Alert, Box, Container, Typography, Stack, Card, RadioGroup, FormControlLabel, Radio, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Paper } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SchoolIcon from '@mui/icons-material/School'; // Placeholder icon if needed

export default function AllStudentsPage() {
    const students: Array<{ id: string; name: string; department: string; class: string }> = [];

    const [departmentFilter, setDepartmentFilter] = useState('om');
    const [levelFilter, setLevelFilter] = useState('junior');


    return (
        <Box sx={{ position: 'relative', minHeight: '100vh' }}>
            {/* Full Page Background */}
            <Box
                sx={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: 'url(/images/background1.png)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    zIndex: -1,
                }}
            />

            <Box sx={{ py: 4, position: 'relative' }}>
                <Container maxWidth="lg">
                    <Stack spacing={4}>
                        {/* Header */}
                        <Box>
                            {/* Breadcrumb-like or just title? Design shows "Student Assignment Dashboard" */}
                            {/* Assuming this is a sub-page, maybe a back button would be good but design doesn't explicitly show one outside the specific context. 
                             Design image shows "Home Years About" nav, which is handled by Navbar. 
                             The title on page is "Student Assignment Dashboard". 
                         */}
                            <Typography variant="h4" fontWeight="bold" sx={{ color: '#fff', mb: 4 }}>
                                Student Assignment Dashboard
                            </Typography>
                        </Box>

                        {/* Main Content Card - Students List */}
                        <Card
                            sx={{
                                backgroundColor: 'rgba(255, 255, 255, 0.95)', // Slightly transparent white or solid white as per design
                                borderRadius: '24px',
                                p: { xs: 3, md: 5 },
                                boxShadow: '0px 4px 20px rgba(0,0,0,0.1)'
                            }}
                        >
                            <Stack spacing={3}>

                                {/* Card Header with Icon */}
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Box sx={{
                                        width: 40, height: 40,
                                        backgroundColor: '#ffc107',
                                        borderRadius: '8px',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: '#000'
                                    }}>
                                        {/* Using an icon representing students/list */}
                                        {/* If specific icon needed, can import specific SVGs. Using generic icon for now based on MUI */}
                                        <SchoolIcon />
                                    </Box>
                                    <Typography variant="h6" fontWeight="bold">Students List</Typography>
                                </Box>

                                {/* Filters */}
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, py: 2 }}>
                                    {/* Department Filter */}
                                    <RadioGroup
                                        row
                                        value={departmentFilter}
                                        onChange={(e) => setDepartmentFilter(e.target.value)}
                                    >
                                        <FormControlLabel value="om" control={<Radio sx={{ color: '#ffc107', '&.Mui-checked': { color: '#ffc107' } }} />} label="OM" />
                                        <FormControlLabel value="sd" control={<Radio sx={{ color: '#ffc107', '&.Mui-checked': { color: '#ffc107' } }} />} label="SD" />
                                    </RadioGroup>

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
                                </Box>

                                {/* Table */}
                                <Alert severity="warning">
                                    Students list endpoint is not integrated yet. No mock data is shown in production mode.
                                </Alert>
                                <TableContainer component={Paper} elevation={0} sx={{ border: 'none', borderRadius: '12px', overflow: 'hidden' }}>
                                    <Table>
                                        <TableHead sx={{ backgroundColor: '#ffc107' }}>
                                            <TableRow>
                                                <TableCell sx={{ fontWeight: 'bold', color: '#000' }}>Student Name</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold', color: '#000' }}>Student ID</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold', color: '#000' }}>Department</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold', color: '#000' }}>Class</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold', color: '#000' }}>Actions</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {students.map((student) => (
                                                <TableRow key={student.id} sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { backgroundColor: '#f5f5f5' } }}>
                                                    <TableCell sx={{ fontWeight: 'bold' }}>{student.name}</TableCell>
                                                    <TableCell sx={{ fontWeight: 'bold' }}>{student.id}</TableCell>
                                                    <TableCell sx={{ fontWeight: 'bold' }}>{student.department}</TableCell>
                                                    <TableCell sx={{ fontWeight: 'bold', color: '#2e7d32' }}>{student.class}</TableCell> {/* Green color for class as per design hint */}
                                                    <TableCell>
                                                        <Stack direction="row" spacing={1}>
                                                            {/* Edit Action */}
                                                            <IconButton size="small" sx={{ color: '#1976d2' }}>
                                                                <EditIcon fontSize="small" />
                                                            </IconButton>
                                                            {/* Delete Action */}
                                                            <IconButton size="small" sx={{ color: '#d32f2f' }}>
                                                                <DeleteIcon fontSize="small" />
                                                            </IconButton>
                                                        </Stack>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>

                            </Stack>
                        </Card>

                    </Stack>
                </Container>
            </Box>
        </Box>
    );
}

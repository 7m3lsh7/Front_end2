'use client';

import React from 'react';
import { Box, Container, Typography, Stack, Button, Card, MenuItem, Select, FormControl, InputLabel, TextField, RadioGroup, FormControlLabel, Radio, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Checkbox, Paper } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Link from 'next/link';
import { useState } from 'react';
import SharedNavbar from "@/components/layout/SharedNavbar";
import AddStudentModal from '@/components/vice/students/AddStudentModal';

export default function ViceStudentsPage() {
    const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);

    return (
           <>
        <SharedNavbar/>
        {/* Main Content Card */}

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
                                                <Select label="Academic Year" defaultValue="">
                                                    <MenuItem value="2024">2024-2025</MenuItem>
                                                </Select>
                                            </FormControl>
                                            <FormControl fullWidth size="small" sx={{ maxWidth: 200, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                                                <InputLabel>Department</InputLabel>
                                                <Select label="Department" defaultValue="">
                                                    <MenuItem value="OM">OM</MenuItem>
                                                    <MenuItem value="SD">SD</MenuItem>
                                                </Select>
                                            </FormControl>
                                            <TextField
                                                placeholder="class name"
                                                size="small"
                                                sx={{ backgroundColor: '#f5f5f5', borderRadius: 1 }}
                                            />
                                            <Button
                                                variant="contained"
                                                startIcon={<AddIcon />}
                                                sx={{
                                                    backgroundColor: '#ffc107',
                                                    color: '#000',
                                                    fontWeight: 'bold',
                                                    '&:hover': { backgroundColor: '#ffca2c' }
                                                }}
                                            >
                                                Create class
                                            </Button>
                                        </Box>
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
                                                <Select label="Select Class" defaultValue="">
                                                    <MenuItem value="c1">Class 1</MenuItem>
                                                </Select>
                                            </FormControl>
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
                                            <RadioGroup row defaultValue="om">
                                                <FormControlLabel value="om" control={<Radio sx={{ color: '#ffc107', '&.Mui-checked': { color: '#ffc107' } }} />} label="OM" />
                                                <FormControlLabel value="sd" control={<Radio sx={{ color: '#ffc107', '&.Mui-checked': { color: '#ffc107' } }} />} label="SD" />
                                            </RadioGroup>
                                            <RadioGroup row defaultValue="junior">
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
                                                        <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    <TableRow>
                                                        <TableCell>Ahmed Al-Mansouri</TableCell>
                                                        <TableCell>2025025</TableCell>
                                                        <TableCell>OM</TableCell>
                                                        <TableCell>
                                                            <Checkbox sx={{ color: '#ccc', '&.Mui-checked': { color: '#000' } }} />
                                                        </TableCell>
                                                    </TableRow>
                                                </TableBody>
                                            </Table>
                                        </TableContainer>

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
            />
        </Box >
        </>
    );
}

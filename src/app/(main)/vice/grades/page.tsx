'use client';

import React, { useState } from 'react';
import { Box, Container, Typography, Stack, Card, CardContent, Button, Divider, Dialog, IconButton } from '@mui/material';
import Link from 'next/link';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import CloseIcon from '@mui/icons-material/Close';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn'; // For term icon

export default function ViceGradesDashboard() {
    const [openTermModal, setOpenTermModal] = useState(false);

    const handleOpenTermModal = () => {
        setOpenTermModal(true);
    };

    const handleCloseTermModal = () => {
        setOpenTermModal(false);
    };

    return (
        <Box sx={{ position: 'relative', minHeight: '100vh', backgroundColor: '#000', paddingBottom: 4 }}>
            {/* Background Gold Lines (Optional/Abstract representation) */}
            <Box sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '500px',
                backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(255, 193, 7, 0.1) 20px, rgba(255, 193, 7, 0.1) 21px)',
                zIndex: 0
            }} />

            {/* Page Header Area */}
            <Box sx={{ py: 4, position: 'relative', zIndex: 1 }}>
                <Container maxWidth="lg">
                    <Box sx={{ mb: 6 }}>
                        <Typography variant="h4" fontWeight="bold" sx={{ color: '#fff' }}>
                            Grades Management Dashboard
                        </Typography>
                    </Box>

                    {/* Main Content Glass Container with Background */}
                    <Box
                        sx={{
                            backgroundImage: 'url(/images/Frame.png)',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            borderRadius: '32px',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)' /* Glassmorphism shadow */,
                            overflow: 'hidden',
                            position: 'relative',
                            minHeight: '600px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        {/* Blur Overlay */}
                        <Box sx={{
                            position: 'absolute',
                            top: 0, left: 0, right: 0, bottom: 0,
                            backdropFilter: 'blur(3px)',
                            backgroundColor: 'rgba(0,0,0,0.2)'
                        }} />

                        {/* Content inside the glass card */}
                        <Box sx={{
                            position: 'relative',
                            zIndex: 1,
                            width: '100%',
                            maxWidth: '600px',
                            p: { xs: 2, md: 0 },
                        }}>
                            <Stack spacing={3} alignItems="center">
                                {/* Quarter Grades Card */}
                                <Card sx={{
                                    width: '100%',
                                    borderRadius: '16px',
                                    backgroundColor: '#fff',
                                    p: 1
                                }}>
                                    <CardContent sx={{ p: 3, '&:last-child': { pb: 3 }, display: 'flex', flexDirection: 'column', gap: 2 }}>
                                        {/* Header Row: Icon + Title */}
                                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                                            <Box sx={{
                                                width: 48, height: 48,
                                                backgroundColor: '#ffc107',
                                                borderRadius: '12px',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                color: '#fff',
                                                flexShrink: 0
                                            }}>
                                                <AssignmentIcon sx={{ fontSize: 24, color: 'white' }} />
                                            </Box>
                                            <Box>
                                                <Typography variant="h6" fontWeight="bold" sx={{ lineHeight: 1.2, mb: 0.5 }}>
                                                    Quarter Grades
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" sx={{ opacity: 0.8, fontSize: '0.9rem' }}>
                                                    Set the maximum grades for subjects before teachers enter student grades.
                                                </Typography>
                                            </Box>
                                        </Box>

                                        <Divider sx={{ my: 1 }} />

                                        <Button
                                            component={Link}
                                            href="/vice/grades/quarter"
                                            variant="contained"
                                            fullWidth
                                            sx={{
                                                backgroundColor: '#ffc107',
                                                color: '#000',
                                                fontWeight: 'bold',
                                                textTransform: 'none',
                                                py: 1.5,
                                                borderRadius: '10px',
                                                boxShadow: 'none',
                                                '&:hover': { backgroundColor: '#ffca2c', boxShadow: 'none' }
                                            }}
                                        >
                                            Manage Quarter Grades
                                        </Button>
                                    </CardContent>
                                </Card>

                                {/* Final Grades Card */}
                                <Card sx={{
                                    width: '100%',
                                    borderRadius: '16px',
                                    backgroundColor: '#fff',
                                    p: 1
                                }}>
                                    <CardContent sx={{ p: 3, '&:last-child': { pb: 3 }, display: 'flex', flexDirection: 'column', gap: 2 }}>
                                        {/* Header Row: Icon + Title */}
                                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                                            <Box sx={{
                                                width: 48, height: 48,
                                                backgroundColor: '#ffc107',
                                                borderRadius: '12px',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                color: '#fff',
                                                flexShrink: 0
                                            }}>
                                                <PlaylistAddCheckIcon sx={{ fontSize: 24, color: 'white' }} />
                                            </Box>
                                            <Box>
                                                <Typography variant="h6" fontWeight="bold" sx={{ lineHeight: 1.2, mb: 0.5 }}>
                                                    Final Grades
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" sx={{ opacity: 0.8, fontSize: '0.9rem' }}>
                                                    Enter final exam grades using student secret codes for transparency.
                                                </Typography>
                                            </Box>
                                        </Box>

                                        <Divider sx={{ my: 1 }} />

                                        <Button
                                            onClick={handleOpenTermModal}
                                            variant="contained"
                                            fullWidth
                                            sx={{
                                                backgroundColor: '#ffc107',
                                                color: '#000',
                                                fontWeight: 'bold',
                                                textTransform: 'none',
                                                py: 1.5,
                                                borderRadius: '10px',
                                                boxShadow: 'none',
                                                '&:hover': { backgroundColor: '#ffca2c', boxShadow: 'none' }
                                            }}
                                        >
                                            Enter Final Grades
                                        </Button>
                                    </CardContent>
                                </Card>
                            </Stack>
                        </Box>
                    </Box>
                </Container>
            </Box>

            {/* Select Term Modal */}
            <Dialog
                open={openTermModal}
                onClose={handleCloseTermModal}
                PaperProps={{
                    sx: {
                        borderRadius: '24px',
                        background: 'rgba(255, 255, 255, 0.8)',
                        backdropFilter: 'blur(20px)',
                        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
                        maxWidth: '500px',
                        width: '100%',
                        p: 1
                    }
                }}
                BackdropProps={{
                    sx: {
                        backdropFilter: 'blur(5px)',
                        backgroundColor: 'rgba(0,0,0,0.5)'
                    }
                }}
            >
                <Box sx={{ p: 3, position: 'relative' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography variant="h6" fontWeight="bold">
                            Select Term
                        </Typography>
                        <IconButton onClick={handleCloseTermModal} size="small">
                            <CloseIcon />
                        </IconButton>
                    </Box>

                    <Stack direction="row" spacing={2} justifyContent="center">
                        <Button
                            component={Link}
                            href="/vice/grades/final?semester=1"
                            variant="contained"
                            startIcon={<AssignmentTurnedInIcon />}
                            sx={{
                                backgroundColor: '#ffc107',
                                color: '#000',
                                fontWeight: 'bold',
                                textTransform: 'none',
                                py: 1.5,
                                px: 3,
                                borderRadius: '12px',
                                boxShadow: 'none',
                                flex: 1,
                                '&:hover': { backgroundColor: '#ffca2c', boxShadow: 'none' }
                            }}
                        >
                            Semester 1
                        </Button>
                        <Button
                            component={Link}
                            href="/vice/grades/final?semester=2"
                            variant="contained"
                            startIcon={<AssignmentTurnedInIcon />}
                            sx={{
                                backgroundColor: '#ffc107',
                                color: '#000',
                                fontWeight: 'bold',
                                textTransform: 'none',
                                py: 1.5,
                                px: 3,
                                borderRadius: '12px',
                                boxShadow: 'none',
                                flex: 1,
                                '&:hover': { backgroundColor: '#ffca2c', boxShadow: 'none' }
                            }}
                        >
                            Semester 2
                        </Button>
                    </Stack>
                </Box>
            </Dialog>
        </Box>
    );
}

'use client';

import React from 'react';
import { Box, Container, Typography, Card, CardContent, Stack, CardActionArea, Grid } from '@mui/material';
import Link from 'next/link';
import SharedNavbar from '@/components/layout/SharedNavbar';

export default function ViceDashboard() {
    const cards = [
        {
            id: 1,
            title: 'Teacher',
            description: 'Add teachers and assign them to subjects and academic years.',
            href: '/vice/teachers',
        },
        {
            id: 2,
            title: 'Student',
            description: 'Add students and assign them to academic years and classes.',
            href: '/vice/students',
        },
        {
            id: 3,
            title: 'Grades',
            description: 'Enter and manage quarter and final exam grades for students.',
            href: '/vice/grades',
        },
    ];

    return (
        
   <main>
        <SharedNavbar/>
        <Box sx={{ position: 'relative', minHeight: '100vh', backgroundColor: '#f9f9f9' }}>
            {/* Full Page Background */}
            <Box
                sx={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: 'url(/images/background2.png)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    zIndex: 0,
                }}
            />
            {/* Dark Overlay */}
            <Box sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.5)',
                zIndex: 0
            }} />

            <Box sx={{ py: 4, position: 'relative', zIndex: 1 }}>
                <Container maxWidth="lg">
                    <Box sx={{ p: { xs: 3, md: 6 }, color: '#fff' }}>
                        {/* Hero Content */}
                        <Stack spacing={2} sx={{
                            mb: 6,
                            textAlign: 'left',
                            borderRadius: '16px',
                            position: 'relative',
                        }}>

                            <Box sx={{ position: 'relative', zIndex: 1 }}>
                                <Typography variant="h3" component="h1" fontWeight="bold" color="white">
                                    Welcome, Ahmed Mohamed
                                </Typography>
                                <Typography variant="h5" sx={{ opacity: 0.9, color: 'white' }}>
                                    Administrator Portal
                                </Typography>
                                <Typography variant="body1" sx={{ maxWidth: '600px', opacity: 0.8, color: '#e0e0e0', mb: 3 }}>
                                    Review, Approve grades, and manage student grades access
                                </Typography>
                            </Box>
                        </Stack>

                        {/* Cards Grid */}
                        <Grid container spacing={3}>
                            {cards.map((card) => (
                                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={card.id}>
                                    <Card
                                        sx={{
                                            height: '100%',
                                            borderRadius: '16px',
                                            backgroundColor: '#fff',
                                            boxShadow: '0px 4px 10px rgba(0,0,0,0.1)',
                                            transition: 'transform 0.2s',
                                            '&:hover': {
                                                transform: 'translateY(-5px)',
                                                boxShadow: '0px 8px 25px rgba(0,0,0,0.2)',
                                            }
                                        }}
                                    >
                                        <CardActionArea
                                            component={Link}
                                            href={card.href}
                                            sx={{ height: '100%' }}
                                        >
                                            <CardContent sx={{ p: 4, height: '100%' }}>
                                                <Stack spacing={2}>
                                                    {/* Number Icon */}
                                                    <Box
                                                        sx={{
                                                            width: 50,
                                                            height: 50,
                                                            backgroundColor: '#ffc107',
                                                            borderRadius: '12px',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center'
                                                        }}
                                                    >
                                                        <Typography variant="h5" fontWeight="bold" color="black">
                                                            {card.id}
                                                        </Typography>
                                                    </Box>

                                                    {/* Content */}
                                                    <Box>
                                                        <Typography variant="h6" fontWeight="bold" gutterBottom color="text.primary">
                                                            {card.title}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                                                            {card.description}
                                                        </Typography>
                                                    </Box>
                                                </Stack>
                                            </CardContent>
                                        </CardActionArea>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                </Container>
            </Box>
        </Box>
        </main>
    );
}

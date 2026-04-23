'use client';

import React from 'react';
import { Box, Container, Typography, Stack, Card, CardActionArea, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function FinalGradesSetupPage() {
    const levels = [
        { id: 1, name: 'Junior' },
        { id: 2, name: 'Wheeler' },
        { id: 3, name: 'Senior' },
    ];

    const searchParams = useSearchParams();
    const semester = searchParams.get('semester');

    return (
        <Box sx={{ position: 'relative', minHeight: '100vh', backgroundColor: '#000', overflow: 'hidden' }}>
            {/* Background Gold Lines (Abstract) */}
            <Box sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: `
                    radial-gradient(circle at 100% 100%, transparent 10%, rgba(255, 193, 7, 0.05) 10%, rgba(255, 193, 7, 0.05) 11%, transparent 11%),
                    radial-gradient(circle at 100% 100%, transparent 15%, rgba(255, 193, 7, 0.05) 15%, rgba(255, 193, 7, 0.05) 16%, transparent 16%),
                    radial-gradient(circle at 100% 100%, transparent 20%, rgba(255, 193, 7, 0.05) 20%, rgba(255, 193, 7, 0.05) 21%, transparent 21%)
                `,
                zIndex: 0,
                pointerEvents: 'none'
            }} />

            <Box sx={{ py: 4, position: 'relative', zIndex: 1 }}>
                <Container maxWidth="lg">
                    {/* Header */}
                    <Box sx={{ mb: 6, display: 'flex', alignItems: 'center', gap: 2 }}>
                        <IconButton component={Link} href="/vice/grades" sx={{ color: 'white' }}>
                            <ArrowBackIcon />
                        </IconButton>
                        <Typography variant="h4" fontWeight="bold" sx={{ color: '#fff' }}>
                            Final Grades Setup {semester ? `- Semester ${semester}` : ''}
                        </Typography>
                    </Box>

                    {/* Central Card with Frame.png Background */}
                    <Card
                        sx={{
                            backgroundImage: 'url(/images/Frame.png)',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            borderRadius: '32px',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
                            overflow: 'hidden',
                            position: 'relative',
                            minHeight: '500px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%',
                            maxWidth: '900px',
                            mx: 'auto'
                        }}
                    >
                        {/* Content */}
                        <Stack spacing={3} sx={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: '400px', p: 2 }}>
                            {levels.map((level) => (
                                <Card
                                    key={level.id}
                                    sx={{
                                        borderRadius: '16px',
                                        backgroundColor: '#fff',
                                        overflow: 'hidden',
                                        transition: 'transform 0.2s',
                                        '&:hover': {
                                            transform: 'scale(1.02)',
                                        }
                                    }}
                                >
                                    <CardActionArea
                                        component={Link}
                                        href={`/vice/grades/final/${level.name.toLowerCase()}?semester=${semester || '1'}`}
                                        sx={{ p: 1.5 }}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Box sx={{
                                                width: 48,
                                                height: 48,
                                                backgroundColor: '#ffc107',
                                                borderRadius: '8px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                flexShrink: 0
                                            }}>
                                                <Typography variant="h5" fontWeight="bold" color="white">
                                                    {level.id}
                                                </Typography>
                                            </Box>
                                            <Typography variant="h6" fontWeight="bold" color="black">
                                                {level.name}
                                            </Typography>
                                        </Box>
                                    </CardActionArea>
                                </Card>
                            ))}
                        </Stack>
                    </Card>
                </Container>
            </Box>
        </Box>
    );
}

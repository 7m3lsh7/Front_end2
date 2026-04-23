'use client';

import React from 'react';
import { Box, Container, Typography, Stack, Card, CardActionArea, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Link from 'next/link';

export default function ViceGradesQuarterPage() {
    const levels = [
        { id: 1, name: 'Junior' },
        { id: 2, name: 'Wheeler' },
        { id: 3, name: 'Senior' },
    ];

    return (
        <Box sx={{ position: 'relative', minHeight: '100vh', paddingBottom: 4 }}>
            <Box sx={{ py: 4, position: 'relative' }}>
                <Container maxWidth="lg">
                    <Box sx={{ mb: 6, display: 'flex', alignItems: 'center', gap: 2 }}>
                        <IconButton component={Link} href="/vice/grades" sx={{ color: 'black' }}>
                            <ArrowBackIcon />
                        </IconButton>
                        <Typography variant="h3" fontWeight="bold" sx={{ color: '#000' }}>
                            Quarter Grades
                        </Typography>
                    </Box>

                    {/* Central Glass Card */}
                    <Card
                        sx={{
                            backgroundImage: 'url(/images/Frame.png)',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            borderRadius: '24px',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
                        }}
                    >
                        <Box sx={{
                            background: 'rgba(255, 255, 255, 0.1)',
                            backdropFilter: 'blur(20px)',
                            p: { xs: 4, md: 8 },
                        }}>
                            <Stack spacing={3}>
                                {levels.map((level, index) => (
                                    <Card
                                        key={level.id}
                                        sx={{
                                            borderRadius: '12px',
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
                                            href={`/vice/grades/quarter/${level.name.toLowerCase()}`}
                                            sx={{ p: 2 }}
                                        >
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                                                <Box sx={{
                                                    width: 48,
                                                    height: 48,
                                                    backgroundColor: '#ffc107',
                                                    borderRadius: '8px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                }}>
                                                    <Typography variant="h5" fontWeight="bold" color="black">
                                                        {index + 1}
                                                    </Typography>
                                                </Box>

                                                <Typography variant="h5" fontWeight="bold" color="black">
                                                    {level.name}
                                                </Typography>
                                            </Box>
                                        </CardActionArea>
                                    </Card>
                                ))}
                            </Stack>
                        </Box>
                    </Card>
                </Container>
            </Box>
        </Box>
    );
}

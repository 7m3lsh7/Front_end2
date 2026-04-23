'use client';

import React from 'react';
import { Box, Container, Typography, Stack } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function SubjectSelectionPage() {
    const params = useParams();
    const level = typeof params?.level === 'string' ? params.level : 'Junior';

    const subjects = [
        { id: 'arabic', name: 'Arabic' },
        { id: 'english', name: 'English' },
        { id: 'math', name: 'Math' },
        { id: 'social-studies', name: 'Social Studies' },
        { id: 'physics', name: 'Physics' },
        { id: 'mechanics', name: 'Mechanics' },
        { id: 'religion', name: 'Religion' },
        { id: 'other', name: 'Other' },
    ];

    return (
        <Box sx={{ position: 'relative', minHeight: '100vh', backgroundColor: '#000', color: '#fff' }}>
            {/* Background Gold Lines */}
            <Box sx={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(255, 193, 7, 0.05) 20px, rgba(255, 193, 7, 0.05) 21px)',
                zIndex: 0,
                pointerEvents: 'none'
            }} />

            <Box sx={{ py: 4, position: 'relative', zIndex: 1 }}>
                <Container maxWidth="lg">
                    {/* Header */}
                    <Box sx={{ mb: 6 }}>
                        <Link href="/vice/grades/quarter" style={{ textDecoration: 'none', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                            <ArrowBackIcon fontSize="small" />
                            <Typography variant="h6" fontWeight="bold">Back To Years</Typography>
                        </Link>

                        <Typography variant="h4" fontWeight="bold" sx={{ textTransform: 'capitalize', mb: 1 }}>
                            {level} - Administrator
                        </Typography>
                        <Typography variant="body1" color="gray">
                            Review quarter grades and add final grade
                        </Typography>
                    </Box>

                    {/* Subjects Grid - 2 columns with smaller sizes */}
                    <Stack spacing="10px" sx={{ maxWidth: '1300px', mx: 'auto' }}>
                        {[0, 1, 2, 3].map((rowIndex) => (
                            <Box key={rowIndex} sx={{ display: 'flex', gap: '10px' }}>
                                {subjects.slice(rowIndex * 2, rowIndex * 2 + 2).map((subject) => (
                                    <Link
                                        key={subject.id}
                                        href={`/vice/grades/quarter/${level}/${subject.id}`}
                                        style={{ textDecoration: 'none', flex: 1 }}
                                    >
                                        <Box
                                            sx={{
                                                width: '550px',
                                                height: '100px',
                                                backgroundColor: '#E8E8E8',
                                                borderRadius: '30px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 2.5,
                                                px: 3,
                                                cursor: 'pointer',
                                                transition: 'all 0.2s',
                                                '&:hover': {
                                                    backgroundColor: '#fff',
                                                    transform: 'translateY(-2px)',
                                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                                }
                                            }}
                                        >
                                            {/* Icon Box */}
                                            <Box sx={{
                                                width: 48,
                                                height: 48,
                                                backgroundColor: '#FFC107',
                                                borderRadius: '14px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                flexShrink: 0
                                            }}>
                                                <MenuBookIcon sx={{ color: '#fff', fontSize: 28 }} />
                                            </Box>

                                            {/* Subject Name */}
                                            <Typography variant="h6" fontWeight="bold" color="black" sx={{ fontSize: '1.35rem' }}>
                                                {subject.name}
                                            </Typography>
                                        </Box>
                                    </Link>
                                ))}
                            </Box>
                        ))}
                    </Stack>
                </Container>
            </Box>
        </Box>
    );
}

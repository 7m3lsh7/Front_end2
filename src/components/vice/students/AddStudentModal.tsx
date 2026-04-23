'use client';

import React, { useMemo, useState } from 'react';
import { Dialog, DialogContent, IconButton, Box, Typography, TextField, Button, Step, StepLabel, Stepper, Alert } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import type { ViceDepartment, ViceLevel } from '@/types/vice/students';

interface AddStudentModalProps {
    open: boolean;
    onClose: () => void;
    classId: number | null;
    year: ViceLevel;
    department: ViceDepartment;
    onSubmit: (payload: {
        firstName: string;
        middleName?: string;
        lastName: string;
        studentCode: string;
        email: string;
        phone: string;
    }) => Promise<void>;
}

export default function AddStudentModal({ open, onClose, classId, year, department, onSubmit }: AddStudentModalProps) {
    const [activeStep] = useState(0);
    const steps = [1, 2, 3];

    const [form, setForm] = useState({
        firstName: '',
        middleName: '',
        lastName: '',
        studentCode: '',
        email: '',
        phone: '',
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const disabledReason = useMemo(() => {
        if (!classId) return 'Please select a class first';
        if (!form.firstName.trim()) return 'First name is required';
        if (!form.lastName.trim()) return 'Last name is required';
        if (!form.studentCode.trim()) return 'Student code is required';
        if (!form.email.trim()) return 'Email is required';
        if (!form.phone.trim()) return 'Phone is required';
        return null;
    }, [classId, form]);

    const handleSave = async () => {
        setError(null);
        setSuccess(false);
        if (disabledReason) {
            setError(disabledReason);
            return;
        }
        setSubmitting(true);
        try {
            await onSubmit({
                firstName: form.firstName.trim(),
                middleName: form.middleName.trim() ? form.middleName.trim() : undefined,
                lastName: form.lastName.trim(),
                studentCode: form.studentCode.trim(),
                email: form.email.trim().toLowerCase(),
                phone: form.phone.trim(),
            });
            setSuccess(true);
            setForm({
                firstName: '',
                middleName: '',
                lastName: '',
                studentCode: '',
                email: '',
                phone: '',
            });
            setTimeout(() => {
                onClose();
                setSuccess(false);
            }, 800);
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : 'Failed to add student');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: '24px',
                    padding: 2,
                    maxWidth: '600px'
                }
            }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight="bold">
                    Add New Student
                </Typography>
                <IconButton onClick={onClose} size="small">
                    <CloseIcon />
                </IconButton>
            </Box>

            <DialogContent sx={{ overflowY: 'visible' }}>
                <Box sx={{ width: '100%', mb: 4 }}>
                    <Stepper activeStep={activeStep} alternativeLabel sx={{
                        '& .MuiStepConnector-line': {
                            borderColor: '#ffc107',
                            borderTopWidth: 3,
                            borderRadius: 1
                        }
                    }}>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel
                                    StepIconComponent={() => (
                                        <Box sx={{
                                            width: 32,
                                            height: 32,
                                            borderRadius: '50%',
                                            backgroundColor: '#ffc107',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontWeight: 'bold',
                                            color: '#000',
                                            zIndex: 1,
                                            border: '2px solid white' // To separate from line
                                        }}>
                                            {label}
                                        </Box>
                                    )}
                                >
                                </StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                </Box>

                {success && <Alert severity="success" sx={{ mb: 2 }}>Student added successfully</Alert>}
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                <Alert severity="info" sx={{ mb: 2 }}>
                    Year: <b>{year}</b> — Department: <b>{department}</b> — Class: <b>{classId ?? '—'}</b>
                </Alert>

                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                        gap: 2,
                        mb: 4,
                    }}
                >
                    <Box>
                        <TextField
                            fullWidth
                            label="First name"
                            value={form.firstName}
                            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                            variant="outlined"
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', backgroundColor: '#f5f5f5' } }}
                        />
                    </Box>
                    <Box>
                        <TextField
                            fullWidth
                            label="Middle name (optional)"
                            value={form.middleName}
                            onChange={(e) => setForm({ ...form, middleName: e.target.value })}
                            variant="outlined"
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', backgroundColor: '#f5f5f5' } }}
                        />
                    </Box>
                    <Box>
                        <TextField
                            fullWidth
                            label="Last name"
                            value={form.lastName}
                            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                            variant="outlined"
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', backgroundColor: '#f5f5f5' } }}
                        />
                    </Box>
                    <Box>
                        <TextField
                            fullWidth
                            label="Student code"
                            value={form.studentCode}
                            onChange={(e) => setForm({ ...form, studentCode: e.target.value })}
                            variant="outlined"
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', backgroundColor: '#f5f5f5' } }}
                        />
                    </Box>
                    <Box>
                        <TextField
                            fullWidth
                            label="Email"
                            type="email"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            variant="outlined"
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', backgroundColor: '#f5f5f5' } }}
                        />
                    </Box>
                    <Box>
                        <TextField
                            fullWidth
                            label="Phone"
                            value={form.phone}
                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                            variant="outlined"
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', backgroundColor: '#f5f5f5' } }}
                        />
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Button
                        variant="contained"
                        onClick={handleSave}
                        disabled={submitting || !!disabledReason}
                        sx={{
                            backgroundColor: '#ffc107',
                            color: '#000',
                            fontWeight: 'bold',
                            borderRadius: '12px',
                            minWidth: '200px',
                            textTransform: 'none',
                            fontSize: '1.1rem',
                            '&:hover': {
                                backgroundColor: '#ffca2c'
                            }
                        }}
                    >
                        {submitting ? 'Saving...' : 'Save Student'}
                    </Button>
                </Box>
            </DialogContent>
        </Dialog>
    );
}

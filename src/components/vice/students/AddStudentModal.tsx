'use client';

import React from 'react';
import { Dialog, DialogContent, IconButton, Box, Typography, TextField, Button, Grid, Step, StepLabel, Stepper } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface AddStudentModalProps {
    open: boolean;
    onClose: () => void;
}

export default function AddStudentModal({ open, onClose }: AddStudentModalProps) {
    const [activeStep] = React.useState(0);
    const steps = [1, 2, 3];

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

                <Grid container spacing={2} sx={{ mb: 4 }}>
                    {[...Array(6)].map((_, index) => (
                        <Grid item xs={6} key={index}>
                            <TextField
                                fullWidth
                                placeholder="Student name"
                                variant="outlined"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '12px',
                                        backgroundColor: '#f5f5f5',
                                        '& fieldset': { border: 'none' }, // Remove default border
                                    },
                                    '& input': {
                                        padding: '12px 16px',
                                    }
                                }}
                            />
                        </Grid>
                    ))}
                </Grid>

                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Button
                        variant="contained"
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
                        Next
                    </Button>
                </Box>
            </DialogContent>
        </Dialog>
    );
}

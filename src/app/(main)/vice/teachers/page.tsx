"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Stack,
  Button,
  Card,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";

import { Teacher } from "@/types/teacher.types";
import { Class, Subject } from "@/types/subject.types";
import { TeachersAPI } from "@/data/teachers.api";
import { SubjectsAPI } from "@/data/subjects.api";
import { ClassesAPI } from "@/data/classes.api";
import { TeacherAssignmentsAPI } from "@/data/teacher-assignments.api";

export default function ViceTeachersPage() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedClassIds, setSelectedClassIds] = useState<number[]>([]);

  const [openAddSubject, setOpenAddSubject] = useState(false);
  const [openAddTeacher, setOpenAddTeacher] = useState(false);
  const [openTeachersList, setOpenTeachersList] = useState(false);

  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);

  const [selectedTeacherId, setSelectedTeacherId] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState("");

  // Loading and error states for teacher form
  const [isSavingTeacher, setIsSavingTeacher] = useState(false);
  const [teacherError, setTeacherError] = useState<string | null>(null);
  const [teacherSuccess, setTeacherSuccess] = useState(false);
  const [pendingTeacherDraft, setPendingTeacherDraft] = useState<{
    firstName: string;
    middleName?: string;
    lastName: string;
    email: string;
    phone: string;
    qualifications: string;
    department: string;
  } | null>(null);

  // Loading and error states for data fetching
  const [isLoadingTeachers, setIsLoadingTeachers] = useState(false);
  const [isLoadingSubjects, setIsLoadingSubjects] = useState(false);
  const [isLoadingClasses, setIsLoadingClasses] = useState(false);
  const [isAssigningTeacher, setIsAssigningTeacher] = useState(false);
  
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [assignmentError, setAssignmentError] = useState<string | null>(null);
  const [assignmentSuccess, setAssignmentSuccess] = useState(false);

  /* ===================== ADD TEACHER FORM ===================== */
  const [teacherForm, setTeacherForm] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    phone: "",
    qualifications: "",
    department: "",
  });

  /* ===================== ADD SUBJECT FORM ===================== */
  const [subjectName, setSubjectName] = useState("");
  const [subjectType, setSubjectType] = useState<"academic" | "competency">(
    "academic"
  );

  /* ===================== FETCH DATA ===================== */

  useEffect(() => {
    setIsLoadingTeachers(true);
    setFetchError(null);
    TeachersAPI.getAll()
      .then((data) => {
        setTeachers(data);
        setIsLoadingTeachers(false);
      })
      .catch((error) => {
        console.error("Failed to fetch teachers:", error);
        setFetchError(
          error instanceof Error
            ? error.message
            : "Failed to load teachers. Please try again."
        );
        setIsLoadingTeachers(false);
      });
  }, []);

  const loadTeachers = async () => {
    setIsLoadingTeachers(true);
    setFetchError(null);
    try {
      const data = await TeachersAPI.getAll();
      setTeachers(data);
    } catch (error) {
      setFetchError(
        error instanceof Error
          ? error.message
          : "Failed to load teachers. Please try again."
      );
    } finally {
      setIsLoadingTeachers(false);
    }
  };

  useEffect(() => {
    if (!selectedYear) {
      setSubjects([]);
      return;
    }
    setIsLoadingSubjects(true);
    SubjectsAPI.getByYear(selectedYear)
      .then((data) => {
        setSubjects(data);
        setIsLoadingSubjects(false);
      })
      .catch((error) => {
        console.error("Failed to fetch subjects:", error);
        setFetchError(
          error instanceof Error
            ? error.message
            : "Failed to load subjects. Please try again."
        );
        setIsLoadingSubjects(false);
      });
  }, [selectedYear]);

  useEffect(() => {
    if (!selectedYear) {
      setClasses([]);
      return;
    }
    setIsLoadingClasses(true);
    ClassesAPI.getByYear(selectedYear)
      .then((data) => {
        setClasses(data);
        setIsLoadingClasses(false);
      })
      .catch((error) => {
        console.error("Failed to fetch classes:", error);
        setFetchError(
          error instanceof Error
            ? error.message
            : "Failed to load classes. Please try again."
        );
        setIsLoadingClasses(false);
      });
  }, [selectedYear]);

  /* ===================== HANDLERS ===================== */
  const toggleClassSelection = (classId: number) => {
    setSelectedClassIds((prev) =>
      prev.includes(classId)
        ? prev.filter((id) => id !== classId)
        : [...prev, classId],
    );
  };
  
  const handleAssignTeacher = async () => {
    // Validation
    if ((!selectedTeacherId && !pendingTeacherDraft) || !selectedYear || !selectedSubjectId || selectedClassIds.length === 0) {
      setAssignmentError("Please fill in all required fields");
      return;
    }

    setAssignmentError(null);
    setAssignmentSuccess(false);
    setIsAssigningTeacher(true);

    try {
      let teacherIdToAssign = selectedTeacherId;

      // If no existing teacher selected, create from draft now (final step).
      if (!teacherIdToAssign && pendingTeacherDraft) {
        const createdTeacher = (await TeachersAPI.create({
          hireDate: new Date().toISOString(),
          department: pendingTeacherDraft.department,
          qualifications: pendingTeacherDraft.qualifications,
          email: pendingTeacherDraft.email,
          role: "Teacher",
          phone: pendingTeacherDraft.phone,
          fullName: {
            firstName: pendingTeacherDraft.firstName,
            middleName: pendingTeacherDraft.middleName,
            lastName: pendingTeacherDraft.lastName,
          },
        })) as Teacher;

        teacherIdToAssign = createdTeacher.id;
        setPendingTeacherDraft(null);
        await loadTeachers();
      }

      if (!teacherIdToAssign) {
        throw new Error("Teacher is not selected");
      }

      const normalizedClassIds = selectedClassIds
        .map((id) => Number(id))
        .filter((id) => Number.isInteger(id) && id > 0);

      if (normalizedClassIds.length === 0) {
        throw new Error("Please select at least one valid class");
      }

      await TeacherAssignmentsAPI.create({
        teacherId: String(teacherIdToAssign).trim(),
        yearId: String(selectedYear).trim(),
        subjectId: String(selectedSubjectId).trim(),
        classIds: normalizedClassIds,
      });

      setAssignmentSuccess(true);
      // Reset form
      setSelectedTeacherId("");
      setSelectedSubjectId("");
      setSelectedClassIds([]);
      
      // Hide success message after delay
      setTimeout(() => {
        setAssignmentSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Failed to assign teacher:", error);
      setAssignmentError(
        error instanceof Error
          ? error.message
          : "Failed to assign teacher. Please try again."
      );
    } finally {
      setIsAssigningTeacher(false);
    }
  };

  const handleSaveTeacher = async () => {
    // Reset error and success states
    setTeacherError(null);
    setTeacherSuccess(false);

    // Form validation
    if (!teacherForm.firstName.trim()) {
      setTeacherError("First name is required");
      return;
    }
    if (!teacherForm.lastName.trim()) {
      setTeacherError("Last name is required");
      return;
    }
    if (!teacherForm.email.trim()) {
      setTeacherError("Email is required");
      return;
    }
    if (!teacherForm.phone.trim()) {
      setTeacherError("Phone is required");
      return;
    }
    if (!teacherForm.department.trim()) {
      setTeacherError("Department is required");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(teacherForm.email.trim())) {
      setTeacherError("Please enter a valid email address");
      return;
    }

    // Phone validation (basic - accepts numbers, spaces, dashes, parentheses)
    const phoneRegex = /^[\d\s\-\(\)]+$/;
    const cleanPhone = teacherForm.phone.replace(/\s/g, "");
    if (cleanPhone.length < 8 || cleanPhone.length > 15) {
      setTeacherError("Phone number must be between 8 and 15 digits");
      return;
    }
    if (!phoneRegex.test(teacherForm.phone)) {
      setTeacherError("Please enter a valid phone number");
      return;
    }

    setIsSavingTeacher(true);
    try {
      // Sanitize inputs before sending
      const sanitizeInput = (input: string) => {
        return input
          .trim()
          .replace(/[<>]/g, "") // Remove < and > to prevent XSS
          .substring(0, 255); // Limit length
      };

      // Save as local draft only; creation happens at final assign step.
      setPendingTeacherDraft({
        firstName: sanitizeInput(teacherForm.firstName),
        middleName: teacherForm.middleName
          ? sanitizeInput(teacherForm.middleName)
          : undefined,
        lastName: sanitizeInput(teacherForm.lastName),
        email: teacherForm.email.trim().toLowerCase(),
        phone: cleanPhone,
        qualifications: sanitizeInput(teacherForm.qualifications),
        department: sanitizeInput(teacherForm.department),
      });

      // Success - reset form and continue to assignment steps
      setTeacherSuccess(true);

      // Reset form
      setTeacherForm({
        firstName: "",
        middleName: "",
        lastName: "",
        email: "",
        phone: "",
        qualifications: "",
        department: "",
      });

      // Close modal after a short delay to show success message
      setTimeout(() => {
        setOpenAddTeacher(false);
        setTeacherSuccess(false);
      }, 1500);
    }catch (error: unknown) {
      console.error("Failed to create teacher:", error);
    
      if (error instanceof Error) {
        setTeacherError(error.message);
      } else {
        setTeacherError("Failed to create teacher. Please try again.");
      }
    }
    finally {
      setIsSavingTeacher(false);
    }
  };

  const handleSaveSubject = async () => {
    try {
      if (!subjectName.trim()) {
        setFetchError("Subject name is required");
        return;
      }
      if (!selectedYear.trim()) {
        setFetchError("Select academic year/stage first");
        return;
      }
      // Backend swagger does not accept "type"; encode category in subject name.
      const normalizedSubjectName =
        subjectType === "competency"
          ? `${subjectName.trim()} (Jadarat)`
          : subjectName.trim();

      await SubjectsAPI.create({
        subjectName: normalizedSubjectName,
        stage: selectedYear,
      });

      setOpenAddSubject(false);
      setSubjectName("");
      setSubjectType("academic");
      setSubjects(await SubjectsAPI.getByYear(selectedYear));
    } catch (error) {
      console.error("Failed to create subject:", error);
      setFetchError(
        error instanceof Error ? error.message : "Failed to create subject."
      );
    }
  };

  // Reset form when dialog closes
  const handleCloseTeacherDialog = () => {
    setOpenAddTeacher(false);
    setTeacherForm({
      firstName: "",
      middleName: "",
      lastName: "",
      email: "",
      phone: "",
      qualifications: "",
      department: "",
    });
    setTeacherError(null);
    setTeacherSuccess(false);
  };

  /* ===================== UI ===================== */

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundImage: "url(/Images/background1.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={4}>
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h4" fontWeight="bold" sx={{ color: "#fff" }}>
              Teacher Assignment Dashboard
            </Typography>
            <Button
              variant="contained"
              onClick={() => setOpenTeachersList(true)}
              sx={{
                backgroundColor: "#ffc107",
                color: "#000",
                fontWeight: "bold",
                "&:hover": { backgroundColor: "#ffca2c" },
              }}
            >
              List Teacher
            </Button>
          </Box>

          {/* Main Content */}
          <Box
            sx={{
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              borderRadius: "24px",
              p: { xs: 3, md: 6 },
              color: "#fff",
            }}
          >
            <Stack spacing={4}>
              {/* Step 1 */}
              <Card
                sx={{ p: 3, borderRadius: "16px", backgroundColor: "#fff" }}
              >
                <Stack spacing={2}>
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        backgroundColor: "#ffc107",
                        borderRadius: "8px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "bold",
                        color: "#000",
                      }}
                    >
                      1
                    </Box>
                    <Typography variant="h6" fontWeight="bold">
                      Select Teacher
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <FormControl fullWidth size="small" sx={{ maxWidth: 300 }}>
                      <InputLabel>Select Teacher</InputLabel>
                      <Select
                        label="Select Teacher"
                        value={selectedTeacherId}
                        onChange={(e) => setSelectedTeacherId(e.target.value)}
                        disabled={isLoadingTeachers}
                      >
                        {isLoadingTeachers ? (
                          <MenuItem disabled>
                            <CircularProgress size={20} sx={{ mr: 1 }} />
                            Loading...
                          </MenuItem>
                        ) : teachers.length === 0 ? (
                          <MenuItem disabled>No teachers available</MenuItem>
                        ) : (
                          teachers.map((t) => (
                            <MenuItem key={t.id} value={t.id}>
                              {t.fullName}
                            </MenuItem>
                          ))
                        )}
                      </Select>
                    </FormControl>

                    <Button
                      onClick={() => setOpenAddTeacher(true)}
                      variant="contained"
                      startIcon={<AddIcon />}
                      sx={{
                        backgroundColor: "#ffc107",
                        color: "#000",
                        "&:hover": { backgroundColor: "#ffca2c" },
                      }}
                    >
                      Add New Teacher
                    </Button>
                  </Box>
                  {pendingTeacherDraft && (
                    <Alert severity="info">
                      New teacher draft saved. Complete year/subject/classes then click <b>Assign Teacher</b> to create and assign.
                    </Alert>
                  )}
                </Stack>
              </Card>

              {/* Step 2 */}
              <Card
                sx={{ p: 3, borderRadius: "16px", backgroundColor: "#fff" }}
              >
                <Stack spacing={2}>
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        backgroundColor: "#ffc107",
                        borderRadius: "8px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "bold",
                        color: "#000",
                      }}
                    >
                      2
                    </Box>
                    <Typography variant="h6" fontWeight="bold">
                      Subject Assignment
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", gap: 2 }}>
                    <FormControl fullWidth size="small" sx={{ maxWidth: 200 }}>
                      <InputLabel>Academic Year</InputLabel>
                      <Select
                        label="Academic Year"
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                      >
                        <MenuItem value="2024-2025">2024-2025</MenuItem>
                        <MenuItem value="2025-2026">2025-2026</MenuItem>
                        <MenuItem value="2026-2027">2026-2027</MenuItem>
                      </Select>
                    </FormControl>

                    <FormControl fullWidth size="small" sx={{ maxWidth: 200 }}>
                      <InputLabel>Subject</InputLabel>
                      <Select
                        label="Subject"
                        value={selectedSubjectId}
                        onChange={(e) => setSelectedSubjectId(e.target.value)}
                        disabled={isLoadingSubjects || !selectedYear}
                      >
                        {isLoadingSubjects ? (
                          <MenuItem disabled>
                            <CircularProgress size={20} sx={{ mr: 1 }} />
                            Loading...
                          </MenuItem>
                        ) : subjects.length === 0 ? (
                          <MenuItem disabled>No subjects available</MenuItem>
                        ) : (
                          subjects.map((s) => (
                            <MenuItem key={s.id} value={s.id}>
                              {s.subjectName}
                            </MenuItem>
                          ))
                        )}
                      </Select>
                    </FormControl>

                    <IconButton
                      onClick={() => setOpenAddSubject(true)}
                      sx={{
                        backgroundColor: "#ffc107",
                        color: "#000",
                        "&:hover": { backgroundColor: "#ffca2c" },
                      }}
                    >
                      <AddIcon />
                    </IconButton>
                  </Box>
                </Stack>
              </Card>
            </Stack>
            <Card sx={{ p: 3, borderRadius: "16px", backgroundColor: "#fff" }}>
            <Stack spacing={2}>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    backgroundColor: "#ffc107",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                    color: "#000",
                  }}
                >
                  3
                </Box>
                <Typography variant="h6" fontWeight="bold">
                  Assign Classes
                </Typography>
              </Box>

              {isLoadingClasses ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                  {classes.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                      No classes available for selected year
                    </Typography>
                  ) : (
                    classes.map((cls) => {
                      const isSelected = selectedClassIds.includes(cls.classId);

                      return (
                        <Box
                          key={cls.classId}
                          onClick={() => toggleClassSelection(cls.classId)}
                          sx={{
                            width: 44,
                            height: 44,
                            borderRadius: "50%",
                            backgroundColor: isSelected ? "#000" : "#ffc107",
                            color: isSelected ? "#ffc107" : "#000",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: "bold",
                            cursor: "pointer",
                            transition: "0.2s",
                            border: isSelected ? "2px solid #ffc107" : "none",
                            "&:hover": { transform: "scale(1.1)" },
                          }}
                        >
                          {cls.className}
                        </Box>
                      );
                    })
                  )}
                </Box>
              )}
            </Stack>
          </Card>
          {/* Error and Success Messages */}
          {fetchError && (
            <Alert severity="error" sx={{ mt: 2 }} onClose={() => setFetchError(null)}>
              {fetchError}
            </Alert>
          )}
          {assignmentError && (
            <Alert severity="error" sx={{ mt: 2 }} onClose={() => setAssignmentError(null)}>
              {assignmentError}
            </Alert>
          )}
          {assignmentSuccess && (
            <Alert severity="success" sx={{ mt: 2 }} onClose={() => setAssignmentSuccess(false)}>
              Teacher assigned successfully!
            </Alert>
          )}

          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <Button
              variant="contained"
              size="large"
              disabled={
                (!selectedTeacherId && !pendingTeacherDraft) ||
                !selectedSubjectId ||
                selectedClassIds.length === 0 ||
                isAssigningTeacher
              }
              onClick={handleAssignTeacher}
              sx={{
                backgroundColor: "#ffc107",
                color: "#000",
                px: 6,
                py: 1.5,
                fontWeight: "bold",
                "&:hover": { backgroundColor: "#ffca2c" },
              }}
            >
              {isAssigningTeacher ? (
                <>
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                  Processing...
                </>
              ) : (
                "Create & Assign Teacher"
              )}
            </Button>
          </Box>
          </Box>
        
          
        </Stack>

        {/* Add Teacher Modal */}
        <Dialog open={openAddTeacher} onClose={handleCloseTeacherDialog}>
          <DialogTitle>
            Add New Teacher
            <IconButton
              onClick={handleCloseTeacherDialog}
              sx={{ float: "right" }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>

          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1, minWidth: 400 }}>
              {/* Success Message */}
              {teacherSuccess && (
                <Alert severity="success">
                  Teacher added successfully!
                </Alert>
              )}

              {/* Error Message */}
              {teacherError && (
                <Alert severity="error">{teacherError}</Alert>
              )}

              <TextField
                label="First Name"
                placeholder="First Name"
                value={teacherForm.firstName}
                onChange={(e) =>
                  setTeacherForm({ ...teacherForm, firstName: e.target.value })
                }
                required
                fullWidth
              />
              <TextField
                label="Middle Name"
                placeholder="Middle Name"
                value={teacherForm.middleName}
                onChange={(e) =>
                  setTeacherForm({ ...teacherForm, middleName: e.target.value })
                }
                fullWidth
              />
              <TextField
                label="Last Name"
                placeholder="Last Name"
                value={teacherForm.lastName}
                onChange={(e) =>
                  setTeacherForm({ ...teacherForm, lastName: e.target.value })
                }
                required
                fullWidth
              />
              <TextField
                label="Email"
                type="email"
                placeholder="Email"
                value={teacherForm.email}
                onChange={(e) =>
                  setTeacherForm({ ...teacherForm, email: e.target.value })
                }
                required
                fullWidth
              />
              <TextField
                label="Phone"
                placeholder="Phone"
                type="tel"
                value={teacherForm.phone}
                onChange={(e) =>
                  setTeacherForm({ ...teacherForm, phone: e.target.value })
                }
                required
                fullWidth
                helperText="Enter phone number (8-15 digits)"
              />
              <TextField
                label="Qualifications"
                placeholder="Qualifications"
                value={teacherForm.qualifications}
                onChange={(e) =>
                  setTeacherForm({
                    ...teacherForm,
                    qualifications: e.target.value,
                  })
                }
                multiline
                rows={3}
                fullWidth
              />
              <TextField
                label="Department"
                placeholder="Department (must match backend)"
                value={teacherForm.department}
                onChange={(e) =>
                  setTeacherForm({
                    ...teacherForm,
                    department: e.target.value,
                  })
                }
                required
                fullWidth
              />

              <Button
                variant="contained"
                onClick={handleSaveTeacher}
                disabled={isSavingTeacher}
                fullWidth
                sx={{
                  mt: 2,
                  backgroundColor: "#ffc107",
                  color: "#000",
                  "&:hover": { backgroundColor: "#ffca2c" },
                }}
              >
                {isSavingTeacher ? (
                  <>
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                    Saving...
                  </>
                ) : (
                  "Save Teacher"
                )}
              </Button>
            </Stack>
          </DialogContent>
        </Dialog>

        {/* Add Subject Modal */}
        <Dialog open={openAddSubject} onClose={() => setOpenAddSubject(false)}>
          <DialogTitle>
            Add New Subject
            <IconButton
              onClick={() => setOpenAddSubject(false)}
              sx={{ float: "right" }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>

          <DialogContent>
            <Stack spacing={2}>
              <TextField
                placeholder="Subject name"
                onChange={(e) => setSubjectName(e.target.value)}
              />

              <Alert severity="info">
                Subject will be created for stage/year: <b>{selectedYear || "Not selected"}</b>
              </Alert>

              <RadioGroup
                value={subjectType}
                onChange={(e) =>
                  setSubjectType(e.target.value as "academic" | "competency")
                }
              >
                <FormControlLabel
                  value="academic"
                  control={<Radio />}
                  label="Academic Subject"
                />
                <FormControlLabel
                  value="competency"
                  control={<Radio />}
                  label="Competency (Jadarat)"
                />
              </RadioGroup>

              <Button variant="contained" onClick={handleSaveSubject}>
                Save Subject
              </Button>
            </Stack>
          </DialogContent>
        </Dialog>
      </Container>

      <Dialog open={openTeachersList} onClose={() => setOpenTeachersList(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Teachers List
          <IconButton onClick={() => setOpenTeachersList(false)} sx={{ float: "right" }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Button variant="outlined" onClick={loadTeachers} sx={{ mb: 2 }}>
            Refresh
          </Button>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {teachers.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell>{t.id}</TableCell>
                    <TableCell>{t.fullName}</TableCell>
                  </TableRow>
                ))}
                {teachers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={2}>No teachers available</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
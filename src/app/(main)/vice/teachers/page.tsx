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
import { alpha, useTheme } from "@mui/material/styles";

import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";

import { Teacher } from "@/types/teacher.types";
import { Class, Subject } from "@/types/subject.types";
import { TeachersAPI } from "@/data/teachers.api";
import { SubjectsAPI } from "@/data/subjects.api";
import { ClassesAPI } from "@/data/classes.api";
import { TeacherAssignmentsAPI } from "@/data/teacher-assignments.api";
import { useLanguage } from "@/context/LanguageContext";
import LoadingRegion from "@/components/a11y/LoadingRegion";
import AccessibleIconButton from "@/components/a11y/AccessibleIconButton";
import { appToast } from "@/hooks/useAppToast";

export default function ViceTeachersPage() {
  const { t } = useLanguage();
  const theme = useTheme();
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
            : t("teachers.failedLoadTeachers", "Failed to load teachers. Please try again.")
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
          : t("teachers.failedLoadTeachers", "Failed to load teachers. Please try again.")
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
            : t("teachers.failedLoadSubjects", "Failed to load subjects. Please try again.")
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
            : t("teachers.failedLoadClasses", "Failed to load classes. Please try again.")
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
      setAssignmentError(t("teachers.fillRequiredFields", "Please fill in all required fields"));
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
        throw new Error(t("teachers.teacherNotSelected", "Teacher is not selected"));
      }

      const normalizedClassIds = selectedClassIds
        .map((id) => Number(id))
        .filter((id) => Number.isInteger(id) && id > 0);

      if (normalizedClassIds.length === 0) {
        throw new Error(t("teachers.selectValidClass", "Please select at least one valid class"));
      }

      await TeacherAssignmentsAPI.create({
        teacherId: String(teacherIdToAssign).trim(),
        yearId: String(selectedYear).trim(),
        subjectId: String(selectedSubjectId).trim(),
        classIds: normalizedClassIds,
      });

      setAssignmentSuccess(true);
      appToast.success(t("teachers.assignedSuccess", "Teacher assigned successfully!"));
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
          : t("teachers.failedAssignTeacher", "Failed to assign teacher. Please try again.")
      );
      appToast.error(
        error instanceof Error
          ? error.message
          : t("teachers.failedAssignTeacher", "Failed to assign teacher. Please try again.")
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
      setTeacherError(t("teachers.firstNameRequired", "First name is required"));
      return;
    }
    if (!teacherForm.lastName.trim()) {
      setTeacherError(t("teachers.lastNameRequired", "Last name is required"));
      return;
    }
    if (!teacherForm.email.trim()) {
      setTeacherError(t("teachers.emailRequired", "Email is required"));
      return;
    }
    if (!teacherForm.phone.trim()) {
      setTeacherError(t("teachers.phoneRequired", "Phone is required"));
      return;
    }
    if (!teacherForm.department.trim()) {
      setTeacherError(t("teachers.departmentRequired", "Department is required"));
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(teacherForm.email.trim())) {
      setTeacherError(t("teachers.validEmail", "Please enter a valid email address"));
      return;
    }

    // Phone validation (basic - accepts numbers, spaces, dashes, parentheses)
    const phoneRegex = /^[\d\s\-\(\)]+$/;
    const cleanPhone = teacherForm.phone.replace(/\s/g, "");
    if (cleanPhone.length < 8 || cleanPhone.length > 15) {
      setTeacherError(t("teachers.phoneLength", "Phone number must be between 8 and 15 digits"));
      return;
    }
    if (!phoneRegex.test(teacherForm.phone)) {
      setTeacherError(t("teachers.validPhone", "Please enter a valid phone number"));
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
      appToast.success(t("teachers.addedSuccess", "Teacher added successfully!"));

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
        appToast.error(error.message);
      } else {
        setTeacherError(t("teachers.failedCreateTeacher", "Failed to create teacher. Please try again."));
        appToast.error(t("teachers.failedCreateTeacher", "Failed to create teacher. Please try again."));
      }
    }
    finally {
      setIsSavingTeacher(false);
    }
  };

  const handleSaveSubject = async () => {
    try {
      if (!subjectName.trim()) {
        setFetchError(t("teachers.subjectNameRequired", "Subject name is required"));
        return;
      }
      if (!selectedYear.trim()) {
        setFetchError(t("teachers.selectAcademicYear", "Select academic year/stage first"));
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
      appToast.success(t("teachers.saveSubject", "Save Subject"));
    } catch (error) {
      console.error("Failed to create subject:", error);
      setFetchError(
        error instanceof Error ? error.message : t("teachers.failedCreateSubject", "Failed to create subject.")
      );
      appToast.error(
        error instanceof Error ? error.message : t("teachers.failedCreateSubject", "Failed to create subject.")
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
        py: { xs: 2, md: 4 },
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
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            <Typography
              variant="h4"
              fontWeight={700}
              sx={{
                color: theme.palette.common.white,
                lineHeight: 1.2,
                textShadow: `0 2px 10px ${alpha(theme.palette.common.black, 0.45)}`,
                fontSize: { xs: "1.5rem", md: "2rem" },
              }}
            >
              {t("teachers.dashboardTitle")}
            </Typography>
            <Button
              variant="contained"
              onClick={() => setOpenTeachersList(true)}
              sx={{
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                fontWeight: 700,
                textTransform: "none",
                "&:hover": { backgroundColor: theme.palette.primary.dark },
              }}
            >
              {t("teachers.listTeacher")}
            </Button>
          </Box>

          {/* Main Content */}
          <Box
            sx={{
              backgroundColor: alpha(theme.palette.background.default, 0.8),
              backdropFilter: "blur(4px)",
              borderRadius: "24px",
              border: `1px solid ${alpha(theme.palette.divider, 0.6)}`,
              p: { xs: 2, md: 4 },
              color: theme.palette.text.primary,
            }}
          >
            <Stack spacing={4}>
              {/* Step 1 */}
              <Card
                sx={{ p: { xs: 2, md: 3 }, borderRadius: "16px", backgroundColor: theme.palette.background.paper }}
              >
                <Stack spacing={2}>
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        backgroundColor: theme.palette.primary.main,
                        borderRadius: "8px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                        color: theme.palette.primary.contrastText,
                      }}
                    >
                      1
                    </Box>
                    <Typography variant="h6" fontWeight={700} color="text.primary">
                      {t("teachers.selectTeacher")}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                    <FormControl fullWidth size="small" sx={{ maxWidth: { xs: "100%", sm: 320 }, minWidth: 220 }}>
                      <InputLabel>{t("teachers.selectTeacher")}</InputLabel>
                      <Select
                        label={t("teachers.selectTeacher")}
                        value={selectedTeacherId}
                        onChange={(e) => setSelectedTeacherId(e.target.value)}
                        disabled={isLoadingTeachers}
                      >
                        {isLoadingTeachers ? (
                          <MenuItem disabled>
                            <LoadingRegion />
                          </MenuItem>
                        ) : teachers.length === 0 ? (
                          <MenuItem disabled>{t("teachers.noTeachersAvailable")}</MenuItem>
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
                        backgroundColor: theme.palette.primary.main,
                        color: theme.palette.primary.contrastText,
                        textTransform: "none",
                        fontWeight: 700,
                        "&:hover": { backgroundColor: theme.palette.primary.dark },
                      }}
                    >
                      {t("teachers.addNewTeacher")}
                    </Button>
                  </Box>
                  {pendingTeacherDraft && (
                    <Alert severity="info">
                      {t("teachers.draftSaved", "New teacher draft saved. Complete year/subject/classes then click")} <b>{t("teachers.assignTeacherCta", "Assign Teacher")}</b> {t("teachers.toCreateAssign", "to create and assign.")}
                    </Alert>
                  )}
                </Stack>
              </Card>

              {/* Step 2 */}
              <Card
                sx={{ p: { xs: 2, md: 3 }, borderRadius: "16px", backgroundColor: theme.palette.background.paper }}
              >
                <Stack spacing={2}>
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        backgroundColor: theme.palette.primary.main,
                        borderRadius: "8px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                        color: theme.palette.primary.contrastText,
                      }}
                    >
                      2
                    </Box>
                    <Typography variant="h6" fontWeight={700} color="text.primary">
                      {t("teachers.subjectAssignment")}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                    <FormControl fullWidth size="small" sx={{ maxWidth: { xs: "100%", sm: 220 }, minWidth: 180 }}>
                      <InputLabel>{t("students.academicYear")}</InputLabel>
                      <Select
                        label={t("students.academicYear")}
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                      >
                        <MenuItem value="2024-2025">2024-2025</MenuItem>
                        <MenuItem value="2025-2026">2025-2026</MenuItem>
                        <MenuItem value="2026-2027">2026-2027</MenuItem>
                      </Select>
                    </FormControl>

                    <FormControl fullWidth size="small" sx={{ maxWidth: { xs: "100%", sm: 220 }, minWidth: 180 }}>
                      <InputLabel>{t("teachers.subject")}</InputLabel>
                      <Select
                        label={t("teachers.subject")}
                        value={selectedSubjectId}
                        onChange={(e) => setSelectedSubjectId(e.target.value)}
                        disabled={isLoadingSubjects || !selectedYear}
                      >
                        {isLoadingSubjects ? (
                          <MenuItem disabled>
                            <LoadingRegion />
                          </MenuItem>
                        ) : subjects.length === 0 ? (
                          <MenuItem disabled>{t("teachers.noSubjectsAvailable", "No subjects available")}</MenuItem>
                        ) : (
                          subjects.map((s) => (
                            <MenuItem key={s.id} value={s.id}>
                              {s.subjectName}
                            </MenuItem>
                          ))
                        )}
                      </Select>
                    </FormControl>

                    <AccessibleIconButton
                      label={t("teachers.addSubject", "Add subject")}
                      onClick={() => setOpenAddSubject(true)}
                      sx={{
                        backgroundColor: theme.palette.primary.main,
                        color: theme.palette.primary.contrastText,
                        "&:hover": { backgroundColor: theme.palette.primary.dark },
                      }}
                    >
                      <AddIcon />
                    </AccessibleIconButton>
                  </Box>
                </Stack>
              </Card>
            </Stack>
            <Card sx={{ p: { xs: 2, md: 3 }, borderRadius: "16px", backgroundColor: theme.palette.background.paper }}>
            <Stack spacing={2}>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    backgroundColor: theme.palette.primary.main,
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    color: theme.palette.primary.contrastText,
                  }}
                >
                  3
                </Box>
                <Typography variant="h6" fontWeight={700} color="text.primary">
                  {t("teachers.assignClasses")}
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
                      {t("teachers.noClassesForYear")}
                    </Typography>
                  ) : (
                    classes.map((cls) => {
                      const isSelected = selectedClassIds.includes(cls.classId);

                      return (
                        <Button
                          key={cls.classId}
                          onClick={() => toggleClassSelection(cls.classId)}
                          aria-pressed={isSelected}
                          aria-label={`${t("students.class")} ${cls.className}`}
                          sx={{
                            width: 44,
                            height: 44,
                            borderRadius: "50%",
                            backgroundColor: isSelected ? theme.palette.text.primary : theme.palette.primary.main,
                            color: isSelected ? theme.palette.primary.main : theme.palette.primary.contrastText,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: 700,
                            transition: "0.2s",
                            border: isSelected ? `2px solid ${theme.palette.primary.main}` : "none",
                            "&:hover": { transform: "scale(1.1)" },
                            minWidth: 44,
                          }}
                        >
                          {cls.className}
                        </Button>
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
              {t("teachers.assignedSuccess", "Teacher assigned successfully!")}
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
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                px: { xs: 3, md: 6 },
                py: 1.5,
                fontWeight: 700,
                textTransform: "none",
                "&:hover": { backgroundColor: theme.palette.primary.dark },
              }}
            >
              {isAssigningTeacher ? (
                <>
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                  {t("teachers.processing")}
                </>
              ) : (
                t("teachers.createAndAssignTeacher")
              )}
            </Button>
          </Box>
          </Box>
        
          
        </Stack>

        {/* Add Teacher Modal */}
        <Dialog open={openAddTeacher} onClose={handleCloseTeacherDialog} fullWidth maxWidth="sm">
          <DialogTitle>
            {t("teachers.addNewTeacher")}
            <AccessibleIconButton
              label={t("common.closeMenu")}
              onClick={handleCloseTeacherDialog}
              sx={{ float: "right" }}
            >
              <CloseIcon />
            </AccessibleIconButton>
          </DialogTitle>

          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1, minWidth: { xs: 0, sm: 400 } }}>
              {/* Success Message */}
              {teacherSuccess && (
                <Alert severity="success">
                  {t("teachers.addedSuccess", "Teacher added successfully!")}
                </Alert>
              )}

              {/* Error Message */}
              {teacherError && (
                <Alert severity="error">{teacherError}</Alert>
              )}

              <TextField
                label={t("modal.firstName")}
                placeholder={t("modal.firstName")}
                value={teacherForm.firstName}
                onChange={(e) =>
                  setTeacherForm({ ...teacherForm, firstName: e.target.value })
                }
                required
                fullWidth
              />
              <TextField
                label={t("modal.middleNameOptional")}
                placeholder={t("modal.middleNameOptional")}
                value={teacherForm.middleName}
                onChange={(e) =>
                  setTeacherForm({ ...teacherForm, middleName: e.target.value })
                }
                fullWidth
              />
              <TextField
                label={t("modal.lastName")}
                placeholder={t("modal.lastName")}
                value={teacherForm.lastName}
                onChange={(e) =>
                  setTeacherForm({ ...teacherForm, lastName: e.target.value })
                }
                required
                fullWidth
              />
              <TextField
                label={t("modal.email")}
                type="email"
                placeholder={t("modal.email")}
                value={teacherForm.email}
                onChange={(e) =>
                  setTeacherForm({ ...teacherForm, email: e.target.value })
                }
                required
                fullWidth
              />
              <TextField
                label={t("modal.phone")}
                placeholder={t("modal.phone")}
                type="tel"
                value={teacherForm.phone}
                onChange={(e) =>
                  setTeacherForm({ ...teacherForm, phone: e.target.value })
                }
                required
                fullWidth
                helperText={t("teachers.phoneLength", "Enter phone number (8-15 digits)")}
              />
              <TextField
                label={t("teachers.qualifications", "Qualifications")}
                placeholder={t("teachers.qualifications", "Qualifications")}
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
                label={t("students.department")}
                placeholder={t("teachers.departmentHelp", "Department (must match backend)")}
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
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                  "&:hover": { backgroundColor: theme.palette.primary.dark },
                }}
              >
                {isSavingTeacher ? (
                  <>
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                    {t("modal.saving")}
                  </>
                ) : (
                  t("teachers.saveTeacher", "Save Teacher")
                )}
              </Button>
            </Stack>
          </DialogContent>
        </Dialog>

        {/* Add Subject Modal */}
        <Dialog open={openAddSubject} onClose={() => setOpenAddSubject(false)} fullWidth maxWidth="sm">
          <DialogTitle>
            {t("teachers.addSubject", "Add New Subject")}
            <AccessibleIconButton
              label={t("common.closeMenu")}
              onClick={() => setOpenAddSubject(false)}
              sx={{ float: "right" }}
            >
              <CloseIcon />
            </AccessibleIconButton>
          </DialogTitle>

          <DialogContent>
            <Stack spacing={2}>
              <TextField
                placeholder={t("teachers.subjectName", "Subject name")}
                onChange={(e) => setSubjectName(e.target.value)}
              />

              <Alert severity="info">
                {t("teachers.subjectForYear", "Subject will be created for stage/year:")} <b>{selectedYear || t("common.notSelected")}</b>
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
                  label={t("teachers.academicSubject", "Academic Subject")}
                />
                <FormControlLabel
                  value="competency"
                  control={<Radio />}
                  label={t("teachers.competencyJadarat", "Competency (Jadarat)")}
                />
              </RadioGroup>

              <Button
                variant="contained"
                onClick={handleSaveSubject}
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                  textTransform: "none",
                  "&:hover": { backgroundColor: theme.palette.primary.dark },
                }}
              >
                {t("teachers.saveSubject", "Save Subject")}
              </Button>
            </Stack>
          </DialogContent>
        </Dialog>
      </Container>

      <Dialog open={openTeachersList} onClose={() => setOpenTeachersList(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {t("teachers.teachersList")}
          <AccessibleIconButton label={t("common.closeMenu")} onClick={() => setOpenTeachersList(false)} sx={{ float: "right" }}>
            <CloseIcon />
          </AccessibleIconButton>
        </DialogTitle>
        <DialogContent>
          <Button
            variant="outlined"
            onClick={loadTeachers}
            sx={{ mb: 2, textTransform: "none", borderColor: theme.palette.divider, color: theme.palette.text.primary }}
          >
            {t("common.refresh")}
          </Button>
          <TableContainer component={Paper}>
            <Table size="small">
              <caption style={{ textAlign: "left", padding: "8px 16px", fontWeight: 600 }}>
                {t("teachers.teachersList")}
              </caption>
              <TableHead>
                <TableRow>
                  <TableCell>{t("teachers.id")}</TableCell>
                  <TableCell>{t("teachers.name")}</TableCell>
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
                    <TableCell colSpan={2}>{t("teachers.noTeachersAvailable")}</TableCell>
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
import type {
  TeacherSubject,
  TeacherProfileResponse,
  TeacherClassesResponse,
  TeacherStudent,
} from "@/types/Teacher-api/teacher-api";
import { API_BASE_URL, secureFetch } from "@/config/api.config";

interface ApiSubject {
  subjectId?: number;
  id?: number;
  subjectName?: string;
  stage?: string;
}

interface AuthMeResponse {
  userId?: number | string;
  username?: string;
  fullName?: string;
}

const KNOWN_ACADEMIC_YEARS = ["2024-2025", "2025-2026", "2026-2027"] as const;

const mapStageToTeacherYear = (stage: string | undefined): TeacherSubject["year"] => {
  if (!stage) return "junior";
  if (stage.includes("2025-2026")) return "wheeler";
  if (stage.includes("2026-2027")) return "senior";
  return "junior";
};

export interface TeacherDashboardYear {
  yearId: string;
  classes: { classId: string; className: string }[];
}

interface TeacherDashboardRow {
  yearId?: string;
  stage?: string;
  classId?: string | number;
  className?: string;
  classes?: Array<{ classId?: string | number; className?: string }>;
}

const isNotFoundError = (error: unknown): boolean =>
  error instanceof Error && error.message.includes("HTTP 404");

const tryFetchDashboardRows = async (): Promise<TeacherDashboardRow[] | null> => {
  const candidatePaths = [
    "/TeacherAssignments/MyDashboard",
    "/TeacherAssignments/my-dashboard",
    "/TeacherAssignments/TeacherDashboard",
  ];

  for (const path of candidatePaths) {
    try {
      const payload = await secureFetch(`${API_BASE_URL}${path}`);
      if (Array.isArray(payload)) return payload as TeacherDashboardRow[];
      if (payload && typeof payload === "object") {
        const wrappedRows = (payload as { data?: unknown; assignments?: unknown }).data
          ?? (payload as { assignments?: unknown }).assignments;
        if (Array.isArray(wrappedRows)) return wrappedRows as TeacherDashboardRow[];
      }
      return [];
    } catch (error) {
      if (isNotFoundError(error)) continue;
      throw error;
    }
  }

  return null;
};

const toYearId = (row: TeacherDashboardRow): string | null => {
  const yearId = row.yearId?.trim() || row.stage?.trim() || "";
  return yearId ? yearId : null;
};

const normalizeDashboardRows = (rows: TeacherDashboardRow[]): TeacherDashboardYear[] => {
  const grouped = new Map<string, Map<string, string>>();

  rows.forEach((row) => {
    const yearId = toYearId(row);
    if (!yearId) return;
    if (!grouped.has(yearId)) grouped.set(yearId, new Map<string, string>());
    const classMap = grouped.get(yearId)!;

    if (Array.isArray(row.classes)) {
      row.classes.forEach((cls) => {
        const classId = String(cls.classId ?? "").trim();
        const className = (cls.className ?? "").trim();
        if (classId && className) classMap.set(classId, className);
      });
    }

    const directClassId = String(row.classId ?? "").trim();
    const directClassName = (row.className ?? "").trim();
    if (directClassId && directClassName) classMap.set(directClassId, directClassName);
  });

  return Array.from(grouped.entries()).map(([yearId, classMap]) => ({
    yearId,
    classes: Array.from(classMap.entries()).map(([classId, className]) => ({
      classId,
      className,
    })),
  }));
};

export async function getTeacherDashboardYears(): Promise<TeacherDashboardYear[]> {
  const rows = await tryFetchDashboardRows();
  if (!rows) {
    throw new Error(
      "Teacher dashboard endpoint is not available yet. Expected: GET /api/TeacherAssignments/MyDashboard"
    );
  }
  return normalizeDashboardRows(rows);
}

export async function getTeacherSubjects(): Promise<TeacherSubject[]> {
  const results = await Promise.all(
    KNOWN_ACADEMIC_YEARS.map(async (year) => {
      const data = (await secureFetch(
        `${API_BASE_URL}/Subjects?year=${encodeURIComponent(year)}`
      )) as ApiSubject[];
      return Array.isArray(data) ? data : [];
    })
  );

  const merged = results.flat();
  return merged.map((subject, index) => {
    const subjectId = Number(subject.subjectId ?? subject.id ?? index + 1);
    const subjectName = (subject.subjectName ?? "Unknown Subject").trim();
    const stage = subject.stage ?? KNOWN_ACADEMIC_YEARS[0];
    return {
      id: Number.isFinite(subjectId) ? subjectId : index + 1,
      title: subjectName,
      subjectName,
      year: mapStageToTeacherYear(stage),
      route: `/teacher/classes?year=${encodeURIComponent(stage)}&subject=${encodeURIComponent(
        String(subjectId)
      )}`,
    };
  });
}

export async function getTeacherProfile(): Promise<TeacherProfileResponse> {
  const me = (await secureFetch(`${API_BASE_URL}/Auth/me`)) as AuthMeResponse;
  const displayName = me.fullName?.trim() || me.username?.trim() || "Teacher";
  return {
    name: displayName,
    subtitle: "Manage your subjects and classes",
    currentAcademicYear: "junior",
  };
}

/**
 * Fetch classes list for a specific year and subject from API.
 * Used on /teacher/classes page to display all classes for a selected subject.
 *
 * @param year - Academic year: "junior" | "wheeler" | "senior"
 * @param subjectId - Optional subject ID (or name) to filter classes
 */
export async function getTeacherClasses(
  year: string,
  subjectId?: string | number
): Promise<TeacherClassesResponse> {
  let url = `${API_BASE_URL}/Classes?yearId=${encodeURIComponent(year)}`;
  if (subjectId !== undefined && subjectId !== null) {
    url += `&subjectId=${encodeURIComponent(subjectId)}`;
  }
  const classesData = (await secureFetch(url)) as Array<{
    classId?: number | string;
    className?: string;
  }>;
  return {
    classes: (Array.isArray(classesData) ? classesData : []).map((cls) => ({
      id: cls.classId ?? "",
      className: cls.className ?? "Unnamed Class",
    })),
    year,
    subjectName: "",
  };
}

/**
 * Fetch students for a given class.
 */
export async function getClassStudents(
  classId: string | number
): Promise<{ students: TeacherStudent[] }> {
  const data = (await secureFetch(
    `${API_BASE_URL}/Students?classId=${encodeURIComponent(classId.toString())}`
  )) as TeacherStudent[] | { students?: TeacherStudent[] };
  if (Array.isArray(data)) return { students: data };
  return { students: data.students ?? [] };
}

/**
 * Save a grade for a student.
 */
export async function saveStudentGrade(
  classId: string | number,
  studentId: string | number,
  grade: number
): Promise<void> {
  await secureFetch(`${API_BASE_URL}/Grades`, {
    method: "POST",
    body: JSON.stringify({ classId, studentId, grade }),
  });
}

export const teacherService = {
  getTeacherDashboardYears,
  getTeacherSubjects,
  getTeacherProfile,
  getTeacherClasses,
  getClassStudents,
  saveStudentGrade,
};

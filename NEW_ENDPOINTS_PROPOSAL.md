# New Backend Endpoints Proposal: Academic Year Mappings

**Target Audience:** Backend API Team
**Context:** The frontend needs a way to map specific educational stages/levels (e.g., `junior`, `wheeler`, `senior`) to specific Academic Years (e.g., `2024-2025`). This mapping is crucial because some endpoints (like `TeacherAssignments`) require an Academic Year string, while others (like `Subjects`) require a level string. The Vice Principal needs to manage this mapping in the settings page.

## Proposed Entity: `YearMapping`

```json
{
  "level": "string",          // e.g., "junior", "wheeler", "senior"
  "academicYear": "string",   // e.g., "2024-2025"
  "updatedAt": "string (ISO date)"
}
```

---

## 1. GET `/api/Settings/YearMappings`
**Description:** Retrieve all current year mappings.
**Authentication:** Required (Admin / Vice Principal Role)

### Request:
No payload or query parameters required.

### Response (200 OK):
```json
[
  {
    "level": "junior",
    "academicYear": "2024-2025",
    "updatedAt": "2024-08-01T10:00:00Z"
  },
  {
    "level": "wheeler",
    "academicYear": "2024-2025",
    "updatedAt": "2024-08-01T10:00:00Z"
  },
  {
    "level": "senior",
    "academicYear": "2024-2025",
    "updatedAt": "2024-08-01T10:00:00Z"
  }
]
```

---

## 2. POST (or PUT) `/api/Settings/YearMappings`
**Description:** Update or create a mapping for a specific level.
**Authentication:** Required (Admin / Vice Principal Role)

### Request Body:
```json
{
  "level": "junior",
  "academicYear": "2025-2026"
}
```

### Response (200 OK):
```json
{
  "message": "Mapping updated successfully",
  "data": {
    "level": "junior",
    "academicYear": "2025-2026",
    "updatedAt": "2025-08-01T10:05:00Z"
  }
}
```

### Response (400 Bad Request):
```json
{
  "message": "Validation Error: 'level' must be 'junior', 'wheeler', or 'senior'. 'academicYear' is required."
}
```

---

## Notes for Backend Team
1. The frontend Vice Principal Settings page will consume these endpoints to allow admins to easily push a button that rolls over "junior" from "2024-2025" to "2025-2026".
2. Ideally, this mapping should be cached on the backend, and any API requests that rely on a "level" should dynamically resolve to the active `academicYear` mapped to that level in the database.

---
---

# New Backend Endpoints Proposal: Analytics & Rankings

**Context:** The frontend contains `/rankings` and `/analytics` pages for the Vice Principal and School Administration to monitor performance, visualize data, and identify top-performing students. Currently, no endpoints exist in the Swagger documentation to serve this data. We propose the following read-only statistical endpoints.

## 📊 Analytics Endpoints

### 1. GET `/api/Analytics/DashboardStats`
**Purpose:** Provides high-level KPI cards for the Analytics dashboard.
**Query Parameters:**
- `yearId` (optional): Filter stats by Academic Year (e.g., `2024-2025`).
- `level` (optional): Filter by level (`junior`, `wheeler`, `senior`).

**Response (200 OK):**
```json
{
  "totalStudents": 1450,
  "totalTeachers": 85,
  "totalClasses": 42,
  "schoolAverageGpa": 3.2,
  "passRatePercentage": 88.5
}
```

### 2. GET `/api/Analytics/GradeDistribution`
**Purpose:** Provides data for chart visualizations (e.g., Bar/Pie charts) showing the distribution of grades across the school or a specific level/subject.
**Query Parameters:**
- `yearId` (required)
- `level` (optional)
- `subjectId` (optional)

**Response (200 OK):**
```json
[
  { "grade": "A", "count": 350 },
  { "grade": "B", "count": 520 },
  { "grade": "C", "count": 410 },
  { "grade": "D", "count": 120 },
  { "grade": "F", "count": 50 }
]
```

---

## 🏆 Rankings Endpoints

### 3. GET `/api/Rankings/TopStudents`
**Purpose:** Retrieve the top N students based on their cumulative GPA for the honor roll and rankings page.
**Query Parameters:**
- `yearId` (required)
- `level` (optional): Restrict ranking to a specific level.
- `department` (optional): Restrict ranking to OM or SD.
- `limit` (optional): Number of students to return (default: 10, max: 100).

**Response (200 OK):**
```json
[
  {
    "rank": 1,
    "studentId": "st1",
    "studentCode": "2025001",
    "fullName": "Youssef Ahmed",
    "department": "SD",
    "level": "senior",
    "className": "S-1",
    "cumulativeGpa": 4.0,
    "totalMarks": 995
  },
  {
    "rank": 2,
    "studentId": "st42",
    "studentCode": "2025042",
    "fullName": "Mariam Ali",
    "department": "OM",
    "level": "senior",
    "className": "S-3",
    "cumulativeGpa": 3.98,
    "totalMarks": 988
  }
]
```

### 4. GET `/api/Rankings/SubjectLeaders`
**Purpose:** Get the highest scoring students for a specific subject (e.g., Top 5 in Physics).
**Query Parameters:**
- `subjectId` (required)
- `yearId` (required)
- `limit` (optional): default 5.

**Response (200 OK):**
```json
[
  {
    "rank": 1,
    "studentId": "st99",
    "fullName": "Omar Hassan",
    "className": "J-4",
    "subjectScore": 100
  }
]
```

---
**Notes for Backend Team:** 
- These endpoints involve heavy aggregations. Consider caching the results (e.g., updating them only once a day or when grades are published) to prevent database overload.
- The `GPA` and `totalMarks` logic should match the official grading scale used by the school.

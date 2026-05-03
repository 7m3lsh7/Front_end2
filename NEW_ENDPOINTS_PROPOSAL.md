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

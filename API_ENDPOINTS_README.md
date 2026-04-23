# API Endpoints Documentation

This file contains comprehensive documentation for all API Endpoints required in the project.

---

## 🔐 Authentication Endpoints

### 1. POST `/api/auth/login`

**Purpose:** User login and obtain JWT tokens

**Authentication:** Not required

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response (Success - 200):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "role": "Admin" | "Teacher" | "Student"
}
```

**Response (Error - 401):**
```json
{
  "message": "Invalid username or password"
}
```

**Response (Error - 400):**
```json
{
  "message": "Username and password are required"
}
```

**Security Notes:**
- Returns JWT access token and refresh token in response body
- Frontend automatically stores tokens (access token in sessionStorage, refresh token in localStorage)
- Inputs are validated and sanitized before processing
- Access token should have short expiration (e.g., 15-60 minutes)
- Refresh token should have longer expiration (e.g., 7-30 days)

---

### 2. POST `/api/auth/refresh`

**Purpose:** Refresh access token using refresh token

**Authentication:** Not required (but refresh token must be valid)

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (Success - 200):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." // Optional - only if rotating refresh tokens
}
```

**Response (Error - 401):**
```json
{
  "message": "Invalid or expired refresh token"
}
```

**Response (Error - 400):**
```json
{
  "message": "Refresh token is required"
}
```

**Notes:**
- Used automatically by frontend when access token expires
- Frontend will retry the original request after successful refresh
- If refresh fails, user will be logged out automatically

---

### 3. GET `/api/auth/me`

**Purpose:** Get current authenticated user information

**Authentication:** Required (JWT Bearer token)

**Request Body:** None

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Response (Success - 200):**
```json
{
  "userId": 1,
  "role": "Admin" | "Teacher" | "Student"
}
```

**Response (Error - 401):**
```json
{
  "message": "Unauthenticated"
}
```

**Notes:**
- Uses JWT Bearer token in Authorization header
- If access token is expired, frontend will automatically refresh it and retry
- User must be logged in with valid access token

---

### 4. POST `/api/auth/logout`

**Purpose:** User logout and invalidate refresh token

**Authentication:** Not required (but refresh token should be sent)

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (Success - 200):**
```json
{
  "message": "Logged out successfully"
}
```

**Notes:**
- Invalidates the refresh token on the server
- Frontend clears all tokens from storage
- User will need to login again to access protected endpoints

---

## 👨‍🏫 Teachers Endpoints

### 5. GET `/api/Teachers`

**Purpose:** Get list of all teachers

**Authentication:** Required (JWT Bearer token)

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Request Body:** None

**Response (Success - 200):**
```json
[
  {
    "id": "string",
    "fullName": "string"
  }
]
```

**Response (Error - 401):**
```json
{
  "message": "Unauthenticated"
}
```

---

### 6. POST `/api/Teachers`

**Purpose:** Create a new teacher

**Authentication:** Required (JWT Bearer token)

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Request Body:**
```json
{
  "hireDate": "2024-01-01T00:00:00.000Z",
  "department": "string",
  "qualifications": "string",
  "email": "string",
  "role": "string",
  "phone": "string",
  "fullName": {
    "firstName": "string",
    "middleName": "string (optional)",
    "lastName": "string"
  }
}
```

**Response (Success - 200/201):**
```json
{
  "id": "string",
  "fullName": "string"
}
```

**Response (Error - 400):**
```json
{
  "message": "Validation error message"
}
```

**Notes:**
- Email validation is required
- Phone number validation is required (8-15 digits)
- Inputs are sanitized to prevent XSS

---

## 📚 Subjects Endpoints

### 7. GET `/api/Subjects?year={year}`

**Purpose:** Get list of subjects for a specific academic year

**Authentication:** Required (JWT Bearer token)

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Query Parameters:**
- `year` (required): Academic year name (e.g., "2024-2025")

**Request Body:** None

**Response (Success - 200):**
```json
[
  {
    "id": "string",
    "subjectName": "string",
    "yearName": "string"
  }
]
```

**Response (Error - 400):**
```json
{
  "message": "Year parameter is required"
}
```

**Notes:**
- Year parameter is sanitized to prevent URL injection

---

### 8. POST `/api/Subjects`

**Purpose:** Create a new subject

**Authentication:** Required (JWT Bearer token)

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Request Body:**
```json
{
  "subjectName": "string",
  "stage": "string"
}
```

**Response (Success - 200/201):**
```json
{
  "id": "string",
  "subjectName": "string",
  "yearName": "string"
}
```

**Response (Error - 400):**
```json
{
  "message": "Validation error message"
}
```

**Notes:**
- `type` must be either "academic" or "competency"
- Subject name is sanitized before saving

---

## 🏫 Classes Endpoints

### 9. GET `/api/Classes?yearId={yearId}`

**Purpose:** Get list of classes for a specific academic year

**Authentication:** Required (JWT Bearer token)

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Query Parameters:**
- `yearId` (required): Academic year identifier (e.g., "2024-2025")

**Request Body:** None

**Response (Success - 200):**
```json
[
  {
    "classId": 1,
    "className": "string"
  }
]
```

**Response (Error - 400):**
```json
{
  "message": "YearId parameter is required"
}
```

**Notes:**
- YearId parameter is sanitized to prevent URL injection using `encodeURIComponent`

---

## 👨‍🏫📚 Teacher Assignments Endpoints

### 10. POST `/api/TeacherAssignments`

**Purpose:** Assign a teacher to a subject in specific classes

**Authentication:** Required (JWT Bearer token)

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Request Body:**
```json
{
  "teacherId": "string",
  "yearId": "string",
  "subjectId": "string",
  "classIds": [1, 2, 3]
}
```

**Response (Success - 200/201):**
```json
{
  "message": "Teacher assigned successfully"
}
```

**Response (Error - 400):**
```json
{
  "message": "All fields are required"
}
```

**Response (Error - 404):**
```json
{
  "message": "Teacher, subject, or class not found"
}
```

**Notes:**
- `classIds` must be a non-empty array
- Must verify existence of teacher, subject, and classes before assignment

---

### 10.1 GET `/api/TeacherAssignments/MyDashboard`

**Purpose:** Return the authenticated teacher's assigned academic years and classes for the `/teacher` dashboard.

**Authentication:** Required (JWT Bearer token - Teacher role)

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Request Body:** None

**Response (Success - 200):**
```json
[
  {
    "yearId": "2024-2025",
    "classes": [
      { "classId": 1, "className": "J1" },
      { "classId": 2, "className": "J2" }
    ]
  },
  {
    "yearId": "2026-2027",
    "classes": [
      { "classId": 9, "className": "S1" }
    ]
  }
]
```

**Response (Error - 401):**
```json
{
  "message": "Unauthenticated"
}
```

**Notes:**
- Must return only years/classes assigned to the logged-in teacher.
- This endpoint is now wired in frontend and is the primary data source for `/teacher`.

---

### 10.2 GET `/api/TeacherAssignments/MyClasses?yearId={yearId}`

**Purpose:** Return teacher classes for one academic year (optional optimization for `/teacher/classes` page).

**Authentication:** Required (JWT Bearer token - Teacher role)

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Query Parameters:**
- `yearId` (required): Academic year ID, e.g. `2024-2025`

**Response (Success - 200):**
```json
[
  { "classId": 1, "className": "J1" },
  { "classId": 2, "className": "J2" }
]
```

**Notes:**
- If implemented, frontend can switch from generic `/api/Classes` to this endpoint for strict teacher-scoped classes.

---

## 🔒 Security Notes

### Authentication
- All endpoints (except `/api/auth/login` and `/api/auth/refresh`) require authentication
- Authentication is done via **JWT Bearer tokens** in the `Authorization` header
- Format: `Authorization: Bearer <accessToken>`
- Access tokens have short expiration (15-60 minutes recommended)
- Refresh tokens have longer expiration (7-30 days recommended)
- Frontend automatically refreshes access tokens when they expire
- If refresh token is invalid/expired, user is automatically logged out

### Token Storage (Frontend)
- **Access Token**: Stored in `localStorage`
- **Refresh Token**: Stored in `localStorage`
- Tokens are never exposed in URLs or logs
- Frontend automatically adds `Authorization` header to all requests

### Input Validation
- All inputs are validated and sanitized
- Validation includes:
  - Required fields presence
  - Input length (prevent buffer overflow)
  - Data types (email, phone, etc.)
  - XSS sanitization (removes `<`, `>`, `"`, `'`)

### Error Handling
- Generic error messages to prevent user enumeration
- No sensitive information is exposed in error messages

---

## 📝 Usage Examples

### Frontend API Calls

#### Authentication
```typescript
import { authService } from "@/services/auth.service";

// Login - automatically stores tokens
const loginResponse = await authService.login({ 
  username: "admin", 
  password: "1234" 
});
// Returns: { accessToken, refreshToken, role }
// Tokens are automatically stored in storage

// Get current user - automatically uses stored access token
const me = await authService.getMe();
// Returns: { userId, role }
// If token expired, automatically refreshes and retries

// Refresh access token manually (usually not needed - automatic)
await authService.refreshAccessToken();

// Logout - clears all tokens
await authService.logout();
```

#### Teachers
```typescript
import { TeachersAPI } from "@/data/teachers.api";
import { api } from "@/services/api"; // or use secureFetch

// Get all teachers - Authorization header added automatically
const teachers = await TeachersAPI.getAll();
// Or using axios directly:
const teachers = await api.get("/Teachers");

// Create teacher - Authorization header added automatically
const newTeacher = await TeachersAPI.create({
  hireDate: new Date().toISOString(),
  department: "General",
  qualifications: "PhD in Mathematics",
  email: "teacher@example.com",
  role: "Teacher",
  phone: "1234567890",
  fullName: {
    firstName: "John",
    middleName: "Doe",
    lastName: "Smith"
  }
});
// Or using axios directly:
const newTeacher = await api.post("/Teachers", { ... });
```

#### Subjects
```typescript
import { SubjectsAPI } from "@/data/subjects.api";
import { api } from "@/services/api";

// Get subjects by year - Authorization header added automatically
const subjects = await SubjectsAPI.getByYear("2024-2025");
// Or using axios directly:
const subjects = await api.get("/Subjects", { 
  params: { year: "2024-2025" } 
});

// Create subject - Authorization header added automatically
const newSubject = await SubjectsAPI.create({
  subjectName: "Mathematics",
  stage: "2024-2025"
});
```

#### Classes
```typescript
import { ClassesAPI } from "@/data/classes.api";
import { api } from "@/services/api";

// Get classes by year - Authorization header added automatically
const classes = await ClassesAPI.getByYear("2024-2025");
// Or using axios directly:
const classes = await api.get("/Classes", { 
  params: { yearId: "2024-2025" } 
});
```

#### Teacher Assignments
```typescript
import { TeacherAssignmentsAPI } from "@/data/teacher-assignments.api";
import { api } from "@/services/api";

// Assign teacher to subject and classes - Authorization header added automatically
await TeacherAssignmentsAPI.create({
  teacherId: "teacher-id-123",
  yearId: "2024-2025",
  subjectId: "subject-id-456",
  classIds: [1, 2, 3]
});
// Or using axios directly:
await api.post("/TeacherAssignments", {
  teacherId: "teacher-id-123",
  yearId: "2024-2025",
  subjectId: "subject-id-456",
  classIds: [1, 2, 3]
});
```

### Automatic Token Refresh

The frontend automatically handles token refresh:

```typescript
// When making any API request, if access token is expired:
// 1. Request fails with 401
// 2. Frontend automatically calls /api/auth/refresh
// 3. New access token is stored
// 4. Original request is retried with new token
// 5. All pending requests are queued during refresh

// This happens transparently - no manual handling needed!
const data = await api.get("/Teachers"); // Token refresh handled automatically
```



## 🧑‍💼 Vice Module Endpoints

### Scope
The following endpoints are specific to vice workflows.  
Core entities (`Teachers`, `Subjects`, `Classes`, `TeacherAssignments`) are already documented above and must be reused (no duplicate APIs).

### 11. GET `/api/vice/dashboard/cards`
**Purpose:** Get dynamic cards for `/vice` dashboard.

**Response (200):**
```json
[
  { "id": 1, "title": "Teacher", "description": "Add teachers and assign them to subjects.", "route": "/vice/teachers" },
  { "id": 2, "title": "Student", "description": "Manage classes and student enrollment.", "route": "/vice/students" },
  { "id": 3, "title": "Grades", "description": "Manage quarter and final grades setup.", "route": "/vice/grades" }
]
```

### 12. GET `/api/vice/students`
**Purpose:** List students with filters.

**Query Parameters:**
- `year` (required): `junior | wheeler | senior`
- `department` (required): `OM | SD`
- `classId` (optional): class ID

**Response (200):**
```json
[
  {
    "id": "st1",
    "studentCode": "2025025",
    "name": "Ahmed Al-Mansouri",
    "department": "OM",
    "className": "J1",
    "year": "junior"
  }
]
```

### 13. POST `/api/vice/students`
**Purpose:** Create student.

**Request Body:**
```json
{
  "firstName": "Ahmed",
  "middleName": "M",
  "lastName": "Ali",
  "studentCode": "2025123",
  "email": "student@example.com",
  "phone": "01000000000",
  "department": "OM",
  "year": "junior",
  "classId": 1
}
```

### 14. PUT `/api/vice/students/{studentId}`
**Purpose:** Update student.

### 15. DELETE `/api/vice/students/{studentId}`
**Purpose:** Delete student.

### 16. GET `/api/vice/grades/quarter/subjects?level={level}`
**Purpose:** List subjects available for quarter grades by level.

### 17. GET `/api/vice/grades/quarter/students`
**Purpose:** Load quarter grade sheet with filters.

**Query Parameters:**
- `level`, `subjectId`, `department`, `classId`

**Response (200):**
```json
{
  "maxQuarterGrades": { "q1": 25, "q2": 25, "q3": 25, "q4": 25 },
  "students": [
    { "studentId": "st1", "studentName": "Ahmed", "q1": 20, "q2": 19, "q3": 18, "q4": 22 }
  ]
}
```

### 18. PUT `/api/vice/grades/quarter/students`
**Purpose:** Save quarter grades in bulk.

### 19. GET `/api/vice/grades/final/students`
**Purpose:** Load final grades table by `level + semester + filters`.

### 20. PUT `/api/vice/grades/final/students`
**Purpose:** Save/update final grades in bulk.

**Request Body:**
```json
{
  "level": "junior",
  "semester": 1,
  "department": "OM",
  "classId": 1,
  "grades": [
    { "studentId": "st1", "score": 78 }
  ]
}
```

### 21. POST `/api/vice/grades/final/submit`
**Purpose:** Submit final grades for approval.

### 22. GET `/api/vice/grades/final/history?studentId={id}&subjectId={id}`
**Purpose:** View final grade edit/audit history.

## 📋 Summary

| Endpoint | Method | Auth Required | Description |
|----------|--------|---------------|-------------|
| `/api/auth/login` | POST | ❌ | User login (returns JWT tokens) |
| `/api/auth/refresh` | POST | ❌ | Refresh access token |
| `/api/auth/me` | GET | ✅ | Current user information |
| `/api/auth/logout` | POST | ❌ | User logout (invalidates refresh token) |
| `/api/Teachers` | GET | ✅ | List of teachers |
| `/api/Teachers` | POST | ✅ | Create new teacher |
| `/api/Subjects` | GET | ✅ | List of subjects (by year) |
| `/api/Subjects` | POST | ✅ | Create new subject |
| `/api/Classes` | GET | ✅ | List of classes (by year) |
| `/api/TeacherAssignments` | POST | ✅ | Assign teacher to subject and classes |
| `/api/TeacherAssignments/MyDashboard` | GET | ✅ | Logged-in teacher years + classes |
| `/api/TeacherAssignments/MyClasses` | GET | ✅ | Logged-in teacher classes by year |
| `/api/vice/dashboard/cards` | GET | ✅ | Vice dashboard cards |
| `/api/vice/students` | GET | ✅ | List students with filters |
| `/api/vice/students` | POST | ✅ | Create student |
| `/api/vice/students/{studentId}` | PUT | ✅ | Update student |
| `/api/vice/students/{studentId}` | DELETE | ✅ | Delete student |
| `/api/vice/grades/quarter/subjects` | GET | ✅ | Quarter subjects by level |
| `/api/vice/grades/quarter/students` | GET | ✅ | Quarter grades sheet |
| `/api/vice/grades/quarter/students` | PUT | ✅ | Save quarter grades |
| `/api/vice/grades/final/students` | GET | ✅ | Final grades sheet |
| `/api/vice/grades/final/students` | PUT | ✅ | Save final grades |
| `/api/vice/grades/final/submit` | POST | ✅ | Submit final grades |
| `/api/vice/grades/final/history` | GET | ✅ | Final grades history |

**Authentication Method:** All protected endpoints use `Authorization: Bearer <accessToken>` header.

---

## 🔄 Token Refresh Flow

1. **User logs in** → Receives `accessToken` and `refreshToken`
2. **Access token expires** → API returns `401 Unauthorized`
3. **Frontend automatically**:
   - Calls `/api/auth/refresh` with `refreshToken`
   - Receives new `accessToken` (and optionally new `refreshToken`)
   - Retries original request with new token
   - Queues any pending requests during refresh
4. **If refresh fails** → User is logged out automatically

---

## ⚠️ Important Notes for Backend Implementation

1. **Login Response**: Must return `accessToken` and `refreshToken` in response body
2. **Refresh Endpoint**: Must accept `refreshToken` in request body and return new tokens
3. **Protected Endpoints**: Must validate `Authorization: Bearer <token>` header
4. **Token Expiration**: Return `401` status when access token is expired/invalid
5. **Logout**: Should invalidate the refresh token on the server

---

**Last Updated:** 2026-04-18

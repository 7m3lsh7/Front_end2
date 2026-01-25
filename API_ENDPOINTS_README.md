# API Endpoints Documentation

This file contains comprehensive documentation for all API Endpoints required in the project.

---

## 🔐 Authentication Endpoints

### 1. POST `/api/auth/login`

**Purpose:** User login

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
- Token is automatically stored in HttpOnly cookie
- Cookie contains flags: `HttpOnly`, `Secure` (in production), `SameSite=Strict`
- Cookie is valid for one hour (3600 seconds)
- Inputs are validated and sanitized before processing

---

### 2. GET `/api/auth/me`

**Purpose:** Get current authenticated user information

**Authentication:** Required (HttpOnly cookie)

**Request Body:** None

**Headers:**
```
Cookie: access_token=<token>
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
- Uses HttpOnly cookie for authentication
- User must be logged in

---

### 3. POST `/api/auth/logout`

**Purpose:** User logout

**Authentication:** Required (HttpOnly cookie)

**Request Body:** None

**Response (Success - 200):**
```json
{
  "message": "Logged out successfully"
}
```

**Notes:**
- Automatically deletes the cookie
- Cookie is removed from the browser

---

## 👨‍🏫 Teachers Endpoints

### 4. GET `/api/teachers`

**Purpose:** Get list of all teachers

**Authentication:** Required (HttpOnly cookie)

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

### 5. POST `/api/teachers`

**Purpose:** Create a new teacher

**Authentication:** Required (HttpOnly cookie)

**Request Body:**
```json
{
  "hireDate": "2024-01-01T00:00:00.000Z",
  "department": "string",
  "qualifications": "string",
  "username": "string",
  "email": "string",
  "role": "Teacher",
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

### 6. GET `/api/subjects?year={yearName}`

**Purpose:** Get list of subjects for a specific academic year

**Authentication:** Required (HttpOnly cookie)

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

### 7. POST `/api/subjects`

**Purpose:** Create a new subject

**Authentication:** Required (HttpOnly cookie)

**Request Body:**
```json
{
  "subjectName": "string",
  "yearName": "string",
  "type": "academic" | "competency"
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

### 8. GET `/api/classes?yearId={yearId}`

**Purpose:** Get list of classes for a specific academic year

**Authentication:** Required (HttpOnly cookie)

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

### 9. POST `/api/teacher-assignments`

**Purpose:** Assign a teacher to a subject in specific classes

**Authentication:** Required (HttpOnly cookie)

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

## 🔒 Security Notes

### Authentication
- All endpoints (except `/api/auth/login`) require authentication
- Authentication is done via HttpOnly cookies
- Cookies contain security flags:
  - `HttpOnly`: Prevents JavaScript access
  - `Secure`: In production only (requires HTTPS)
  - `SameSite=Strict`: Protection against CSRF attacks

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

// Login
const user = await authService.login({ username: "admin", password: "1234" });

// Get current user
const me = await authService.getMe();

// Logout
await authService.logout();
```

#### Teachers
```typescript
import { TeachersAPI } from "@/data/teachers.api";

// Get all teachers
const teachers = await TeachersAPI.getAll();

// Create teacher
const newTeacher = await TeachersAPI.create({
  hireDate: new Date().toISOString(),
  department: "General",
  qualifications: "PhD in Mathematics",
  username: "teacher@example.com",
  email: "teacher@example.com",
  role: "Teacher",
  phone: "1234567890",
  fullName: {
    firstName: "John",
    middleName: "Doe",
    lastName: "Smith"
  }
});
```

#### Subjects
```typescript
import { SubjectsAPI } from "@/data/subjects.api";

// Get subjects by year
const subjects = await SubjectsAPI.getByYear("2024-2025");

// Create subject
const newSubject = await SubjectsAPI.create({
  subjectName: "Mathematics",
  yearName: "2024-2025",
  type: "academic"
});
```

#### Classes
```typescript
import { ClassesAPI } from "@/data/classes.api";

// Get classes by year
const classes = await ClassesAPI.getByYear("2024-2025");
```

#### Teacher Assignments
```typescript
import { TeacherAssignmentsAPI } from "@/data/teacher-assignments.api";

// Assign teacher to subject and classes
await TeacherAssignmentsAPI.create({
  teacherId: "teacher-id-123",
  yearId: "2024-2025",
  subjectId: "subject-id-456",
  classIds: [1, 2, 3]
});
```

---

## 🛠️ Configuration

### API Base URL
The base URL is determined by the environment variable:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

If not specified, the default value will be used: `http://localhost:5000/api`

### secureFetch
All API calls use `secureFetch` from `@/config/api.config`:
- Automatically sends `credentials: "include"`
- Automatically adds `Content-Type: application/json`
- Handles errors uniformly

---

## 📋 Summary

| Endpoint | Method | Auth Required | Description |
|----------|--------|---------------|-------------|
| `/api/auth/login` | POST | ❌ | User login |
| `/api/auth/me` | GET | ✅ | Current user information |
| `/api/auth/logout` | POST | ✅ | User logout |
| `/api/teachers` | GET | ✅ | List of teachers |
| `/api/teachers` | POST | ✅ | Create new teacher |
| `/api/subjects` | GET | ✅ | List of subjects (by year) |
| `/api/subjects` | POST | ✅ | Create new subject |
| `/api/classes` | GET | ✅ | List of classes (by year) |
| `/api/teacher-assignments` | POST | ✅ | Assign teacher to subject and classes |

---

**Last Updated:** 2025-01-25

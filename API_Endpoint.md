

## Authentication

- **Login** sets an **HttpOnly cookie** (session/token). The frontend does not read the cookie; it is sent automatically with subsequent requests.
- **Auth-required endpoints** must return **401 Unauthorized** when the session is invalid or missing. The frontend will then redirect to login or show an error.
- **Logout** must clear the session cookie.

---

## Auth Endpoints

### 1. POST `/auth/login`

Authenticate the user and establish a session.

| Item | Description |
|------|-------------|
| **Request Body** | JSON |
| **Response** | JSON |

**Request Body:**

```json
{
  "username": "string",
  "password": "string"
}
```

**Success Response (200):**

```json
{
  "userId": 1,
  "role": "Admin"
}
```

- **`role`** must be one of: `"Admin"` \| `"Teacher"` \| `"Student"`.
- Backend must set the **HttpOnly** session cookie on success.

**Error:** Return an appropriate HTTP status (e.g. 401) for invalid credentials. The frontend treats non-2xx as login failure.

---

### 2. GET `/auth/me`

Return the currently authenticated user. Used on app load and after login.

| Item | Description |
|------|-------------|
| **Request Body** | None |
| **Headers** | Cookie (session) |
| **Response** | JSON |

**Success Response (200):**

```json
{
  "userId": 1,
  "role": "Student"
}
```

**Error:** Return **401** if not authenticated. The frontend will treat the user as logged out.

---

### 3. POST `/auth/logout`

Invalidate the current session.

| Item | Description |
|------|-------------|
| **Request Body** | None |
| **Headers** | Cookie (session) |

**Success Response (200):**

```json
{
  "message": "Logged out successfully"
}
```

- Backend must **clear the HttpOnly** session cookie.

---

## Student Role Endpoints

All endpoints below require an authenticated user with **role: Student**. Use the same session cookie as above.

---

### 4. GET `/student/cards`

Returns the list of dashboard cards (e.g. Quarter Grades, Final Grades, Competencies) for the student dashboard.

| Item | Description |
|------|-------------|
| **Request Body** | None |
| **Response** | Array of card objects (or wrapper) |

**Success Response (200):**

The frontend accepts any of these shapes:

- Raw array: `[{ "id": 1, "title": "...", ... }, ...]`
- Wrapped: `{ "cards": [...] }` or `{ "data": [...] }`

**Example (raw array):**

```json
[
  {
    "id": 1,
    "title": "Quarter Grades",
    "description": "View your quarterly performance across all subjects.",
    "route": "/student/quarter"
  },
  {
    "id": 2,
    "title": "Final Grades",
    "description": "View your semester final exam grades.",
    "route": "/student/final"
  },
  {
    "id": 3,
    "title": "Competencies Grades",
    "description": "View your specialization competency grades.",
    "route": "/student/jadarat"
  }
]
```

If the endpoint fails or is not implemented, the frontend uses a static fallback and still renders the dashboard.

---

### 5. GET `/student/profile`

Returns the current student’s profile for the dashboard header (name, year label, subtitle).

| Item | Description |
|------|-------------|
| **Request Body** | None |
| **Response** | JSON object |

**Success Response (200):**

```json
{
  "name": "Ahmed",
  "year": "Year 2",
  "subtitle": "Your academic overview",
  "currentAcademicYear": "senior"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Display name |
| `year` | string | No | Year label (e.g. "Year 2") |
| `subtitle` | string | No | Subtitle under the header |
| `currentAcademicYear` | string | No | One of `"junior"` \| `"senior"` \| `"wheeler"`. Used as the default academic year until the student picks one on the Years page. |

If the endpoint fails, the frontend uses default values (e.g. name `"Student"`, empty year).

---

### 6. GET `/student/years`

Returns the list of academic years available for selection (e.g. Junior, Wheeler, Senior).

| Item | Description |
|------|-------------|
| **Request Body** | None |
| **Response** | Array of year options (or wrapper) |

**Success Response (200):**

The frontend accepts:

- Raw array: `[{ "id": "junior", "number": "1", "title": "Junior" }, ...]`
- Wrapped: `{ "years": [...] }` or `{ "data": [...] }`

**Example (raw array):**

```json
[
  { "id": "junior", "number": "1", "title": "Junior" },
  { "id": "wheeler", "number": "2", "title": "Wheeler" },
  { "id": "senior", "number": "3", "title": "Senior" }
]
```

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Must be `"junior"` \| `"senior"` \| `"wheeler"` (used as query param for grades). |
| `number` | string | Display number (e.g. "1", "2"). |
| `title` | string | Display label (e.g. "Junior"). |

If the endpoint fails, the frontend uses a static list.

---

### 7. GET `/student/grades/quarter?year={year}`

Returns quarter grades for the given academic year.

| Item | Description |
|------|-------------|
| **Query** | `year` (required): `junior` \| `senior` \| `wheeler` |
| **Response** | JSON with `grades` array |

**Success Response (200):**

```json
{
  "grades": [
    { "subject": "Mathematics", "yourGrade": 25, "quarterGrade": 25 },
    { "subject": "Physics", "yourGrade": 20, "quarterGrade": 22 }
  ],
  "year": "senior"
}
```

| Field | Type | Description |
|-------|------|-------------|
| `grades` | array | List of grade rows (see below). |
| `year` | string | Echo of the requested year (optional). |

**Grade row:**

| Field | Type | Description |
|-------|------|-------------|
| `subject` | string | Subject name |
| `yourGrade` | number | Student’s grade (e.g. out of 25) |
| `quarterGrade` | number | Quarter grade value |

**Note:** The frontend **calculates the average** from `grades` (average of `yourGrade`). You do not need to send `averageGrade`; if sent, it is ignored.

---

### 8. GET `/student/grades/final?year={year}`

Returns final exam grades for the given academic year. Same contract as **Quarter grades** above.

| Item | Description |
|------|-------------|
| **Query** | `year` (required): `junior` \| `senior` \| `wheeler` |
| **Response** | Same shape as quarter: `{ "grades": [...], "year": "..." }` |

**Grade row:** Same as quarter: `subject`, `yourGrade`, `quarterGrade`.  
Average is computed on the frontend from `yourGrade`.

---

### 9. GET `/student/grades/jadarat?year={year}`

Returns competencies (Jadarat) grades for the given academic year.

| Item | Description |
|------|-------------|
| **Query** | `year` (required): `junior` \| `senior` \| `wheeler` |
| **Response** | JSON with `grades` array |

**Success Response (200):**

```json
{
  "grades": [
    { "Jadarat": "API", "Your_Attemps": "Fail", "Attemps": "Attemp-one" },
    { "Jadarat": "Multi-media", "Your_Attemps": "Pass", "Attemps": "Attemp-two" }
  ],
  "year": "senior"
}
```

| Field | Type | Description |
|-------|------|-------------|
| `Jadarat` | string | Competency / subject name |
| `Your_Attemps` | string | `"Pass"` or `"Fail"` (case-insensitive on frontend) |
| `Attemps` | string | Attempt label (e.g. "Attemp-one") |

**Note:** The frontend **calculates the pass rate** (percentage of `"Pass"`) from `grades`. You do not need to send `averageGrade`.

---

## Data Types (TypeScript)

Reference types used by the frontend (for implementation or codegen):

```ts
// Auth
interface LoginPayload {
  username: string;
  password: string;
}

interface AuthUser {
  userId: number;
  role: "Admin" | "Teacher" | "Student";
}

// Student cards
interface StudentCardApi {
  id: number;
  title: string;
  description: string;
  route: string;
}

// Student profile
interface StudentProfileResponse {
  name: string;
  year?: string;
  subtitle?: string;
  currentAcademicYear?: "junior" | "senior" | "wheeler";
}

// Years list
interface YearOption {
  id: "junior" | "senior" | "wheeler";
  number: string;
  title: string;
}

// Quarter / Final grades
interface QuarterGradeRow {
  subject: string;
  yourGrade: number;
  quarterGrade: number;
}

// Jadarat grades
interface JadaratGradeRow {
  Jadarat: string;
  Your_Attemps: string;
  Attemps: string;
}
```

---

## Summary

| # | Method | Path | Purpose |
|---|--------|------|---------|
| 1 | POST | `/auth/login` | Login, set session cookie |
| 2 | GET | `/auth/me` | Current user (userId, role) |
| 3 | POST | `/auth/logout` | Logout, clear cookie |
| 4 | GET | `/student/cards` | Dashboard cards for student |
| 5 | GET | `/student/profile` | Student name, year, subtitle, currentAcademicYear |
| 6 | GET | `/student/years` | Academic years list (junior/senior/wheeler) |
| 7 | GET | `/student/grades/quarter?year=` | Quarter grades for year |
| 8 | GET | `/student/grades/final?year=` | Final grades for year |
| 9 | GET | `/student/grades/jadarat?year=` | Jadarat (competencies) grades for year |

---


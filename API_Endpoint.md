
## 1. POST /auth/login

    - **Purpose:** Login user
    - **Request Body:**
    ```json
    {
    "username": "string",
    "password": "string"
    }
    Success Response:

    {
    "userId": 1,
    "role": "Admin | Teacher | Student"
    }
    Notes: Backend will set HttpOnly cookie.

## 2. GET /auth/me

    Purpose: Get current logged-in user

    Request Body: None

    Success Response:

    {
    "userId": 1,
    "role": "Admin | Teacher | Student"
    }
    Notes: Uses HttpOnly cookie for auth.

## 3. POST /auth/logout

    Purpose: Logout user

    Request Body: None

    Success Response:

    {
    "message": "Logged out successfully"
    }
    Notes: Backend will clear HttpOnly cookie.
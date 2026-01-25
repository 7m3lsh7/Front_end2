
import type { NextApiRequest, NextApiResponse } from "next";
/**
 * POST /api/auth/login
 * ====================
 * Authentication endpoint responsible for user login.
 *
 * Responsibilities:
 * - Validate user credentials
 * - Generate and issue an authentication token (mocked here)
 * - Store the token in an HttpOnly cookie
 * - Return the user's role to the frontend
 *
 * The frontend never directly accesses the token.
 */

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    const { username, password } = req.body;

    // Input validation
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    // Sanitize inputs
    const sanitizedUsername = String(username).trim();
    const sanitizedPassword = String(password).trim();

    // Length validation
    if (sanitizedUsername.length > 100 || sanitizedPassword.length > 200) {
        return res.status(400).json({ message: "Invalid input length" });
    }

    // Determine if production (HTTPS) or development
    const isProduction = process.env.NODE_ENV === "production";
    const cookieOptions = [
        "HttpOnly",
        "Path=/",
        `Max-Age=3600`,
        isProduction ? "Secure" : "", // Secure flag only in production (HTTPS)
        "SameSite=Strict", // CSRF protection
    ].filter(Boolean).join("; ");

    // Mock validation
    if (sanitizedUsername === "student" && sanitizedPassword === "1234") {
        // Set HttpOnly cookie with security flags
        res.setHeader("Set-Cookie", `access_token=mock-jwt-token; ${cookieOptions}`);
        return res.status(200).json({ role: "Student" });
    }

    if (sanitizedUsername === "teacher" && sanitizedPassword === "1234") {
        res.setHeader("Set-Cookie", `access_token=mock-jwt-token; ${cookieOptions}`);
        return res.status(200).json({ role: "Teacher" });
    }

    if (sanitizedUsername === "admin" && sanitizedPassword === "1234") {
        res.setHeader("Set-Cookie", `access_token=mock-jwt-token; ${cookieOptions}`);
        return res.status(200).json({ role: "Admin" });
    }

    // Generic error message to prevent user enumeration
    return res.status(401).json({ message: "Invalid username or password" });
}

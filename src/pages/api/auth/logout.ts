/**
 * POST /api/auth/logout
 * =====================
 * Endpoint responsible for logging out the current user.
 *
 * Responsibilities:
 * - Invalidate the authentication cookie
 * - Terminate the user's session
 * - Ensure the client is fully unauthenticated
 */

import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    // Determine if production (HTTPS) or development
    const isProduction = process.env.NODE_ENV === "production";
    const cookieOptions = [
        "HttpOnly",
        "Path=/",
        "Max-Age=0",
        isProduction ? "Secure" : "", // Secure flag only in production (HTTPS)
        "SameSite=Strict",
    ].filter(Boolean).join("; ");

    res.setHeader(
        "Set-Cookie",
        `access_token=; ${cookieOptions}`
    );
    return res.status(200).json({ message: "Logged out successfully" });
}

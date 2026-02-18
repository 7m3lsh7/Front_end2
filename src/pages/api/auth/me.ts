/**
 * GET /api/auth/me
 * =================
 * Endpoint for retrieving the currently authenticated user.
 *
 * Responsibilities:
 * - Read and validate the authentication cookie
 * - Resolve the user's identity and role
 * - Return minimal user information required by the frontend
 *
 * This endpoint is the authoritative source
 * for authentication state validation.
 */

import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const { cookies } = req;

    if (cookies.access_token === "mock-jwt-token") {
        // Return mock user
        return res.status(200).json({
            userId: 1,
            role: "Student", 
        });
    }

    return res.status(401).json({ message: "Unauthenticated" });
}

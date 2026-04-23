import { api } from "./api";
import { ProfileData } from "@/types/profile";

export interface ProfileResponse extends ProfileData {
  userId: number;
}

/**
 * Profile service
 * ===============
 * Responsible for fetching the currently authenticated user's profile.
 *
 * The backend should identify the user from the authentication mechanism
 * (cookie / JWT) so the frontend only calls `/profile/me` without IDs.
 */

export const profileService = {
  /**
   * Get current user's profile.
   *
   * GET `${API_BASE_URL}/profile/me`
   */
  async getMyProfile(): Promise<ProfileResponse> {
    // Base URL is already set in axios instance (`src/services/api.ts`)
    const res = await api.get<ProfileResponse>("/Auth/me");
    return res.data;
  },
};


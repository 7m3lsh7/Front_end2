import { API_BASE_URL, secureFetch } from "@/config/api.config";
import { Class } from "@/types/subject.types";

export const ClassesAPI = {
  getByYear(yearId: string): Promise<Class[]> {
    // Sanitize yearId to prevent URL injection
    const sanitizedYearId = encodeURIComponent(yearId);
    return secureFetch(`${API_BASE_URL}/classes?yearId=${sanitizedYearId}`);
  },
};

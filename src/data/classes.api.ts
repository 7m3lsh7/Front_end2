import { API_BASE_URL, secureFetch } from "@/config/api.config";
import { Class } from "@/types/subject.types";
import type { CreateClassPayload } from "@/types/vice/students";

export const ClassesAPI = {
  getByYear(yearId: string): Promise<Class[]> {
    // Sanitize yearId to prevent URL injection
    const sanitizedYearId = encodeURIComponent(yearId);
    return secureFetch(`${API_BASE_URL}/classes?yearId=${sanitizedYearId}`) as Promise<Class[]>;
  },

  create(payload: CreateClassPayload): Promise<Class> {
    return secureFetch(`${API_BASE_URL}/classes`, {
      method: "POST",
      body: JSON.stringify(payload),
    }) as Promise<Class>;
  },
};

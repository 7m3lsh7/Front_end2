import { API_BASE_URL, secureFetch } from "@/config/api.config";
import { Subject, CreateSubjectPayload } from "@/types/subject.types";

export const SubjectsAPI = {
  getByYear(year: string): Promise<Subject[]> {
    return secureFetch(`${API_BASE_URL}/subjects?year=${year}`);
  },

  create(payload: CreateSubjectPayload) {
    return secureFetch(`${API_BASE_URL}/subjects`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
};

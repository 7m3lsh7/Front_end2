import { API_BASE_URL, secureFetch } from "@/config/api.config";
import { Subject, CreateSubjectPayload } from "@/types/subject.types";

export const SubjectsAPI = {
  getByYear(year: string): Promise<Subject[]> {
    return secureFetch(`${API_BASE_URL}/Subjects?year=${encodeURIComponent(year)}`) as Promise<Subject[]>;
  },

  create(payload: CreateSubjectPayload) {
    return secureFetch(`${API_BASE_URL}/Subjects`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
};

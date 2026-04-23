import { API_BASE_URL, secureFetch } from "@/config/api.config";

export interface CreateTeacherAssignmentPayload {
  teacherId: string;
  yearId: string;
  subjectId: string;
  classIds: number[];
}

export const TeacherAssignmentsAPI = {
  create(payload: CreateTeacherAssignmentPayload): Promise<void> {
    return secureFetch(`${API_BASE_URL}/TeacherAssignments`, {
      method: "POST",
      body: JSON.stringify(payload),
    }) as Promise<void>;
  },
};

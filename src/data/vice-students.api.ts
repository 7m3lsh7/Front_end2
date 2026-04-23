import { API_BASE_URL, secureFetch } from "@/config/api.config";
import type {
  CreateViceStudentPayload,
  ViceDepartment,
  ViceLevel,
  ViceStudent,
} from "@/types/vice/students";

export interface ViceStudentsListParams {
  year: ViceLevel;
  department: ViceDepartment;
  classId?: number;
}

export const ViceStudentsAPI = {
  async list(params: ViceStudentsListParams): Promise<ViceStudent[]> {
    const qs = new URLSearchParams();
    qs.set("year", params.year);
    qs.set("department", params.department);
    if (params.classId !== undefined) qs.set("classId", String(params.classId));

    return (await secureFetch(`${API_BASE_URL}/vice/students?${qs.toString()}`)) as ViceStudent[];
  },

  async create(payload: CreateViceStudentPayload): Promise<ViceStudent> {
    return (await secureFetch(`${API_BASE_URL}/vice/students`, {
      method: "POST",
      body: JSON.stringify(payload),
    })) as ViceStudent;
  },

  async update(studentId: string, payload: Partial<CreateViceStudentPayload>): Promise<ViceStudent> {
    return (await secureFetch(`${API_BASE_URL}/vice/students/${encodeURIComponent(studentId)}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    })) as ViceStudent;
  },

  async remove(studentId: string): Promise<void> {
    await secureFetch(`${API_BASE_URL}/vice/students/${encodeURIComponent(studentId)}`, {
      method: "DELETE",
    });
  },
};


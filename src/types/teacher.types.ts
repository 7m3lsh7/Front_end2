export interface Teacher {
  id: string;
  fullName: string;
}

export interface CreateTeacherPayload {
  hireDate: string;
  department: string;
  qualifications: string;
  username: string;
  email: string;
  role: "Teacher";
  phone: string;
  fullName: {
    firstName: string;
    middleName?: string;
    lastName: string;
  };
}

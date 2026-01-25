export interface Subject {
  id: string;
  subjectName: string;
  yearName: string;
}

export interface CreateSubjectPayload {
  subjectName: string;
  yearName: string;
  type:string;
}

export interface Class {
    classId: number;
    className: string;
}
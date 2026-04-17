<<<<<<< HEAD
import { StudentCardApi } from "@/types/Student/Student-api";
=======
import { StudentCardApi } from "@/types/Student-api/Student-api";
>>>>>>> a4e0ea5a8280e355608569163c10e2a29430e494

export const studentCardsApi: StudentCardApi[] = [
  {
    id: 1,
<<<<<<< HEAD
    title: "Teacher",
    description: "Add teachers and assign them to subjects.",
    route: "/ff/teachers",
  },
];
=======
    title: "Quarter Grades",
    description: "View your quarterly performance across all subjects.",
    route: "/student/quarter",
  },
  {
    id: 2,
    title: "Final Grades",
    description: "View your semester final exam grades.",
    route: "/student/final",
  },
  {
    id: 3,
    title: "Competencies Grades",
    description: "View your specialization competency grades.",
    route: "/student/jadarat",
  },
];
>>>>>>> a4e0ea5a8280e355608569163c10e2a29430e494

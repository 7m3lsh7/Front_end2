import { CardData } from "@/types/SharedCard";
import TeacherIcon from "@/icons/book.svg";
import StudentIcon from "@/icons/file.svg";
import { StudentCardApi } from '@/types/Student/Student-api';

export function mapStudentCardsToSharedCards(
  data: StudentCardApi[]
): CardData[] {
  return data.map((item) => ({
    id: item.id.toString(),
    title: item.title,
    description: item.description,
    href: item.route,
    icon:
      item.title === "Teacher"
        ? TeacherIcon
        : StudentIcon,
  }));
}

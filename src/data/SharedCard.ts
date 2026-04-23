import { CardData } from "@/types/SharedCard";
import BookIcon from "@/icons/book.svg";
import UserIcon from "@/icons/file.svg";

export const cardsData: CardData[] = [
  {
    id: "1",
    icon: BookIcon,
    title: "Books",
    description: "All available books",
    href: "/vice/books",
  },
  {
    id: "2",
    icon: UserIcon,
    title: "Students",
    description: "Manage student profiles",
    href: "/vice/students",
  },
];

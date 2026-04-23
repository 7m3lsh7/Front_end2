import { ViceCardApi } from '@/types/vice/vice-api';
import { CardData } from "@/types/SharedCard";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import DescriptionIcon from "@mui/icons-material/Description";
import GradingIcon from "@mui/icons-material/Grading";

export function mapViceCardsToSharedCards(
  data: ViceCardApi[]
): CardData[] {
  return data.map((item) => ({
    id: item.id.toString(),
    title: item.title,
    description: item.description,
    href: item.route,
    icon:
      item.title === "Teacher"
        ? MenuBookIcon
        : item.title === "Grades"
          ? GradingIcon
          : DescriptionIcon,
  }));
}

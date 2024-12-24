import { FieldType } from "@/types/fields";
import {
  LetterText,
  Braces,
  type LucideIcon,
} from "lucide-react";

export const fieldTypes: {
  id: number;
  type: FieldType;
  name: string;
  className: string;
  icon: LucideIcon;
}[] = [
  {
    id: 1,
    type: "string",
    name: "String",
    className: "bg-blue-700",
    icon: LetterText,
  },
  // {
  //   id: 2,
  //   type: "number",
  //   name: "Number",
  //   className: "bg-red-600",
  //   icon: Binary,
  // },
  // {
  //   id: 3,
  //   type: "boolean",
  //   name: "Boolean",
  //   className: "bg-green-700",
  //   icon: ToggleRight,
  // },
  // {
  //   id: 4,
  //   type: "date",
  //   name: "Date",
  //   className: "bg-amber-500",
  //   icon: CalendarCheck2,
  // },
  {
    id: 5,
    type: "enum",
    name: "Enum",
    className: "bg-purple-700",
    icon: Braces,
  },
];

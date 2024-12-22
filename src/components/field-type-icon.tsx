import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

export const FieldTypeIconWrapper = ({
  icon: Icon,
  size = 24,
  className,
}: {
  icon: LucideIcon;
  size?: number;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "font-mono text-xs leading-none font-bold rounded-sm text-white select-none h-11 w-11 flex justify-center items-center",
        className
      )}
    >
      <Icon size={size} />
    </div>
  );
};

import React from "react";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { GripVertical } from "lucide-react";

export const FieldItemWrapper = ({
  id,
  children,
}: {
  id: number;
  children: React.ReactNode;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  return (
    <li
      ref={setNodeRef}
      style={{
        transform: CSS.Translate.toString(transform),
        transition,
        zIndex: isDragging ? 100 : "auto",
        position: isDragging ? "relative" : "static",
      }}
      {...attributes}
      className="rounded-lg bg-white overflow-hidden border border-zinc-200 text-zinc-950 shadow-sm flex gap-3"
    >
      <div
        {...listeners}
        className="cursor-move flex justify-center items-center bg-gray-200 text-zinc-400 h-full w-4"
      >
        <GripVertical />
      </div>
      <div className="h-full w-full pr-3 py-3 space-y-3">
        {children}
      </div>
    </li>
  );
};

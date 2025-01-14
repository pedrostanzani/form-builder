import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function capitalize(input: string): string {
  if (!input) {
    return input;
  }
  return input.charAt(0).toUpperCase() + input.slice(1);
}

export function getUserFieldHTMLId(fieldId: number, field: string) {
  return `user-field-${fieldId}--${field}`;
}

export function generateFieldKey(fieldId: number) {
  return `field_${fieldId}`;
}

export function getMaxId(arr: { id: number }[]) {
  return Math.max(...arr.map((item) => item.id));
}

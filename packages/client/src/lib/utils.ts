import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const AUTO_PDF_OPENAI_API_KEY = "AUTO_PDF_OPENAI_API_KEY";

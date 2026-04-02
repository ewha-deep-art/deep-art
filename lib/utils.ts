import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getFileName(url: string | null | undefined): string {
  return url ? (url.split("/").pop() ?? "없음") : "없음";
}

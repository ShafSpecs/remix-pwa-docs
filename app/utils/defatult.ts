import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export const DEFAULT_TAG = 'main'

export const mergeObjects = <T extends object, U extends object>(firstObj: T, secondObj: U): T & U => {
  return { ...firstObj, ...secondObj };
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


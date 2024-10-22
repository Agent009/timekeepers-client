import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * TRUE if the provided parameter is a non-null object
 * @param {any} object The object to check.
 * @returns {boolean}
 */
export const isObject = (object: unknown): boolean => typeof object === "object" && object !== null;

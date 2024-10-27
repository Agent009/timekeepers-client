import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import path from "path";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * TRUE if the provided parameter is a non-null object
 * @param {any} object The object to check.
 * @returns {boolean}
 */
export const isObject = (object: unknown): boolean => typeof object === "object" && object !== null;

export const getImagesDir = (relative: boolean = true): string => {
  return relative
    ? path.join("images", "nfts").replaceAll("\\", "/")
    : path.join(process.cwd(), "public", "images", "nfts");
};

export const getImagePath = (imageName: string, relative: boolean = true): string => {
  let value = path.join(getImagesDir(relative), imageName);

  if (relative) {
    value = value.replaceAll("\\", "/");
  }

  return value;
};

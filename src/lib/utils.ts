import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import dayjs from "dayjs";
import { EpochRarity } from "@customTypes/index";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getEpochSnapshot() {
  const date = dayjs();
  return {
    second: date.second(),
    minute: date.minute(),
    hour: date.hour(),
    dayOfWeek: date.day(),
    dayOfMonth: date.date(),
    month: date.month(),
    year: date.year(),
    dayName: date.format("dddd"),
    monthName: date.format("MMMM"),
    fullDate: date.format("YYYY-MM-DD"),
    time: date.format("HH:mm"),
    fullDateTime: date.format("YYYY-MM-DD HH:mm"),
    isoDateTime: date.toISOString(),
    unix: date.unix(),
  };
}

export const randomRarity = (): EpochRarity => {
  return (
    Object.values(EpochRarity)[Math.floor(Math.random() * Object.values(EpochRarity).length)] || EpochRarity.Common
  );
};

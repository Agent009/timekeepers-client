import fs from "fs";
import path from "path";
import { EpochData } from "@customTypes/index";

const dataFilePath = path.join("src/app/data.json");
// console.log("server -> utils -> dataFilePath", dataFilePath);

// Function to read data from data.json with filtering options
export const readData = (
  startDate?: string,
  endDate?: string,
  rarity?: string,
  type?: string,
  state?: string,
  status?: string,
): EpochData[] => {
  const rawData = fs.readFileSync(dataFilePath, "utf-8");
  const data: EpochData[] = JSON.parse(rawData);

  return data.filter((entry) => {
    const entryDate = new Date(entry.isoDate);
    const isInDateRange =
      (!startDate || entryDate >= new Date(startDate)) && (!endDate || entryDate <= new Date(endDate));
    const isMatchingRarity = !rarity || entry.rarity === rarity;
    const isMatchingType = !type || entry.type === type;
    const isMatchingState = !state || entry.state === state;
    const isMatchingStatus = !status || entry.status === status;

    return isInDateRange && isMatchingRarity && isMatchingType && isMatchingState && isMatchingStatus;
  });
};

// Function to write data to data.json (append new entry)
export const writeData = (newEntry: EpochData): void => {
  const rawData = fs.readFileSync(dataFilePath, "utf-8");
  const data: EpochData[] = JSON.parse(rawData);

  // Check for existing entry based on type and value
  const existingIndex = data.findIndex((entry) => {
    if (entry.type === "minute") {
      // For minutes, check only ymdDate and value
      return entry.value === newEntry.value && entry.ymdhmDate === newEntry.ymdhmDate;
    } else {
      // For other types, check ymdDate, type, and value
      return entry.type === newEntry.type && entry.value === newEntry.value && entry.ymdDate === newEntry.ymdDate;
    }
  });

  if (existingIndex !== -1) {
    // Update existing entry
    data[existingIndex] = newEntry;
  } else {
    // Add new entry
    data.push(newEntry);
  }

  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), "utf-8");
};

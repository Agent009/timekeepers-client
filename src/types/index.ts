import React from "react";

export enum EpochType {
  Minute = "minute",
  Hour = "hour",
  Day = "day",
  Month = "month",
  Year = "year",
}

export enum EpochState {
  Past = "past",
  Present = "present",
  Future = "future",
}

export enum EpochStatus {
  Active = "active",
  Queued = "queued",
  Generating = "generating",
  Generated = "generated",
}

export enum EpochRarity {
  Common = "common",
  Rare = "rare",
  Epic = "epic",
  Legendary = "legendary",
}

export const rarityGradientColors: Record<EpochRarity, { start: string; end: string }> = {
  [EpochRarity.Common]: { start: "#d3d3d3", end: "#f5f5f5" }, // Light, simple, and neutral for common
  [EpochRarity.Rare]: { start: "#00c6ff", end: "#0072ff" }, // Blue gradient for rarity, evoking a sense of something special
  [EpochRarity.Epic]: { start: "#8a2be2", end: "#4b0082" }, // Deep purple and indigo for epic, indicating prestige and value
  [EpochRarity.Legendary]: { start: "#ffd700", end: "#ff8c00" }, // Gold and orange for legendary, symbolizing something highly valuable and unique
};

export interface EpochSnapshot {
  second: number;
  minute: number;
  hour: number;
  dayOfWeek: number;
  dayOfMonth: number;
  month: number;
  year: number;
  dayName: string;
  monthName: string;
  fullDate: string;
  time: string;
  fullDateTime: string;
  isoDateTime: string;
  unix: number;
}

export interface EpochData {
  type: EpochType;
  value: number;
  isoDate: string; // string in ISO 8601 format
  ymdDate: string; // string in YYYY-MM-DD format
  ymdhmDate: string; // string in YYYY-MM-DD HH:mm format
  state: EpochState;
  status: EpochStatus;
  nft?: string | null;
  rarity?: EpochRarity;
}

export interface TimeCard {
  type: string;
  value: string;
  topText?: string;
  bottomText?: string;
  date: Date;
  minted?: boolean;
  rarity?: EpochRarity;
  status?: EpochStatus;
  nft?: string;
  content?: () => React.ReactNode;
}

export interface TimeCardsResponse {
  cards: TimeCard[];
  pastCards: TimeCard[];
  futureCards: TimeCard[];
}

export interface TimelineEntry {
  title: string;
  subheading?: string;
  titleClass?: string;
  subheadingClass?: string;
  content: React.ReactNode;
}

export interface WriteDataResponse {
  success: boolean;
  updated?: boolean;
  message: string;
}

export type RegisterPayload = {
  email: FormDataEntryValue;
  password: FormDataEntryValue;
  name?: FormDataEntryValue | null;
};

// Define a custom error type for validation errors
export interface ValidationError {
  errors: Record<string, { message: string }>;
}

// Define a custom error type for database errors
export interface DatabaseError {
  code: number;
  message: string;
}

// Define a union type for all possible error types
export type CreateError = ValidationError | DatabaseError | Error;

export interface QueryParams {
  limit?: number;
  sort?: Record<string, 1 | -1>;
  skip?: number;
}

export interface UpdateOptions {
  new?: boolean; // Return the modified document rather than the original
  upsert?: boolean; // Create the document if it doesn't exist
  runValidators?: boolean; // Run validators on update
  context?: string; // Query context
}

export type UpsertResult<T> = {
  success: boolean;
  updated: boolean;
  document: T;
};

export enum NewsCategory {
  General = "general",
  Sports = "sports",
  Science = "science",
  Technology = "technology",
  Entertainment = "entertainment",
}

export interface NewsArticle {
  title: string;
  description: string;
}

export interface MintDataResponse {
  epochType: EpochType;
  startDate: string;
  endDate: string;
  category: string;
  articles: NewsArticle[];
}

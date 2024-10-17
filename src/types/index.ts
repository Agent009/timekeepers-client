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

export type UpsertResult<T> = {
  success: boolean;
  updated: boolean;
  document: T;
};

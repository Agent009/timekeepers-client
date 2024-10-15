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

export interface TimeCard {
  title: string;
  description: string;
  topText?: string;
  bottomText?: string;
  date: Date;
  minted?: boolean;
  rarity?: EpochRarity;
  status?: EpochStatus;
  nft?: string;
  content?: () => React.ReactNode;
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

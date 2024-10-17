import React from "react";
import { EpochData, EpochRarity, EpochStatus, EpochType, TimeCard } from "@customTypes/index";
import dayjs from "dayjs";
import { getFutureEpochs } from "@lib/epochUtils.ts";

export const generateCard = (
  epochType: EpochType,
  currentVal: number,
  ymdhmDate: string,
  epochData?: EpochData,
  content?: () => React.ReactNode,
): TimeCard => {
  let bottomText = "";
  const date = dayjs(ymdhmDate);

  switch (epochType) {
    case EpochType.Minute:
      bottomText = date.format("HH:mm");
      break;
    case EpochType.Hour:
      bottomText = date.format("DD/MM");
      break;
    case EpochType.Day:
      bottomText = date.format("YYYY-MM-DD");
      break;
    case EpochType.Month:
      bottomText = date.format("YYYY-MM");
      break;
    case EpochType.Year:
      bottomText = "Another year";
      break;
    default:
      throw new Error(`Unsupported epoch type: ${epochType}`);
  }

  return {
    title: String(currentVal),
    description: epochType,
    topText: epochType,
    bottomText: bottomText,
    date: new Date(ymdhmDate),
    minted: EpochStatus.Generated === epochData?.status,
    rarity: epochData?.rarity || EpochRarity.Common,
    status: epochData?.status ?? EpochStatus.Queued,
    nft: epochData?.nft || undefined,
    content: content || generateCardContent(epochType, currentVal, ymdhmDate),
  };
};

export const generateCardContent = (
  epochType: EpochType,
  currentVal: number,
  ymdhmDate: string,
): (() => React.ReactNode) => {
  return () => (
    <div>
      <p>Next {epochType}.</p>
      <p>{ymdhmDate}</p>
    </div>
  );
};

export const getTimeCards = (epochType: EpochType, currentVal: number, ymdhmDate: string, epochData: EpochData[]) => {
  const maxBefore = 2;
  const maxAfter = 2;
  const pastCards: TimeCard[] = [];
  const futureCards: TimeCard[] = getFutureCards(epochType, ymdhmDate, maxAfter);
  const filteredEpochs =
    (epochData &&
      epochData.length > 0 &&
      epochData
        // Filter epochs based on the current value and the maximum allowed difference before the current value
        .filter((epoch) => {
          return (
            epoch.type === epochType && epoch.ymdhmDate === ymdhmDate && Math.abs(epoch.value - currentVal) <= maxBefore
          );
        })
        // Sort in descending order
        ?.sort((a, b) => {
          return a.ymdhmDate.localeCompare(b.ymdhmDate);
        })) ||
    [];

  // Generate cards for epochs before the current value
  for (let i = 0; i < maxBefore; i++) {
    const epoch = filteredEpochs[i];

    if (epoch) {
      // Fetch from existing data if present
      pastCards.push(generateCard(epochType, epoch.value, epoch.ymdhmDate, epoch));
    } else {
      // Or else generate a placeholder card
      pastCards.push(generateCard(epochType, currentVal - i - 1, ymdhmDate));
    }
  }

  return {
    // Combine past and future cards into a single array
    cards: [...pastCards, ...futureCards] as TimeCard[],
    pastCards,
    futureCards,
  };
};

/**
 * Generate placeholder cards for upcoming epochs
 * @param epochType
 * @param amount
 * @param ymdhmDate
 */
export const getFutureCards = (epochType: EpochType, ymdhmDate: string, amount: number = 2) => {
  const futureEpochs = getFutureEpochs(epochType, ymdhmDate, amount);
  const futureCards: TimeCard[] = [];

  futureEpochs.forEach((epoch) => {
    futureCards.push(generateCard(epochType, epoch.value, epoch.ymdhmDate, epoch));
  });

  return futureCards;
};

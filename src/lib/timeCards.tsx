import React from "react";
import dayjs from "dayjs";
import {
  EpochData,
  EpochRarity,
  EpochState,
  EpochStatus,
  EpochType,
  TimeCard,
  TimeCardsResponse,
} from "@customTypes/index";
import { getFutureEpochs, isSameEpoch } from "@lib/epochUtils";

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
    type: epochType,
    value: String(currentVal),
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

export const getTimeCards = (
  epochType: EpochType,
  currentVal: number,
  ymdhmDate: string,
  epochData: EpochData[],
): TimeCardsResponse => {
  const maxBefore = 2;
  const maxAfter = 2;
  const pastCards: TimeCard[] = [];
  const futureCards: TimeCard[] = getFutureCards(epochType, ymdhmDate, maxAfter, epochData);
  const filteredEpochs = getFilteredEpochs(epochType, EpochState.Past, ymdhmDate, maxBefore, epochData);
  // console.log("timeCards -> getTimeCards -> epoch", epochType, currentVal, "filteredEpochs", filteredEpochs);

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

export const getFilteredEpochs = (
  epochType: EpochType,
  epochState: EpochState,
  ymdhmDate: string,
  amount: number = 2,
  epochData: EpochData[],
) => {
  return (
    (epochData &&
      epochData.length > 0 &&
      epochData
        // Filter epochs based on the current value and the maximum allowed difference before/after the current value
        .filter((epoch) => {
          const date = dayjs(ymdhmDate);
          const matchType = epoch.type === epochType;
          const matchDate =
            epochState === EpochState.Past
              ? dayjs(epoch.ymdhmDate).diff(date, epochType) <= amount && epoch.ymdhmDate.localeCompare(ymdhmDate) < 0
              : dayjs(epoch.ymdhmDate).diff(date, epochType) <= amount && epoch.ymdhmDate.localeCompare(ymdhmDate) > 0;
          return matchType && matchDate;
        })
        // Sort in descending order
        ?.sort((a, b) => {
          return b.ymdhmDate.localeCompare(a.ymdhmDate);
        })) ||
    []
  );
};

/**
 * Generate placeholder cards for upcoming epochs
 * @param epochType
 * @param amount
 * @param ymdhmDate
 * @param epochData
 */
export const getFutureCards = (epochType: EpochType, ymdhmDate: string, amount: number = 2, epochData: EpochData[]) => {
  const filteredEpochs = getFilteredEpochs(epochType, EpochState.Future, ymdhmDate, amount, epochData);
  const futureEpochs = getFutureEpochs(epochType, ymdhmDate, amount);
  const futureCards: TimeCard[] = [];
  console.log("timeCards -> getFutureCards -> type", epochType, "filtered", filteredEpochs, "future", futureEpochs);
  futureEpochs.forEach((epoch) => {
    const existing = filteredEpochs.find((e) => isSameEpoch(epochType, epoch, e));

    if (existing) {
      // Fetch from existing data if present
      futureCards.push(generateCard(epochType, existing.value, existing.ymdhmDate, existing));
    } else {
      // Or else generate a placeholder card
      futureCards.push(generateCard(epochType, epoch.value, epoch.ymdhmDate, epoch));
    }
  });

  return futureCards;
};

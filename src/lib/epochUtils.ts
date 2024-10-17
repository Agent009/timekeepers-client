import dayjs from "dayjs";
import { EpochData, EpochRarity, EpochSnapshot, EpochState, EpochStatus, EpochType } from "@customTypes/index";

export const getEpochSnapshot = (): EpochSnapshot => {
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
};

export const randomRarity = (): EpochRarity => {
  return (
    Object.values(EpochRarity)[Math.floor(Math.random() * Object.values(EpochRarity).length)] || EpochRarity.Common
  );
};

/**
 * Get the current epoch data based on the current snapshot and epoch type
 * @param epochType
 * @param snapshot
 */
export const getCurrentEpoch = (epochType: EpochType, snapshot: EpochSnapshot) => {
  return {
    type: epochType,
    value:
      epochType === EpochType.Minute
        ? snapshot.minute
        : epochType === EpochType.Hour
          ? snapshot.hour
          : epochType === EpochType.Day
            ? snapshot.dayOfMonth
            : epochType === EpochType.Month
              ? snapshot.month
              : snapshot.year,
    isoDate: snapshot.isoDateTime,
    ymdDate: snapshot.fullDate,
    ymdhmDate: snapshot.fullDateTime,
    state: EpochState.Past,
    status: EpochStatus.Queued,
    rarity: randomRarity(),
  };
};

/**
 * Generate upcoming epochs
 * @param epochType
 * @param amount
 * @param ymdhmDate
 */
export const getFutureEpochs = (epochType: EpochType, ymdhmDate: string, amount: number = 2) => {
  const futureEpochs: EpochData[] = [];
  let date = dayjs(ymdhmDate);
  let newVal = 0;

  for (let i = 0; i < amount; i++) {
    if (epochType === EpochType.Minute) {
      date = date.add(1, "minute");
      newVal = date.minute();
    } else if (epochType === EpochType.Hour) {
      date = date.add(1, "hour");
      newVal = date.hour();
    } else if (epochType === EpochType.Day) {
      date = date.add(1, "day");
      newVal = date.date();
    } else if (epochType === EpochType.Month) {
      date = date.add(1, "month");
      newVal = date.month();
    } else if (epochType === EpochType.Year) {
      date = date.add(1, "year");
      newVal = date.year();
    }

    futureEpochs.push({
      type: epochType,
      value: newVal,
      isoDate: date.toISOString(),
      ymdDate: date.format("YYYY-MM-DD"),
      ymdhmDate: date.format("YYYY-MM-DD HH:mm"),
      state: EpochState.Future,
      status: EpochStatus.Queued,
      // TODO: Add logic for determining rarity based on epoch type and value and other factors
      rarity: randomRarity(),
    });
  }

  return futureEpochs;
};

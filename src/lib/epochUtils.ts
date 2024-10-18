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
 * Get the epoch value based on the epoch type and snapshot
 * @param epochType
 * @param snapshot
 */
export const getEpochValueFromSnapshot = (epochType: EpochType, snapshot: EpochSnapshot): number => {
  return epochType === EpochType.Minute
    ? snapshot.minute
    : epochType === EpochType.Hour
      ? snapshot.hour
      : epochType === EpochType.Day
        ? snapshot.dayOfMonth
        : epochType === EpochType.Month
          ? snapshot.month
          : snapshot.year;
};

/**
 * Get the current epoch data based on the current snapshot and epoch type
 * @param epochType
 * @param snapshot
 * @param data
 */
export const getCurrentEpoch = (epochType: EpochType, snapshot: EpochSnapshot, data?: EpochData[]) => {
  const value = getEpochValueFromSnapshot(epochType, snapshot);
  const epochData: EpochData | undefined = data?.find(
    (d) => d.type === epochType && d.value === value && d.ymdhmDate === snapshot.fullDateTime,
  );
  return {
    type: epochType,
    value: value,
    isoDate: snapshot.isoDateTime,
    ymdDate: snapshot.fullDate,
    ymdhmDate: snapshot.fullDateTime,
    state: EpochState.Past,
    status: EpochStatus.Queued,
    rarity: (epochData && epochData.rarity) || randomRarity(),
  };
};

/**
 * Compare two epochs and return true if they are the same type and value
 * @param t
 * @param a
 * @param b
 */
export const isSameEpoch = (t: EpochType, a: EpochData, b: EpochData) => {
  const matchType = a.type === b.type;
  const matchValue = a.value === b.value;
  const matchDate = t === EpochType.Minute ? a.ymdhmDate === b.ymdhmDate : a.ymdDate === b.ymdDate;
  return matchType && matchValue && matchDate;
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

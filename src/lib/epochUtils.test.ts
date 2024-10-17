import { getEpochSnapshot, getFutureEpochs } from "./epochUtils";
import { EpochState, EpochStatus, EpochType } from "@customTypes/index";

describe("Utils", () => {
  describe("getEpochSnapshot function", () => {
    it("should return the correct epoch snapshot", () => {
      const data = getEpochSnapshot();
      // console.log("utils -> test -> getEpochSnapshot", data);
      const date = new Date();

      expect(data.minute).toBe(date.getMinutes());
    });
  });

  describe("getFutureEpochs function", () => {
    it("should return the correct future epochs for minutes", () => {
      const data = getFutureEpochs(EpochType.Minute, "2023-12-31 23:58", 2);
      // console.log("utils -> test -> getFutureEpochs(minute)", data);

      expect(data.length).toBe(2);
      expect(data[0]!.type).toBe(EpochType.Minute);
      expect(data[0]!.state).toBe(EpochState.Future);
      expect(data[0]!.status).toBe(EpochStatus.Queued);
      expect(data[0]!.value).toBe(59);
      expect(data[0]!.isoDate).toBe("2023-12-31T23:59:00.000Z");
      expect(data[0]!.ymdDate).toBe("2023-12-31");
      expect(data[0]!.ymdhmDate).toBe("2023-12-31 23:59");
      expect(data[1]!.value).toBe(0);
      expect(data[1]!.isoDate).toBe("2024-01-01T00:00:00.000Z");
      expect(data[1]!.ymdDate).toBe("2024-01-01");
      expect(data[1]!.ymdhmDate).toBe("2024-01-01 00:00");
    });
    it("should return the correct future epochs for hours", () => {
      const data = getFutureEpochs(EpochType.Hour, "2023-12-31 23:58", 2);
      // console.log("utils -> test -> getFutureEpochs(hour)", data);

      expect(data.length).toBe(2);
      expect(data[0]!.type).toBe(EpochType.Hour);
      expect(data[0]!.value).toBe(0);
      expect(data[0]!.isoDate).toBe("2024-01-01T00:58:00.000Z");
      expect(data[0]!.ymdDate).toBe("2024-01-01");
      expect(data[0]!.ymdhmDate).toBe("2024-01-01 00:58");
      expect(data[1]!.value).toBe(1);
      expect(data[1]!.isoDate).toBe("2024-01-01T01:58:00.000Z");
      expect(data[1]!.ymdDate).toBe("2024-01-01");
      expect(data[1]!.ymdhmDate).toBe("2024-01-01 01:58");
    });
    it("should return the correct future epochs for days", () => {
      const data = getFutureEpochs(EpochType.Day, "2023-12-30 23:58", 2);
      // console.log("utils -> test -> getFutureEpochs(day)", data);

      expect(data.length).toBe(2);
      expect(data[0]!.type).toBe(EpochType.Day);
      expect(data[0]!.value).toBe(31);
      expect(data[0]!.isoDate).toBe("2023-12-31T23:58:00.000Z");
      expect(data[0]!.ymdDate).toBe("2023-12-31");
      expect(data[0]!.ymdhmDate).toBe("2023-12-31 23:58");
      expect(data[1]!.value).toBe(1);
      expect(data[1]!.isoDate).toBe("2024-01-01T23:58:00.000Z");
      expect(data[1]!.ymdDate).toBe("2024-01-01");
      expect(data[1]!.ymdhmDate).toBe("2024-01-01 23:58");
    });
    it("should return the correct future epochs for months", () => {
      const data = getFutureEpochs(EpochType.Month, "2023-11-30 23:58", 2);
      // console.log("utils -> test -> getFutureEpochs(month)", data);

      expect(data.length).toBe(2);
      expect(data[0]!.type).toBe(EpochType.Month);
      expect(data[0]!.value).toBe(11); // 11 = December
      expect(data[0]!.isoDate).toBe("2023-12-30T23:58:00.000Z");
      expect(data[0]!.ymdDate).toBe("2023-12-30");
      expect(data[0]!.ymdhmDate).toBe("2023-12-30 23:58");
      expect(data[1]!.value).toBe(0); // 0 = January
      expect(data[1]!.isoDate).toBe("2024-01-30T23:58:00.000Z");
      expect(data[1]!.ymdDate).toBe("2024-01-30");
      expect(data[1]!.ymdhmDate).toBe("2024-01-30 23:58");
    });
    it("should return the correct future epochs for years", () => {
      const data = getFutureEpochs(EpochType.Year, "2023-11-30 23:58", 3);
      // console.log("utils -> test -> getFutureEpochs(year)", data);

      expect(data.length).toBe(3);
      expect(data[0]!.type).toBe(EpochType.Year);
      expect(data[0]!.value).toBe(2024);
      expect(data[0]!.isoDate).toBe("2024-11-30T23:58:00.000Z");
      expect(data[0]!.ymdDate).toBe("2024-11-30");
      expect(data[0]!.ymdhmDate).toBe("2024-11-30 23:58");
      expect(data[1]!.value).toBe(2025);
      expect(data[1]!.isoDate).toBe("2025-11-30T23:58:00.000Z");
      expect(data[1]!.ymdDate).toBe("2025-11-30");
      expect(data[1]!.ymdhmDate).toBe("2025-11-30 23:58");
      expect(data[2]!.value).toBe(2026);
      expect(data[2]!.ymdhmDate).toBe("2026-11-30 23:58");
    });
  });
});

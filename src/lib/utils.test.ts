import { getEpochSnapshot } from "./utils";

describe("Utils", () => {
  describe("epochData function", () => {
    it("should return the correct epoch data", () => {
      const data = getEpochSnapshot();
      console.log("utils -> test -> getEpochData", data);
      const date = new Date();

      expect(data.minute).toBe(date.getMinutes());
    });
  });
});

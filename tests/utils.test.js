import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import { convertStringBigIntsToBigInts } from "../src/utils.ts";

describe("utils", () => {
  describe("convertStringBigIntsToBigInts", () => {
    afterEach(() => {
      vi.restoreAllMocks();
      vi.unstubAllGlobals();
    });

    it("should return null if input is null", () => {
      expect(convertStringBigIntsToBigInts(null)).toBeNull();
    });

    it("should return the value if input is not an object", () => {
      expect(convertStringBigIntsToBigInts("string")).toBe("string");
      expect(convertStringBigIntsToBigInts(123)).toBe(123);
      expect(convertStringBigIntsToBigInts(true)).toBe(true);
      expect(convertStringBigIntsToBigInts(undefined)).toBeUndefined();
    });

    it("should convert numeric strings to BigInt in an object", () => {
      const input = {
        id: "12345678901234567890",
        small: "123",
        name: "test",
      };
      const expected = {
        id: 12345678901234567890n,
        small: 123n,
        name: "test",
      };
      expect(convertStringBigIntsToBigInts(input)).toEqual(expected);
    });

    it("should recursively convert nested objects", () => {
      const input = {
        data: {
          id: "9876543210",
          meta: {
            count: "42",
          },
        },
      };
      const expected = {
        data: {
          id: 9876543210n,
          meta: {
            count: 42n,
          },
        },
      };
      expect(convertStringBigIntsToBigInts(input)).toEqual(expected);
    });

    it("should handle arrays by mapping them", () => {
      const input = ["123", { id: "456" }, "abc"];
      const expected = ["123", { id: 456n }, "abc"];
      expect(convertStringBigIntsToBigInts(input)).toEqual(expected);
    });

    it("should keep value as string if BigInt conversion throws error", () => {
      const originalBigInt = global.BigInt;
      const mockBigInt = vi.fn((val) => {
        if (val === "999") {
          throw new Error("Mock Error");
        }
        return originalBigInt(val);
      });
      vi.stubGlobal("BigInt", mockBigInt);

      const input = {
        val: "999",
        other: "123",
      };

      const expected = {
        val: "999",
        other: 123n,
      };

      expect(convertStringBigIntsToBigInts(input)).toEqual(expected);
    });
  });
});

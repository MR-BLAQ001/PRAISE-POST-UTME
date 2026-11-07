import { describe, expect, it } from "vitest";
import {
  average,
  clamp,
  dateKey,
  formatDuration,
  initials,
  parseCSV,
  percentage,
  ratingFor,
  truncate
} from "@/lib/utils";
import { formatCountdown } from "@/lib/exam";
import { validateEmail, validatePassword, validateUsername } from "@/lib/auth-copy";

describe("number helpers", () => {
  it("clamps values into a range", () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-3, 0, 10)).toBe(0);
    expect(clamp(30, 0, 10)).toBe(10);
  });

  it("computes rounded percentages safely", () => {
    expect(percentage(1, 3)).toBe(33);
    expect(percentage(2, 3)).toBe(67);
    expect(percentage(5, 0)).toBe(0);
  });

  it("averages values and handles empty arrays", () => {
    expect(average([10, 20, 30])).toBe(20);
    expect(average([])).toBe(0);
  });
});

describe("formatting helpers", () => {
  it("formats durations for timers and summaries", () => {
    expect(formatDuration(0)).toBe("00:00");
    expect(formatDuration(65)).toBe("01:05");
    expect(formatDuration(3725)).toBe("1h 02m");
    expect(formatCountdown(65)).toBe("01:05");
    expect(formatCountdown(3725)).toBe("1:02:05");
    expect(formatCountdown(-10)).toBe("00:00");
  });

  it("builds initials from the first two name parts", () => {
    expect(initials("Praise Admin")).toBe("PA");
    expect(initials("ada")).toBe("A");
    expect(initials("  ")).toBe("");
  });

  it("creates local calendar keys", () => {
    expect(dateKey(new Date(2026, 10, 6))).toBe("2026-11-06");
    expect(dateKey(new Date(2026, 0, 9))).toBe("2026-01-09");
  });

  it("maps scores to honest rating labels", () => {
    expect(ratingFor(95).tone).toBe("excellent");
    expect(ratingFor(75).tone).toBe("good");
    expect(ratingFor(60).tone).toBe("fair");
    expect(ratingFor(20).tone).toBe("poor");
  });

  it("truncates long text with an ellipsis", () => {
    expect(truncate("abcdefghij", 5)).toBe("abcd…");
    expect(truncate("abc", 5)).toBe("abc");
  });
});

describe("parseCSV", () => {
  it("parses simple rows and ignores blank lines", () => {
    expect(parseCSV("a,b,c\n1,2,3\n\n")).toEqual([
      ["a", "b", "c"],
      ["1", "2", "3"]
    ]);
  });

  it("handles quoted commas, escaped quotes and embedded newlines", () => {
    const rows = parseCSV('a,"b,c",d\n"line\nbreak","quote ""here""",3');
    expect(rows).toEqual([
      ["a", "b,c", "d"],
      ["line\nbreak", 'quote "here"', "3"]
    ]);
  });

  it("supports CRLF line endings", () => {
    expect(parseCSV("a,b\r\n1,2\r\n")).toEqual([
      ["a", "b"],
      ["1", "2"]
    ]);
  });
});

describe("auth validation copy", () => {
  it("validates passwords", () => {
    expect(validatePassword("short")).not.toBeNull();
    expect(validatePassword("alllettersonly")).not.toBeNull();
    expect(validatePassword("12345678")).not.toBeNull();
    expect(validatePassword("Demo123!")).toBeNull();
  });

  it("validates emails", () => {
    expect(validateEmail("student@praise.ng")).toBeNull();
    expect(validateEmail("not-an-email")).not.toBeNull();
    expect(validateEmail("missing@domain")).not.toBeNull();
  });

  it("validates usernames", () => {
    expect(validateUsername("demo_scholar")).toBeNull();
    expect(validateUsername("ab")).not.toBeNull();
    expect(validateUsername("has space")).not.toBeNull();
    expect(validateUsername("symbols!")).not.toBeNull();
  });
});

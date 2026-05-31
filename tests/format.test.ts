import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  calculateDiscountPercent,
  formatCurrency,
  toTitleCase,
} from "../src/lib/format";

describe("format helpers", () => {
  it("formats cents as whole-dollar USD", () => {
    assert.equal(formatCurrency(129900), "$1,299");
  });

  it("calculates sale discount percentages", () => {
    assert.equal(calculateDiscountPercent(100000, 75000), 25);
    assert.equal(calculateDiscountPercent(100000, 100000), null);
    assert.equal(calculateDiscountPercent(100000, null), null);
  });

  it("converts slugs to title case", () => {
    assert.equal(toTitleCase("premium-tech-market"), "Premium Tech Market");
  });
});

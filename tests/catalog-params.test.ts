import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { parseProductFilters } from "../src/lib/catalog-params";

describe("parseProductFilters", () => {
  it("normalizes product filters from search params", () => {
    const filters = parseProductFilters({
      brand: "greenline",
      category: "laptops",
      inStock: "true",
      maxPrice: "2499.99",
      minPrice: "100",
      search: "creator laptop",
      sort: "price-desc",
    });

    assert.deepEqual(filters, {
      brand: "greenline",
      category: "laptops",
      inStock: true,
      maxPrice: 249999,
      minPrice: 10000,
      search: "creator laptop",
      sort: "price-desc",
    });
  });

  it("ignores invalid price and sort values", () => {
    const filters = parseProductFilters({
      maxPrice: "-20",
      minPrice: "not-a-number",
      sort: "random",
    });

    assert.equal(filters.maxPrice, undefined);
    assert.equal(filters.minPrice, undefined);
    assert.equal(filters.sort, "featured");
  });

  it("allows route-specific filter overrides", () => {
    const filters = parseProductFilters(
      {
        category: "phones",
        search: "camera",
      },
      {
        category: "cameras",
      },
    );

    assert.equal(filters.category, "cameras");
    assert.equal(filters.search, "camera");
  });
});

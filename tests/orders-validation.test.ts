import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { checkoutSchema, orderStatusLabel } from "../src/lib/orders/validation";

describe("checkoutSchema", () => {
  it("requires delivery address fields for delivery orders", () => {
    const result = checkoutSchema.safeParse({
      addressLine1: "",
      addressLine2: "",
      cityParishState: "",
      country: "",
      deliveryMethod: "DELIVERY",
      email: "customer@example.com",
      fullName: "Customer One",
      notes: "",
      phone: "555-0100",
    });

    assert.equal(result.success, false);
    assert.deepEqual(result.error.flatten().fieldErrors.addressLine1, [
      "Address line 1 is required for delivery.",
    ]);
    assert.deepEqual(result.error.flatten().fieldErrors.cityParishState, [
      "City, town, parish, or state is required for delivery.",
    ]);
    assert.deepEqual(result.error.flatten().fieldErrors.country, [
      "Country is required for delivery.",
    ]);
  });

  it("allows pickup orders without delivery address fields", () => {
    const result = checkoutSchema.safeParse({
      addressLine1: "",
      addressLine2: "",
      cityParishState: "",
      country: "",
      deliveryMethod: "PICKUP",
      email: "CUSTOMER@EXAMPLE.COM",
      fullName: "Customer One",
      notes: "",
      phone: "555-0100",
    });

    assert.equal(result.success, true);
    assert.equal(result.data.email, "customer@example.com");
  });
});

describe("orderStatusLabel", () => {
  it("formats enum labels for display", () => {
    assert.equal(orderStatusLabel("READY_FOR_PICKUP"), "Ready For Pickup");
    assert.equal(orderStatusLabel("PENDING"), "Pending");
  });
});

import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test("landing page loads with title and hero", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Magpie Industries/);
    await expect(page.getByText("Magpie Industries SC")).toBeVisible();
  });

  test("navbar links navigate to correct pages", async ({ page }) => {
    await page.goto("/");

    // Navigate to Mining Calculator
    await page.getByRole("link", { name: "Mining" }).click();
    await expect(page).toHaveURL(/\/tools\/mining/);
    await expect(page.getByText("Mining Calculator")).toBeVisible();

    // Navigate to Ships
    await page.getByRole("link", { name: "Ships" }).click();
    await expect(page).toHaveURL(/\/ships/);
    await expect(page.getByText("Ship Database")).toBeVisible();

    // Navigate to Locations
    await page.getByRole("link", { name: "Locations" }).click();
    await expect(page).toHaveURL(/\/locations/);
    await expect(page.getByText("Locations Database")).toBeVisible();
  });

  test("sign in page loads", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Sign In" }).click();
    await expect(page).toHaveURL(/\/auth\/signin/);
    await expect(page.getByText("Sign In")).toBeVisible();
  });

  test("sign up page loads", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Sign Up" }).click();
    await expect(page).toHaveURL(/\/auth\/signup/);
    await expect(page.getByText("Sign Up")).toBeVisible();
  });
});

test.describe("Search Palette", () => {
  test("search palette opens with Ctrl+K", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Control+k");
    await expect(page.getByPlaceholder(/search/i)).toBeVisible();
  });
});

test.describe("Tools", () => {
  test("mining calculator allows ore selection", async ({ page }) => {
    await page.goto("/tools/mining");
    await expect(page.getByText("Mining Calculator")).toBeVisible();
    // Page should display ore data
    await expect(page.getByText("Quantanium")).toBeVisible();
  });

  test("salvage calculator shows ship list", async ({ page }) => {
    await page.goto("/tools/salvage");
    await expect(page.getByText("Salvage Calculator")).toBeVisible();
    await expect(page.getByText("Aurora MR")).toBeVisible();
  });

  test("refinery optimizer shows methods", async ({ page }) => {
    await page.goto("/tools/refinery");
    await expect(page.getByText("Refinery Optimizer")).toBeVisible();
    await expect(page.getByText("Cormack Method")).toBeVisible();
  });

  test("trade planner loads", async ({ page }) => {
    await page.goto("/tools/trade");
    await expect(page.getByText("Trade Route Planner")).toBeVisible();
  });

  test("loadout planner loads with ship selector", async ({ page }) => {
    await page.goto("/tools/loadout");
    await expect(page.getByText("Loadout Planner")).toBeVisible();
  });

  test("profit simulator loads with presets", async ({ page }) => {
    await page.goto("/tools/profit");
    await expect(page.getByText("Profit Simulator")).toBeVisible();
  });
});

test.describe("Ships", () => {
  test("ship comparison page loads", async ({ page }) => {
    await page.goto("/ships/compare");
    await expect(page.getByText("Ship Comparison")).toBeVisible();
    await expect(page.getByLabel("Select ship 1")).toBeVisible();
    await expect(page.getByLabel("Select ship 2")).toBeVisible();
    await expect(page.getByLabel("Select ship 3")).toBeVisible();
  });

  test("ship comparison page is linked from ships page", async ({ page }) => {
    await page.goto("/ships");
    await page.getByRole("link", { name: "Compare Ships" }).click();
    await expect(page).toHaveURL(/\/ships\/compare/);
    await expect(page.getByText("Ship Comparison")).toBeVisible();
  });
});

test.describe("Community", () => {
  test("friends page loads", async ({ page }) => {
    await page.goto("/community/friends");
    await expect(page.getByText("Friends")).toBeVisible();
  });

  test("groups page loads", async ({ page }) => {
    await page.goto("/community/groups");
    await expect(page.getByText("Groups")).toBeVisible();
  });

  test("activity feed page loads", async ({ page }) => {
    await page.goto("/community/feed");
    await expect(page.getByText("Activity Feed")).toBeVisible();
  });

  test("events page loads", async ({ page }) => {
    await page.goto("/community/events");
    await expect(page.getByText("Events")).toBeVisible();
  });
});

test.describe("Guides", () => {
  test("beginner guide loads", async ({ page }) => {
    await page.goto("/guides/beginner");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("wikelo guide loads with contracts", async ({ page }) => {
    await page.goto("/guides/wikelo");
    await expect(page.getByText("Wikelo")).toBeVisible();
  });

  test("wikelo tracker loads with inventory", async ({ page }) => {
    await page.goto("/guides/wikelo/tracker");
    await expect(page.getByText("Inventory Tracker")).toBeVisible();
  });
});

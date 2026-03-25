import { test, expect, Page } from "@playwright/test";

const API_URL = "http://localhost:3001";

const MOCK_USER = {
  id: "user-1",
  username: "testuser",
  email: "test@example.com",
  role: "user",
};

const MOCK_NOTE = {
  id: "note-1",
  itemName: "Quantanium",
  totalCount: 50,
  sellCount: 30,
  keepCount: 20,
  notes: "Found near Lyria",
  createdAt: "2026-03-25T12:00:00.000Z",
  updatedAt: "2026-03-25T12:00:00.000Z",
};

async function setupAuthMocks(page: Page) {
  await page.addInitScript(() => {
    localStorage.setItem("token", "fake-jwt-token");
  });

  await page.route(`${API_URL}/api/auth/me`, (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ success: true, data: MOCK_USER }),
    })
  );
}

test.describe("Inventory Notepad", () => {
  test("shows sign-in message when not authenticated", async ({ page }) => {
    await page.route(`${API_URL}/api/auth/me`, (route) =>
      route.fulfill({
        status: 401,
        contentType: "application/json",
        body: JSON.stringify({ success: false, error: "Unauthorized" }),
      })
    );

    await page.goto("/tools/notepad");
    await expect(page.getByText("Inventory Notepad")).toBeVisible();
    await expect(page.getByText("Sign in to track your items.")).toBeVisible();
  });

  test("shows empty state when authenticated with no notes", async ({
    page,
  }) => {
    await setupAuthMocks(page);

    await page.route(`${API_URL}/api/inventory-notes`, (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true, data: [] }),
      })
    );

    await page.goto("/tools/notepad");
    await expect(page.getByText("Inventory Notepad")).toBeVisible();
    await expect(
      page.getByText('No items yet. Click "+ Add Item" to get started.')
    ).toBeVisible();
  });

  test("displays existing notes in table", async ({ page }) => {
    await setupAuthMocks(page);

    await page.route(`${API_URL}/api/inventory-notes`, (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true, data: [MOCK_NOTE] }),
      })
    );

    await page.goto("/tools/notepad");
    await expect(page.getByText("Quantanium")).toBeVisible();
    await expect(page.getByText("Found near Lyria")).toBeVisible();
    await expect(page.getByText("Your Items (1)")).toBeVisible();
  });

  test("can add a new item", async ({ page }) => {
    await setupAuthMocks(page);

    await page.route(`${API_URL}/api/inventory-notes`, (route) => {
      if (route.request().method() === "GET") {
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ success: true, data: [] }),
        });
      }
      if (route.request().method() === "POST") {
        return route.fulfill({
          status: 201,
          contentType: "application/json",
          body: JSON.stringify({ success: true, data: MOCK_NOTE }),
        });
      }
      return route.continue();
    });

    await page.goto("/tools/notepad");

    await page.getByRole("button", { name: "+ Add Item" }).click();
    await page.getByLabel("Item Name").fill("Quantanium");
    await page.getByRole("button", { name: "Save" }).click();

    await expect(page.getByText("Quantanium")).toBeVisible();
  });

  test("can delete an item", async ({ page }) => {
    await setupAuthMocks(page);

    await page.route(`${API_URL}/api/inventory-notes`, (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true, data: [MOCK_NOTE] }),
      })
    );

    await page.route(`${API_URL}/api/inventory-notes/note-1`, (route) => {
      if (route.request().method() === "DELETE") {
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ success: true }),
        });
      }
      return route.continue();
    });

    await page.goto("/tools/notepad");
    await expect(page.getByText("Quantanium")).toBeVisible();

    await page.getByRole("button", { name: "Delete" }).click();
    await expect(page.getByText("Quantanium")).not.toBeVisible();
  });

  test("can edit an item inline", async ({ page }) => {
    await setupAuthMocks(page);

    await page.route(`${API_URL}/api/inventory-notes`, (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true, data: [MOCK_NOTE] }),
      })
    );

    await page.route(`${API_URL}/api/inventory-notes/note-1`, (route) => {
      if (route.request().method() === "PATCH") {
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            success: true,
            data: { ...MOCK_NOTE, itemName: "Bexalite", totalCount: 100 },
          }),
        });
      }
      return route.continue();
    });

    await page.goto("/tools/notepad");
    await page.getByRole("button", { name: "Edit" }).click();

    // Should show cancel button in edit mode
    await expect(page.getByRole("button", { name: "Cancel" })).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Save" })
    ).toBeVisible();
  });
});

import { test, expect, Page } from "@playwright/test";

/* ------------------------------------------------------------------ */
/*  Shared mock data                                                    */
/* ------------------------------------------------------------------ */

const MOCK_USER = {
  id: "user-1",
  username: "testuser",
  email: "test@example.com",
  role: "user",
};

const MOCK_OTHER_USER = {
  id: "user-2",
  username: "otheruser",
  role: "user",
};

const MOCK_ROLE = {
  id: "role-1",
  name: "Leader",
  rank: 100,
  permissions: [
    "manage_members",
    "manage_roles",
    "manage_fleet",
    "manage_operations",
    "manage_treasury",
    "manage_events",
    "manage_recruitment",
  ],
};

const MOCK_ORG_SUMMARY = {
  id: "org-1",
  name: "Test Org",
  slug: "test-org",
  description: "A test organization",
  logoUrl: null,
  isPublic: true,
  owner: { id: "user-1", username: "testuser" },
  memberCount: 2,
  myRole: MOCK_ROLE,
};

const MOCK_ORG_DETAIL = {
  ...MOCK_ORG_SUMMARY,
  spectrumId: null,
  bannerUrl: null,
  ownerId: "user-1",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
  members: [
    {
      id: "user-1",
      username: "testuser",
      avatarUrl: null,
      role: MOCK_ROLE,
      joinedAt: "2026-01-01T00:00:00.000Z",
    },
    {
      id: "user-2",
      username: "otheruser",
      avatarUrl: null,
      role: null,
      joinedAt: "2026-01-02T00:00:00.000Z",
    },
  ],
  roles: [MOCK_ROLE],
  isMember: true,
  joinRequestStatus: null,
};

const MOCK_DISCOVER_ORG = {
  id: "org-2",
  name: "Public Org",
  slug: "public-org",
  description: "A public org to join",
  logoUrl: null,
  isPublic: true,
  owner: { id: "user-2", username: "otheruser" },
  memberCount: 5,
};

const API_URL = "http://localhost:3001";

/* ------------------------------------------------------------------ */
/*  Helper: set up auth and common API mocks                           */
/* ------------------------------------------------------------------ */

async function setupAuthMocks(page: Page) {
  // Set a fake token so AuthProvider thinks we're logged in
  await page.addInitScript(() => {
    localStorage.setItem("token", "fake-jwt-token");
  });

  // Mock auth/me
  await page.route(`${API_URL}/api/auth/me`, (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ success: true, data: MOCK_USER }),
    })
  );
}

/* ------------------------------------------------------------------ */
/*  Orgs listing page                                                   */
/* ------------------------------------------------------------------ */

test.describe("Orgs Listing Page", () => {
  test("shows sign-in message when not authenticated", async ({ page }) => {
    // No auth mocks — localStorage has no token
    await page.route(`${API_URL}/api/auth/me`, (route) =>
      route.fulfill({
        status: 401,
        contentType: "application/json",
        body: JSON.stringify({ success: false, error: "Unauthorized" }),
      })
    );

    await page.goto("/orgs");
    await expect(
      page.getByText("Sign in to view and create organizations.")
    ).toBeVisible();
  });

  test("displays my orgs and discover orgs sections", async ({ page }) => {
    await setupAuthMocks(page);

    await page.route(`${API_URL}/api/orgs`, (route) => {
      if (route.request().method() === "GET") {
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ success: true, data: [MOCK_ORG_SUMMARY] }),
        });
      }
      return route.continue();
    });

    await page.route(`${API_URL}/api/orgs/discover*`, (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: [MOCK_DISCOVER_ORG],
          pagination: { page: 1, limit: 20, total: 1, totalPages: 1 },
        }),
      })
    );

    await page.goto("/orgs");

    // Sections visible
    await expect(page.getByText("My Organizations")).toBeVisible();
    await expect(page.getByText("Discover Organizations")).toBeVisible();

    // Org cards visible
    await expect(page.getByText("Test Org", { exact: true })).toBeVisible();
    await expect(page.getByText("Public Org", { exact: true })).toBeVisible();

    // Meta info
    await expect(page.getByText("2 members")).toBeVisible();
    await expect(page.getByText("Role: Leader")).toBeVisible();
  });

  test("shows empty states when no orgs exist", async ({ page }) => {
    await setupAuthMocks(page);

    await page.route(`${API_URL}/api/orgs`, (route) => {
      if (route.request().method() === "GET") {
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ success: true, data: [] }),
        });
      }
      return route.continue();
    });

    await page.route(`${API_URL}/api/orgs/discover*`, (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: [],
          pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
        }),
      })
    );

    await page.goto("/orgs");

    await expect(
      page.getByText("You are not a member of any organizations yet.")
    ).toBeVisible();
    await expect(
      page.getByText("No public organizations to discover right now.")
    ).toBeVisible();
  });

  test("create org form opens and submits", async ({ page }) => {
    await setupAuthMocks(page);

    await page.route(`${API_URL}/api/orgs`, (route) => {
      if (route.request().method() === "POST") {
        return route.fulfill({
          status: 201,
          contentType: "application/json",
          body: JSON.stringify({
            success: true,
            data: {
              id: "org-new",
              name: "New Org",
              slug: "new-org",
              description: null,
              logoUrl: null,
              isPublic: true,
              createdAt: "2026-03-11T00:00:00Z",
              owner: { id: "user-1", username: "testuser" },
              memberCount: 1,
            },
          }),
        });
      }
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true, data: [] }),
      });
    });

    await page.route(`${API_URL}/api/orgs/discover*`, (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true, data: [] }),
      })
    );

    await page.goto("/orgs");

    // Open create form
    await page.getByRole("button", { name: "Create Organization" }).click();
    await expect(page.getByText("Create a New Organization")).toBeVisible();

    // Fill form
    await page.getByLabel("Name").fill("New Org");
    await expect(page.getByLabel("Slug")).toHaveValue("new-org");

    // Submit
    await page.getByRole("button", { name: "Create" }).click();
  });
});

/* ------------------------------------------------------------------ */
/*  Org detail page                                                     */
/* ------------------------------------------------------------------ */

test.describe("Org Detail Page", () => {
  async function setupOrgDetailMocks(
    page: Page,
    orgOverrides: Record<string, unknown> = {}
  ) {
    await setupAuthMocks(page);

    const orgData = { ...MOCK_ORG_DETAIL, ...orgOverrides };

    await page.route(`${API_URL}/api/orgs/test-org`, (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true, data: orgData }),
      })
    );
  }

  test("renders org header with name, description, and meta", async ({
    page,
  }) => {
    await setupOrgDetailMocks(page);
    await page.goto("/orgs/test-org");

    await expect(page.getByRole("heading", { name: "Test Org" })).toBeVisible();
    await expect(page.getByText("A test organization").first()).toBeVisible();
    await expect(page.getByText("2 members")).toBeVisible();
    await expect(page.getByText("Owner: testuser")).toBeVisible();
  });

  test("shows Dashboard link for owner", async ({ page }) => {
    await setupOrgDetailMocks(page);
    await page.goto("/orgs/test-org");

    await expect(page.getByRole("link", { name: "Dashboard" })).toBeVisible();
  });

  test("shows Leave button for non-owner member", async ({ page }) => {
    await setupOrgDetailMocks(page, {
      ownerId: "user-2",
      owner: { id: "user-2", username: "otheruser" },
    });
    await page.goto("/orgs/test-org");

    await expect(
      page.getByRole("button", { name: "Leave Organization" })
    ).toBeVisible();
  });

  test("shows Transfer & Leave button for owner with members", async ({
    page,
  }) => {
    await setupOrgDetailMocks(page);
    await page.goto("/orgs/test-org");

    await expect(
      page.getByRole("button", { name: "Transfer & Leave" })
    ).toBeVisible();
  });

  test("shows Request to Join for non-member", async ({ page }) => {
    await setupOrgDetailMocks(page, {
      isMember: false,
      myRole: null,
      ownerId: "user-2",
      owner: { id: "user-2", username: "otheruser" },
      joinRequestStatus: null,
    });
    await page.goto("/orgs/test-org");

    await expect(
      page.getByRole("button", { name: "Request to Join" })
    ).toBeVisible();
  });

  test("shows Request Pending badge for pending join request", async ({
    page,
  }) => {
    await setupOrgDetailMocks(page, {
      isMember: false,
      myRole: null,
      ownerId: "user-2",
      owner: { id: "user-2", username: "otheruser" },
      joinRequestStatus: "PENDING",
    });
    await page.goto("/orgs/test-org");

    await expect(page.getByText("Request Pending")).toBeVisible();
  });

  test("tabs switch content", async ({ page }) => {
    await setupOrgDetailMocks(page);
    await page.goto("/orgs/test-org");

    // Overview tab active by default
    await expect(page.getByText("About")).toBeVisible();

    // Switch to Members tab
    await page.getByRole("button", { name: "Members", exact: true }).click();
    await expect(page.getByText("Members (2)")).toBeVisible();
    await expect(page.getByText("testuser").first()).toBeVisible();
    await expect(page.getByText("otheruser").first()).toBeVisible();
  });

  test("overview tab shows org details", async ({ page }) => {
    await setupOrgDetailMocks(page);
    await page.goto("/orgs/test-org");

    await expect(page.getByText("About")).toBeVisible();
    await expect(page.getByText("Details")).toBeVisible();
    await expect(page.getByText("Public")).toBeVisible();
  });

  test("leave org redirects to /orgs", async ({ page }) => {
    await setupOrgDetailMocks(page, {
      ownerId: "user-2",
      owner: { id: "user-2", username: "otheruser" },
    });

    await page.route(
      `${API_URL}/api/orgs/org-1/members/user-1`,
      (route) => {
        if (route.request().method() === "DELETE") {
          return route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify({
              success: true,
              data: { message: "Member removed" },
            }),
          });
        }
        return route.continue();
      }
    );

    // Mock the orgs listing page that we'll be redirected to
    await page.route(`${API_URL}/api/orgs`, (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true, data: [] }),
      })
    );
    await page.route(`${API_URL}/api/orgs/discover*`, (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true, data: [] }),
      })
    );

    await page.goto("/orgs/test-org");

    // Accept the confirm dialog
    page.on("dialog", (dialog) => dialog.accept());

    await page.getByRole("button", { name: "Leave Organization" }).click();
    await expect(page).toHaveURL(/\/orgs$/);
  });

  test("transfer & leave opens modal with member list", async ({ page }) => {
    await setupOrgDetailMocks(page);
    await page.goto("/orgs/test-org");

    await page.getByRole("button", { name: "Transfer & Leave" }).click();

    await expect(page.getByText("Transfer Ownership")).toBeVisible();
    await expect(
      page.getByText("Select a member to become the new owner")
    ).toBeVisible();

    // The dropdown should contain the other member
    const select = page.locator("select").last();
    await expect(select).toContainText("otheruser");

    // Cancel closes the modal
    await page.getByRole("button", { name: "Cancel" }).click();
    await expect(page.getByText("Transfer Ownership")).not.toBeVisible();
  });
});

/* ------------------------------------------------------------------ */
/*  Fleet page                                                          */
/* ------------------------------------------------------------------ */

test.describe("Fleet Page", () => {
  async function setupFleetMocks(page: Page) {
    await setupAuthMocks(page);

    await page.route(`${API_URL}/api/orgs/test-org`, (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: { id: "org-1", name: "Test Org", slug: "test-org" },
        }),
      })
    );

    await page.route(`${API_URL}/api/orgs/org-1/fleet`, (route) => {
      if (route.request().method() === "GET") {
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            success: true,
            data: [
              {
                id: "ship-1",
                shipName: "Constellation Andromeda",
                nickname: "The Magpie",
                status: "ACTIVE",
                owner: { id: "user-1", username: "testuser" },
              },
            ],
          }),
        });
      }
      return route.continue();
    });
  }

  test("displays fleet with ship cards", async ({ page }) => {
    await setupFleetMocks(page);
    await page.goto("/orgs/test-org/fleet");

    await expect(page.getByText("Test Org — Fleet")).toBeVisible();
    await expect(page.getByText("Constellation Andromeda")).toBeVisible();
    await expect(page.getByText('"The Magpie"')).toBeVisible();
    await expect(page.getByText("Active")).toBeVisible();
  });

  test("shows add ship form", async ({ page }) => {
    await setupFleetMocks(page);
    await page.goto("/orgs/test-org/fleet");

    await expect(page.getByText("Add Ship to Fleet")).toBeVisible();
    await expect(page.getByLabel("Ship Name")).toBeVisible();
    await expect(page.getByLabel("Nickname (optional)")).toBeVisible();
  });

  test("shows edit and remove buttons for ship owner", async ({ page }) => {
    await setupFleetMocks(page);
    await page.goto("/orgs/test-org/fleet");

    await expect(page.getByRole("button", { name: "Edit" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Remove" })).toBeVisible();
  });

  test("empty fleet shows message", async ({ page }) => {
    await setupAuthMocks(page);

    await page.route(`${API_URL}/api/orgs/test-org`, (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: { id: "org-1", name: "Test Org", slug: "test-org" },
        }),
      })
    );

    await page.route(`${API_URL}/api/orgs/org-1/fleet`, (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true, data: [] }),
      })
    );

    await page.goto("/orgs/test-org/fleet");
    await expect(
      page.getByText("No ships in the fleet yet.")
    ).toBeVisible();
  });
});

/* ------------------------------------------------------------------ */
/*  Operations page                                                     */
/* ------------------------------------------------------------------ */

test.describe("Operations Page", () => {
  async function setupOperationsMocks(page: Page) {
    await setupAuthMocks(page);

    await page.route(`${API_URL}/api/orgs/test-org`, (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: { id: "org-1", name: "Test Org", slug: "test-org" },
        }),
      })
    );

    await page.route(`${API_URL}/api/orgs/org-1/operations`, (route) => {
      if (route.request().method() === "GET") {
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            success: true,
            data: [
              {
                id: "op-1",
                title: "Mining Run Alpha",
                operationType: "mining",
                status: "PLANNING",
                startsAt: "2026-03-15T18:00:00.000Z",
                endsAt: null,
                shipCount: 2,
                crewCount: 5,
              },
            ],
          }),
        });
      }
      return route.continue();
    });
  }

  test("displays operations list", async ({ page }) => {
    await setupOperationsMocks(page);
    await page.goto("/orgs/test-org/operations");

    await expect(page.getByText("Test Org — Operations")).toBeVisible();
    await expect(page.getByText("Mining Run Alpha")).toBeVisible();
    await expect(page.getByText("Mining", { exact: true }).last()).toBeVisible();
    await expect(page.getByText("Planning").first()).toBeVisible();
    await expect(page.getByText("Ships: 2")).toBeVisible();
    await expect(page.getByText("Crew: 5")).toBeVisible();
  });

  test("new operation button toggles form", async ({ page }) => {
    await setupOperationsMocks(page);
    await page.goto("/orgs/test-org/operations");

    await page.getByRole("button", { name: "New Operation" }).click();
    await expect(page.getByText("Create Operation").first()).toBeVisible();
    await expect(page.getByLabel("Title")).toBeVisible();
    await expect(page.getByLabel("Type")).toBeVisible();
    await expect(page.getByLabel("Starts At")).toBeVisible();

    // The button text changes to "Cancel" when form is open
    await page.getByRole("button", { name: "Cancel" }).click();
    await expect(page.getByLabel("Title")).not.toBeVisible();
  });

  test("empty operations shows message", async ({ page }) => {
    await setupAuthMocks(page);

    await page.route(`${API_URL}/api/orgs/test-org`, (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: { id: "org-1", name: "Test Org", slug: "test-org" },
        }),
      })
    );

    await page.route(`${API_URL}/api/orgs/org-1/operations`, (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true, data: [] }),
      })
    );

    await page.goto("/orgs/test-org/operations");
    await expect(
      page.getByText("No operations yet. Create one to get started.")
    ).toBeVisible();
  });
});

/* ------------------------------------------------------------------ */
/*  Operation detail page                                               */
/* ------------------------------------------------------------------ */

test.describe("Operation Detail Page", () => {
  async function setupOpDetailMocks(page: Page) {
    await setupAuthMocks(page);

    await page.route(`${API_URL}/api/orgs/test-org`, (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: { id: "org-1", name: "Test Org", slug: "test-org" },
        }),
      })
    );

    await page.route(`${API_URL}/api/orgs/org-1/operations/op-1`, (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: {
            id: "op-1",
            title: "Mining Run Alpha",
            operationType: "mining",
            status: "PLANNING",
            description: "Let's mine some rocks",
            startsAt: "2026-03-15T18:00:00.000Z",
            endsAt: null,
            creatorId: "user-1",
            creatorUsername: "testuser",
            ships: [
              {
                id: "opship-1",
                shipId: "ship-1",
                shipName: "Constellation Andromeda",
                nickname: "The Magpie",
                crew: [
                  {
                    id: "crew-1",
                    userId: "user-1",
                    username: "testuser",
                    position: "Captain/Pilot",
                  },
                ],
              },
            ],
          },
        }),
      })
    );

    await page.route(`${API_URL}/api/orgs/org-1/fleet`, (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: [
            {
              id: "ship-1",
              shipName: "Constellation Andromeda",
              nickname: "The Magpie",
            },
            { id: "ship-2", shipName: "Freelancer MAX", nickname: null },
          ],
        }),
      })
    );

    await page.route(`${API_URL}/api/orgs/org-1/members`, (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: [
            { id: "user-1", username: "testuser" },
            { id: "user-2", username: "otheruser" },
          ],
        }),
      })
    );
  }

  test("displays operation header info", async ({ page }) => {
    await setupOpDetailMocks(page);
    await page.goto("/orgs/test-org/operations/op-1");

    await expect(
      page.getByRole("heading", { name: "Mining Run Alpha" })
    ).toBeVisible();
    await expect(page.getByText("Mining", { exact: true }).last()).toBeVisible();
    await expect(page.getByText("Planning").first()).toBeVisible();
    await expect(page.getByText("Let's mine some rocks")).toBeVisible();
    await expect(page.getByText("Created by: testuser")).toBeVisible();
  });

  test("shows ships with crew", async ({ page }) => {
    await setupOpDetailMocks(page);
    await page.goto("/orgs/test-org/operations/op-1");

    await expect(page.getByText("Ships (1)")).toBeVisible();
    await expect(
      page.getByText('Constellation Andromeda "The Magpie"')
    ).toBeVisible();
    await expect(page.getByText("Captain/Pilot")).toBeVisible();
  });

  test("shows status controls for creator", async ({ page }) => {
    await setupOpDetailMocks(page);
    await page.goto("/orgs/test-org/operations/op-1");

    await expect(page.getByText("Change Status:")).toBeVisible();
    await expect(page.getByRole("button", { name: "Update" })).toBeVisible();
  });

  test("shows available ships to add", async ({ page }) => {
    await setupOpDetailMocks(page);
    await page.goto("/orgs/test-org/operations/op-1");

    // Freelancer MAX is not assigned yet, should appear in the add-ship dropdown
    // First select is the status dropdown, second is the ship dropdown
    const addShipSelect = page.locator("select").nth(1);
    await expect(addShipSelect).toContainText("Freelancer MAX");
  });
});

/* ------------------------------------------------------------------ */
/*  Recruitment page                                                    */
/* ------------------------------------------------------------------ */

test.describe("Recruitment Page", () => {
  async function setupRecruitmentMocks(page: Page) {
    await setupAuthMocks(page);

    await page.route(`${API_URL}/api/orgs/test-org`, (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: { id: "org-1", name: "Test Org", slug: "test-org" },
        }),
      })
    );

    await page.route(`${API_URL}/api/recruitment/org/org-1`, (route) => {
      if (route.request().method() === "GET") {
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            success: true,
            data: [
              {
                id: "post-1",
                title: "Looking for Miners",
                description: "We need experienced miners for our org.",
                requirements: "Must have mining ship",
                isOpen: true,
                createdAt: "2026-03-01T00:00:00.000Z",
              },
            ],
          }),
        });
      }
      return route.continue();
    });
  }

  test("displays recruitment posts", async ({ page }) => {
    await setupRecruitmentMocks(page);
    await page.goto("/orgs/test-org/recruitment");

    await expect(
      page.getByRole("heading", { name: "Recruitment" })
    ).toBeVisible();
    await expect(page.getByText("Looking for Miners")).toBeVisible();
    await expect(
      page.getByText("We need experienced miners for our org.")
    ).toBeVisible();
    await expect(page.getByText("Open")).toBeVisible();
  });

  test("create post button toggles form", async ({ page }) => {
    await setupRecruitmentMocks(page);
    await page.goto("/orgs/test-org/recruitment");

    await page.getByRole("button", { name: "Create Post" }).click();
    await expect(page.getByText("New Recruitment Post")).toBeVisible();
    await expect(page.getByLabel("Title")).toBeVisible();
    await expect(page.getByLabel("Description")).toBeVisible();

    // The header button text changes to "Cancel" when form is open
    await page.getByRole("button", { name: "Cancel" }).first().click();
    await expect(page.getByText("New Recruitment Post")).not.toBeVisible();
  });

  test("shows toggle and delete buttons on posts", async ({ page }) => {
    await setupRecruitmentMocks(page);
    await page.goto("/orgs/test-org/recruitment");

    await expect(
      page.getByRole("button", { name: "Close Post" })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Delete" })
    ).toBeVisible();
  });

  test("empty recruitment shows message", async ({ page }) => {
    await setupAuthMocks(page);

    await page.route(`${API_URL}/api/orgs/test-org`, (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: { id: "org-1", name: "Test Org", slug: "test-org" },
        }),
      })
    );

    await page.route(`${API_URL}/api/recruitment/org/org-1`, (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true, data: [] }),
      })
    );

    await page.goto("/orgs/test-org/recruitment");
    await expect(
      page.getByText("No recruitment posts yet.")
    ).toBeVisible();
  });
});

import { test, expect } from "@playwright/test";

async function login(page: import("@playwright/test").Page, email: string, password: string) {
    await page.goto("/en/login");
    await page.getByLabel(/email/i).fill(email);
    await page.getByLabel(/password/i).fill(password);
    await page.getByRole("button", { name: /sign in|login/i }).click();
    await expect(page).toHaveURL(/\/en\/dashboard/);
}

test.describe("Opportunity moderation", () => {
    test("a new submission is pending and hidden from the public feed until approved", async ({ page }) => {
        const uniqueTitle = `E2E Test Opportunity ${Date.now()}`;

        // Regular user submits a new opportunity.
        await login(page, "user@example.com", "user123");
        await page.goto("/en/add-opportunity");

        await page.getByLabel(/title/i).fill(uniqueTitle);
        await page.getByLabel(/organization/i).fill("Test Org");
        await page.getByLabel(/category/i).selectOption("Job");
        await page.getByLabel(/^country/i).fill("Germany");
        await page.getByLabel(/^location/i).fill("Frankfurt");
        await page.getByLabel(/type/i).selectOption("Remote");
        await page.getByLabel(/deadline/i).fill("2027-01-01");
        await page.getByLabel(/description/i).fill(
            "This is a long enough description for the validation rules to accept it happily."
        );
        await page.getByLabel(/requirements/i).fill("Some requirement");
        await page.getByLabel(/apply link/i).fill("https://example.com/apply");
        await page.getByRole("button", { name: /submit/i }).click();

        await expect(page.getByText(/review/i)).toBeVisible();

        // It must NOT show up in the public feed yet.
        await page.goto("/en/opportunities");
        await expect(page.getByText(uniqueTitle)).toHaveCount(0);

        // It should show up as "PENDING" on the user's own dashboard.
        await page.goto("/en/dashboard");
        await expect(page.getByText(uniqueTitle)).toBeVisible();
        await expect(page.getByText("PENDING")).toBeVisible();

        // Admin logs in and approves it.
        await page.goto("/en/logout").catch(() => {});
        await page.context().clearCookies();
        await login(page, "admin@example.com", "admin123");
        await page.goto("/en/admin/opportunities");

        await expect(page.getByText(uniqueTitle)).toBeVisible();
        await page
            .locator("div", { hasText: uniqueTitle })
            .getByRole("button", { name: /approve/i })
            .first()
            .click();

        // Now it must be visible in the public feed.
        await page.goto("/en/opportunities");
        await expect(page.getByText(uniqueTitle)).toBeVisible();
    });
});

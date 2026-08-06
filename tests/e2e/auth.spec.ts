import { test, expect } from "@playwright/test";

// Requires the database to be seeded first: npm run db:seed
// (creates user@example.com / user123 and admin@example.com / admin123)

test.describe("Authentication", () => {
    test("a registered user can log in and reach the dashboard", async ({ page }) => {
        await page.goto("/en/login");

        await page.getByLabel(/email/i).fill("user@example.com");
        await page.getByLabel(/password/i).fill("user123");
        await page.getByRole("button", { name: /sign in|login/i }).click();

        await expect(page).toHaveURL(/\/en\/dashboard/);
        await expect(page.getByText(/user@example\.com/i)).toBeVisible();
    });

    test("an incorrect password is rejected", async ({ page }) => {
        await page.goto("/en/login");

        await page.getByLabel(/email/i).fill("user@example.com");
        await page.getByLabel(/password/i).fill("totally-wrong-password");
        await page.getByRole("button", { name: /sign in|login/i }).click();

        await expect(page).not.toHaveURL(/\/en\/dashboard/);
    });

    test("a new visitor can register and is signed in automatically", async ({ page }) => {
        const uniqueEmail = `test-${Date.now()}@example.com`;

        await page.goto("/en/register");
        await page.getByLabel(/name/i).fill("Test User");
        await page.getByLabel(/^email/i).fill(uniqueEmail);
        await page.getByLabel(/^password/i).fill("password123");
        await page.getByLabel(/confirm password/i).fill("password123");
        await page.getByRole("button", { name: /create account|register|sign up/i }).click();

        await expect(page).toHaveURL(/\/en\/dashboard/);
    });
});

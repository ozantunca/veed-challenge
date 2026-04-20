import { expect, test } from "@playwright/test";

test.describe("Video library", () => {
  test("lists videos and changes order when sorting", async ({ page }) => {
    await page.goto("/?sort=newest");
    await expect(page.getByRole("heading", { name: "Video library" })).toBeVisible();
    const cards = page.getByTestId("video-card");
    await expect(cards.first()).toBeVisible();
    const firstNewestTitle = await cards
      .first()
      .getByTestId("video-title")
      .innerText();

    await page.goto("/?sort=oldest");
    const firstOldestTitle = await cards
      .first()
      .getByTestId("video-title")
      .innerText();

    expect(firstNewestTitle).not.toEqual(firstOldestTitle);
  });

  test("creates a video and shows it in the grid", async ({ page }) => {
    const unique = `PW Test ${Date.now()}`;
    await page.goto("/new");
    await page.getByLabel(/title/i).fill(unique);
    await page.getByPlaceholder(/add tags/i).fill("e2e");
    await page.getByPlaceholder(/add tags/i).press("Enter");
    await page.getByRole("button", { name: /create video/i }).click();

    await page.waitForURL(/\/?\?sort=newest$/);
    await expect(page.getByText(unique, { exact: true })).toBeVisible();
  });
});

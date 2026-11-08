import { expect, test } from "./fixtures";

test("orders a pastry from a table and follows its status", async ({ page }) => {
  await page.goto("/?mesa=4");

  await expect(page.getByText("Mesa 4")).toBeVisible();
  await page.getByRole("button", { name: "Agregar Muffin de chocolate" }).click();
  await page.getByRole("button", { name: /Ver pedido/ }).click();

  await expect(page.getByText("Se entrega en la mesa 4.")).toBeVisible();
  await page.getByRole("button", { name: "Confirmar pedido" }).click();

  await expect(page.getByRole("heading", { name: "Pedido confirmado" })).toBeVisible();
  await expect(page.getByText("Pendiente")).toBeVisible();
  await expect(page.getByText(/^Order-\d+$/)).toBeVisible();

  await page.getByRole("button", { name: "Actualizar estado" }).click();

  await expect(page.getByText("Pendiente")).toBeVisible();
  await expect(page.getByRole("alert")).toHaveCount(0);
});

test("the checkout fits a 375px screen without horizontal scroll", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/?mesa=4");

  await page.getByRole("button", { name: "Agregar Muffin de chocolate" }).click();
  await page.getByRole("button", { name: /Ver pedido/ }).click();
  await page.getByRole("button", { name: "Confirmar pedido" }).click();
  await expect(page.getByRole("heading", { name: "Pedido confirmado" })).toBeVisible();

  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(scrollWidth).toBeLessThanOrEqual(375);
});

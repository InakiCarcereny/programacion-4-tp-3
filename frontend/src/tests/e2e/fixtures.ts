import { test as base } from "@playwright/test";

export const test = base.extend({});

test.beforeEach(async ({ request }) => {
  await request.post("http://localhost:3000/__test__/reset");
  await request.post("http://localhost:3000/__test__/seed");
});

export { expect } from "@playwright/test";

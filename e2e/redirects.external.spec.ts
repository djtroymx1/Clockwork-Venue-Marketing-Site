import { test, expect } from "@playwright/test";

const shouldRun = process.env.EXTERNAL_CHECK === "1";
const describeFn = shouldRun ? test.describe : test.describe.skip;

describeFn("external redirects", () => {
  const cases = [
    {
      name: "clockworkvenue.com apex",
      url: "https://clockworkvenue.com",
      expectedLocation: "https://www.clockworkvenue.com/",
    },
    {
      name: "stageflowlive.com",
      url: "https://stageflowlive.com",
      expectedLocation: "https://www.clockworkvenue.com/",
    },
    {
      name: "www.stageflowlive.com",
      url: "https://www.stageflowlive.com",
      expectedLocation: "https://www.clockworkvenue.com/",
    },
  ];

  for (const { name, url, expectedLocation } of cases) {
    test(name, async ({ request }) => {
      const response = await request.get(url, { maxRedirects: 0 });
      expect(response.status(), `${url} should return 308`).toBe(308);
      const location = response.headers()["location"];
      expect(location, `${url} should point to ${expectedLocation}`).toBe(expectedLocation);
    });
  }
});

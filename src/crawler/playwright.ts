import { chromium } from 'playwright';

(async () => {
  const t0 = Date.now();
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://medium.com/@dmccreary/lost-in-knowledge-space-14be123ea083');
  await page.screenshot({ path: 'example.png' });

  await browser.close();
  const t1 = Date.now();
  const duration = t1 - t0;
  console.log(`Took ${duration}ms`);
})();

import * as Apify from 'apify';
import { GoogleSERP } from 'serp-parser';
import { generate } from 'shortid';
import { env } from './src/env';
console.log(env.API.PORT);
const scrapeGoogleResults = async <T>(q: string): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    const requestList = await Apify.openRequestList(generate(), [`https://google.com/search?q=${q}`]);

    const crawler = new Apify.PuppeteerCrawler({
      requestList,
      handlePageFunction: async ({ request, page }) => {
        const content = await page.content();
        const parser = new GoogleSERP(content);
        console.dir(parser.serp);
        resolve(parser.serp);
      },
      maxRequestsPerCrawl: 100,
      maxConcurrency: 10,
    });
    try {
      await crawler.run();
    } catch (err) {
      reject(err);
    }
  });
};

scrapeGoogleResults('Node js courses');

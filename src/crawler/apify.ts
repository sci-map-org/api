import * as Apify from 'apify';
import { load } from 'cheerio';
import * as cheerio from 'cheerio';
import { WebsiteExtractor, FieldExtractors } from './extractors/extractors';

import { generate } from 'shortid';

export type CheerioSelector = ReturnType<typeof load>;

/**
 * Questions:
 * Do I ever need to do something else then selecting and getting the text ?
 * How to make it robust => know when it fails, handle changes gracefully (loose selector ?)
 */
const scrapePagePuppeteer = async <T>(url: string, extractors: FieldExtractors<T>): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    const requestList = await Apify.openRequestList(generate(), [url]);
    requestList.initialize();

    const crawler = new Apify.PuppeteerCrawler({
      requestList,
      handlePageFunction: async ({ request, page }) => {
        const content = await page.content();
        const $ = cheerio.load(content);
        resolve(
          Object.keys(extractors).reduce((obj, extractorKey) => {
            obj[extractorKey] = extractors[extractorKey]($);
            return obj;
          }, {})
        );
      },
      maxRequestsPerCrawl: 100,
      maxConcurrency: 10,
    });

    await crawler.run();
  });
};

const scrapePageCheerio = async <T>(url: string, extractors: FieldExtractors<T>): Promise<T> => {
  return new Promise(async (resolve, reject) => {
    const requestList = await Apify.openRequestList(generate(), [url]);
    requestList.initialize();

    const crawler = new Apify.CheerioCrawler({
      requestList,
      handlePageFunction: async ({ request, $ }) => {
        resolve(
          Object.keys(extractors).reduce((obj, extractorKey) => {
            obj[extractorKey] = extractors[extractorKey]($);
            return obj;
          }, {} as T)
        );
      },
      maxRequestsPerCrawl: 100,
      maxConcurrency: 10,
    });

    await crawler.run();
  });
};

export const scrapePage = <T>(url: string, config: WebsiteExtractor<T>): Promise<T> => {
  if (config.crawlerType === 'cheerio') return scrapePageCheerio(url, config.fieldExtractors);
  return scrapePagePuppeteer(url, config.fieldExtractors);
};

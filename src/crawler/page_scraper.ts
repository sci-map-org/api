import * as Apify from 'apify';
import * as cheerio from 'cheerio';
import { generate } from 'shortid';
import { logger } from '../infra/logger';
import { FieldExtractors, ScraperWebsiteExtractor } from './extractors/extractors';

const { log } = Apify.utils;
log.setLevel(log.LEVELS.ERROR);

/**
 * Questions:
 * Do I ever need to do something else then selecting and getting the text ?
 * How to make it robust => know when it fails, handle changes gracefully (loose selector ?)
 */
const scrapePagePuppeteer = async <T>(url: string, extractors: FieldExtractors<T>): Promise<T> => {
  return new Promise(async (resolve, reject) => {
    const requestList = await Apify.openRequestList(generate(), [url]);

    const crawler = new Apify.PuppeteerCrawler({
      requestList,
      handlePageFunction: async ({ request, page }) => {
        const content = await page.content();
        const $ = cheerio.load(content);
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
    try {
      await crawler.run();
    } catch (err) {
      reject(err);
    }
  });
};

const scrapePageCheerio = async <T>(url: string, extractors: FieldExtractors<T>): Promise<T> => {
  return new Promise(async (resolve, reject) => {
    try {
      const requestList = await Apify.openRequestList(generate(), [url]);

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
    } catch (err) {
      reject(err);
    }
  });
};

export const scrapePage = async <T>(url: string, config: ScraperWebsiteExtractor<T>): Promise<T | null> => {
  const scrapeFn = config.scraperType === 'cheerio' ? scrapePageCheerio : scrapePagePuppeteer;
  try {
    const data = await scrapeFn(url, config.fieldExtractors);
    return data;
  } catch (err) {
    logger.warn(`Scraping page ${url} failed:`);
    logger.warn(err.message);
    return null;
  }
};

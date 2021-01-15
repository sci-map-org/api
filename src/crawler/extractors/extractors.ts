import { load } from 'cheerio';

export type CheerioSelector = ReturnType<typeof load>;

type ScraperType = 'cheerio' | 'puppeteer';

export type FieldExtractors<T> = {
  [key in keyof T]: ($: CheerioSelector) => T[key];
};

export type ScraperWebsiteExtractor<T> = {
  type: 'scraper'; // rename to scraper
  scraperType: ScraperType;
  urlMatch: RegExp;
  fieldExtractors: FieldExtractors<T>;
};

type IntegrationWebsiteExtractor<T> = {
  type: 'integration';
  urlMatch: RegExp;
  extractData: (url: string) => Promise<T>;
};

export type WebsiteExtractor<T> = ScraperWebsiteExtractor<T> | IntegrationWebsiteExtractor<T>;

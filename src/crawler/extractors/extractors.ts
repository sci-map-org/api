import { load } from 'cheerio';

export type CheerioSelector = ReturnType<typeof load>;

type CrawlerType = 'cheerio' | 'puppeteer';

export type FieldExtractors<T> = {
  [key in keyof T]: ($: CheerioSelector) => T[key];
};

export interface WebsiteExtractor<T> {
  crawlerType: CrawlerType;
  urlMatch: RegExp;
  fieldExtractors: FieldExtractors<T>;
}

import { WebsiteExtractor } from './extractors';

export interface MediumExtractedData {
  title: string;
}

export const mediumExtractorConfig: WebsiteExtractor<MediumExtractedData> = {
  crawlerType: 'cheerio',
  urlMatch: /medium.com/,
  fieldExtractors: {
    title: $ =>
      $('article  h1')
        .first()
        .text(),
  },
};

import { WebsiteExtractor } from './extractors';

export interface YoutubeExtractedData {
  title: string;
}

export const youtubeExtractorConfig: WebsiteExtractor<YoutubeExtractedData> = {
  crawlerType: 'puppeteer',
  urlMatch: /youtube.com/,
  fieldExtractors: {
    title: $ =>
      $('h1')
        .first()
        .text(),
  },
};

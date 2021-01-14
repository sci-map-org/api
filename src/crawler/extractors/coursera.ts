import { WebsiteExtractor } from './extractors';

export interface CourseraExtractedData {
  title: string;
  averageRating: number;
  description: string;
}

export const courseraExtractorConfig: WebsiteExtractor<CourseraExtractedData> = {
  crawlerType: 'cheerio',
  urlMatch: /coursera.org\/learn/,
  fieldExtractors: {
    title: $ => $('#main  h1').text(),
    averageRating: $ =>
      Number(
        $(
          '#main > div > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div > div > div > div > div > div > div > ul > li > a > div > span'
        )
          .first()
          .contents()
          .filter((_, element) => element.type === 'text')
          .text()
      ),
    description: $ =>
      $('#main > div > div.cdp-about > div > div > div > div > div > div.description > div > div > div').text(),
  },
};

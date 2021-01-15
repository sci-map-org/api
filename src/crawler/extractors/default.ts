import { urlRegexp } from '../../util/regexp.util';
import { WebsiteExtractor } from './extractors';

export interface DefaultExtractedData {
  title?: string;
}

export const defaultExtractorConfig: WebsiteExtractor<DefaultExtractedData> = {
  type: 'scraper',
  scraperType: 'cheerio',
  urlMatch: urlRegexp,
  fieldExtractors: {
    title: $ => {
      return (
        $('body h1')
          .first()
          .text() ||
        $('body h2')
          .first()
          .text() ||
        undefined
      );
    },
  },
};

import { WebsiteExtractor } from './extractors/extractors';
import { scrapePage } from './page_scraper';

export const extractWebsiteData = <T>(url: string, extractor: WebsiteExtractor<T>) => {
  if (extractor.type === 'scraper') return scrapePage(url, extractor);
  return extractor.extractData(url);
};

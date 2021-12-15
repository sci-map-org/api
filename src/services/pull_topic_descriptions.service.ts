import fetch from 'cross-fetch';
import { GoogleNojsSERP } from 'serp-parser';
import { APIPullDescriptionsQueryOptions, APIPulledDescription } from '../api/schema/types';

export const pullTopicDescriptions = async ({
  name,
  aliases,
  parentTopicName,
  contextName,
}: APIPullDescriptionsQueryOptions): Promise<APIPulledDescription[]> => {
  const pulledDescriptions: APIPulledDescription[] = [];
  const wikipediaDescription = await pullWikipediaDescription(name);
  wikipediaDescription && pulledDescriptions.push(wikipediaDescription);
  return pulledDescriptions;
};

const pullWikipediaDescription = async (name: string): Promise<APIPulledDescription | null> => {
  const summary = await getWikipediaSummary(name);
  if (summary) {
    return {
      sourceName: 'Wikipedia',
      sourceUrl: summary.link,
      text: summary.snippet,
    };
  }
  return null;
};

const getWikipediaSummary = async (q: string): Promise<{ name: string; snippet: string; link: string }> => {
  const response = await fetch(
    `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${q}&utf8=&format=json`
  );

  const body = await response.text();

  try {
    const data = JSON.parse(body);

    if (!data.query.search.length) throw new Error('No results found');
    const firstResult = data.query.search[0];

    return {
      name: firstResult.title,
      snippet: firstResult.snippet,
      link: `https://en.wikipedia.org/wiki/${encodeURIComponent(firstResult.title)}`,
    };
  } catch (err) {
    throw new Error(`Failed parsing`);
  }
};

const scrapeGoogleResults = async <T>(q: string): Promise<any> => {
  const response = await fetch('https://www.google.com/search?q=' + q);
  const html = await response.text();
  console.log(html);
  const parser = new GoogleNojsSERP(html);
  console.dir(parser.serp);
};

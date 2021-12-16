import { google } from 'googleapis';
import { flatten } from 'lodash';
import { compareTwoStrings } from 'string-similarity';
import wiki from 'wikijs';
import { APIPullDescriptionsQueryOptions, APIPulledDescription } from '../api/schema/types';

export enum PulledDescriptionSourceName {
  wikipedia = 'wikipedia',
  google = 'google',
}

const nameToWikipediaQuery = (name: string) => (name.endsWith('s') ? name.slice(0, name.length - 1) : name);

export const pullTopicDescriptions = async ({
  name,
  aliases,
  parentTopicName,
  contextName,
}: APIPullDescriptionsQueryOptions): Promise<APIPulledDescription[]> => {
  return [
    ...(await pullWikipediaDefinitions(nameToWikipediaQuery(name))),
    ...(aliases
      ? flatten(await Promise.all(aliases.map((alias) => pullWikipediaDefinitions(nameToWikipediaQuery(alias)))))
      : []),
  ];
};

const kgSearch = google.kgsearch({
  version: 'v1',
  // auth: env.OTHER.GOOGLE_APIS_KEY
});

/**
 * Unused for now: search is quite poor. Results are ok but basically extracts from wikipedia
 */
const getGoogleKgDefinitions = async (query: string): Promise<APIPulledDescription[]> => {
  const result = await kgSearch.entities.search({ query, limit: 8 });
  if (!result.data.itemListElement?.length) return [];
  return result.data.itemListElement
    .filter((listElement) => {
      return listElement.result['@type'].length === 1 && listElement.result['@type'][0] === 'Thing';
    })

    .filter(({ result }) => !!result.detailedDescription)
    .map(({ result }) => {
      const sourceUrl: string = result.detailedDescription.url;

      return {
        name: result.name,
        sourceName:
          sourceUrl && sourceUrl.includes('wiki')
            ? PulledDescriptionSourceName.wikipedia
            : PulledDescriptionSourceName.google,
        description: result.detailedDescription.articleBody,
        sourceUrl,
      };
    });
};

export const pullWikipediaDefinitions = async (name: string): Promise<APIPulledDescription[]> => {
  const { results } = await wiki().search(name, 6);
  const pages = await Promise.all(
    results
      .filter((result) => compareTwoStrings(name, result) > 0.15)
      .map(async (result) => {
        return wiki().page(result);
      })
  );
  return await Promise.all(
    pages
      .filter((page) => page['pageprops']?.disambiguation === undefined) // weirdly equals to an empty field when it's a disambiguation topic
      .map(async (page) => {
        const pulledDescription: APIPulledDescription = {
          sourceUrl: page.url(),
          sourceName: PulledDescriptionSourceName.wikipedia,
          resultName: page.raw.title,
          description: await page.summary(),
        };
        return pulledDescription;
      })
  );
};

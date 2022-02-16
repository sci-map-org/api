import { APIResourceData } from '../api/schema/types';
import { CourseraExtractedData, courseraExtractorConfig } from '../crawler/extractors/coursera';
import { defaultExtractorConfig } from '../crawler/extractors/default';
import { WebsiteExtractor } from '../crawler/extractors/extractors';
import { MediumExtractedData, mediumExtractorConfig } from '../crawler/extractors/medium';
import {
  YoutubePlaylistData,
  youtubePlaylistExtractorConfig,
  YoutubeVideoData,
  youtubeVideoExtractorConfig,
} from '../crawler/extractors/youtube';
import { extractWebsiteData } from '../crawler/website_extractor';
import { ResourceType } from '../entities/Resource';

type ResourceDataExtractor<T> = {
  extractor: WebsiteExtractor<T>;
  postProcess: (data: T) => Promise<APIResourceData> | APIResourceData;
};

const youtubeVideoConfig: ResourceDataExtractor<YoutubeVideoData> = {
  extractor: youtubeVideoExtractorConfig,
  postProcess: async (data) => {
    return {
      name: data.title,
      description: data.description,
      types: [ResourceType.youtube_video],
      durationSeconds: data.durationSeconds,
    };
  },
};

const youtubePlaylistConfig: ResourceDataExtractor<YoutubePlaylistData> = {
  extractor: youtubePlaylistExtractorConfig,
  postProcess: async (data) => {
    return {
      name: data.title,
      description: data.description,
      types: [ResourceType.youtube_playlist],
      durationSeconds: data.durationSeconds,
      subResourceSeries: data.items.map(({ videoData }) => ({
        name: videoData.title,
        url: `https://www.youtube.com/watch?v=${videoData.youtubeId}&list=${data.youtubeId}`,
        description: videoData.description,
        types: [ResourceType.youtube_video],
        durationSeconds: videoData.durationSeconds,
      })),
    };
  },
};

const mediumConfig: ResourceDataExtractor<MediumExtractedData> = {
  extractor: mediumExtractorConfig,
  postProcess: async (data) => ({
    name: data.title,
    types: [ResourceType.article],
  }),
};

const courseraConfig: ResourceDataExtractor<CourseraExtractedData> = {
  extractor: courseraExtractorConfig,
  postProcess: async (data) => ({
    name: data.title,
    types: [ResourceType.course],
  }),
};

const defaultConfig: ResourceDataExtractor<{ title?: string }> = {
  extractor: defaultExtractorConfig,
  postProcess: (data) => ({
    name: data.title,
  }),
};

const configs = [youtubeVideoConfig, youtubePlaylistConfig, mediumConfig, courseraConfig, defaultConfig]; // put default at the end as it catches all urls

const dispatch = async (url: string, configs: ResourceDataExtractor<any>[]): Promise<APIResourceData> => {
  const matchingConfig = configs.find((config) => !!url.match(config.extractor.urlMatch));
  if (!matchingConfig) return {};

  const data = await extractWebsiteData(url, matchingConfig.extractor);
  return matchingConfig.postProcess(data);
};

export const analyzeResourceUrl = async (url: string): Promise<APIResourceData> => {
  return await dispatch(url, configs);
};

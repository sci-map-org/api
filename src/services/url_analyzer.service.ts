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
import { ResourceMediaType, ResourceType } from '../entities/Resource';

type ResourceDataExtractor<T> = {
  extractor: WebsiteExtractor<T>;
  postProcess: (data: T) => Promise<APIResourceData> | APIResourceData;
};

const youtubeVideoConfig: ResourceDataExtractor<YoutubeVideoData> = {
  extractor: youtubeVideoExtractorConfig,
  postProcess: async data => {
    return {
      name: data.title,
      description: data.description,
      type: ResourceType.youtube_video,
      mediaType: ResourceMediaType.video,
      durationSeconds: data.durationSeconds,
    };
  },
};

const youtubePlaylistConfig: ResourceDataExtractor<YoutubePlaylistData> = {
  extractor: youtubePlaylistExtractorConfig,
  postProcess: async data => {
    return {
      name: data.title,
      description: data.description,
      type: ResourceType.youtube_playlist,
      mediaType: ResourceMediaType.video,
      durationSeconds: data.durationSeconds,
      subResourceSeries: data.items.map(({ videoData }) => ({
        name: videoData.title,
        url: `https://www.youtube.com/watch?v=${videoData.youtubeId}&list=${data.youtubeId}`,
        description: videoData.description,
        type: ResourceType.youtube_video,
        mediaType: ResourceMediaType.video,
        durationSeconds: videoData.durationSeconds,
      })),
    };
  },
};

const mediumConfig: ResourceDataExtractor<MediumExtractedData> = {
  extractor: mediumExtractorConfig,
  postProcess: async data => ({
    name: data.title,
    type: ResourceType.article,
    mediaType: ResourceMediaType.text,
  }),
};

const courseraConfig: ResourceDataExtractor<CourseraExtractedData> = {
  extractor: courseraExtractorConfig,
  postProcess: async data => ({
    name: data.title,
    type: ResourceType.course,
    mediaType: ResourceMediaType.video,
  }),
};

const defaultConfig: ResourceDataExtractor<{ title?: string }> = {
  extractor: defaultExtractorConfig,
  postProcess: data => ({
    name: data.title,
  }),
};

const configs = [youtubeVideoConfig, youtubePlaylistConfig, mediumConfig, courseraConfig, defaultConfig]; // put default at the end as it catches all urls

const dispatch = async (url: string, configs: ResourceDataExtractor<any>[]): Promise<APIResourceData> => {
  const matchingConfig = configs.find(config => !!url.match(config.extractor.urlMatch));
  if (!matchingConfig) return {};

  const data = await extractWebsiteData(url, matchingConfig.extractor);
  return matchingConfig.postProcess(data);
};

export const analyzeResourceUrl = async (url: string): Promise<APIResourceData> => {
  return await dispatch(url, configs);
};

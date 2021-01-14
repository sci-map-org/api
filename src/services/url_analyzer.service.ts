import { APIResourceData } from '../api/schema/types';
import { scrapePage } from '../crawler/apify';
import { CourseraExtractedData, courseraExtractorConfig } from '../crawler/extractors/coursera';
import { defaultExtractorConfig } from '../crawler/extractors/default';
import { WebsiteExtractor } from '../crawler/extractors/extractors';
import { MediumExtractedData, mediumExtractorConfig } from '../crawler/extractors/medium';
import { YoutubeExtractedData, youtubeExtractorConfig } from '../crawler/extractors/youtube';
import { ResourceMediaType, ResourceType } from '../entities/Resource';

type AnalyzerConfig<T> = {
  extractor: WebsiteExtractor<T>;
  postProcess: (data: T) => Promise<APIResourceData> | APIResourceData;
};

const youtubeConfig: AnalyzerConfig<YoutubeExtractedData> = {
  extractor: youtubeExtractorConfig,
  postProcess: async data => ({
    name: data.title,
    type: ResourceType.youtube_video,
    mediaType: ResourceMediaType.video,
  }),
};

const mediumConfig: AnalyzerConfig<MediumExtractedData> = {
  extractor: mediumExtractorConfig,
  postProcess: async data => ({
    name: data.title,
    type: ResourceType.article,
    mediaType: ResourceMediaType.text,
  }),
};

const courseraConfig: AnalyzerConfig<CourseraExtractedData> = {
  extractor: courseraExtractorConfig,
  postProcess: async data => ({
    name: data.title,
    type: ResourceType.course,
    mediaType: ResourceMediaType.video,
  }),
};

const defaultConfig: AnalyzerConfig<{ title?: string }> = {
  extractor: defaultExtractorConfig,
  postProcess: data => ({
    name: data.title,
  }),
};

const configs = [youtubeConfig, mediumConfig, courseraConfig, defaultConfig]; // put default at the end as it catches all urls

const dispatch = async (url: string, configs: AnalyzerConfig<any>[]): Promise<APIResourceData> => {
  const matchingConfig = configs.find(config => !!url.match(config.extractor.urlMatch));
  if (!matchingConfig) return {};
  const data = await scrapePage(url, matchingConfig.extractor);
  return matchingConfig.postProcess(data);
};

export const analyzeResourceUrl = async (url: string): Promise<APIResourceData> => {
  return await dispatch(url, configs);
};

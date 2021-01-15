import { youtubePlaylistRegexp, youtubeVideoRegexp } from '../../util/regexp.util';
import { WebsiteExtractor } from './extractors';
import { extractYoutubePlaylistData, extractYoutubeVideoData } from '../integrations/youtube';

export interface YoutubeVideoData {
  title: string;
  description: string;
  youtubeId: string;
  durationSeconds: number;
}

export const youtubeVideoExtractorConfig: WebsiteExtractor<YoutubeVideoData> = {
  type: 'integration',
  urlMatch: youtubeVideoRegexp,
  extractData: async url => {
    console.log(url);
    const matchResult = url.match(youtubeVideoRegexp);
    if (!matchResult || !matchResult[1]) throw new Error('failed to extract youtube video id');
    return extractYoutubeVideoData(matchResult[1]);
  },
};

export interface YoutubePlaylistItemData {
  videoData: YoutubeVideoData;
}
export interface YoutubePlaylistData {
  title: string;
  description: string;
  durationSeconds: number;
  items: YoutubePlaylistItemData[];
}

export const youtubePlaylistExtractorConfig: WebsiteExtractor<YoutubePlaylistData> = {
  type: 'integration',
  urlMatch: youtubePlaylistRegexp,
  extractData: async url => {
    const matchResult = url.match(youtubePlaylistRegexp);
    if (!matchResult || !matchResult[1]) throw new Error('failed to extract youtube playlist id');
    return extractYoutubePlaylistData(matchResult[1]);
  },
};

import { google } from 'googleapis';
import { parse, toSeconds } from 'iso8601-duration';
import { env } from '../../env';
import { YoutubeVideoData, YoutubePlaylistData, YoutubePlaylistItemData } from '../extractors/youtube';

const extractYoutubeVideosData = async (videoIds: string[]): Promise<YoutubeVideoData[]> => {
  const { data } = await google.youtube({ version: 'v3', auth: env.OTHER.GOOGLE_APIS_KEY }).videos.list({
    id: videoIds,
    part: [
      'contentDetails',
      'id',
      'liveStreamingDetails',
      'localizations',
      'player',
      'snippet',
      'statistics',
      'status',
      'topicDetails',
    ],
  });
  const items = data.items;
  if (!items) throw new Error('No items retrieved from Youtube video API for ids ' + videoIds.join(','));
  if (items.length !== videoIds.length)
    throw new Error('Some video items failed to be retrived from Youtube video API for ids ' + videoIds.join(','));

  return items.map(videoData => {
    const title = videoData.snippet?.title;
    const description = videoData.snippet?.description;
    const youtubeId = videoData.id;
    const durationISO = videoData.contentDetails?.duration;
    if (!title || typeof description !== 'string' || !youtubeId || !durationISO) throw new Error('missing data');
    const durationSeconds = toSeconds(parse(durationISO));
    return {
      title,
      description,
      youtubeId,
      durationSeconds,
    };
  });
};

export const extractYoutubeVideoData = async (videoId: string) => {
  const [videoData] = await extractYoutubeVideosData([videoId]);
  if (!videoId) throw new Error(`Youtube video with id ${videoId} not found (apparently)`);
  return videoData;
};

const getYoutubePlaylistItemData = async (playlistId: string): Promise<YoutubePlaylistItemData[]> => {
  let i = 0;

  let items: YoutubePlaylistItemData[] = [];
  let nextPageToken: undefined | string = undefined;
  while (i === 0 || (!!nextPageToken && i < 50)) {
    const { data } = await google.youtube({ version: 'v3', auth: env.OTHER.GOOGLE_APIS_KEY }).playlistItems.list({
      playlistId: playlistId,
      part: ['contentDetails', 'id', 'snippet', 'status'],
      maxResults: 50,
      pageToken: nextPageToken,
    });

    const itemsData = data.items;
    nextPageToken = data.nextPageToken;
    if (!itemsData) throw new Error('missing items');
    const newItems: YoutubePlaylistItemData[] = await Promise.all(
      itemsData
        .filter(itemData => itemData.status?.privacyStatus === 'public')
        .map(
          async (itemData): Promise<YoutubePlaylistItemData> => {
            const youtubeId = itemData.contentDetails?.videoId;
            if (!youtubeId) throw new Error('missing data');
            return {
              videoData: await extractYoutubeVideoData(youtubeId),
            };
          }
        )
    );

    items = items.concat(newItems);
    i++;
  }
  return items;
};

export const extractYoutubePlaylistData = async (playlistId: string): Promise<YoutubePlaylistData> => {
  const { data } = await google.youtube({ version: 'v3', auth: env.OTHER.GOOGLE_APIS_KEY }).playlists.list({
    id: [playlistId],
    part: ['contentDetails', 'id', 'localizations', 'player', 'snippet', 'status'],
  });
  if (!data?.items?.length) throw new Error(`Youtube playlist with id ${playlistId} not found (apparently)`);

  const playlistData = data.items[0];

  const items: YoutubePlaylistItemData[] = await getYoutubePlaylistItemData(playlistId);

  const title = playlistData.snippet?.title;
  const description = playlistData.snippet?.description;
  const youtubeId = playlistData.id;
  if (!title || typeof description !== 'string' || !youtubeId) throw new Error('missing data');
  const durationSeconds = items.reduce((totalDuration, item) => totalDuration + item.videoData.durationSeconds, 0);
  return {
    title,
    description,
    items,
    durationSeconds,
  };
};

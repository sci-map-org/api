import got from 'got';
import * as cheerio from 'cheerio';

export const mediumArticle = 'https://medium.com/@dmccreary/lost-in-knowledge-space-14be123ea083';
export const youtubeVideo = 'https://www.youtube.com/watch?v=IlU-zDU6aQ0';
const url = mediumArticle;
(async () => {
  const t0 = Date.now();
  const response = await got(url);
  const $ = cheerio.load(response.body);
  console.log($('title')[0].children[0]['data']);
  console.log($('h1')[0].children[0]['data']);
  const t1 = Date.now();
  const duration = t1 - t0;
  console.log(`Took ${duration}ms`);
})();

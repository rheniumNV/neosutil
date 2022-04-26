const axios = require("axios");
const _ = require("lodash");
const json2emap = require("json2emap");

const apiKey = process.env.YOUTUBE_TOKEN;

const YOUTUBE = "YOUTUBE";
const NICONICO = "NICONICO";

exports.searchVideo = async (req, res, _next) => {
  const {
    q: word,
    maxResult = 50,
    useEmap = true,
    platform = YOUTUBE,
  } = req.query;
  if (maxResult > 50) {
    throw new Error("maxResult must be 50 or less.");
  }

  const url = (() => {
    switch (platform) {
      case YOUTUBE:
        return `https://www.googleapis.com/youtube/v3/search?type=video&part=snippet&q=${encodeURIComponent(
          word
        )}&maxResults=${maxResult}&key=${apiKey}`;
      case NICONICO:
        return `https://api.search.nicovideo.jp/api/v2/snapshot/video/contents/search?q=${encodeURIComponent(
          word
        )}&targets=title&fields=contentId,title,userId,description,channelId,startTime,thumbnailUrl&filters[viewCounter][gte]=0&_sort=-viewCounter&_offset=0&_limit=100&_context=NicoNeos`;
      default:
        return "";
    }
  })();

  const response = await axios(url);

  const videos =
    platform === YOUTUBE
      ? _.map(response.data.items, (item) => {
          const {
            title,
            description,
            channelTitle,
            channelId,
            thumbnails,
            publishTime,
          } = item.snippet;
          return {
            source: `https://www.youtube.com/watch?v=${_.get(item, [
              "id",
              "videoId",
            ])}`,
            videoId: _.get(item, ["id", "videoId"]),
            title,
            description,
            channelTitle,
            channelId,
            thumbnail: _.get(thumbnails, ["high", "url"]),
            publishTime,
            platform: YOUTUBE,
          };
        })
      : platform === NICONICO
      ? _.map(response.data.data, (item) => {
          const {
            title,
            userId,
            description,
            channelId,
            contentId,
            thumbnailUrl,
            startTime,
          } = item;
          return {
            source: `https://www.nicovideo.jp/watch/${contentId}`,
            videoId: contentId,
            title,
            description,
            channelTitle: channelId
              ? `https://ch.nicovideo.jp/ch${channelId}`
              : `https://www.nicovideo.jp/user/${userId}`,
            channelId: channelId
              ? `https://ch.nicovideo.jp/ch${channelId}`
              : `https://www.nicovideo.jp/user/${userId}`,
            thumbnail: thumbnailUrl,
            publishTime: startTime,
            platform: NICONICO,
          };
        })
      : [];
  res.send(useEmap ? json2emap({ items: videos }) : { items: videos });
};

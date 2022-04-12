const axios = require("axios");
const _ = require("lodash");
const json2emap = require("json2emap");

const apiKey = process.env.YOUTUBE_TOKEN;

exports.searchVideo = async (req, res, _next) => {
  const { q: word, maxResult = 50, useEmap = true } = req.query;
  if (maxResult > 50) {
    throw new Error("maxResult must be 50 or less.");
  }

  const url = `https://www.googleapis.com/youtube/v3/search?type=video&part=snippet&q=${encodeURIComponent(
    word
  )}&maxResults=${maxResult}&key=${apiKey}`;

  const response = await axios(url);

  const videos = _.map(response.data.items, (item) => {
    const {
      title,
      description,
      channelTitle,
      channelId,
      thumbnails,
      publishTime,
    } = item.snippet;
    return {
      videoId: _.get(item, ["id", "videoId"]),
      title,
      description,
      channelTitle,
      channelId,
      thumbnail: _.get(thumbnails, ["high", "url"]),
      publishTime,
    };
  });

  res.send(useEmap ? json2emap({ items: videos }) : { items: videos });
};

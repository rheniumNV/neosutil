import axios from "axios";
import _ from "lodash";
import json2emap from "json2emap";
import express from "express";

type Platform = "YOUTUBE" | "NICONICO";
const YOUTUBE: "YOUTUBE" = "YOUTUBE";
const NICONICO: "NICONICO" = "NICONICO";

const apiYoutubeKeys: string[] = JSON.parse(process.env.YOUTUBE_TOKEN ?? "[]");
let apiYoutubeKeyIndex: number = 0;

type SearchOption = {
  word: string;
  maxResult: number;
};

type VideoItem = {
  source: string;
  videoId: string;
  title: string;
  description: string;
  channelTitle: string;
  channelId: string;
  channelLink: string;
  thumbnail: string;
  publishTime: string;
  platform: Platform;
};

async function searchYoutube(option: SearchOption): Promise<VideoItem[]> {
  const { word, maxResult } = option;

  const apiKey = _.get(apiYoutubeKeys, apiYoutubeKeyIndex);
  apiYoutubeKeyIndex = (apiYoutubeKeyIndex + 1) % apiYoutubeKeys.length;

  const url = `https://www.googleapis.com/youtube/v3/search?type=video&part=snippet&q=${encodeURIComponent(
    word
  )}&maxResults=${maxResult}&key=${apiKey}`;
  const response = await axios(url);
  const items = _(response.data.items)
    .map((item) => {
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
        channelLink: `https://www.youtube.com/channel/${channelId}`,
        thumbnail: _.get(thumbnails, ["high", "url"]),
        publishTime,
        platform: YOUTUBE,
      };
    })
    .value();
  return items;
}

async function searchNiconico(option: SearchOption): Promise<VideoItem[]> {
  const { word, maxResult } = option;
  const url = `https://api.search.nicovideo.jp/api/v2/snapshot/video/contents/search?q=${encodeURIComponent(
    word
  )}&targets=title&fields=contentId,title,userId,description,channelId,startTime,thumbnailUrl&filters[viewCounter][gte]=0&_sort=-viewCounter&_offset=0&_limit=${maxResult}&_context=NicoNeos`;
  const response = await axios(url);
  const items = _(response.data.data)
    .map((item) => {
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
        videoId: `${contentId}`,
        title,
        description,
        channelTitle: channelId
          ? `https://ch.nicovideo.jp/ch${channelId}`
          : `https://www.nicovideo.jp/user/${userId}`,
        channelId: channelId ?? userId,
        channelLink: channelId
          ? `https://ch.nicovideo.jp/ch${channelId}`
          : `https://www.nicovideo.jp/user/${userId}`,
        thumbnail: thumbnailUrl,
        publishTime: startTime,
        platform: NICONICO,
      };
    })
    .value();
  return items;
}

async function searchVideo(
  platform: Platform,
  option: SearchOption
): Promise<VideoItem[]> {
  switch (platform) {
    case "YOUTUBE":
      return await searchYoutube(option);
    case "NICONICO":
      return await searchNiconico(option);
  }
}

export async function apiSearchVideo(
  req: express.Request,
  res: express.Response,
  _next: express.NextFunction
): Promise<void> {
  const { q: word, useEmap = true, platform = YOUTUBE } = req.query;

  if (typeof word !== "string") {
    throw new Error(`word is not string. word=${word}`);
  }

  if (!(platform === YOUTUBE || platform === NICONICO)) {
    throw new Error(
      `platform is not [YOUTUBE, NICONICO]. platform=${platform}`
    );
  }

  const maxResult =
    platform === YOUTUBE ? 50 : platform === NICONICO ? 100 : 50;

  const result = { items: await searchVideo(platform, { word, maxResult }) };

  res.send(useEmap ? json2emap(result) : result);
}

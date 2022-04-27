import axios from "axios";
import cheerio from "cheerio";
import express from "express";
import json2emap from "json2emap";

async function getMetaProps(url: string): Promise<any[]> {
  const result = await axios(url);
  const $ = cheerio.load(result.data);
  let results: any[] = [];
  $("head meta").each((i, el) => {
    const property = $(el).attr("property");
    const content = $(el).attr("content");
    if (property && content) {
      results.push({ [property]: content });
    }
  });
  results.sort((a, b) => {
    if (Object.keys(a)[0] < Object.keys(b)[0]) return -1;
    if (Object.keys(a)[0] > Object.keys(b)[0]) return 1;
    return 0;
  });
  return results;
}

function resolveSiteName(metaProps: any[]) {
  const ogSiteName = getMetaPropContent(metaProps, "og:site_name");
  if (ogSiteName) return ogSiteName;
  return "(No SiteName)";
}

function resolveTitle(metaProps: any[]) {
  const ogTitle = getMetaPropContent(metaProps, "og:title");
  if (ogTitle) return ogTitle;
  return "(No Title)";
}

function resolveDesc(metaProps: any[]) {
  const ogDesc = getMetaPropContent(metaProps, "og:description");
  if (ogDesc) return ogDesc;
  return "";
}

function resolveImageUrl(metaProps: any[]) {
  const ogImage = getMetaPropContent(metaProps, "og:image");
  if (ogImage) return ogImage;
  return "";
}

function getMetaPropContent(metaProps: any[], propKey: string) {
  const mpObj = metaProps.find((d, i, arr) => {
    return d[propKey];
  });
  if (mpObj) return mpObj[propKey];
  return "";
}

async function getPageInfo(url: string): Promise<{
  siteName: string;
  title: string;
  description: string;
  image: string;
}> {
  const metaProps = await getMetaProps(url);

  const siteName = resolveSiteName(metaProps);
  const title = resolveTitle(metaProps);
  const description = resolveDesc(metaProps);
  const image = resolveImageUrl(metaProps);

  return { siteName, title, description, image };
}

export async function apiGetPageInfo(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): Promise<void> {
  const { url, useEmap = true } = req.query;
  if (typeof url !== "string") {
    throw new Error(`url is not string. url=${url}`);
  }
  const pageInfo = await getPageInfo(url);
  res.send(useEmap ? json2emap(pageInfo) : pageInfo);
}

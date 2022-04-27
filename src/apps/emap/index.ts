import expres from "express";
import json2emap from "json2emap";

export async function apiGetJsonToEmap(
  req: expres.Request,
  res: expres.Response
): Promise<void> {
  const json = req.query.json;
  if (typeof json !== "string") {
    throw new Error(`json is not string. json=${json}`);
  }
  res.send(json2emap(JSON.parse(json)));
}

export async function apiPostJsonToEmap(
  req: expres.Request,
  res: expres.Response
): Promise<void> {
  res.send(json2emap(req.body));
}

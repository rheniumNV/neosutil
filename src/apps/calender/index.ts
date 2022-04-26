import axios from "axios";
import json2emap from "json2emap";
import _ from "lodash";
import express from "express";

export async function apiGetEventCalender1Week(
  req: express.Request,
  res: express.Response,
  _next: express.NextFunction
): Promise<void> {
  const { useEmap = true } = req.query;

  const eventData = _.get(await axios("https://neokun.kokoa.dev/"), "data", []);

  res.send(useEmap ? json2emap(eventData) : eventData);
}

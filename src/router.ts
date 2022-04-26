import express from "express";
import { apiSearchVideo } from "./apps/video/index";
import { apiGetJsonToEmap, apiPostJsonToEmap } from "./apps/emap";
import { apiGetUsers, apiGetUsersInPublic } from "./apps/users";
import { apiGetItems, apiGetLatestItem } from "./apps/items";
import { apiGetEventCalender1Week } from "./apps/calender";

const wrap = (
  path: string,
  fn: (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => Promise<void>
): [string, express.Handler] => [
  path,
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    fn(req, res, next).catch(next);
  },
];

export default function router(app: express.Express) {
  app.get(...wrap("/emap/json2emap", apiGetJsonToEmap));
  app.post(...wrap("/emap/json2emap", apiPostJsonToEmap));
  app.get(...wrap("/users/find", apiGetUsers));
  app.get(...wrap("/api/publicUsers", apiGetUsersInPublic));

  app.get(...wrap("/api/emap/json2emap", apiGetJsonToEmap));
  app.post(...wrap("/api/emap/json2emap", apiPostJsonToEmap));
  app.get(...wrap("/api/users/find", apiGetUsers));
  app.get(...wrap("/api/users/publicUsers", apiGetUsersInPublic));
  app.get(...wrap("/api/calender/1week", apiGetEventCalender1Week));

  app.get(...wrap("/api/v1/items", apiGetItems));
  app.get(...wrap("/api/v1/items/latest", apiGetLatestItem));

  app.get(...wrap("/api/v1/video/search", apiSearchVideo));
}

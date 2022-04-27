import express from "express";
import expressRedisCache from "express-redis-cache";
import { apiSearchVideo } from "./apps/video/index";
import { apiGetJsonToEmap, apiPostJsonToEmap } from "./apps/emap";
import { apiGetUsers, apiGetUsersInPublic } from "./apps/users";
import { apiGetItems, apiGetLatestItem } from "./apps/items";
import { apiGetEventCalender1Week } from "./apps/calender";
import { apiGetPageInfo } from "./apps/ogp";

function generateEc(defaultRequestHandler: express.RequestHandler) {
  return function ec(
    path: string,
    fn: (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => Promise<void>,
    route?: express.RequestHandler
  ): [string, express.RequestHandler, express.Handler] {
    return [
      path,
      route ?? defaultRequestHandler,
      (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
      ) => {
        fn(req, res, next).catch(next);
      },
    ];
  };
}

function e(
  path: string,
  fn: (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => Promise<void>
): [string, express.Handler] {
  return [
    path,
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      fn(req, res, next).catch(next);
    },
  ];
}

export default function router(
  app: express.Express,
  cache: expressRedisCache.ExpressRedisCache
) {
  const ec = generateEc(cache.route({ expire: { 200: 60, xxx: 10 } }));

  app.get(...e("/emap/json2emap", apiGetJsonToEmap));
  app.post(...e("/emap/json2emap", apiPostJsonToEmap));
  app.get(...ec("/users/find", apiGetUsers));
  app.get(...ec("/api/publicUsers", apiGetUsersInPublic));

  app.get(...e("/api/emap/json2emap", apiGetJsonToEmap));
  app.post(...e("/api/emap/json2emap", apiPostJsonToEmap));
  app.get(...ec("/api/users/find", apiGetUsers));
  app.get(...ec("/api/users/publicUsers", apiGetUsersInPublic));
  app.get(...ec("/api/calender/1week", apiGetEventCalender1Week));

  app.get(...ec("/api/v1/items", apiGetItems));
  app.get(...ec("/api/v1/items/latest", apiGetLatestItem));

  app.get(
    ...ec(
      "/api/v1/video/search",
      apiSearchVideo,
      cache.route({ expire: { 200: 1800, xxx: 10 } })
    )
  );
  app.get(
    ...ec(
      "/api/v1/ogp",
      apiGetPageInfo,
      cache.route({ expire: { 200: 1800, xxx: 10 } })
    )
  );

  app.get(
    ...ec("/now", async (_req, res, _next) => {
      res.send(new Date());
    })
  );
}

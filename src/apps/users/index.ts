import express from "express";
import axios from "axios";
import _ from "lodash";
import json2emap from "json2emap";

const NEOS_API_BASE_URL = "https://apiproxy.neos.love/";

type SessionUser = {
  username: string;
  userID: string;
  isPresent: boolean;
  outputDevice: number;
};

type Session = {
  name: string;
  correspondingWorldId: {
    recordId: string;
    ownerId: string;
  };
  tags: string[];
  sessionId: string;
  normalizedSessionId: string;
  hostUserId: string;
  hostMachineId: string;
  hostUsername: string;
  compatibilityHash: string;
  neosVersion: string;
  headlessHost: boolean;
  sessionURLs: string[];
  sessionUsers: SessionUser[];
  thumbnail: string;
  joinedUsers: number;
  activeUsers: number;
  totalJoinedUsers: number;
  totalActiveUsers: number;
  maxUsers: number;
  mobileFriendly: boolean;
  sessionBeginTime: string;
  lastUpdate: string;
  accessLevel: string;
  hasEnded: boolean;
  isValid: boolean;
};

export async function apiGetUsers(
  req: express.Request,
  res: express.Response,
  _next: express.NextFunction
): Promise<void> {
  const { q: word, useEmap = true } = req.query;
  const users = await axios(`${NEOS_API_BASE_URL}api/users?name=%s", ${word}`);
  const result = _(users.data)
    .map(({ id, username: name }) => ({
      id,
      name,
    }))
    .value();
  res.send(useEmap ? json2emap({ users: result }) : { users: result });
}

export async function apiGetUsersInPublic(
  req: express.Request,
  res: express.Response,
  _next: express.NextFunction
): Promise<void> {
  const {
    useEmap = true,
    includeSessionInfo = true,
    includeUsername = true,
  } = req.query;
  const sessions = await axios.get(`${NEOS_API_BASE_URL}api/sessions`);
  const activeUsers = _(sessions.data)
    .flatMap<{ user: SessionUser; session: Session }>((session: Session) =>
      _.map(session.sessionUsers, (user: SessionUser) => ({
        user,
        session,
      }))
    )
    .filter(
      ({ user }: { user: SessionUser; session: Session }) =>
        _.startsWith(user.userID, "U-") && user.isPresent
    )
    .map(({ user: { userID, username }, session }) => ({
      id: userID,
      name: username,
      ...(includeSessionInfo
        ? {
            session: _.pick(session, [
              "name",
              "sessionId",
              "hostUsername",
              "headlessHost",
              "thumbnail",
              "joinedUsers",
              "maxUsers",
              "sessionBeginTime",
              "accessLevel",
            ]),
          }
        : {}),
    }))
    .uniq()
    .value();
  res.send(useEmap ? json2emap(activeUsers) : activeUsers);
}

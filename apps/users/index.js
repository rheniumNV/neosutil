const axios = require("axios");
const util = require("util");
const _ = require("lodash");
const json2emap = require("json2emap");

exports.getUsers = async (req, res, _next) => {
  const { q: word, useEmap = true } = req.query;
  //const users = await neos.CloudXInterface.GetUsers(word);
  const users = await axios(
    util.format("https://www.neosvr-api.com/api/users?name=%s", word)
  );
  console.log(users.data);
  const result = _(users.data)
    .map(({ id, username: name }) => ({
      id,
      name,
    }))
    .value();
  res.send(useEmap ? json2emap({ users: result }) : { users: result });
};

exports.getUsersInPublic = async (req, res, _next) => {
  const {
    useEmap = true,
    includeSessionInfo = true,
    includeUsername = true,
  } = req.query;
  const sessions = await axios.get("https://www.neosvr-api.com/api/sessions");
  const activeUsers = _(sessions.data)
    .flatMap((session) =>
      _.map(session.sessionUsers, (user) => ({
        user,
        session,
      }))
    )
    .filter(
      ({ user: { userID, isPresent } }) =>
        _.startsWith(userID, "U-") && isPresent
    )
    .uniq(({ user: { userID } }) => userID)
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
    .value();
  res.send(useEmap ? json2emap(activeUsers) : activeUsers);
};

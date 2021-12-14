const { getJsonToEmap, postJsonToEmap } = require("./apps/emap");
const { getUsers, getUsersInPublic } = require("./apps/users");
const { getEventCalender1Week } = require("./apps/calender");

const wrap = (path, fn) => [
  path,
  (req, res, next) => {
    fn(req, res, next).catch(next);
  },
];

module.exports = (app) => {
  app.get(...wrap("/emap/json2emap", getJsonToEmap));
  app.post(...wrap("/emap/json2emap", postJsonToEmap));
  app.get(...wrap("/users/find", getUsers));
  app.get(...wrap("/api/publicUsers", getUsersInPublic));

  app.get(...wrap("/api/emap/json2emap", getJsonToEmap));
  app.post(...wrap("/api/emap/json2emap", postJsonToEmap));
  app.get(...wrap("/api/users/find", getUsers));
  app.get(...wrap("/api/users/publicUsers", getUsersInPublic));
  app.get(...wrap("/api/calender/1week", getEventCalender1Week));
};

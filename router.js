const { getJsonToEmap, postJsonToEmap } = require("./apps/emap");
const { getUsers } = require("./apps/users");

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
};

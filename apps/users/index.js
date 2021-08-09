const json2emap = require("json2emap");
const _ = require("lodash");

const jsonToEmap = (json) => json2emap(json);
const Neos = require("@bombitmanbomb/neosjs");

const neos = new Neos();

exports.getUsers = async (req, res, _next) => {
  const { q: word } = req.query;
  const users = await neos.CloudXInterface.GetUsers(word);
  console.log(word, users);
  const result = _.map(
    users.Content ? users.Content : [],
    ({ Id, Username }) => ({
      id: Id,
      neme: Username,
    })
  );
  console.log(result);
  res.send(jsonToEmap({ users: result }));
};
